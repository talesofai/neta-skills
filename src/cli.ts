#!/usr/bin/env node
import { program } from "@commander-js/extra-typings";
import pkg from "../package.json" with { type: "json" };
import { buildCommands } from "./commands/load.ts";
import { setupEnvPaths } from "./utils/config.ts";

setupEnvPaths();

program
  .name("neta")
  .description("NETA CLI - Neta API Client")
  .version(pkg.version);

await buildCommands(program);

program.parse(process.argv);
