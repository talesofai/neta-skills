var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Option, } from "@commander-js/extra-typings";
import { createApis } from "../apis/index.js";
import { ApiResponseError } from "../utils/errors.js";
import { isCommand } from "./factory.js";
export const loadCommands = async (domains) => {
    const cmdFiles = await Promise.all(domains.map(async (domain) => {
        return readdir(resolve(import.meta.dirname, domain))
            .then((files) => files
            .filter((file) => file.endsWith(".cmd.ts") || file.endsWith(".cmd.js"))
            .map((file) => resolve(import.meta.dirname, domain, file)))
            .catch((_error) => {
            return [];
        });
    })).then((files) => files.flat());
    return await Promise.all(cmdFiles.map(async (file) => {
        const module = await import(__rewriteRelativeImportExtension(pathToFileURL(file).href));
        return Object.getOwnPropertyNames(module)
            .filter((name) => {
            const value = module[name];
            return isCommand(value);
        })
            .map((name) => module[name]);
    })).then((commands) => commands.flat());
};
const IS_DEV = process.env["NODE_ENV"] === "development";
const logger = console;
export const buildCommands = async (cli, commands) => {
    // Parse global options early so --token/--api_base_url can be used
    // before subcommands are registered.
    cli.parseOptions(process.argv);
    const { api_base_url, token } = cli.opts();
    const apis = createApis({
        baseUrl: typeof api_base_url === "string"
            ? api_base_url
            : (process.env["NETA_API_BASE_URL"] ?? "https://api.talesofai.cn"),
        headers: {
            "x-token": typeof token === "string" ? token : (process.env["NETA_TOKEN"] ?? ""),
            "x-platform": "nieta-app/web",
        },
    });
    const user = await apis.user.me().catch((e) => {
        if (e instanceof ApiResponseError) {
            return null;
        }
        return null;
    });
    const filteredCommands = [];
    for (const cmd of commands) {
        if (!cmd.validate) {
            filteredCommands.push(cmd);
            continue;
        }
        const validated = await cmd.validate({
            apis,
            user,
            log: logger,
            sendNotification: () => Promise.resolve(),
        });
        if (validated) {
            filteredCommands.push(cmd);
        }
    }
    return filteredCommands.map((cmd) => {
        const command = cli.command(cmd.name);
        command.description(cmd.title || cmd.description || "");
        const inputSchema = cmd.inputSchema?.toJSONSchema();
        if (inputSchema?.properties) {
            Object.entries(inputSchema.properties).forEach(([key, property]) => {
                if (typeof property !== "object")
                    return;
                if (property.type === "object")
                    throw new Error("Object type options is not supported");
                if (property.type === "array")
                    throw new Error("Array type options is not supported");
                const option = new Option(`--${key} <${property.type}>`, property.description);
                if (property.default) {
                    option.default(property.default);
                }
                if (property.enum) {
                    // @ts-expect-error -- ignore type error
                    option.choices(property.enum);
                }
                if (inputSchema.required?.includes(key) &&
                    property.default === undefined) {
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
            if (cmd.inputSchema) {
                // @ts-expect-error -- ignore type error
                const result = await cmd
                    // @ts-expect-error -- ignore type error
                    .execute(cmd.inputSchema.parse(args), {
                    apis,
                    user,
                    log: IS_DEV
                        ? logger
                        : {
                            error: () => { },
                            warn: () => { },
                            info: () => { },
                            debug: () => { },
                        },
                    _meta: {},
                    sendNotification: () => Promise.resolve(),
                })
                    .catch((e) => {
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
                if (!result)
                    return;
                logger.info(JSON.stringify(result));
            }
            else {
                // @ts-expect-error -- ignore type error
                const result = await cmd
                    // @ts-expect-error -- ignore type error
                    .execute({
                    apis,
                    user,
                    log: IS_DEV
                        ? logger
                        : {
                            error: () => { },
                            warn: () => { },
                            info: () => { },
                            debug: () => { },
                        },
                    _meta: {},
                    sendNotification: () => Promise.resolve(),
                })
                    .catch((e) => {
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
                if (!result)
                    return;
                logger.info(JSON.stringify(result));
            }
        });
        return command;
    });
};
