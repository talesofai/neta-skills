/** biome-ignore-all lint/suspicious/noConsole: use console */
import { IS_DEV } from "./env.ts";

export const logger = IS_DEV
  ? console
  : {
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: () => {},
    };
