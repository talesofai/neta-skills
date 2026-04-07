import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      nick_name: Type.String(),
      bio: Type.String(),
      avatar_url: Type.String(),
    }),
  }),
  import.meta,
);

const updateProfileParameters = Type.Object({
  nick_name: Type.Optional(
    Type.String({ description: meta.parameters.nick_name }),
  ),
  bio: Type.Optional(Type.String({ description: meta.parameters.bio })),
  avatar_url: Type.Optional(
    Type.String({ description: meta.parameters.avatar_url }),
  ),
});

export const updateProfile = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: updateProfileParameters,
  },
  async ({ nick_name, bio, avatar_url }, { apis, user }) => {
    if (!user) {
      throw new Error(
        "neta-me commands require login. Please run /login first.",
      );
    }

    if (!nick_name && !bio && !avatar_url) {
      throw new Error(
        "At least one field must be provided: nick_name, bio, or avatar_url.",
      );
    }

    const updated = await apis.user.updateUser({
      nick_name,
      bio,
      avatar_url,
    });

    return {
      uuid: updated.uuid,
      nick_name: updated.nick_name ?? null,
      avatar_url: updated.avatar_url ?? null,
    };
  },
);
