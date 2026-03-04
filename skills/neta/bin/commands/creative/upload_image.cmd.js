import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
import { uploadImageV1Parameters, uploadImageV1ResultSchema, } from "../schema.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
const ALLOWED_SUFFIXES = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
const ALLOWED_SUFFIX_SET = new Set(ALLOWED_SUFFIXES);
const MIME_TO_SUFFIX = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "image/webp": "webp",
};
const SUFFIX_TO_MIME = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
};
const isUploadImageSuffix = (value) => {
    return ALLOWED_SUFFIX_SET.has(value);
};
const normalizeSuffix = (suffix) => {
    if (!suffix)
        return null;
    const value = suffix.replace(/^\./, "").toLowerCase();
    if (!isUploadImageSuffix(value))
        return null;
    return value;
};
const inferSuffixFromFilename = (filename) => {
    if (!filename)
        return null;
    return normalizeSuffix(extname(filename));
};
const inferSuffixFromContentType = (contentType) => {
    if (!contentType)
        return null;
    const normalized = contentType.toLowerCase().split(";")[0]?.trim();
    if (!normalized)
        return null;
    return normalizeSuffix(MIME_TO_SUFFIX[normalized]);
};
const inferMimeFromBytes = (bytes) => {
    if (bytes.length >= 4) {
        if (bytes[0] === 0x89 &&
            bytes[1] === 0x50 &&
            bytes[2] === 0x4e &&
            bytes[3] === 0x47) {
            return "image/png";
        }
        if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
            return "image/jpeg";
        }
        if (bytes[0] === 0x47 &&
            bytes[1] === 0x49 &&
            bytes[2] === 0x46 &&
            bytes[3] === 0x38) {
            return "image/gif";
        }
        if (bytes[0] === 0x52 &&
            bytes[1] === 0x49 &&
            bytes[2] === 0x46 &&
            bytes[3] === 0x46 &&
            bytes.length >= 12 &&
            bytes[8] === 0x57 &&
            bytes[9] === 0x45 &&
            bytes[10] === 0x42 &&
            bytes[11] === 0x50) {
            return "image/webp";
        }
    }
    const textPrefix = Buffer.from(bytes.subarray(0, 200))
        .toString("utf-8")
        .trimStart()
        .toLowerCase();
    if (textPrefix.startsWith("<?xml") ||
        textPrefix.startsWith("<svg") ||
        textPrefix.includes("<svg")) {
        return "image/svg+xml";
    }
    return null;
};
const parseDataUrl = (value) => {
    const matched = value.match(/^data:([^;,]+)?(?:;charset=[^;,]+)?(;base64)?,([\s\S]+)$/i);
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
        sourceName: undefined,
    };
};
const readInputBytes = async (image) => {
    if (image.startsWith("data:")) {
        return parseDataUrl(image);
    }
    if (/^https?:\/\//i.test(image)) {
        const response = await fetch(image);
        if (!response.ok) {
            throw new Error(`E_DOWNLOAD_FAILED: 下载图片失败 status=${response.status} url=${image}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? undefined;
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
const inferSuffix = (args) => {
    const byParam = normalizeSuffix(args.explicitSuffix);
    const byImagePath = inferSuffixFromFilename(args.image);
    const bySourceName = inferSuffixFromFilename(args.sourceName);
    const byContentType = inferSuffixFromContentType(args.sourceContentType);
    const byBytes = inferSuffixFromContentType(inferMimeFromBytes(args.bytes) ?? "");
    return byParam ?? byImagePath ?? bySourceName ?? byContentType ?? byBytes;
};
export const uploadImage = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: uploadImageV1Parameters,
    outputSchema: uploadImageV1ResultSchema,
}, async ({ image, suffix }, { apis }) => {
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
        throw new Error("E_CANNOT_INFER_SUFFIX: 无法识别图片后缀，请显式传入 suffix");
    }
    const contentType = inputData.contentType?.toLowerCase().startsWith("image/")
        ? inputData.contentType
        : SUFFIX_TO_MIME[finalSuffix];
    const { upload_url, view_url } = await apis.artifact.uploadSignedUrl({
        suffix: finalSuffix,
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
        throw new Error(`E_UPLOAD_FAILED: status=${uploadRes.status}, reason=${reason || "unknown"}`);
    }
    return {
        url: view_url,
    };
});
