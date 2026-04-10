import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      page_index: Type.String(),
      page_size: Type.String(),
      modality: Type.String(),
      is_starred: Type.String(),
    }),
  }),
  import.meta,
);

const listMyArtifactsParameters = Type.Object({
  page_index: Type.Optional(
    Type.Integer({
      minimum: 0,
      default: 0,
      description: meta.parameters.page_index,
    }),
  ),
  page_size: Type.Optional(
    Type.Integer({
      minimum: 1,
      maximum: 100,
      default: 20,
      description: meta.parameters.page_size,
    }),
  ),
  modality: Type.Optional(
    Type.String({ description: meta.parameters.modality }),
  ),
  is_starred: Type.Optional(
    Type.Boolean({ description: meta.parameters.is_starred }),
  ),
});

export const listMyArtifacts = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: listMyArtifactsParameters,
  },
  async ({ page_index, page_size, modality, is_starred }, { apis }) => {
    const resolvedPageSize = page_size ?? 20;
    const result = await apis.artifact.listArtifacts({
      page_index,
      page_size: resolvedPageSize,
      modality,
      is_starred,
    });
    return {
      has_more: result.list.length === resolvedPageSize,
      list: result.list,
    };
  },
);
