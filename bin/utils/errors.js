import { AxiosError } from "axios";
import { safeParseJson } from "./json.js";
export class ApiResponseError extends Error {
    code;
    message;
    constructor(code, message, options) {
        super(message, {
            ...options,
        });
        this.code = code;
        this.message = message;
        this.name = "ApiResponseError";
    }
}
export const catchErrorResponse = (data) => {
    if (typeof data !== "string" && typeof data !== "object")
        return String(data);
    const parsedData = typeof data === "string" ? (safeParseJson(data) ?? {}) : data;
    const detail = parsedData?.["detail"];
    if (typeof detail === "string") {
        return detail;
    }
    if (typeof detail === "object") {
        if (Array.isArray(detail)) {
            return detail.map(({ msg } = { msg: "" }) => msg).join(", ");
        }
        else {
            return detail["message"] ?? detail["msg"] ?? JSON.stringify(detail);
        }
    }
    const message = parsedData?.["message"] ??
        parsedData?.["msg"] ??
        JSON.stringify(parsedData);
    return message;
};
export const handleAxiosError = (error) => {
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
