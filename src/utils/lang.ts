import osLocale from "os-locale";

export const getSysLocale = (): "zh_cn" | "en_us" => {
  const locale = osLocale();

  if (locale.startsWith("zh")) {
    return "zh_cn";
  }

  return "en_us";
};
