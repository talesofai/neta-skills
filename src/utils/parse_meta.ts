import { readFileSync } from "node:fs";
import type { TSchema } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import yaml from "yaml";
import { getLocale as getLocaleFromLang } from "./lang.ts";

let _locale: "zh_cn" | "en_us" = "en_us";

export const setLocale = (locale?: "zh_cn" | "en_us") => {
  _locale = locale ?? getLocaleFromLang();
};

export const getLocale = () => {
  return _locale;
};

export const parseMeta = <T extends TSchema>(
  schema: T,
  importMeta: ImportMeta,
) => {
  const file = readFileSync(
    importMeta.filename.replace(/\.(ts|js)$/, `.${_locale}.yml`),
    "utf-8",
  );

  const data = yaml.parse(file);
  return Value.Parse(schema, data);
};
