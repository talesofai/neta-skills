import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      name: Type.String(),
      gender: Type.String(),
      avatar_artifact_uuid: Type.String(),
      prompt: Type.String(),
      trigger: Type.String(),
      accessibility: Type.String(),
      age: Type.String(),
      interests: Type.String(),
      persona: Type.String(),
      description: Type.String(),
      occupation: Type.String(),
    }),
  }),
  import.meta,
);

const createCharacterParameters = Type.Object({
  name: Type.String({ description: meta.parameters.name }),
  gender: Type.Union(
    [Type.Literal("自由"), Type.Literal("男"), Type.Literal("女")],
    { description: meta.parameters.gender, default: "自由" },
  ),
  avatar_artifact_uuid: Type.String({
    description: meta.parameters.avatar_artifact_uuid,
  }),
  prompt: Type.String({ description: meta.parameters.prompt }),
  trigger: Type.String({ description: meta.parameters.trigger }),
  accessibility: Type.Union([Type.Literal("PUBLIC"), Type.Literal("PRIVATE")], {
    default: "PUBLIC",
    description: meta.parameters.accessibility,
  }),
  age: Type.Optional(Type.String({ description: meta.parameters.age })),
  interests: Type.Optional(
    Type.String({ description: meta.parameters.interests }),
  ),
  persona: Type.Optional(Type.String({ description: meta.parameters.persona })),
  description: Type.Optional(
    Type.String({ description: meta.parameters.description }),
  ),
  occupation: Type.Optional(
    Type.String({ description: meta.parameters.occupation }),
  ),
});

export const createCharacter = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: createCharacterParameters,
  },
  async (
    {
      name,
      gender,
      avatar_artifact_uuid,
      prompt,
      trigger,
      accessibility,
      age,
      interests,
      persona,
      description,
      occupation,
    },
    { apis },
  ) => {
    return await apis.tcp.createCharacter({
      name,
      gender,
      avatar_artifact_uuid,
      prompt,
      trigger,
      // IMAGE_EDIT uses avatar in its pipeline; pass ref_image_uuid = avatar for backend consistency
      ref_image_uuid: avatar_artifact_uuid,
      accessibility,
      age,
      interests,
      persona,
      description,
      occupation,
    });
  },
);
