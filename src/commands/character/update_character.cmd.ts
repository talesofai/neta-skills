import { Type } from "@sinclair/typebox";
import type { CreateCharacterParams } from "../../apis/tcp.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      tcp_uuid: Type.String(),
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

const updateCharacterParameters = Type.Object({
  tcp_uuid: Type.String({ description: meta.parameters.tcp_uuid }),
  name: Type.Optional(Type.String({ description: meta.parameters.name })),
  gender: Type.Optional(Type.String({ description: meta.parameters.gender })),
  avatar_artifact_uuid: Type.Optional(
    Type.String({ description: meta.parameters.avatar_artifact_uuid }),
  ),
  prompt: Type.Optional(Type.String({ description: meta.parameters.prompt })),
  trigger: Type.Optional(Type.String({ description: meta.parameters.trigger })),
  accessibility: Type.Optional(
    Type.Union([Type.Literal("PUBLIC"), Type.Literal("PRIVATE")], {
      description: meta.parameters.accessibility,
    }),
  ),
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

export const updateCharacter = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: updateCharacterParameters,
  },
  async (
    {
      tcp_uuid,
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
    // Only send fields that were explicitly provided (undefined = unchanged)
    const params: Partial<CreateCharacterParams> = {};
    if (name !== undefined) params.name = name;
    if (gender !== undefined) params.gender = gender;
    if (avatar_artifact_uuid !== undefined) {
      params.avatar_artifact_uuid = avatar_artifact_uuid;
      // avatar doubles as ref_image for the IMAGE_EDIT model pipeline
      params.ref_image_uuid = avatar_artifact_uuid;
    }
    if (prompt !== undefined) params.prompt = prompt;
    if (trigger !== undefined) params.trigger = trigger;
    if (accessibility !== undefined) params.accessibility = accessibility;
    if (age !== undefined) params.age = age;
    if (interests !== undefined) params.interests = interests;
    if (persona !== undefined) params.persona = persona;
    if (description !== undefined) params.description = description;
    if (occupation !== undefined) params.occupation = occupation;

    return await apis.tcp.updateCharacter(tcp_uuid, params);
  },
);
