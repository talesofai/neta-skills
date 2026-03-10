import z from "zod";
import { parseMeta } from "../utils/parse_meta.js";
const meta = parseMeta(z.object({
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
    do_checkin_result_schema: z.object({
        message: z.string(),
    }),
}), import.meta);
/**
 * 这是一个包含所有 schema 的文件,用于生成类型声明文件.
 */
//#region Common
export const sizeSchema = z.object({
    width: z.number(),
    height: z.number(),
});
export const inheritSchema = z.object({
    collection_uuid: z.string().optional(),
    picture_uuid: z.string().optional(),
});
export const taskCreatedSchema = z.object({
    task_uuid: z.string(),
});
//#endregion
// #region Assign
export const textAssignSchema = z.string();
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
export const imageAssignSchema = z.object({
    type: z.literal("image"),
    uuid: z.string(),
    url: z.string(),
    width: z.number().nullish(),
    height: z.number().nullish(),
});
export const videoAssignSchema = z.object({
    type: z.literal("video"),
    uuid: z.string(),
    url: z.string(),
    cover: z.string(),
    width: z.number().nullish(),
    height: z.number().nullish(),
});
export const audioAssignSchema = z.object({
    type: z.literal("audio"),
    uuid: z.string(),
    url: z.string(),
    name: z.string(),
    preview_url: z.string().nullish(),
});
const htmlTemplateAssignSchema = z.object({
    type: z.literal("html_template"),
    url: z.string(),
    verse_preset_uuid: z.string(),
    content_schema: z.string(),
});
export const emptyAssignSchema = z.null();
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
export const taskModalitySchema = z
    .enum(["PICTURE", "VIDEO", "AUDIO", "VERSE"])
    .describe(meta.task_status_schema.modality);
export const taskArtifactImageDetailSchema = sizeSchema.loose();
export const taskArtifactVideoDetailSchema = sizeSchema.loose();
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
export const characterOrElementumSearchResultSchema = z.object({
    uuid: z.string(),
    type: z.enum(["character", "elementum"]),
    name: z.string(),
    avatar_img: z.string().nullish(),
    header_img: z.string().nullish(),
});
export const searchCharacterOrElementumV1ResultSchema = z.object({
    total: z.number(),
    page_index: z.number(),
    page_size: z.number(),
    list: z.array(characterOrElementumSearchResultSchema),
});
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
        .describe(meta.request_character_or_elementum_parameters_schema.parent_type),
})
    .refine((data) => data.name || data.uuid, {
    message: "必须提供name或uuid参数之一",
});
export const requestCharacterOrElementumV1ResultSchema = z.object({
    detail: z
        .union([characterAssignSchema, elementumAssignSchema])
        .describe(meta.request_character_or_elementum_result_schema.detail),
});
// #endregion
// #region Request Bgm V1
export const requestBgmV1Parameters = z.object({
    placeholder: z
        .string()
        .describe(meta.request_bgm_parameters_schema.placeholder),
});
export const requestBgmV1ResultSchema = z.object({
    bgm: audioAssignSchema.nullish(),
});
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
// #endregion
// #region Remove Background V1
export const removeBackgroundV1Parameters = z.object({
    input_image: z
        .string()
        .describe(meta.remove_background_parameters_schema.input_image),
});
// #endregion
// #region Hashtag Common Schemas
export const hashtagBaseParameters = z.object({
    hashtag: z.string().describe(meta.hashtag_base_parameters_schema.hashtag),
});
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
// #endregion
// #region Fetch Hashtag V1
export const fetchHashtagV1Parameters = hashtagBaseParameters.extend({
// 仅继承基础参数,无额外参数
});
export const loreEntrySchema = z
    .object({
    uuid: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string(),
    bind_hashtag_info: z.unknown().nullish(),
})
    .loose();
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
        .array(z.object({
        uuid: z
            .string()
            .describe(meta.activity_detail_schema.review_users_uuid),
        name: z
            .string()
            .describe(meta.activity_detail_schema.review_users_name),
    }))
        .nullish()
        .describe(meta.activity_detail_schema.review_users),
})
    .loose();
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
export const fetchHashtagV1ResultSchema = z.object({
    hashtag: hashtagInfoSchema.nullish(),
});
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
export const fetchSelectedCollectionsByHashtagV1Parameters = paginatedHashtagParameters.extend({
    sort_by: z
        .enum(["highlight_mark_time"])
        .optional()
        .default("highlight_mark_time")
        .describe(meta.fetch_selected_collections_by_hashtag_parameters_schema.sort_by),
});
export const fetchSelectedCollectionsByActivityV1ResultSchema = z.object({
    total: z
        .number()
        .describe(meta.fetch_selected_collections_by_activity_result_schema.total),
    page_index: z
        .number()
        .describe(meta.fetch_selected_collections_by_activity_result_schema.page_index),
    page_size: z
        .number()
        .describe(meta.fetch_selected_collections_by_activity_result_schema.page_size),
    list: z
        .array(selectedCollectionSchema)
        .describe(meta.fetch_selected_collections_by_activity_result_schema.list),
});
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
// #endregion
export const wrapOutput = (content) => {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(content),
            },
        ],
        structuredContent: content,
    };
};
export const wrapAction = (action) => {
    return (...args) => {
        const result = action(...args);
        if (result instanceof Promise) {
            return result.then(wrapOutput);
        }
        return wrapOutput(result);
    };
};
// #region User Stories
export const getUserStoriesParametersSchema = z.object({
    uuid: z.string().describe(meta.get_user_stories_parameters_schema.uuid),
    page_index: z
        .number()
        .optional()
        .default(0)
        .describe(meta.get_user_stories_parameters_schema.page_index),
    page_size: z
        .number()
        .optional()
        .default(20)
        .describe(meta.get_user_stories_parameters_schema.page_size),
});
export const userStorySchema = z.object({
    id: z.number(),
    storyId: z.string(),
    name: z.string(),
    coverUrl: z.string(),
    status: z.enum(["PUBLISHED", "PRIVATE", "DRAFT"]),
    likeCount: z.number(),
    commentCount: z.number().nullable(),
    sharedCount: z.number().nullable(),
    sameStyleCount: z.number(),
    ctime: z.string(),
    is_pinned: z.boolean(),
    hashtag_names: z.array(z.string()),
});
export const getUserStoriesResultSchema = z.object({
    total: z.number().describe(meta.get_user_stories_result_schema.total),
    page_index: z
        .number()
        .describe(meta.get_user_stories_result_schema.page_index),
    page_size: z
        .number()
        .describe(meta.get_user_stories_result_schema.page_size),
    stories: z.array(userStorySchema).describe(meta.get_user_stories_result_schema.stories),
});
// #endregion
// #region Manuscript List
export const getManuscriptListParametersSchema = z.object({
    page_index: z
        .number()
        .optional()
        .default(0)
        .describe(meta.get_manuscript_list_parameters_schema.page_index),
    page_size: z
        .number()
        .optional()
        .default(24)
        .describe(meta.get_manuscript_list_parameters_schema.page_size),
});
export const manuscriptSchema = z.object({
    uuid: z.string(),
    name: z.string(),
    cover_url: z.string(),
    status: z.string(),
    ctime: z.string(),
    mtime: z.string(),
});
export const getManuscriptListResultSchema = z.object({
    total: z.number().describe(meta.get_manuscript_list_result_schema.total),
    page_index: z
        .number()
        .describe(meta.get_manuscript_list_result_schema.page_index),
    page_size: z
        .number()
        .describe(meta.get_manuscript_list_result_schema.page_size),
    has_next: z.boolean().describe(meta.get_manuscript_list_result_schema.has_next),
    manuscripts: z.array(manuscriptSchema).describe(meta.get_manuscript_list_result_schema.manuscripts),
});
// #endregion
// #region Checkin Status
export const getCheckinStatusResultSchema = z.object({
    today_signed: z.boolean().describe(meta.get_checkin_status_result_schema.today_signed),
    streak_count: z.number().describe(meta.get_checkin_status_result_schema.streak_count),
    cycle_day: z.number().describe(meta.get_checkin_status_result_schema.cycle_day),
    cycle_signed_history: z.array(z.boolean()).describe(meta.get_checkin_status_result_schema.cycle_signed_history),
    reward_list: z.array(z.looseObject()).describe(meta.get_checkin_status_result_schema.reward_list),
});
// #endregion
// #region Do Checkin
export const doCheckinResultSchema = z.object({
    message: z.string().describe(meta.do_checkin_result_schema.message),
});
// #endregion
// #region Message Count
export const getMessageCountResultSchema = z.looseObject({
    like: z.number().optional().describe(meta.get_message_count_result_schema.like),
    interacts: z.number().optional().describe(meta.get_message_count_result_schema.interacts),
    subscribe: z.number().optional().describe(meta.get_message_count_result_schema.subscribe),
});
// #endregion
// #region AP Info
export const getApInfoResultSchema = z.object({
    ap: z.number().nullable().describe(meta.get_ap_info_result_schema.ap),
    temp_ap: z.number().nullable().describe(meta.get_ap_info_result_schema.temp_ap),
    ap_limit: z.number().nullable().describe(meta.get_ap_info_result_schema.ap_limit),
    unlimited_until: z.number().nullable().describe(meta.get_ap_info_result_schema.unlimited_until),
    true_unlimited_until: z.number().nullable().describe(meta.get_ap_info_result_schema.true_unlimited_until),
});
// #endregion
// #region OC Worlds
export const ocWorldSchema = z.object({
    uuid: z.string(),
    name: z.string(),
    description: z.string(),
    cover_url: z.string(),
    character_count: z.number(),
    ctime: z.string(),
});
export const getOCWorldsResultSchema = z.object({
    count: z.number().describe(meta.get_oc_worlds_result_schema.count),
    worlds: z.array(ocWorldSchema).describe(meta.get_oc_worlds_result_schema.worlds),
});
// #endregion
