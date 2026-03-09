import { readFileSync } from "node:fs";
import yaml from "yaml";
const locale = "zh_cn";
export const parseMeta = (schema, importMeta) => {
    const file = readFileSync(importMeta.filename.replace(/\.(ts|js)$/, `.${locale}.yml`), "utf-8");
    return schema.parse(yaml.parse(file));
};
