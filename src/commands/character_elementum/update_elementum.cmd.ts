import { Type } from "@sinclair/typebox";
import type { CreateElementumParams } from "../../apis/tcp.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { mapProfileToElementumAssign } from "../../utils/tcp_mapper.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      tcp_uuid: Type.String(),
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

const updateElementumParameters = Type.Object({
  tcp_uuid: Type.String({ description: meta.parameters.tcp_uuid }),
  name: Type.Optional(Type.String({ description: meta.parameters.name })),
  artifact_uuid: Type.Optional(
    Type.String({ description: meta.parameters.artifact_uuid }),
  ),
  prompt: Type.Optional(Type.String({ description: meta.parameters.prompt })),
  description: Type.Optional(
    Type.String({ description: meta.parameters.description }),
  ),
  ref_image_uuid: Type.Optional(
    Type.String({ description: meta.parameters.ref_image_uuid }),
  ),
  accessibility: Type.Optional(
    Type.Union([Type.Literal("PUBLIC"), Type.Literal("PRIVATE")], {
      description: meta.parameters.accessibility,
    }),
  ),
});

export const updateElementum = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: updateElementumParameters,
  },
  async (
    {
      tcp_uuid,
      name,
      artifact_uuid,
      prompt,
      description,
      ref_image_uuid,
      accessibility,
    },
    { apis },
  ) => {
    // Only send fields that were explicitly provided (undefined = unchanged)
    const params: Partial<CreateElementumParams> = {};
    if (name !== undefined) params.name = name;
    if (artifact_uuid !== undefined) params.artifact_uuid = artifact_uuid;
    if (prompt !== undefined) params.prompt = prompt;
    if (description !== undefined) params.description = description;
    if (ref_image_uuid !== undefined) params.ref_image_uuid = ref_image_uuid;
    if (accessibility !== undefined) params.accessibility = accessibility;

    const result = await apis.tcp.updateElementum(tcp_uuid, params);
    return { detail: mapProfileToElementumAssign(result) };
  },
);
