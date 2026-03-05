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

const isUploadImageSuffix = (value: string): value is UploadImageSuffix => {
  return ALLOWED_SUFFIX_SET.has(value as UploadImageSuffix);
};

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
    throw new Error("E_INVALID_DATA_URL: image 不是合法的 data URL");
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
    sourceName: undefined as string | undefined,
  };
};

const readInputBytes = async (image: string) => {
  if (image.startsWith("data:")) {
    return parseDataUrl(image);
  }

  if (/^https?:\/\//i.test(image)) {
    const response = await fetch(image);
    if (!response.ok) {
      throw new Error(
        `E_DOWNLOAD_FAILED: 下载图片失败 status=${response.status} url=${image}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type")?.split(";")[0]?.trim() ?? undefined;

    return {
      bytes: Buffer.from(arrayBuffer),
      contentType,
      sourceName: basename(new URL(image).pathname) || undefined,
    };
  }

  const bytes = await readFile(image);
  return {
    bytes,
    contentType: undefined,
    sourceName: basename(image),
  };
};

const inferSuffix = (args: {
  explicitSuffix?: string;
  image: string;
  sourceName?: string;
  sourceContentType?: string;
  bytes: Uint8Array;
}) => {
  const byParam = normalizeSuffix(args.explicitSuffix);
  const byImagePath = inferSuffixFromFilename(args.image);
  const bySourceName = inferSuffixFromFilename(args.sourceName);
  const byContentType = inferSuffixFromContentType(args.sourceContentType);
  const byBytes = inferSuffixFromContentType(
    inferMimeFromBytes(args.bytes) ?? "",
  );

  return byParam ?? byImagePath ?? bySourceName ?? byContentType ?? byBytes;
};

export const uploadImage = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: uploadImageV1Parameters,
    outputSchema: uploadImageV1ResultSchema,
  },
  async ({ image, suffix }, { apis }) => {
    const inputData = await readInputBytes(image);

    if (inputData.bytes.length === 0) {
      throw new Error("E_EMPTY_FILE: 上传内容为空");
    }

    const finalSuffix = inferSuffix({
      explicitSuffix: suffix,
      image,
      sourceName: inputData.sourceName,
      sourceContentType: inputData.contentType,
      bytes: inputData.bytes,
    });

    if (!finalSuffix) {
      throw new Error(
        "E_CANNOT_INFER_SUFFIX: 无法识别图片后缀，请显式传入 suffix",
      );
    }

    const { upload_url, view_url } = await apis.artifact.uploadSignedUrl({
      suffix: finalSuffix,
    });

    const uploadRes = await fetch(upload_url, {
      method: "PUT",
      body: inputData.bytes,
    });

    if (!uploadRes.ok) {
      const reason = (await uploadRes.text().catch(() => "")).slice(0, 300);
      throw new Error(
        `E_UPLOAD_FAILED: status=${uploadRes.status}, reason=${reason || "unknown"}`,
      );
    }

    return {
      url: view_url,
    };
  },
);
