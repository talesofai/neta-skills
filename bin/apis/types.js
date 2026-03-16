export const IMAGE_GENERATE_ASPECTS = [
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
export const buildMakeImagePayload = (vtokens, options, inherit) => {
    const { make_image_aspect, advanced_translator, negative_freetext, context_model_series, entrance_uuid, manuscript_uuid, assign_key, toolcall_uuid, } = options;
    const imageAspect = IMAGE_GENERATE_ASPECTS.find((a) => a.aspect === make_image_aspect)?.size ?? [576, 768];
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
    };
};
export const buildMakeVideoPayload = (image_url, work_flow_text, work_flow_model, options) => {
    const { entrance_uuid, manuscript_uuid, inherit_params, assign_key, toolcall_uuid, } = options || {};
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
    };
};
export const isTextAssign = (assign) => typeof assign === "string";
export const isCharacterAssign = (assign) => typeof assign === "object" && assign !== null && assign.type === "character";
export const isElementumAssign = (assign) => typeof assign === "object" && assign !== null && assign.type === "elementum";
export const isImageAssign = (assign) => typeof assign === "object" && assign !== null && assign.type === "image";
export const isVideoAssign = (assign) => typeof assign === "object" && assign !== null && assign.type === "video";
export const isAudioAssign = (assign) => typeof assign === "object" && assign !== null && assign.type === "audio";
export const isHtmlTemplateAssign = (assign) => typeof assign === "object" &&
    assign !== null &&
    assign.type === "html_template";
export const isEmptyAssign = (assign) => assign === null;
