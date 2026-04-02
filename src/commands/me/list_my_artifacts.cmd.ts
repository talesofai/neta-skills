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
    const result = await apis.artifact.listArtifacts({
      page_index,
      page_size,
      modality,
      is_starred,
    });

    return {
      total: result.total,
      list: result.list.map((item) => ({
        uuid: item.uuid,
        status: item.status,
        url: item.url,
        modality: item.modality,
        is_starred: item.is_starred,
        ctime: item.ctime,
        audio_name: item.audio_name,
      })),
    };
  },
);
