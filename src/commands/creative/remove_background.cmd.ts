import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.ts";
import { polling } from "../../utils/polling.ts";
import { createCommand } from "../factory.ts";

const meta = parseMeta(
  Type.Object({
    remove_background: Type.Object({
      name: Type.String(),
      title: Type.String(),
      description: Type.String(),
      parameters: Type.Object({
        input_image: Type.String(),
      }),
    }),
    remove_background_nocrop: Type.Object({
      name: Type.String(),
      title: Type.String(),
      description: Type.String(),
    }),
  }),
  import.meta,
);

const removeBackgroundV1Parameters = Type.Object({
  input_image: Type.String({
    description: meta.remove_background.parameters.input_image,
  }),
});

export const removeBackground = createCommand(
  {
    name: meta.remove_background.name,
    title: meta.remove_background.title,
    description: meta.remove_background.description,
    inputSchema: removeBackgroundV1Parameters,
  },
  async ({ input_image }, { apis, log }) => {
    const createTask = async () => {
      const artifacts = await apis.artifact.artifactDetail([input_image]);
      if (
        !artifacts ||
        !artifacts[0] ||
        artifacts[0].modality !== "PICTURE" ||
        artifacts[0].status !== "SUCCESS"
      ) {
        throw new Error("Input is not a valid picture artifact UUID");
      }
      return apis.artifact.postProcess(input_image, "0_null/抠图SEG", {
        entrance: "PICTURE,CLI",
      });
    };

    const task_uuid = await createTask();
    log.debug("task: %s", task_uuid);

    const timeout = 60 * 1000 * 5;
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

export const removeBackgroundNoCrop = createCommand(
  {
    name: meta.remove_background_nocrop.name,
    title: meta.remove_background_nocrop.title,
    description: meta.remove_background_nocrop.description,
    inputSchema: removeBackgroundV1Parameters,
  },
  async ({ input_image }, { apis, log }) => {
    const createTask = async () => {
      const artifacts = await apis.artifact.artifactDetail([input_image]);
      if (
        !artifacts ||
        !artifacts[0] ||
        artifacts[0].modality !== "PICTURE" ||
        artifacts[0].status !== "SUCCESS"
      ) {
        throw new Error("Input is not a valid picture artifact UUID");
      }

      return apis.artifact.postProcess(input_image, "0_null/抠图SEG", {
        entrance: "PICTURE,CLI",
      });
    };

    const task_uuid = await createTask();
    log.debug("task: %s", task_uuid);

    const res = await polling(
      () => apis.artifact.task(task_uuid),
      (result) => {
        log.debug("polling: %o", result);
        return (
          result.task_status !== "PENDING" &&
          result.task_status !== "MODERATION"
        );
      },
      2000,
      60 * 1000 * 10,
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
