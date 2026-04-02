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
import { API_BASE_URL, IS_DEV } from "../utils/env.ts";
import { ApiResponseError, errors } from "../utils/errors.ts";
import { getSysLocale } from "../utils/lang.ts";
import { logger } from "../utils/logger.ts";
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

export const buildCommands = async (
  cli: CommanderCommand<
    [],
    // biome-ignore lint/complexity/noBannedTypes: ignore type error
    {},
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
    "user",
  ]);

  commands.forEach((cmd) => {
    const command = cli.command(cmd.name);
    command.description(cmd.description || "");
    command.summary(cmd.title || "");
    const inputSchema = cmd.inputSchema;

    if (inputSchema && "properties" in inputSchema) {
      const properties = inputSchema.properties;

      if (!properties) return;

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
      trackConfig({
        app_region: API_BASE_URL.endsWith("cn") ? "cn" : "global",
        app_language: getSysLocale(),
      });

      const apis = createApis({
        logger,
        baseUrl: API_BASE_URL,
        headers: {
          "x-platform": "nieta-app/web",
        },
      });

      const user =
        cmd.name === "login"
          ? null
          : await apis.user.me().catch((e) => {
              if (e instanceof ApiResponseError) {
                logger.info(`${e.name}[${e.code}]: ${e.message}`);
              } else {
                logger.warn(e);
              }

              throw new Error(errors.need_login);
            });

      const startTime = Date.now();

      if (user) {
        logger.debug("[telemetry] user: %s", user.uuid);
        trackConfigUser({ user_unique_id: user.uuid });
      }

      track("command_call", {
        command: cmd.name,
        ...formatCommandParams(args),
      });

      const type = cmd.inputSchema ?? Type.Object({});
      const input = Value.Parse(type, args);

      logger.debug("[command] %s, params: %o", cmd.name, input);

      await cmd
        .execute(input, {
          apis,
          // biome-ignore lint/style/noNonNullAssertion: ignore type error when user is null by login command
          user: user!,
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
                schema: JSON.stringify(e.error?.schema),
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
  });
};
