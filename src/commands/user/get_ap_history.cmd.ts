import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      cursor_id: Type.String(),
      page_size: Type.String(),
    }),
  }),
  import.meta,
);

const getApHistoryParameters = Type.Object({
  cursor_id: Type.Optional(
    Type.Integer({ description: meta.parameters.cursor_id }),
  ),
  page_size: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 50,
      default: 10,
      description: meta.parameters.page_size,
    }),
  ),
});

export const getApHistory = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: getApHistoryParameters,
  },
  async ({ cursor_id, page_size }, { apis, user }) => {
    if (!user) {
      throw new Error(
        "neta-me commands require login. Please run /login first.",
      );
    }

    return apis.user.apDeltaInfo({ cursor_id, page_size });
  },
);
