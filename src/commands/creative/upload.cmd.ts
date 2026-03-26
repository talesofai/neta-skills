import { readFile } from "node:fs/promises";
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  S3Client,
  UploadPartCommand,
  type UploadPartCommandOutput,
} from "@aws-sdk/client-s3";
import { Type } from "@sinclair/typebox";
import { filetypeinfo } from "magic-bytes.js";
import plimit from "p-limit";
import type { Apis } from "../../apis/index.ts";
import type { Credentials } from "../../apis/oss.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { polling } from "../../utils/polling.ts";
import { createCommand } from "../factory.ts";

interface RegionOptions {
  bucket: string;
  region: string;
  endpoint: string;
}

const OSS_STS_OPTIONS_CN: RegionOptions = {
  bucket: "talesofai",
  region: "oss-cn-shanghai",
  endpoint: "oss.talesofai.cn",
};

const OSS_STS_OPTIONS_US: RegionOptions = {
  bucket: "talesofai-us",
  region: "oss-us-west-1",
  endpoint: "oss.talesofai.com",
};

const DEFAULT_IMAGE_LIMIT_SIZE = 1024 * 1024 * 10;
const DEFAULT_VIDEO_LIMIT_SIZE = 1024 * 1024 * 100;

const SUPPORTED_IMAGE_TYPES = ["png", "jpeg", "webp", "gif"];
const SUPPORTED_VIDEO_TYPES = [
  "avi",
  "mov",
  "flv",
  "mkv",
  "webm",
  "mp4",
  "mpeg",
  "wmv",
  "rm",
  "vob",
  "ts",
];

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      file_path: Type.String(),
    }),
    errors: Type.Object({
      file_type_not_supported: Type.String(),
      file_size_too_large: Type.String(),
    }),
  }),
  import.meta,
);

const s3Upload = async (
  data: Buffer,
  options: {
    mimeType: string;
    regionOptions: RegionOptions;
    credentials: Credentials;
    logger: Pick<Console, "error" | "warn" | "info" | "debug">;
  },
) => {
  const { mimeType, regionOptions, credentials, logger } = options;
  const { bucket, region, endpoint } = regionOptions;
  const { access_key_id, access_key_secret, security_token, expiration, path } =
    credentials;

  const now = Date.now();
  const expires = new Date(expiration).getTime();

  if (now > expires) {
    throw new Error("STS token expired");
  }

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: access_key_id,
      secretAccessKey: access_key_secret,
      sessionToken: security_token,
    },
    endpoint: `https://${region}.aliyuncs.com`,
  });

  const createMultipartUploadCommand = new CreateMultipartUploadCommand({
    Bucket: bucket,
    Key: path,
    ContentType: mimeType,
  });

  const createMultipartUploadResponse = await client.send(
    createMultipartUploadCommand,
  );

  const uploadId = createMultipartUploadResponse.UploadId;

  const partSize = 1 * 1024 * 1024;
  const parts = Math.ceil(data.length / partSize);
  const tasks: ((partNumber: number) => Promise<UploadPartCommandOutput>)[] =
    [];

  let uploadedSize = 0;

  for (let i = 0; i < parts; i++) {
    const start = i * partSize;
    const end = Math.min(start + partSize, data.length);
    const partData = data.subarray(start, end);

    const uploadPartCommand = new UploadPartCommand({
      Bucket: bucket,
      Key: path,
      PartNumber: i + 1,
      UploadId: uploadId,
      Body: partData,
    });

    const uploadPart = async (partNumber: number) => {
      const res = await client.send(uploadPartCommand);
      uploadedSize += partData.length;
      logger.debug("uploaded %d bytes, part %d", uploadedSize, partNumber);
      return res;
    };

    tasks.push(uploadPart);
  }

  const limit = plimit(8);
  const completedParts = await Promise.all(
    tasks.map((run, index) =>
      limit(() =>
        run(index + 1).then((res) => ({
          ETag: res.ETag,
          PartNumber: index + 1,
        })),
      ),
    ),
  );

  const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
    Bucket: bucket,
    Key: path,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: completedParts,
    },
  });

  await client.send(completeMultipartUploadCommand);
  const url = `https://${endpoint}/${path}`;
  logger.debug("completed multipart upload, url: %s", url);
  return url;
};

const createArtifact = async (
  url: string,
  options: {
    type: "image" | "video";
    apis: Apis;
    logger: Pick<Console, "error" | "warn" | "info" | "debug">;
  },
) => {
  const { type, apis, logger } = options;

  let uuid: string;

  if (type === "image") {
    const res = await apis.artifact.createPicture({ url });
    uuid = res.uuid;
  }

  if (type === "video") {
    const res = await apis.artifact.createVideo({ url });
    uuid = res.uuid;
  }

  const res = await polling(
    () => apis.artifact.artifactDetail([uuid]),
    (result) => {
      const artifact = result[0];
      if (!artifact) throw new Error("Artifact not found");
      logger.debug("polling: %o", artifact);
      return artifact.status !== "PENDING" && artifact.status !== "MODERATION";
    },
    1000,
    60 * 1000,
  );

  if (res.isTimeout) {
    throw new Error("Timeout");
  }

  // biome-ignore lint/style/noNonNullAssertion: checked
  return res.result[0]!;
};

const checkIsNetworkUrl = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://");
};

export const upload = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: Type.Object({
      file_path: Type.String({ description: meta.parameters.file_path }),
    }),
  },
  async ({ file_path }, { apis, user, log }) => {
    if (!user) {
      throw new Error("Not authenticated. Please check your NETA_TOKEN.");
    }

    const regionOptions = apis.baseUrl.endsWith(".cn")
      ? OSS_STS_OPTIONS_CN
      : OSS_STS_OPTIONS_US;

    const file = await (checkIsNetworkUrl(file_path)
      ? fetch(file_path)
          .then((res) => res.arrayBuffer())
          .then((buffer) => Buffer.from(buffer))
      : readFile(file_path));

    const infos = filetypeinfo(file);
    const info = infos[0]; // always use first extension
    if (!info || !info.extension || !info.mime) {
      throw new Error(meta.errors.file_type_not_supported);
    }

    if (SUPPORTED_IMAGE_TYPES.includes(info.extension)) {
      if (file.length > DEFAULT_IMAGE_LIMIT_SIZE) {
        throw new Error(
          meta.errors.file_size_too_large.replace(
            "{max_size}",
            DEFAULT_IMAGE_LIMIT_SIZE.toString(),
          ),
        );
      }

      const credentials = await apis.oss.getStsCredentials(info.extension);
      const url = await s3Upload(file, {
        mimeType: info.mime,
        regionOptions: regionOptions,
        credentials,
        logger: log,
      });

      return createArtifact(url, {
        type: "image",
        apis,
        logger: log,
      });
    }

    if (SUPPORTED_VIDEO_TYPES.includes(info.extension)) {
      if (file.length > DEFAULT_VIDEO_LIMIT_SIZE) {
        throw new Error(
          meta.errors.file_size_too_large.replace(
            "{max_size}",
            DEFAULT_VIDEO_LIMIT_SIZE.toString(),
          ),
        );
      }

      const credentials = await apis.oss.getVideoStsCredentials(info.extension);
      const url = await s3Upload(file, {
        mimeType: info.mime,
        regionOptions: regionOptions,
        credentials,
        logger: log,
      });

      return createArtifact(url, {
        type: "video",
        apis,
        logger: log,
      });
    }

    throw new Error(meta.errors.file_type_not_supported);
  },
);
