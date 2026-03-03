#!/usr/bin/env node
import { program } from "@commander-js/extra-typings";
import dotenv from "dotenv-flow";
import pkg from "../package.json" with { type: "json" };
import { buildCommands, loadCommands } from "./commands/load.js";
// Load environment variables
dotenv.config();
program
    .name("neta")
    .description("NETA CLI - Neta API Client")
    .version(pkg.version);
const commands = await loadCommands(["creative", "community"]);
await buildCommands(program
    .option("--token", "neta token (default: from env NETA_TOKEN)")
    .option("--api_base_url", "api base url (default: from env NETA_API_BASE_URL)"), commands);
program.parse(process.argv);
