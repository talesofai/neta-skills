import axios from "axios";
import pkg from "../../package.json" with { type: "json" };

type TrackValue = string | number | boolean | string[] | number[] | null;

type TrackParams = Record<string, TrackValue>;

const DISABLE_TELEMETRY = process.env["DISABLE_TELEMETRY"] === "1";

const IS_DEV = process.env["NODE_ENV"] === "development";

const api = axios.create({
  baseURL: "https://gator.volces.com/v2/event/json",
  headers: {
    "content-type": "application/json",
    "x-mcs-appkey":
      "e8cf31177d1687876753d8359bf633258f9c5c8e8b63e7b061affe59fe1f106d",
  },
});

let _user: { user_unique_id: string } | null = null;
let _header: Record<string, string> = {
  app_name: "neta_cli",
  app_package: pkg.name,
  app_version: pkg.version,
};

export const trackConfigUser = (user: { user_unique_id: string } | null) => {
  _user = user;
};

export const trackConfig = (config: Record<string, string>) => {
  _header = {
    ..._header,
    ...config,
  };
};

const logger = console;

export const track = (event: string, params: TrackParams) => {
  if (DISABLE_TELEMETRY) return;

  api
    .post("/", {
      user: _user,
      header: {
        ..._header,
      },
      events: [
        {
          event,
          params,
          local_time_ms: Date.now(),
        },
      ],
    })
    .then((e) => {
      if (!IS_DEV) return;

      if (e.status === 200) return;
      logger.warn("[telemetry] track error: %s %o", e.status, e.data);
    })
    .catch((e) => {
      if (!IS_DEV) return;
      logger.warn("[telemetry] track error: %o", e);
    });
};

export const formatCommandParams = (params: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [`param_${key}`, value];
      }

      if (typeof value === "number") {
        return [`param_${key}`, value];
      }

      if (typeof value === "boolean") {
        return [`param_${key}`, value];
      }

      if (Array.isArray(value)) {
        if (value.every((item) => typeof item === "string")) {
          return [`param_${key}`, value];
        }

        if (value.every((item) => typeof item === "number")) {
          return [`param_${key}`, value];
        }
      }

      return [`param_${key}`, JSON.stringify(value)];
    }),
  );
};
