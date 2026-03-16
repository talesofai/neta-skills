import { cp } from "node:fs/promises";
import { join } from "node:path";
import { glob } from "glob";

const sourceDir = join(import.meta.dirname, "../src");
const distDir = join(import.meta.dirname, "../bin");

const cmdYamlFiles = await glob(join(sourceDir, "**/*.cmd.*.yml")).then(
  (files) => files.map((file) => file.replace(sourceDir, "")),
);
const schemaYamlFiles = await glob(join(sourceDir, "**/schema.*.yml")).then(
  (files) => files.map((file) => file.replace(sourceDir, "")),
);

for (const cmdYamlFile of cmdYamlFiles) {
  await cp(join(sourceDir, cmdYamlFile), join(distDir, cmdYamlFile));
}

for (const schemaYamlFile of schemaYamlFiles) {
  await cp(join(sourceDir, schemaYamlFile), join(distDir, schemaYamlFile));
}
