import { Type } from "@sinclair/typebox";
import { buildMakeImagePayload } from "../../apis/types.ts";
import { parseMeta } from "../../utils/parse_meta.ts";
import { polling } from "../../utils/polling.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
      prompt: Type.String(),
      aspect: Type.String(),
      width: Type.String(),
      height: Type.String(),
      model_series: Type.String(),
    }),
  }),
  import.meta,
);

const makeImageV1Parameters = Type.Object({
  prompt: Type.String({ description: meta.parameters.prompt }),
  aspect: Type.Union(
    [
      Type.Literal("3:4"),
      Type.Literal("16:9"),
      Type.Literal("4:3"),
      Type.Literal("9:16"),
      Type.Literal("1:1"),
    ],
    {
      default: "3:4",
      description: meta.parameters.aspect,
    },
  ),
  width: Type.Optional(
    Type.Integer({
      description: meta.parameters.width,
      minimum: 256,
      maximum: 2048,
    }),
  ),
  height: Type.Optional(
    Type.Integer({
      description: meta.parameters.height,
      minimum: 256,
      maximum: 2048,
    }),
  ),
  model_series: Type.Union(
    [Type.Literal("8_image_edit"), Type.Literal("3_noobxl")],
    {
      default: "8_image_edit",
      description: meta.parameters.model_series,
    },
  ),
});

export const makeImage = createCommand(
  {
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: makeImageV1Parameters,
  },
  async ({ prompt, aspect, model_series, width, height }, { log, apis }) => {
    const createTask = async () => {
      const vtokens = (await apis.prompt.parseVtokens(prompt)) ?? [];

      const payload = buildMakeImagePayload(vtokens ?? [], {
        make_image_aspect: aspect ?? "3:4",
        width,
        height,
        context_model_series: model_series,
      });

      return await apis.artifact.makeImage(payload);
    };

    const task_uuid = await createTask();
    log.debug("task: %s", task_uuid);

    const timeout = 60 * 1000 * 10;
    const res = await polling(
      () => apis.artifact.task(task_uuid),
      async (result) => {
        log.debug("polling: %o", result);
        return (
          result.task_status !== "PENDING" &&
          result.task_status !== "MODERATION"
        );
      },
      2000,
      timeout,
    );

    if (res.isTimeout) {
      return {
        task_uuid,
        task_status: "TIMEOUT",
        artifacts: [],
      };
    }

    return res.result;
  },
);
