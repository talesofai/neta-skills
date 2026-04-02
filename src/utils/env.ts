import dotenv from "dotenv-flow";

// Load environment variables
dotenv.config({
  silent: true,
});

export const IS_DEV = process.env["NODE_ENV"] === "development";

export const API_BASE_URL =
  process.env["NETA_API_BASE_URL"] ?? "https://api.talesofai.com";

export const AUTH_API_BASE_URL = process.env["NETA_AUTH_API_BASE_URL"];

export const CLIENT_ID =
  process.env["NETA_CLIENT_ID"] ?? "ft6zb5zp7fqmq8y807okv";

export const NETA_TOKEN = process.env["NETA_TOKEN"] ?? "";

export const IS_GLOBAL = API_BASE_URL.endsWith("talesofai.com");
