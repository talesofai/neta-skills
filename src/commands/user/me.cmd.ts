import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
  }),
  import.meta,
);

export const me = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
  },
  async (_args, { user }) => {
    return {
      uuid: user.uuid,
      nick_name: user.nick_name ?? null,
      avatar_url: user.avatar_url,
      ap: user.ap_info?.ap ?? null,
      ap_limit: user.ap_info?.ap_limit ?? null,
      unlimited_until: user.ap_info?.unlimited_until ?? null,
      total_collections: user.total_collections,
      total_pictures: user.total_pictures,
      total_travel_characters: user.total_travel_characters,
      privileges:
        user.privileges?.map((p) => ({
          type: p.privilege_type,
          is_active: p.is_active,
          valid_until: p.valid_until,
        })) ?? [],
    };
  },
);
