import { Type } from "@sinclair/typebox";
import { deleteDeviceCode, deleteToken } from "../../utils/auth.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    success: Type.String(),
  }),
  import.meta,
);

export const logout = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
  },
  async (_, { log }) => {
    await deleteToken();
    await deleteDeviceCode();
    log.info(meta.success);
  },
);
