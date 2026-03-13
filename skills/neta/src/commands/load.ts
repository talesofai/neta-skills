import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  type Command as CommanderCommand,
  Option,
} from "@commander-js/extra-typings";
import { type TLiteral, Type } from "@sinclair/typebox";
import { Default, Value } from "@sinclair/typebox/value";
import { createApis } from "../apis/index.ts";
import { ApiResponseError } from "../utils/errors.ts";
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

const logger = console;

export const buildCommands = async (
  cli: CommanderCommand<
    [],
    {
      api_base_url?: string | true;
      token?: string | true;
    },
    // biome-ignore lint/complexity/noBannedTypes: ignore type error
    {}
  >,
  commands: Command<SupportedSchema>[],
) => {
  const { api_base_url, token } = cli.opts();

  const apis = createApis({
    baseUrl:
      typeof api_base_url === "string"
        ? api_base_url
        : (process.env["NETA_API_BASE_URL"] ?? "https://api.talesofai.cn"),
    headers: {
      "x-token":
        typeof token === "string" ? token : (process.env["NETA_TOKEN"] ?? ""),
      "x-platform": "nieta-app/web",
    },
  });

  const user = await apis.user.me().catch((e) => {
    if (e instanceof ApiResponseError) {
      return null;
    }

    return null;
  });

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
          `--${key} <${property["type"]}>`,
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
      const type = cmd.inputSchema ?? Type.Object({});
      const input = Value.Decode(type, Default(type, args));

      if (IS_DEV) {
        logger.debug("command: %s, params: %o", cmd.name, input);
      }

      const result = await cmd
        .execute(input, {
          apis,
          user,
          log: IS_DEV
            ? logger
            : {
                error: () => {},
                warn: () => {},
                info: () => {},
                debug: () => {},
              },
        })
        .catch((e: unknown) => {
          if (e instanceof ApiResponseError) {
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
            logger.error({
              error: {
                type: e.name,
                message: e.message,
              },
            });
            return null;
          }

          logger.error(e);
          return null;
        });

      if (!result) return;

      if (IS_DEV) {
        logger.debug(result);
      } else {
        logger.info(JSON.stringify(result));
      }
    });

    return command;
  });
};
