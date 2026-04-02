import { existsSync, mkdirSync } from "node:fs";
import { readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import envPaths from "env-paths";
import { IS_DEV } from "./env.ts";
import { logger } from "./logger.ts";

const paths = envPaths("neta-cli", {
  suffix: IS_DEV ? "dev" : "",
});

const CONFIG_DIR = process.env["NETA_CONFIG_DIR"] ?? paths.config;
export const setupEnvPaths = () => {
  try {
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }
  } catch (error) {
    logger.error(
      "Failed to setup env paths, try to set NETA_CONFIG_DIR manually, error: %o",
      error,
    );
  }
};

export const readConfig = async (name: string) => {
  try {
    const filePath = resolve(CONFIG_DIR, name);
    if (!existsSync(filePath)) return null;
    const data = await readFile(filePath, "utf-8");
    if (!data) return null;
    return Buffer.from(data, "base64").toString("utf-8");
  } catch (e) {
    logger.warn("Failed to read config: %s, error: %o", name, e);
    return null;
  }
};

export const writeConfig = async (
  name: string,
  value: string,
): Promise<boolean> => {
  try {
    const filePath = resolve(CONFIG_DIR, name);
    const encoded = Buffer.from(value, "utf-8").toString("base64");
    await writeFile(filePath, encoded, "utf-8");
    return true;
  } catch (e) {
    logger.warn("Failed to write config: %s, error: %o", name, e);
    return false;
  }
};

export const deleteConfig = async (name: string): Promise<boolean> => {
  try {
    const filePath = resolve(CONFIG_DIR, name);
    if (!existsSync(filePath)) return true;
    await unlink(filePath);
    return true;
  } catch (e) {
    logger.warn("Failed to delete config: %s, error: %o", name, e);
    return false;
  }
};
