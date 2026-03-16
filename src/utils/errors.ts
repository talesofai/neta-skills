import { AxiosError } from "axios";
import { safeParseJson } from "./json.ts";

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
