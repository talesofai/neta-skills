import { type Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { deleteConfig, readConfig, writeConfig } from "./config.ts";
import { AUTH_API_BASE_URL, CLIENT_ID } from "./env.ts";
import { ApiResponseError } from "./errors.ts";
import { safeParseJson } from "./json.ts";
import { logger } from "./logger.ts";

const DeviceCodeResponse = Type.Object({
  device_code: Type.String(),
  user_code: Type.String(),
  verification_uri: Type.String(),
  verification_uri_complete: Type.String(),
  expires_in: Type.Number(),
  created_at: Type.Number(),
});

export type DeviceCodeResponse = Static<typeof DeviceCodeResponse>;

const TokenResponse = Type.Object({
  access_token: Type.String(),
  id_token: Type.Optional(Type.String()),
  refresh_token: Type.Optional(Type.String()),
  token_type: Type.Literal("Bearer"),
  expires_in: Type.Number(),
  scope: Type.String(),
  created_at: Type.Number(),
});

export type TokenResponse = Static<typeof TokenResponse>;

export const storeDeviceCode = (deviceCode: DeviceCodeResponse) => {
  return writeConfig("device_code", JSON.stringify(deviceCode));
};

export const readDeviceCode = async () => {
  const config = await readConfig("device_code");
  if (!config) return null;
  const json = safeParseJson(config);
  if (!json) return null;
  try {
    return Value.Parse(DeviceCodeResponse, json);
  } catch (e) {
    logger.warn("[auth] read device code: invalid device code, error: %o", e);
    return null;
  }
};

export const deleteDeviceCode = async () => {
  return deleteConfig("device_code");
};

export const storeToken = (token: TokenResponse) => {
  return writeConfig("token", JSON.stringify(token));
};

export const readToken = async () => {
  const config = await readConfig("token");
  if (!config) return null;
  const json = safeParseJson(config);
  if (!json) return null;

  try {
    return Value.Parse(TokenResponse, json);
  } catch (e) {
    logger.warn("[auth] read token: invalid token, error: %o", e);
    return null;
  }
};

export const deleteToken = async () => {
  return deleteConfig("token");
};

export const isDeviceCodeExpired = (deviceCode: DeviceCodeResponse) => {
  return deviceCode.created_at + deviceCode.expires_in * 1000 < Date.now();
};

export const isTokenExpired = (token: TokenResponse) => {
  return token.created_at + token.expires_in * 1000 < Date.now();
};

export const verifyDeviceCode = async () => {
  logger.debug("[auth] verify device code");
  const config = await readConfig("device_code");
  if (!config) {
    throw new Error("Device code is not found, please request login again");
  }
  const deviceCodeConfig = Value.Parse(
    DeviceCodeResponse,
    safeParseJson(config),
  );

  if (isDeviceCodeExpired(deviceCodeConfig)) {
    throw new Error("Device code is expired, please request login again");
  }

  const res = await fetch(`${AUTH_API_BASE_URL}/oidc/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      device_code: deviceCodeConfig.device_code,
    }),
  });

  if (!res.ok) {
    throw new ApiResponseError(res.status, await res.text());
  }

  const data = await res.json();
  if (typeof data !== "object") {
    throw new Error("Invalid response", { cause: data });
  }

  const token = Value.Parse(TokenResponse, {
    ...data,
    created_at: Date.now(),
  });

  if (await storeToken(token)) {
    logger.debug("[auth] verify device code success");
    await deleteDeviceCode();
  } else {
    throw new Error("Failed to store token, please try again");
  }

  return token;
};

export const requestDeviceCode = async () => {
  logger.debug("[auth] request device code");
  const res = await fetch(`${AUTH_API_BASE_URL}/oidc/device/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      scope: "profile email offline_access",
      resource: "https://api.talesofai",
    }),
  });

  if (!res.ok) {
    throw new ApiResponseError(res.status, await res.text());
  }

  const data = await res.json();
  if (typeof data !== "object") {
    throw new Error("Invalid response", { cause: data });
  }

  const deviceCode = Value.Parse(DeviceCodeResponse, {
    ...data,
    created_at: Date.now(),
  });

  if (await storeDeviceCode(deviceCode)) {
    logger.debug("[auth] request device code success");
  } else {
    throw new Error("Failed to store device code, please try again");
  }
  return deviceCode;
};

const REFRESH_TOKEN_EXPIRES_IN = 3600 * 24 * 90; // 90 days in seconds

export const refreshToken = async () => {
  logger.debug("[auth] refresh token");

  const config = await readConfig("token");
  if (!config) {
    throw new Error("Token is not found, please login again");
  }

  const tokenConfig = Value.Parse(TokenResponse, safeParseJson(config));
  if (!tokenConfig.refresh_token) {
    throw new Error("Refresh token is not found, please login again");
  }

  if (tokenConfig.created_at + REFRESH_TOKEN_EXPIRES_IN * 1000 < Date.now()) {
    await deleteToken();
    throw new Error("Refresh token is expired, please login again");
  }

  const res = await fetch(`${AUTH_API_BASE_URL}/oidc/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: "refresh_token",
      refresh_token: tokenConfig.refresh_token,
      scope: "profile email offline_access",
      resource: "https://api.talesofai",
    }),
  });

  if (!res.ok) {
    throw new ApiResponseError(res.status, await res.text());
  }

  const data = await res.json();
  if (typeof data !== "object") {
    throw new Error("Invalid response", { cause: data });
  }

  const token = Value.Parse(TokenResponse, {
    ...data,
    created_at: Date.now(),
  });

  if (await storeToken(token)) {
    logger.debug("[auth] refresh token success");
    return token;
  } else {
    throw new Error("Failed to store token, please try again");
  }
};
