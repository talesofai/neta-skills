import type { Vtokens } from "../utils/prompts.ts";
import type { Modality, TaskStatus } from "./task.ts";

export interface GenericPagination<T> {
  page_size: number;
  page_index: number;
  total: number;
  list: T[];
}

export type PromiseResult<T> = T extends Promise<infer U> ? U : T;

export type MakeImageEntrance =
  | "PICTURE,PURE"
  | "PICTURE,CP"
  | "AI_COMIC,PURE"
  | "AI_COMIC,CP"
  | "MEME,PURE"
  | "PICTURE,IMG2IMG"
  | "NEWBIE"
  | "AI_COMIC,IMG2IMG"
  | "PICTURE,OC_PREVIEW"
  | "PICTURE,INTERACTIVE"
  | "PICTURE,VERSE"
  | "PICTURE,PURE,VERSE";

export type MakeVideoEntrance = "VIDEO,VERSE" | "VIDEO,PURE" | "VIDEO";

export type EditImageEntrance = "IMAGE_EDIT,VERSE";

export type EditHtmlEntrance = "HTML,VERSE";

export type MakeSongEntrance = "SONG,VERSE";

export interface TaskMeta {
  entrance?:
    | MakeImageEntrance
    | MakeVideoEntrance
    | EditImageEntrance
    | EditHtmlEntrance
    | MakeSongEntrance;
  entrance_uuid?: string;
  manuscript_uuid?: string;
  assign_key?: string;
  toolcall_uuid?: string;
}

export type Img2ImgMode =
  | "Balanced"
  | "My prompt is more important"
  | "ControlNet is more important";

export interface Img2ImgParams {
  image_url: string;
  mode: Img2ImgMode;
  weight: number;

  __origin_image_url?: string;
}

export interface InheritPayloadV3Params {
  collection_uuid?: string;
  picture_uuid?: string;
}

export type MakeImageRequest = {
  /**
   * @deprecated
   */
  storyId: "DO_NOT_USE";
  jobType: "universal";
  width: number;
  height: number;
  rawPrompt: Vtokens[];
  index?: number;
  seed?: number;

  meta?: TaskMeta;
  img2img_params?: Img2ImgParams;
  inherit_params?: InheritPayloadV3Params;

  context_model_series?: string | null;
  negative_freetext?: string;
  advanced_translator?: boolean;
};

export type MakeVideoRequest = {
  rawPrompt: Vtokens[];
  image_url: string;
  work_flow_text: string;
  work_flow_model: string;
  inherit_params?: InheritPayloadV3Params;
  meta?: TaskMeta;
};

export type TaskPayload = MakeImageRequest | MakeVideoRequest;

export type PostProcessPreset =
  | "0_null/图片脸部修复"
  | "0_null/抠图SEG"
  | "0_null/抠图SEG-NOCROP";

export const IMAGE_GENERATE_ASPECTS: {
  aspect: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  size: [number, number];
  resultSize: [number, number];
}[] = [
  {
    aspect: "1:1",
    size: [512, 512],
    resultSize: [1024, 1024],
  },
  {
    aspect: "3:4",
    size: [576, 768],
    resultSize: [896, 1152],
  },
  {
    aspect: "4:3",
    size: [768, 576],
    resultSize: [1152, 896],
  },
  {
    aspect: "9:16",
    size: [576, 1024],
    resultSize: [768, 1344],
  },
  {
    aspect: "16:9",
    size: [1024, 576],
    resultSize: [1344, 768],
  },
];

export const buildMakeImagePayload = (
  vtokens: Vtokens[],
  options: {
    make_image_aspect: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
    advanced_translator?: boolean;
    negative_freetext?: string;
    context_model_series?: string;
    entrance_uuid?: string;
    manuscript_uuid?: string;
    assign_key?: string;
    toolcall_uuid?: string;
  },
  inherit?: { collection_uuid?: string; picture_uuid?: string },
) => {
  const {
    make_image_aspect,
    advanced_translator,
    negative_freetext,
    context_model_series,
    entrance_uuid,
    manuscript_uuid,
    assign_key,
    toolcall_uuid,
  } = options;

  const imageAspect = IMAGE_GENERATE_ASPECTS.find(
    (a) => a.aspect === make_image_aspect,
  )?.size ?? [576, 768];

  return {
    storyId: "DO_NOT_USE",
    jobType: "universal",
    rawPrompt: vtokens,
    width: imageAspect[0],
    height: imageAspect[1],
    meta: {
      entrance: "PICTURE,VERSE",
      entrance_uuid,
      manuscript_uuid,
      assign_key,
      toolcall_uuid,
    },
    inherit_params: inherit,
    advanced_translator,
    context_model_series,
    negative_freetext: negative_freetext,
  } satisfies MakeImageRequest;
};

export const buildMakeVideoPayload = (
  image_url: string,
  work_flow_text: string,
  work_flow_model: string,
  options?: {
    entrance_uuid?: string;
    manuscript_uuid?: string;
    inherit_params?: InheritPayloadV3Params;
    assign_key?: string;
    toolcall_uuid?: string;
  },
) => {
  const {
    entrance_uuid,
    manuscript_uuid,
    inherit_params,
    assign_key,
    toolcall_uuid,
  } = options || {};

  return {
    rawPrompt: [],
    image_url,
    work_flow_text,
    work_flow_model,
    inherit_params,
    meta: {
      entrance: "VIDEO,VERSE",
      entrance_uuid,
      manuscript_uuid,
      assign_key,
      toolcall_uuid,
    },
  } satisfies MakeVideoRequest;
};
export interface EditImageRequest {
  text: string;
  images?: string[];
  inherit_params?: InheritPayloadV3Params;
  meta?: TaskMeta;
}

export interface OCMeta {
  category?: string | null;
  series_title?: string | null;
}

/**
 * 角色描述
 */
export interface OriginalCharacterProfile {
  /**
   * 年龄
   */
  age?: string;
  /**
   * 身份
   */
  occupation?: string;
  /**
   * 性格
   */
  persona?: string;
  /**
   * 兴趣
   */
  interests?: string;
  /**
   * 简介
   */
  description: string;

  name: string;

  meta?: OCMeta;
}

export type TextAssign = string;

export type CharacterAssign = {
  type: "character";
  uuid: string;
  name: string;
  age?: string | null;
  interests?: string | null;
  persona?: string | null;
  description?: string | null;
  occupation?: string | null;
  avatar_img?: string | null;
  header_img?: string | null;
};

export type ElementumAssign = {
  type: "elementum";
  uuid: string;
  name: string;
  description?: string | null;
  avatar_img?: string | null;
};

export type ImageAssign = {
  type: "image";
  url: string;
  uuid: string;
  width?: number | null;
  height?: number | null;
};

export type VideoAssign = {
  type: "video";
  url: string;
  cover: string;
  uuid: string;
  width?: number | null;
  height?: number | null;
};

export type AudioAssign = {
  type: "audio";
  url: string;
  uuid: string;
  name: string;
  preview_url?: string | null;
};

export type HtmlTemplateAssign = {
  type: "html_template";
  url: string;
  verse_preset_uuid: string;
  content_schema: string;
};

export type EmptyAssign = null;

export type Assign =
  | TextAssign
  | CharacterAssign
  | ElementumAssign
  | ImageAssign
  | VideoAssign
  | AudioAssign
  | HtmlTemplateAssign
  | EmptyAssign;

export const isTextAssign = (assign: Assign): assign is TextAssign =>
  typeof assign === "string";

export const isCharacterAssign = (assign: Assign): assign is CharacterAssign =>
  typeof assign === "object" && assign !== null && assign.type === "character";

export const isElementumAssign = (assign: Assign): assign is ElementumAssign =>
  typeof assign === "object" && assign !== null && assign.type === "elementum";

export const isImageAssign = (assign: Assign): assign is ImageAssign =>
  typeof assign === "object" && assign !== null && assign.type === "image";

export const isVideoAssign = (assign: Assign): assign is VideoAssign =>
  typeof assign === "object" && assign !== null && assign.type === "video";

export const isAudioAssign = (assign: Assign): assign is AudioAssign =>
  typeof assign === "object" && assign !== null && assign.type === "audio";

export const isHtmlTemplateAssign = (
  assign: Assign,
): assign is HtmlTemplateAssign =>
  typeof assign === "object" &&
  assign !== null &&
  assign.type === "html_template";

export const isEmptyAssign = (assign: Assign): assign is EmptyAssign =>
  assign === null;

export type ManuscriptType = "ALBUM" | "VERSE";

export type ManuscriptRunningStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILURE"
  | "STOP"
  | "PROCESSING";

export interface Manuscript {
  uuid: string;
  entrance_type: ManuscriptType;
  cover_url?: string | null;
  ctime: string;
  mtime: string;
  status: "INIT" | "NORMAL" | "DELETED";
  running_status?: ManuscriptRunningStatus | null;
  error?: string | null;
  conversation_uuid?: string | null;
  verse_preset_uuid?: string | null;
  inherit_verse_preset_uuid?: string | null;
  inherit_collection_uuid?: string | null;
}

export interface ManuscriptCreatePayload {
  entrance_type: ManuscriptType;
  inherit_collection_uuid?: string;
  verse_preset_uuid?: string;
}

export interface ManuscriptAssetCreatePayload {
  artifact_uuid: string;
  task_uuid: string;
  assign_key: string;
  /**
   * @deprecated not used
   */
  is_import: false;
}

export interface ManuscriptAsset {
  task_uuid: string;
  artifact_uuid: string;
  assign_key: string;
  toolcall_uuid: string | null;
  ctime: string;
  /**
   * @deprecated not used
   */
  is_import: false;
  artifact: ManuscriptAssetArtifact;
}

export interface ManuscriptAssetArtifact {
  uuid: string;
  url: string;
  modality: Modality;
  status: TaskStatus;
  width?: number;
  height?: number;
}

export type AnyAssistantMessage = {
  role: "assistant";
  reasoning_content?: string;
  content?:
    | string
    | (
        | { type: "text"; text: string }
        | { type: "output_text"; text: string }
      )[];
  tool_calls?: {
    index: number;
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }[];
};

export type AnyUserMessage = {
  role: "user";
  content:
    | string
    | (
        | {
            type: "text";
            text: string;
          }
        | {
            type: "image_url";
            image_url: {
              url: string;
            };
          }
        | {
            type: "input_text";
            text: string;
          }
        | {
            type: "input_image";
            image: string;
          }
      )[];
};

export type AnyToolMessage = {
  role: "tool";
  content: string;
  tool_call_id: string;
};

export type LLMMessage = {
  uuid: string;
  conversation_uuid: string;
  preset_key: string;
  send_payload: [
    Record<string, unknown>,
    ...(AnyUserMessage | AnyAssistantMessage | AnyToolMessage)[],
  ];
  response_package: {
    id: string;
    type: "text";
    event: string;
    answer: string;
    message_id: string;
    status_code: number;
    raw_response: {
      id: string;
      /**
       * seconds
       */
      created: number;
      model: string;
      usage: unknown;
      /**
       * chat.completion
       */
      object: string;
      choices: {
        index: number;
        message: AnyAssistantMessage;
        finish_reason: string;
      }[];
    };
  };
};

export interface ArtifactDetail {
  uuid: string;
  url: string | null;
  modality: Modality;
  status: TaskStatus;
  input: MakeImageRequest | MakeVideoRequest | null;
  image_detail?: { width: number; height: number };
  video_detail?: { width: number; height: number };
}

export type ArtifactVerseListStatus =
  | "SUCCESS"
  | "PENDING"
  | "STOP"
  | "PROCESSING"
  | "FAILED"
  | "QUEUE";
