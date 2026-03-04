import z from "zod";
import { parseMeta } from "../utils/parse_meta.ts";

const meta = parseMeta(
  z.object({
    character_assign_schema: z.object({
      type: z.string(),
      age: z.string(),
      interests: z.string(),
      persona: z.string(),
      description: z.string(),
      occupation: z.string(),
      avatar_img: z.string(),
      header_img: z.string(),
    }),
    elementum_assign_schema: z.object({
      type: z.string(),
      name: z.string(),
      description: z.string(),
      avatar_img: z.string(),
    }),
    task_artifact: z.string(),
    task_result: z.string(),
    task_status_schema: z.object({
      status: z.string(),
      modality: z.string(),
      artifact_audio_detail_audio_name: z.string(),
      artifact_audio_detail_lyric_url: z.string(),
      artifact: z.string(),
      result: z.string(),
    }),
    make_image_parameters_schema: z.object({
      prompt: z.string(),
      aspect: z.string(),
    }),
    make_video_parameters_schema: z.object({
      image_source: z.string(),
      prompt: z.string(),
      model: z.string(),
    }),
    search_character_or_elementum_parameters_schema: z.object({
      keywords: z.string(),
      parent_type: z.string(),
      sort_scheme: z.string(),
      page_index: z.string(),
      page_size: z.string(),
    }),
    request_character_or_elementum_parameters_schema: z.object({
      name: z.string(),
      uuid: z.string(),
      parent_type: z.string(),
    }),
    request_character_or_elementum_result_schema: z.object({
      detail: z.string(),
    }),
    request_bgm_parameters_schema: z.object({
      placeholder: z.string(),
    }),
    make_song_parameters_schema: z.object({
      prompt: z.string(),
      lyrics: z.string(),
    }),
    remove_background_parameters_schema: z.object({
      input_image: z.string(),
    }),
    upload_image_parameters_schema: z.object({
      image: z.string(),
      input: z.string(),
      image_path: z.string(),
      image_url: z.string(),
      image_data: z.string(),
      filename: z.string(),
      content_type: z.string(),
      suffix: z.string(),
    }),
    upload_image_result_schema: z.object({
      status: z.string(),
      source_type: z.string(),
      input_key: z.string(),
      bucket: z.string(),
      path: z.string(),
      url: z.string(),
      mime_type: z.string(),
      suffix: z.string(),
      byte_size: z.string(),
      sha256: z.string(),
      etag: z.string(),
      upload_http_status: z.string(),
      trace_id: z.string(),
    }),
    hashtag_base_parameters_schema: z.object({
      hashtag: z.string(),
    }),
    paginated_hashtag_parameters_schema: z.object({
      page_index: z.string(),
      page_size: z.string(),
    }),
    activity_detail_schema: z.object({
      uuid: z.string(),
      title: z.string(),
      banner_pic: z.string(),
      creator_name: z.string(),
      review_users: z.string(),
      review_users_uuid: z.string(),
      review_users_name: z.string(),
    }),
    hashtag_info_schema: z.object({
      name: z.string(),
      lore: z.string(),
      activity_detail: z.string(),
      hashtag_heat: z.string(),
      subscribe_count: z.string(),
    }),
    fetch_characters_by_hashtag_parameters_schema: z.object({
      sort_by: z.string(),
      parent_type: z.string(),
    }),
    fetch_characters_by_hashtag_result_schema: z.object({
      total: z.string(),
      page_index: z.string(),
      page_size: z.string(),
      list: z.string(),
      has_next: z.string(),
    }),
    selected_collection_schema: z.object({
      uuid: z.string(),
      name: z.string(),
      coverUrl: z.string(),
      creator_name: z.string(),
      likeCount: z.string(),
      sameStyleCount: z.string(),
      ctime: z.string(),
    }),
    fetch_selected_collections_by_hashtag_parameters_schema: z.object({
      sort_by: z.string(),
    }),
    fetch_selected_collections_by_activity_result_schema: z.object({
      total: z.string(),
      page_index: z.string(),
      page_size: z.string(),
      list: z.string(),
    }),
  }),
  import.meta,
);

/**
 * 这是一个包含所有 schema 的文件,用于生成类型声明文件.
 */

//#region Common

export const sizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});
export type Size = z.infer<typeof sizeSchema>;

export const inheritSchema = z.object({
  collection_uuid: z.string().optional(),
  picture_uuid: z.string().optional(),
});
export type Inherit = z.infer<typeof inheritSchema>;

export const taskCreatedSchema = z.object({
  task_uuid: z.string(),
});
export type TaskCreated = z.infer<typeof taskCreatedSchema>;

//#endregion

// #region Assign

export const textAssignSchema = z.string();
export type TextAssign = z.infer<typeof textAssignSchema>;

export const characterAssignSchema = z.object({
  type: z.literal("character").describe(meta.character_assign_schema.type),
  uuid: z.string(),
  name: z.string(),
  age: z.string().nullish().describe(meta.character_assign_schema.age),
  interests: z
    .string()
    .nullish()
    .describe(meta.character_assign_schema.interests),
  persona: z.string().nullish().describe(meta.character_assign_schema.persona),
  description: z
    .string()
    .nullish()
    .describe(meta.character_assign_schema.description),
  occupation: z
    .string()
    .nullish()
    .describe(meta.character_assign_schema.occupation),
  avatar_img: z
    .string()
    .nullish()
    .describe(meta.character_assign_schema.avatar_img),
  header_img: z
    .string()
    .nullish()
    .describe(meta.character_assign_schema.header_img),
});
export type CharacterAssign = z.infer<typeof characterAssignSchema>;

export const elementumAssignSchema = z.object({
  type: z.literal("elementum").describe(meta.elementum_assign_schema.type),
  uuid: z.string(),
  name: z.string(),
  description: z
    .string()
    .nullish()
    .describe(meta.elementum_assign_schema.description),
  avatar_img: z
    .string()
    .nullish()
    .describe(meta.elementum_assign_schema.avatar_img),
});
export type ElementumAssign = z.infer<typeof elementumAssignSchema>;

export const imageAssignSchema = z.object({
  type: z.literal("image"),
  uuid: z.string(),
  url: z.string(),
  width: z.number().nullish(),
  height: z.number().nullish(),
});
export type ImageAssign = z.infer<typeof imageAssignSchema>;

export const videoAssignSchema = z.object({
  type: z.literal("video"),
  uuid: z.string(),
  url: z.string(),
  cover: z.string(),
  width: z.number().nullish(),
  height: z.number().nullish(),
});
export type VideoAssign = z.infer<typeof videoAssignSchema>;

export const audioAssignSchema = z.object({
  type: z.literal("audio"),
  uuid: z.string(),
  url: z.string(),
  name: z.string(),
  preview_url: z.string().nullish(),
});
export type AudioAssign = z.infer<typeof audioAssignSchema>;

const htmlTemplateAssignSchema = z.object({
  type: z.literal("html_template"),
  url: z.string(),
  verse_preset_uuid: z.string(),
  content_schema: z.string(),
});
export type HtmlPatchAssign = z.infer<typeof htmlTemplateAssignSchema>;

export const emptyAssignSchema = z.null();
export type EmptyAssign = z.infer<typeof emptyAssignSchema>;

export const assignSchema = z.union([
  textAssignSchema,
  characterAssignSchema,
  elementumAssignSchema,
  imageAssignSchema,
  videoAssignSchema,
  audioAssignSchema,
  htmlTemplateAssignSchema,
  emptyAssignSchema,
]);
export type Assign = z.infer<typeof assignSchema>;

//#region Task

export const taskStatusSchema = z
  .enum([
    "PENDING",
    "SUCCESS",
    "FAILURE",
    "TIMEOUT",
    "DELETED",
    "MODERATION",
    "ILLEGAL_IMAGE",
  ])
  .describe(meta.task_status_schema.status);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskModalitySchema = z
  .enum(["PICTURE", "VIDEO", "AUDIO", "VERSE"])
  .describe(meta.task_status_schema.modality);
export type TaskModality = z.infer<typeof taskModalitySchema>;

export const taskArtifactImageDetailSchema = sizeSchema.loose();
export type TaskArtifactImageDetail = z.infer<
  typeof taskArtifactImageDetailSchema
>;
export const taskArtifactVideoDetailSchema = sizeSchema.loose();
export type TaskArtifactVideoDetail = z.infer<
  typeof taskArtifactVideoDetailSchema
>;
export const taskArtifactAudioDetailSchema = z
  .object({
    audio_name: z
      .string()
      .nullish()
      .describe(meta.task_status_schema.artifact_audio_detail_audio_name),
    lyric_url: z
      .string()
      .nullish()
      .describe(meta.task_status_schema.artifact_audio_detail_lyric_url),
  })
  .loose();

export type TaskArtifactAudioDetail = z.infer<
  typeof taskArtifactAudioDetailSchema
>;

export const taskArtifactSchema = z
  .object({
    uuid: z.string(),
    modality: taskModalitySchema,
    status: taskStatusSchema,
    url: z.string().nullish(),
    detail_url: z.string().nullish(),
    text: z.string().nullish(),
    image_detail: taskArtifactImageDetailSchema.nullish(),
    video_detail: taskArtifactVideoDetailSchema.nullish(),
    audio_detail: taskArtifactAudioDetailSchema.nullish(),
  })
  .loose()
  .describe(meta.task_artifact);
export type TaskArtifact = z.infer<typeof taskArtifactSchema>;

export const taskResultSchema = z
  .object({
    task_uuid: z.string(),
    task_status: taskStatusSchema,
    msg: z.string().nullish(),
    err_msg: z.string().nullish(),
    artifacts: z.array(taskArtifactSchema).default([]),
  })
  .loose()
  .describe(meta.task_result);
export type TaskResult = z.infer<typeof taskResultSchema>;

//#endregion

// #region Make Image V1

export const makeImageV1Parameters = z.object({
  prompt: z.string().describe(meta.make_image_parameters_schema.prompt),
  aspect: z
    .enum(["3:4", "16:9", "4:3", "9:16", "1:1"])
    .optional()
    .default("3:4")
    .describe(meta.make_image_parameters_schema.aspect),
  // context_model_series: z
  //   .enum([
  //     "8_image_edit",
  //     "0_null",
  //     "1_sd15",
  //     "2_netaxl",
  //     "3_noobxl",
  //     "5_lumina",
  //   ])
  //   .optional()
  //   .describe(`模型选择`),
  // advanced_translator: z.boolean().optional().describe("是否开启提示词润色"),
  // negative_freetext: z.string().optional().describe("负向提示词"),
});
export type MakeImageV1Parameters = z.infer<typeof makeImageV1Parameters>;

// #endregion

// #region Make Video V1

export const makeVideoV1Parameters = z.object({
  image_source: z
    .string()
    .describe(meta.make_video_parameters_schema.image_source),
  prompt: z.string().describe(meta.make_video_parameters_schema.prompt),
  model: z
    .enum(["model_s", "model_w"])
    .describe(meta.make_video_parameters_schema.model),
});
export type MakeVideoV1Parameters = z.infer<typeof makeVideoV1Parameters>;

// #endregion

// #endregion

// #region 搜索角色和元素 V1
export const searchCharacterOrElementumV1Parameters = z.object({
  keywords: z
    .string()
    .describe(meta.search_character_or_elementum_parameters_schema.keywords),
  parent_type: z
    .enum(["character", "elementum", "both"])
    .default("both")
    .describe(meta.search_character_or_elementum_parameters_schema.parent_type),
  sort_scheme: z
    .enum(["exact", "best"])
    .default("best")
    .describe(meta.search_character_or_elementum_parameters_schema.sort_scheme),
  page_index: z
    .int()
    .min(0)
    .optional()
    .default(0)
    .describe(meta.search_character_or_elementum_parameters_schema.page_index),
  page_size: z
    .int()
    .min(1)
    .max(50)
    .optional()
    .default(10)
    .describe(meta.search_character_or_elementum_parameters_schema.page_size),
});
export type SearchCharacterOrElementumV1Parameters = z.infer<
  typeof searchCharacterOrElementumV1Parameters
>;

export const characterOrElementumSearchResultSchema = z.object({
  uuid: z.string(),
  type: z.enum(["character", "elementum"]),
  name: z.string(),
  avatar_img: z.string().nullish(),
  header_img: z.string().nullish(),
});
export type CharacterOrElementumSearchResult = z.infer<
  typeof characterOrElementumSearchResultSchema
>;

export const searchCharacterOrElementumV1ResultSchema = z.object({
  total: z.number(),
  page_index: z.number(),
  page_size: z.number(),
  list: z.array(characterOrElementumSearchResultSchema),
});
export type SearchCharacterOrElementumV1Result = z.infer<
  typeof searchCharacterOrElementumV1ResultSchema
>;

// 请求角色或元素（支持名称或UUID查询）
export const requestCharacterOrElementumV1Parameters = z
  .object({
    name: z
      .string()
      .optional()
      .describe(meta.request_character_or_elementum_parameters_schema.name),
    uuid: z
      .string()
      .optional()
      .describe(meta.request_character_or_elementum_parameters_schema.uuid),
    parent_type: z
      .enum(["character", "elementum", "both"])
      .optional()
      .default("both")
      .describe(
        meta.request_character_or_elementum_parameters_schema.parent_type,
      ),
  })
  .refine((data) => data.name || data.uuid, {
    message: "必须提供name或uuid参数之一",
  });

export type RequestCharacterOrElementumV1Parameters = z.infer<
  typeof requestCharacterOrElementumV1Parameters
>;

export const requestCharacterOrElementumV1ResultSchema = z.object({
  detail: z
    .union([characterAssignSchema, elementumAssignSchema])
    .describe(meta.request_character_or_elementum_result_schema.detail),
});
export type RequestCharacterOrElementumV1Result = z.infer<
  typeof requestCharacterOrElementumV1ResultSchema
>;

// #endregion

// #region Request Bgm V1
export const requestBgmV1Parameters = z.object({
  placeholder: z
    .string()
    .describe(meta.request_bgm_parameters_schema.placeholder),
});
export type RequestBgmV1Parameters = z.infer<typeof requestBgmV1Parameters>;

export const requestBgmV1ResultSchema = z.object({
  bgm: audioAssignSchema.nullish(),
});
export type RequestBgmV1Result = z.infer<typeof requestBgmV1ResultSchema>;

// #endregion

// #region Make Song V1
export const makeSongV1Parameters = z.object({
  prompt: z
    .string()
    .min(10)
    .max(2000)
    .describe(meta.make_song_parameters_schema.prompt),
  lyrics: z
    .string()
    .min(10)
    .max(3500)
    .describe(meta.make_song_parameters_schema.lyrics),
});
export type MakeSongV1Parameters = z.infer<typeof makeSongV1Parameters>;

// #endregion

// #region Remove Background V1
export const removeBackgroundV1Parameters = z.object({
  input_image: z
    .string()
    .describe(meta.remove_background_parameters_schema.input_image),
});
export type RemoveBackgroundV1Parameters = z.infer<
  typeof removeBackgroundV1Parameters
>;

// #endregion

// #region Upload Image V1
const uploadImageSourceKeys = [
  "image",
  "input",
  "image_path",
  "image_url",
  "image_data",
] as const;

export const uploadImageV1Parameters = z
  .object({
    image: z
      .string()
      .optional()
      .describe(meta.upload_image_parameters_schema.image),
    input: z
      .string()
      .optional()
      .describe(meta.upload_image_parameters_schema.input),
    image_path: z
      .string()
      .optional()
      .describe(meta.upload_image_parameters_schema.image_path),
    image_url: z
      .string()
      .optional()
      .describe(meta.upload_image_parameters_schema.image_url),
    image_data: z
      .string()
      .optional()
      .describe(meta.upload_image_parameters_schema.image_data),
    filename: z
      .string()
      .optional()
      .describe(meta.upload_image_parameters_schema.filename),
    content_type: z
      .string()
      .optional()
      .describe(meta.upload_image_parameters_schema.content_type),
    suffix: z
      .enum(["jpg", "jpeg", "png", "gif", "svg", "webp"])
      .optional()
      .describe(meta.upload_image_parameters_schema.suffix),
  })
  .refine(
    (data) => uploadImageSourceKeys.some((key) => Boolean(data[key])),
    "至少提供一个图片输入参数: image | input | image_path | image_url | image_data",
  );
export type UploadImageV1Parameters = z.infer<typeof uploadImageV1Parameters>;

export const uploadImageV1ResultSchema = z.object({
  status: z
    .literal("uploaded")
    .describe(meta.upload_image_result_schema.status),
  source_type: z
    .enum(["path", "url", "data_url"])
    .describe(meta.upload_image_result_schema.source_type),
  input_key: z
    .enum(uploadImageSourceKeys)
    .describe(meta.upload_image_result_schema.input_key),
  bucket: z.string().describe(meta.upload_image_result_schema.bucket),
  path: z.string().describe(meta.upload_image_result_schema.path),
  url: z.string().describe(meta.upload_image_result_schema.url),
  mime_type: z.string().describe(meta.upload_image_result_schema.mime_type),
  suffix: z
    .enum(["jpg", "jpeg", "png", "gif", "svg", "webp"])
    .describe(meta.upload_image_result_schema.suffix),
  byte_size: z
    .number()
    .int()
    .nonnegative()
    .describe(meta.upload_image_result_schema.byte_size),
  sha256: z
    .string()
    .length(64)
    .describe(meta.upload_image_result_schema.sha256),
  etag: z.string().nullish().describe(meta.upload_image_result_schema.etag),
  upload_http_status: z
    .number()
    .int()
    .describe(meta.upload_image_result_schema.upload_http_status),
  trace_id: z.string().describe(meta.upload_image_result_schema.trace_id),
});
export type UploadImageV1Result = z.infer<typeof uploadImageV1ResultSchema>;

// #endregion

// #region Hashtag Common Schemas
export const hashtagBaseParameters = z.object({
  hashtag: z.string().describe(meta.hashtag_base_parameters_schema.hashtag),
});
export type HashtagBaseParameters = z.infer<typeof hashtagBaseParameters>;

export const paginatedHashtagParameters = hashtagBaseParameters.extend({
  page_index: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0)
    .describe(meta.paginated_hashtag_parameters_schema.page_index),
  page_size: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .describe(meta.paginated_hashtag_parameters_schema.page_size),
});
export type PaginatedHashtagParameters = z.infer<
  typeof paginatedHashtagParameters
>;

// #endregion

// #region Fetch Hashtag V1
export const fetchHashtagV1Parameters = hashtagBaseParameters.extend({
  // 仅继承基础参数,无额外参数
});
export type FetchHashtagV1Parameters = z.infer<typeof fetchHashtagV1Parameters>;

export const loreEntrySchema = z
  .object({
    uuid: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    bind_hashtag_info: z.unknown().nullish(),
  })
  .loose();
export type LoreEntry = z.infer<typeof loreEntrySchema>;

export const activityDetailSchema = z
  .object({
    uuid: z.string().nullish().describe(meta.activity_detail_schema.uuid),
    title: z.string().nullish().describe(meta.activity_detail_schema.title),
    banner_pic: z
      .string()
      .nullish()
      .describe(meta.activity_detail_schema.banner_pic),
    creator_name: z
      .string()
      .nullish()
      .describe(meta.activity_detail_schema.creator_name),
    review_users: z
      .array(
        z.object({
          uuid: z
            .string()
            .describe(meta.activity_detail_schema.review_users_uuid),
          name: z
            .string()
            .describe(meta.activity_detail_schema.review_users_name),
        }),
      )
      .nullish()
      .describe(meta.activity_detail_schema.review_users),
  })
  .loose();
export type ActivityDetail = z.infer<typeof activityDetailSchema>;

export const hashtagInfoSchema = z
  .object({
    name: z.string().describe(meta.hashtag_info_schema.name),
    lore: z.array(loreEntrySchema).describe(meta.hashtag_info_schema.lore),
    activity_detail: activityDetailSchema
      .nullish()
      .describe(meta.hashtag_info_schema.activity_detail),
    hashtag_heat: z
      .number()
      .nullish()
      .describe(meta.hashtag_info_schema.hashtag_heat),
    subscribe_count: z
      .number()
      .nullish()
      .describe(meta.hashtag_info_schema.subscribe_count),
  })
  .loose();
export type HashtagInfo = z.infer<typeof hashtagInfoSchema>;

export const fetchHashtagV1ResultSchema = z.object({
  hashtag: hashtagInfoSchema.nullish(),
});
export type FetchHashtagV1Result = z.infer<typeof fetchHashtagV1ResultSchema>;

export const fetchCharactersByHashtagV1Parameters = paginatedHashtagParameters
  .extend({
    sort_by: z
      .enum(["hot", "newest"])
      .optional()
      .default("hot")
      .describe(meta.fetch_characters_by_hashtag_parameters_schema.sort_by),
    parent_type: z
      .enum(["oc", "elementum"])
      .optional()
      .describe(meta.fetch_characters_by_hashtag_parameters_schema.parent_type),
  })
  .loose();
export type FetchCharactersByHashtagV1Parameters = z.infer<
  typeof fetchCharactersByHashtagV1Parameters
>;

export const characterInfoSchema = z
  .object({
    uuid: z.string(),
    name: z.string(),
    short_name: z.string(),
    avatar_img: z.string().nullish(),
    ctime: z.string(),
    creator_uuid: z.string(),
    creator_name: z.string(),
  })
  .loose();
export type CharacterInfo = z.infer<typeof characterInfoSchema>;

export const fetchCharactersByHashtagV1ResultSchema = z.object({
  total: z
    .number()
    .describe(meta.fetch_characters_by_hashtag_result_schema.total),
  page_index: z
    .number()
    .describe(meta.fetch_characters_by_hashtag_result_schema.page_index),
  page_size: z
    .number()
    .describe(meta.fetch_characters_by_hashtag_result_schema.page_size),
  list: z
    .array(characterInfoSchema)
    .describe(meta.fetch_characters_by_hashtag_result_schema.list),
  has_next: z
    .boolean()
    .describe(meta.fetch_characters_by_hashtag_result_schema.has_next),
});
export type FetchCharactersByHashtagV1Result = z.infer<
  typeof fetchCharactersByHashtagV1ResultSchema
>;

// #region Fetch Selected Stories V1

export const selectedCollectionSchema = z
  .object({
    uuid: z.string().describe(meta.selected_collection_schema.uuid),
    name: z.string().describe(meta.selected_collection_schema.name),
    coverUrl: z
      .string()
      .nullish()
      .describe(meta.selected_collection_schema.coverUrl),
    creator_name: z
      .string()
      .nullish()
      .describe(meta.selected_collection_schema.creator_name),
    likeCount: z
      .number()
      .nullish()
      .describe(meta.selected_collection_schema.likeCount),
    sameStyleCount: z
      .number()
      .nullish()
      .describe(meta.selected_collection_schema.sameStyleCount),
    ctime: z.string().nullish().describe(meta.selected_collection_schema.ctime),
  })
  .loose();
export type SelectedCollection = z.infer<typeof selectedCollectionSchema>;

export const fetchSelectedCollectionsByHashtagV1Parameters =
  paginatedHashtagParameters.extend({
    sort_by: z
      .enum(["highlight_mark_time"])
      .optional()
      .default("highlight_mark_time")
      .describe(
        meta.fetch_selected_collections_by_hashtag_parameters_schema.sort_by,
      ),
  });
export type FetchSelectedCollectionsByHashtagV1Parameters = z.infer<
  typeof fetchSelectedCollectionsByHashtagV1Parameters
>;

export const fetchSelectedCollectionsByActivityV1ResultSchema = z.object({
  total: z
    .number()
    .describe(meta.fetch_selected_collections_by_activity_result_schema.total),
  page_index: z
    .number()
    .describe(
      meta.fetch_selected_collections_by_activity_result_schema.page_index,
    ),
  page_size: z
    .number()
    .describe(
      meta.fetch_selected_collections_by_activity_result_schema.page_size,
    ),
  list: z
    .array(selectedCollectionSchema)
    .describe(meta.fetch_selected_collections_by_activity_result_schema.list),
});
export type FetchSelectedCollectionsByActivityV1Result = z.infer<
  typeof fetchSelectedCollectionsByActivityV1ResultSchema
>;
// #endregion

// #region Error

export const OutputErrorSchema = z.union([
  z.string(),
  z.object({
    code: z.number(),
    message: z.string(),
    data: z
      .looseObject({
        api_error: z
          .object({
            code: z.number(),
            message: z.string(),
          })
          .nullish(),
      })
      .nullish(),
  }),
]);
export type OutputError = z.infer<typeof OutputErrorSchema>;

// #endregion

export const wrapOutput = <T>(content: T) => {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(content),
      },
    ],
    structuredContent: content,
  };
};

export const wrapAction = <
  // biome-ignore lint/suspicious/noExplicitAny: any is used to avoid type errors
  Args extends any[],
  // biome-ignore lint/suspicious/noExplicitAny: any is used to avoid type errors
  T extends (...args: Args) => any,
>(
  action: T,
) => {
  return (...args: Args) => {
    const result = action(...args);
    if (result instanceof Promise) {
      return result.then(wrapOutput);
    }
    return wrapOutput(result);
  };
};
