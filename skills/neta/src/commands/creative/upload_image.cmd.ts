import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import z from "zod";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";
import {
  uploadImageV1Parameters,
  uploadImageV1ResultSchema,
} from "../schema.ts";

const meta = parseMeta(
  z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
  }),
  import.meta,
);

const SOURCE_KEYS = [
  "image",
  "input",
  "image_path",
  "image_url",
  "image_data",
] as const;

type SourceKey = (typeof SOURCE_KEYS)[number];

type SourceType = "path" | "url" | "data_url";

const ALLOWED_SUFFIXES = ["jpg", "jpeg", "png", "gif", "svg", "webp"] as const;

type UploadImageSuffix = (typeof ALLOWED_SUFFIXES)[number];

const ALLOWED_SUFFIX_SET = new Set<UploadImageSuffix>(ALLOWED_SUFFIXES);

const MIME_TO_SUFFIX: Record<string, UploadImageSuffix> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/webp": "webp",
};

const SUFFIX_TO_MIME: Record<UploadImageSuffix, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
};

const isUploadImageSuffix = (value: string): value is UploadImageSuffix => {
  return ALLOWED_SUFFIX_SET.has(value as UploadImageSuffix);
};

const canonicalSuffix = (suffix: string) =>
  suffix.toLowerCase() === "jpeg" ? "jpg" : suffix.toLowerCase();

const normalizeSuffix = (suffix?: string) => {
  if (!suffix) return null;
  const value = suffix.replace(/^\./, "").toLowerCase();
  if (!isUploadImageSuffix(value)) return null;
  return value;
};

const inferSuffixFromFilename = (filename?: string) => {
  if (!filename) return null;
  return normalizeSuffix(extname(filename));
};

const inferSuffixFromContentType = (contentType?: string) => {
  if (!contentType) return null;
  const normalized = contentType.toLowerCase().split(";")[0]?.trim();
  if (!normalized) return null;
  return normalizeSuffix(MIME_TO_SUFFIX[normalized]);
};

const inferMimeFromBytes = (bytes: Uint8Array): string | null => {
  if (bytes.length >= 4) {
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    ) {
      return "image/png";
    }
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return "image/jpeg";
    }
    if (
      bytes[0] === 0x47 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x38
    ) {
      return "image/gif";
    }
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes.length >= 12 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return "image/webp";
    }
  }

  const textPrefix = Buffer.from(bytes.subarray(0, 200))
    .toString("utf-8")
    .trimStart()
    .toLowerCase();
  if (
    textPrefix.startsWith("<?xml") ||
    textPrefix.startsWith("<svg") ||
    textPrefix.includes("<svg")
  ) {
    return "image/svg+xml";
  }
  return null;
};

const parseDataUrl = (value: string) => {
  const matched = value.match(
    /^data:([^;,]+)?(?:;charset=[^;,]+)?(;base64)?,([\s\S]+)$/i,
  );
  if (!matched) {
    throw new Error("E_INVALID_DATA_URL: image_data 不是合法的 data URL");
  }

  const mime = matched[1]?.toLowerCase();
  const isBase64 = Boolean(matched[2]);
  const payload = matched[3] ?? "";
  const bytes = isBase64
    ? Buffer.from(payload, "base64")
    : Buffer.from(decodeURIComponent(payload), "utf-8");

  if (!mime?.startsWith("image/")) {
    throw new Error("E_UNSUPPORTED_CONTENT_TYPE: data URL 必须是 image/*");
  }

  return {
    bytes,
    contentType: mime,
    sourceType: "data_url" as const,
    sourceName: undefined as string | undefined,
  };
};

const resolveSource = (args: z.infer<typeof uploadImageV1Parameters>) => {
  const picked = SOURCE_KEYS.filter((key) => {
    const value = args[key];
    return typeof value === "string" && value.trim().length > 0;
  });

  if (picked.length === 0) {
    throw new Error(
      "E_MISSING_INPUT: 至少提供一个图片输入参数(image/input/image_path/image_url/image_data)",
    );
  }

  const key = picked[0];
  if (!key) {
    throw new Error("E_MISSING_INPUT: 无可用图片输入参数");
  }

  const rawValue = args[key];
  if (typeof rawValue !== "string") {
    throw new Error(`E_INVALID_INPUT: 输入参数 ${key} 不是字符串`);
  }

  return {
    key,
    value: rawValue.trim(),
    hasAmbiguousInput: picked.length > 1,
  };
};

const readInputBytes = async (key: SourceKey, value: string) => {
  if (key === "image_data") {
    return parseDataUrl(value);
  }

  if (key === "image_url" || /^https?:\/\//i.test(value)) {
    const response = await fetch(value);
    if (!response.ok) {
      throw new Error(
        `E_DOWNLOAD_FAILED: 下载图片失败 status=${response.status} url=${value}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type")?.split(";")[0]?.trim() ?? undefined;
    return {
      bytes: Buffer.from(arrayBuffer),
      contentType,
      sourceType: "url" as const,
      sourceName: basename(new URL(value).pathname) || undefined,
    };
  }

  if (key === "image_path" || key === "image" || key === "input") {
    const bytes = await readFile(value);
    return {
      bytes,
      contentType: undefined,
      sourceType: "path" as const,
      sourceName: basename(value),
    };
  }

  throw new Error(`E_UNSUPPORTED_SOURCE: 不支持的输入来源 key=${key}`);
};

const inferContentType = (args: {
  explicitContentType?: string;
  uploadedBytes: Uint8Array;
  suffix?: UploadImageSuffix | null;
  sourceContentType?: string;
}) => {
  const explicit = args.explicitContentType?.trim().toLowerCase();
  if (explicit) {
    if (!explicit.startsWith("image/")) {
      throw new Error(
        "E_UNSUPPORTED_CONTENT_TYPE: content_type 必须是 image/*",
      );
    }
    return explicit;
  }

  const fromSource = args.sourceContentType?.toLowerCase();
  if (fromSource?.startsWith("image/")) {
    return fromSource;
  }

  const fromBytes = inferMimeFromBytes(args.uploadedBytes);
  if (fromBytes) return fromBytes;

  if (args.suffix) {
    const fromSuffix = SUFFIX_TO_MIME[args.suffix];
    if (fromSuffix) return fromSuffix;
  }

  throw new Error(
    "E_CANNOT_INFER_CONTENT_TYPE: 无法识别图片类型，请显式传入 content_type 或 suffix",
  );
};

const inferSuffix = (args: {
  explicitSuffix?: string;
  explicitFilename?: string;
  sourceName?: string;
  sourceContentType?: string;
  bytes: Uint8Array;
}) => {
  const byParam = normalizeSuffix(args.explicitSuffix);
  const byFilename = inferSuffixFromFilename(args.explicitFilename);
  const bySourceName = inferSuffixFromFilename(args.sourceName);
  const byContentType = inferSuffixFromContentType(args.sourceContentType);
  const byBytes = inferSuffixFromContentType(
    inferMimeFromBytes(args.bytes) ?? "",
  );

  const inferred =
    byParam ?? byFilename ?? bySourceName ?? byContentType ?? byBytes;
  if (!inferred) {
    throw new Error(
      "E_CANNOT_INFER_SUFFIX: 无法识别图片后缀，请显式传入 suffix 或 filename",
    );
  }

  if (byParam && byContentType) {
    const sameType =
      canonicalSuffix(byParam) === canonicalSuffix(byContentType);
    if (!sameType) {
      throw new Error(
        `E_SUFFIX_CONTENT_TYPE_CONFLICT: suffix=${byParam} 与 content-type=${byContentType} 冲突`,
      );
    }
  }

  return inferred;
};

const getPathFromUrl = (url: string) => {
  const pathname = new URL(url).pathname;
  return pathname.replace(/^\/+/, "");
};

export const uploadImage = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: uploadImageV1Parameters,
    outputSchema: uploadImageV1ResultSchema,
  },
  async (args, { apis, log }) => {
    const traceId = randomUUID();
    const source = resolveSource(args);

    if (source.hasAmbiguousInput) {
      log.warn(
        "upload_image: multiple input aliases provided, use key=%s",
        source.key,
      );
    }

    const inputData = await readInputBytes(source.key, source.value);
    if (inputData.bytes.length === 0) {
      throw new Error("E_EMPTY_FILE: 上传内容为空");
    }

    const suffix = inferSuffix({
      explicitSuffix: args.suffix,
      explicitFilename: args.filename,
      sourceName: inputData.sourceName,
      sourceContentType: inputData.contentType,
      bytes: inputData.bytes,
    });

    const contentType = inferContentType({
      explicitContentType: args.content_type,
      uploadedBytes: inputData.bytes,
      suffix,
      sourceContentType: inputData.contentType,
    });

    log.info(
      "upload_image: prepare trace=%s key=%s sourceType=%s bytes=%d suffix=%s contentType=%s",
      traceId,
      source.key,
      inputData.sourceType,
      inputData.bytes.length,
      suffix,
      contentType,
    );

    const { upload_url, view_url } = await apis.artifact.uploadSignedUrl({
      suffix,
    });

    const uploadRes = await fetch(upload_url, {
      method: "PUT",
      headers: {
        "content-type": contentType,
      },
      body: inputData.bytes,
    });

    if (!uploadRes.ok) {
      const reason = (await uploadRes.text().catch(() => "")).slice(0, 300);
      throw new Error(
        `E_UPLOAD_FAILED: status=${uploadRes.status}, reason=${reason || "unknown"}`,
      );
    }

    const structuredContent = {
      status: "uploaded" as const,
      source_type: inputData.sourceType as SourceType,
      input_key: source.key,
      bucket: "talesofai",
      path: getPathFromUrl(view_url),
      url: view_url,
      mime_type: contentType,
      suffix,
      byte_size: inputData.bytes.length,
      sha256: createHash("sha256").update(inputData.bytes).digest("hex"),
      etag: uploadRes.headers.get("etag"),
      upload_http_status: uploadRes.status,
      trace_id: traceId,
    };

    log.info(
      "upload_image: result trace=%s path=%s",
      traceId,
      structuredContent.path,
    );
    return structuredContent;
  },
);
