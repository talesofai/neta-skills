import type { AxiosInstance } from "axios";
import { safeParseJson } from "../utils/json.ts";

export function createConfigApis(client: AxiosInstance) {
  const getConfig = async (namespace: string, key: string) => {
    const res = await client
      .get<{
        namespace: string;
        key: string;
        value: string; //
        type: "string" | "int" | "json";
      } | null>(`/v1/configs/config`, {
        params: {
          namespace,
          key,
        },
      })
      .then((res) => res.data);

    if (!res) return null;

    switch (res.type) {
      case "string": {
        const value = String(res.value);
        if (value === "null") {
          return null;
        } else {
          return value;
        }
      }
      case "int": {
        const value = Number(res.value);
        if (Number.isNaN(value)) {
          return null;
        } else {
          return value;
        }
      }
      case "json": {
        const value = safeParseJson<object>(res.value);
        if (value === null) {
          return null;
        } else {
          return value;
        }
      }
      default:
        return null;
    }
  };

  return {
    getConfig,
  };
}
