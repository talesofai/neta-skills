#!/usr/bin/env node
import { program } from "@commander-js/extra-typings";
import dotenv from "dotenv-flow";
import pkg from "../package.json" with { type: "json" };
import { buildCommands } from "./commands/load.ts";

// Load environment variables
dotenv.config({
  silent: true,
});

program
  .name("neta")
  .description("NETA CLI - Neta API Client")
  .version(pkg.version);

const cli = program.option(
  "--api_base_url <string>",
  "api base url (default: NETA_API_BASE_URL or locale-based default)",
);

await buildCommands(cli);

cli.parse(process.argv);
