import { z } from "zod";

// Common Types
export type Size = {
  width: number;
  height: number;
};

export type Inherit = {
  collection_uuid?: string;
  picture_uuid?: string;
};

export type TaskStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILURE"
  | "TIMEOUT"
  | "DELETED"
  | "MODERATION"
  | "ILLEGAL_IMAGE";

export type TaskModality = "PICTURE" | "VIDEO" | "AUDIO" | "VERSE";

export type TaskArtifact = {
  uuid: string;
  modality: TaskModality;
  status: TaskStatus;
  url: string | null;
  detail_url: string | null;
  text: string | null;
  image_detail?: Size | null;
  video_detail?: Size | null;
  audio_detail?: {
    audio_name?: string | null;
    lyric_url?: string | null;
  } | null;
};

export type TaskResult = {
  task_uuid: string;
  task_status: TaskStatus;
  msg?: string | null;
  err_msg?: string | null;
  artifacts: TaskArtifact[];
};

// Assign Types
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
  uuid: string;
  url: string;
  width?: number | null;
  height?: number | null;
};

export type VideoAssign = {
  type: "video";
  uuid: string;
  url: string;
  cover: string;
  width?: number | null;
  height?: number | null;
};

export type AudioAssign = {
  type: "audio";
  uuid: string;
  url: string;
  name: string;
  preview_url?: string | null;
};

export type Assign =
  | string
  | CharacterAssign
  | ElementumAssign
  | ImageAssign
  | VideoAssign
  | AudioAssign
  | null;

// Make Image
export const makeImageV1Parameters = z.object({
  prompt: z.string(),
  aspect: z
    .enum(["3:4", "16:9", "4:3", "9:16", "1:1"])
    .optional()
    .default("3:4"),
});
export type MakeImageV1Parameters = z.infer<typeof makeImageV1Parameters>;

// Make Video
export const makeVideoV1Parameters = z.object({
  image_source: z.string(),
  prompt: z.string(),
  model: z.enum(["model_s", "model_w"]),
});
export type MakeVideoV1Parameters = z.infer<typeof makeVideoV1Parameters>;

// Make Song
export const makeSongV1Parameters = z.object({
  prompt: z.string().min(10).max(2000),
  lyrics: z.string().min(10).max(3500),
});
export type MakeSongV1Parameters = z.infer<typeof makeSongV1Parameters>;

// Remove Background
export const removeBackgroundV1Parameters = z.object({
  input_image: z.string(),
});
export type RemoveBackgroundV1Parameters = z.infer<
  typeof removeBackgroundV1Parameters
>;

// Merge Video
export const mergeVideoV1Parameters = z.object({
  input: z.string(),
});
export type MergeVideoV1Parameters = z.infer<typeof mergeVideoV1Parameters>;

// Request Character
export const requestCharacterV1Parameters = z.object({
  name: z.string(),
});
export type RequestCharacterV1Parameters = z.infer<
  typeof requestCharacterV1Parameters
>;

export const requestCharacterV1ResultSchema = z.object({
  character: z.object({
    type: z.literal("character"),
    uuid: z.string(),
    name: z.string(),
    age: z.string().nullish(),
    interests: z.string().nullish(),
    persona: z.string().nullish(),
    description: z.string().nullish(),
    occupation: z.string().nullish(),
    avatar_img: z.string().nullish(),
    header_img: z.string().nullish(),
  }),
});
export type RequestCharacterV1Result = z.infer<
  typeof requestCharacterV1ResultSchema
>;

// Search TCP
export const searchCharacterOrElementumV1Parameters = z.object({
  keywords: z.string(),
  parent_type: z
    .enum(["character", "elementum", "both"])
    .optional()
    .default("both"),
  sort_scheme: z.enum(["exact", "best"]).optional().default("best"),
  page_index: z.number().int().min(0).optional().default(0),
  page_size: z.number().int().min(1).max(50).optional().default(10),
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

// Request Character or Elementum
export const requestCharacterOrElementumV1Parameters = z
  .object({
    name: z.string().optional(),
    uuid: z.string().optional(),
    parent_type: z
      .enum(["character", "elementum", "both"])
      .optional()
      .default("both"),
  })
  .refine((data) => data.name || data.uuid, {
    message: "必须提供 name 或 uuid 参数之一",
  });
export type RequestCharacterOrElementumV1Parameters = z.infer<
  typeof requestCharacterOrElementumV1Parameters
>;

export const requestCharacterOrElementumV1ResultSchema = z.object({
  detail: z.union([
    z.object({
      type: z.literal("character"),
      uuid: z.string(),
      name: z.string(),
      age: z.string().nullish(),
      interests: z.string().nullish(),
      persona: z.string().nullish(),
      description: z.string().nullish(),
      occupation: z.string().nullish(),
      avatar_img: z.string().nullish(),
      header_img: z.string().nullish(),
    }),
    z.object({
      type: z.literal("elementum"),
      uuid: z.string(),
      name: z.string(),
      description: z.string().nullish(),
      avatar_img: z.string().nullish(),
    }),
  ]),
});
export type RequestCharacterOrElementumV1Result = z.infer<
  typeof requestCharacterOrElementumV1ResultSchema
>;

// Request BGM
export const requestBgmV1Parameters = z.object({
  placeholder: z.string().optional().default(""),
});
export type RequestBgmV1Parameters = z.infer<typeof requestBgmV1Parameters>;

export const requestBgmV1ResultSchema = z.object({
  bgm: z
    .object({
      type: z.literal("audio"),
      uuid: z.string(),
      url: z.string(),
      name: z.string(),
      preview_url: z.string().nullish(),
    })
    .nullish(),
});
export type RequestBgmV1Result = z.infer<typeof requestBgmV1ResultSchema>;

// Hashtag Types
export const hashtagBaseParameters = z.object({
  hashtag: z.string(),
});
export type HashtagBaseParameters = z.infer<typeof hashtagBaseParameters>;

export const paginatedHashtagParameters = hashtagBaseParameters.extend({
  page_index: z.number().int().min(0).optional().default(0),
  page_size: z.number().int().min(1).max(100).optional().default(20),
});
export type PaginatedHashtagParameters = z.infer<
  typeof paginatedHashtagParameters
>;

export const loreEntrySchema = z.object({
  uuid: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
});
export type LoreEntry = z.infer<typeof loreEntrySchema>;

export const activityDetailSchema = z.object({
  uuid: z.string().nullish(),
  title: z.string().nullish(),
  banner_pic: z.string().nullish(),
  creator_name: z.string().nullish(),
  review_users: z
    .array(
      z.object({
        uuid: z.string(),
        name: z.string(),
      }),
    )
    .nullish(),
});
export type ActivityDetail = z.infer<typeof activityDetailSchema>;

export const hashtagInfoSchema = z.object({
  name: z.string(),
  lore: z.array(loreEntrySchema),
  activity_detail: activityDetailSchema.nullish(),
  hashtag_heat: z.number().nullish(),
  subscribe_count: z.number().nullish(),
});
export type HashtagInfo = z.infer<typeof hashtagInfoSchema>;

export const fetchHashtagV1ResultSchema = z.object({
  hashtag: hashtagInfoSchema.nullish(),
});
export type FetchHashtagV1Result = z.infer<typeof fetchHashtagV1ResultSchema>;

export const characterInfoSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  short_name: z.string(),
  avatar_img: z.string().nullish(),
  ctime: z.string(),
  creator_uuid: z.string(),
  creator_name: z.string(),
});
export type CharacterInfo = z.infer<typeof characterInfoSchema>;

export const fetchCharactersByHashtagV1Parameters = paginatedHashtagParameters
  .extend({
    sort_by: z.enum(["hot", "newest"]).optional().default("hot"),
    parent_type: z.enum(["oc", "elementum"]).optional(),
  });
export type FetchCharactersByHashtagV1Parameters = z.infer<
  typeof fetchCharactersByHashtagV1Parameters
>;

export const fetchCharactersByHashtagV1ResultSchema = z.object({
  total: z.number(),
  page_index: z.number(),
  page_size: z.number(),
  list: z.array(characterInfoSchema),
  has_next: z.boolean(),
});
export type FetchCharactersByHashtagV1Result = z.infer<
  typeof fetchCharactersByHashtagV1ResultSchema
>;

export const selectedCollectionSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  coverUrl: z.string().nullish(),
  creator_name: z.string().nullish(),
  likeCount: z.number().nullish(),
  sameStyleCount: z.number().nullish(),
  ctime: z.string().nullish(),
});
export type SelectedCollection = z.infer<typeof selectedCollectionSchema>;

export const fetchSelectedCollectionsByHashtagV1Parameters =
  paginatedHashtagParameters.extend({
    sort_by: z
      .enum(["highlight_mark_time"])
      .optional()
      .default("highlight_mark_time"),
  });
export type FetchSelectedCollectionsByHashtagV1Parameters = z.infer<
  typeof fetchSelectedCollectionsByHashtagV1Parameters
>;

export const fetchSelectedCollectionsByActivityV1ResultSchema = z.object({
  total: z.number(),
  page_index: z.number(),
  page_size: z.number(),
  list: z.array(selectedCollectionSchema),
});
export type FetchSelectedCollectionsByActivityV1Result = z.infer<
  typeof fetchSelectedCollectionsByActivityV1ResultSchema
>;
