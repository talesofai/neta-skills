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
      artifact_uuid: Type.String(),
      prompt: Type.String(),
      description: Type.String(),
      ref_image_uuid: Type.String(),
      accessibility: Type.String(),
    }),
  }),
  import.meta,
);

const createElementumParameters = Type.Object({
  name: Type.String({ description: meta.parameters.name }),
  artifact_uuid: Type.String({ description: meta.parameters.artifact_uuid }),
  prompt: Type.String({ description: meta.parameters.prompt }),
  description: Type.Optional(
    Type.String({ description: meta.parameters.description }),
  ),
  ref_image_uuid: Type.Optional(
    Type.String({ description: meta.parameters.ref_image_uuid }),
  ),
  accessibility: Type.Union([Type.Literal("PUBLIC"), Type.Literal("PRIVATE")], {
    default: "PUBLIC",
    description: meta.parameters.accessibility,
  }),
});

export const createElementum = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: createElementumParameters,
  },
  async (
    { name, artifact_uuid, prompt, description, ref_image_uuid, accessibility },
    { apis },
  ) => {
    return await apis.tcp.createElementum({
      name,
      artifact_uuid,
      prompt,
      description,
      ref_image_uuid,
      accessibility,
    });
  },
);
