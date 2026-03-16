import { readFileSync } from "node:fs";
import { Value } from "@sinclair/typebox/value";
import yaml from "yaml";
const locale = "zh_cn";
export const parseMeta = (schema, importMeta) => {
    const file = readFileSync(importMeta.filename.replace(/\.(ts|js)$/, `.${locale}.yml`), "utf-8");
    const data = yaml.parse(file);
    return Value.Decode(schema, data);
};
