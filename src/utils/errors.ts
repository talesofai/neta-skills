import { Type } from "@sinclair/typebox";
import { AxiosError } from "axios";
import { safeParseJson } from "./json.ts";
import { parseMeta } from "./parse_meta.ts";

export class ApiResponseError extends Error {
  public readonly code: number;
  public readonly message: string;

  constructor(
    code: number,
    message: string,
    options?: {
      cause?: unknown;
    },
  ) {
    super(message, {
      ...options,
    });
    this.code = code;
    this.message = message;
    this.name = "ApiResponseError";
  }
}

export const catchErrorResponse = (data?: unknown): string => {
  if (typeof data !== "string" && typeof data !== "object") return String(data);
  const parsedData: {
    message?: string;
    msg?: string;
    detail?:
      | string
      | {
          message?: string;
          msg?: string;
        }
      // * for code = 422
      | [{ msg: string }];
  } | null = typeof data === "string" ? (safeParseJson(data) ?? {}) : data;

  const detail = parsedData?.["detail"];
  if (typeof detail === "string") {
    return detail;
  }

  if (typeof detail === "object") {
    if (Array.isArray(detail)) {
      return detail.map(({ msg } = { msg: "" }) => msg).join(", ");
    } else {
      return detail["message"] ?? detail["msg"] ?? JSON.stringify(detail);
    }
  }

  const message =
    parsedData?.["message"] ??
    parsedData?.["msg"] ??
    JSON.stringify(parsedData);
  return message;
};

export const handleAxiosError = (error: unknown) => {
  if (error instanceof ApiResponseError) {
    throw error;
  }

  if (error instanceof AxiosError) {
    if (error.response?.status) {
      let message = error.message;
      if (error.response.status >= 400 && error.response.status < 500) {
        message = catchErrorResponse(error.response.data);
      }

      throw new ApiResponseError(error.response.status, message, {
        cause: error,
      });
    }
  }

  if (error instanceof Error) {
    throw new ApiResponseError(-1, error.message, {
      cause: error,
    });
  }

  if (typeof error === "object" && error !== null) {
    throw new ApiResponseError(-1, JSON.stringify(error), {
      cause: error,
    });
  }

  throw new ApiResponseError(-1, String(error), {
    cause: error,
  });
};

export const errors = parseMeta(
  Type.Object({
    need_login: Type.String(),
    not_supported_in_current_region: Type.String(),
    premium_plans_config_not_found: Type.String(),
    premium_plans_config_invalid: Type.String(),
    order_not_unpaid: Type.String(),
    order_expired: Type.String(),
    sts_token_expired: Type.String(),
    artifact_not_found: Type.String(),
    operation_timeout: Type.String(),
    upload_file_type_not_supported: Type.String(),
    upload_file_size_too_large: Type.String(),
    invalid_picture_artifact_uuid: Type.String(),
    tcp_missing_id_or_name: Type.String(),
    tcp_not_found: Type.String(),
    tcp_type_mismatch_character: Type.String(),
    tcp_type_mismatch_elementum: Type.String(),
    tcp_unknown_type: Type.String(),
    hashtag_not_linked_to_activity_space: Type.String(),
    collection_artifact_count_range: Type.String(),
    collection_artifact_not_found: Type.String(),
    collection_artifact_not_success: Type.String(),
    creative_collection_not_found: Type.String(),
    action_fail: Type.String(),
    create_comment_fail: Type.String(),
    collection_not_found: Type.String(),
  }),
  import.meta,
);
