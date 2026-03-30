import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  type Command as CommanderCommand,
  Option,
} from "@commander-js/extra-typings";
import { type TLiteral, Type } from "@sinclair/typebox";
import { AssertError, Value } from "@sinclair/typebox/value";
import { createApis } from "../apis/index.ts";
import { ApiResponseError } from "../utils/errors.ts";
import { getLocale } from "../utils/lang.ts";
import { setLocale } from "../utils/parse_meta.ts";
import {
  formatCommandParams,
  track,
  trackConfig,
  trackConfigUser,
} from "../utils/telemetry.ts";
import { type Command, isCommand, type SupportedSchema } from "./factory.ts";

export const loadCommands = async (domains: string[]) => {
  const cmdFiles = await Promise.all(
    domains.map(async (domain) => {
      return readdir(resolve(import.meta.dirname, domain))
        .then((files) =>
          files
            .filter(
              (file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"),
            )
            .map((file) => resolve(import.meta.dirname, domain, file)),
        )
        .catch((_error) => {
          return [];
        });
    }),
  ).then((files) => files.flat());

  return await Promise.all(
    cmdFiles.map(async (file) => {
      const module = await import(pathToFileURL(file).href);
      return Object.getOwnPropertyNames(module)
        .filter((name) => {
          const value = module[name];
          return isCommand(value);
        })
        .map((name) => module[name] as Command<SupportedSchema>);
    }),
  ).then((commands) => commands.flat());
};

const IS_DEV = process.env["NODE_ENV"] === "development";

const logger: Pick<Console, "error" | "warn" | "info" | "debug"> = IS_DEV
  ? console
  : {
      // biome-ignore lint/suspicious/noConsole: use console
      error: console.error,
      // biome-ignore lint/suspicious/noConsole: use console
      warn: console.warn,
      // biome-ignore lint/suspicious/noConsole: use console
      info: console.info,
      debug: () => {},
    };

export const buildCommands = async (
  cli: CommanderCommand<
    [],
    {
      api_base_url?: string;
    },
    // biome-ignore lint/complexity/noBannedTypes: ignore type error
    {}
  >,
) => {
  setLocale();

  const commands = await loadCommands([
    "creative",
    "community",
    "character_elementum",
    "adventure_campaign",
    "premium",
  ]);

  return commands.map((cmd) => {
    const command = cli.command(cmd.name);
    command.description(cmd.title || cmd.description || "");
    const inputSchema = cmd.inputSchema;

    if (inputSchema && "properties" in inputSchema) {
      const properties = inputSchema.properties;

      if (!properties) return command;

      Object.entries(properties).forEach(([key, property]) => {
        if (typeof property !== "object") return;

        const option = new Option(
          `--${key} <${property["type"] ?? "string"}>`,
          property.description,
        );

        if (property.default) {
          option.default(property.default);
        }

        if (property["anyOf"]) {
          option.choices(property["anyOf"].map((item: TLiteral) => item.const));
        }

        if (
          inputSchema.required?.includes(key) &&
          property.default === undefined
        ) {
          option.makeOptionMandatory();
        }

        if (property.type === "boolean") {
          option.argParser((value) => value === "true" || value === "1");
        }

        if (property.type === "number") {
          option.argParser((value) => Number.parseFloat(value));
        }

        if (property.type === "integer") {
          option.argParser((value) => Number.parseInt(value, 10));
        }

        if (property.type === "null") {
          option.argParser(() => null);
        }

        command.addOption(option);
      });
    }

    command.action(async (args) => {
      const { api_base_url } = cli.opts();

      const baseUrl =
        typeof api_base_url === "string"
          ? api_base_url
          : (process.env["NETA_API_BASE_URL"] ?? "https://api.talesofai.com");

      trackConfig({
        app_region: baseUrl.endsWith("cn") ? "cn" : "global",
        app_language: getLocale(),
      });

      const apis = createApis({
        logger,
        baseUrl,
        headers: {
          "x-token": process.env["NETA_TOKEN"] ?? "",
          "x-platform": "nieta-app/web",
        },
      });

      const user = await apis.user.me().catch((e) => {
        if (e instanceof ApiResponseError) {
          return null;
        }

        return null;
      });
      const startTime = Date.now();
      logger.debug("[telemetry] user: %s", user?.uuid);

      trackConfigUser(user ? { user_unique_id: user.uuid } : null);

      track("command_call", {
        command: cmd.name,
        ...formatCommandParams(args),
      });

      const type = cmd.inputSchema ?? Type.Object({});
      const input = Value.Parse(type, args);

      if (IS_DEV) {
        logger.debug("[command] %s, params: %o", cmd.name, input);
      }

      await cmd
        .execute(input, {
          apis,
          user,
          log: logger,
        })
        .then((result) => {
          const duration = Date.now() - startTime;
          track("command_result", {
            command: cmd.name,
            ...formatCommandParams(args),
            duration,
          });

          if (!result) return;

          if (IS_DEV) {
            logger.debug(JSON.stringify(result, null, 2));
          } else {
            logger.info(JSON.stringify(result));
          }
        })
        .catch((e: unknown) => {
          if (e instanceof AssertError) {
            track("command_error", {
              command: cmd.name,
              ...formatCommandParams(args),
              error_type: e.name,
              error_message: e.message,
            });

            logger.error({
              error: {
                type: e.name,
                message: e.message,
                path: e.error?.path,
                schema: e.error?.schema,
              },
            });
            return null;
          }

          if (e instanceof ApiResponseError) {
            track("command_error", {
              command: cmd.name,
              ...formatCommandParams(args),
              error_type: e.name,
              error_message: e.message,
              error_code: e.code,
            });

            logger.error({
              error: {
                type: e.name,
                code: e.code,
                message: e.message,
              },
            });
            return null;
          }

          if (e instanceof Error) {
            track("command_error", {
              command: cmd.name,
              ...formatCommandParams(args),
              error_type: e.name,
              error_message: e.message,
            });

            logger.error({
              error: {
                type: e.name,
                message: e.message,
              },
            });
            return null;
          }

          track("command_error", {
            command: cmd.name,
            ...formatCommandParams(args),
            error_type: "unknown",
            error_message: typeof e === "string" ? e : JSON.stringify(e),
          });

          logger.error(e);
          return null;
        });
    });

    return command;
  });
};
