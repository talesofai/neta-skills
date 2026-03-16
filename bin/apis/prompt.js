import { mapTCP2Tag, REF_IMG_PROMPT_PLACEHOLDER, stringToPrompts, } from "../utils/prompts.js";
const PRESET_DOMAIN_IMG_REF = "APP/单图/图生图";
export const createPromptApis = (client, tcpApis) => {
    const parseVtokens = async (prompt, options) => {
        const insPrompts = stringToPrompts(prompt, options);
        const imgModes = insPrompts.some((p) => p.type === "ref_image")
            ? await img2imgModes()
            : [];
        const resPrompts = await Promise.all(insPrompts.map(async (p) => {
            if (p.type === "text") {
                return {
                    type: "freetext",
                    weight: p.weight,
                    value: p.value,
                };
            }
            if (p.type === "ref_image") {
                if (p.value === REF_IMG_PROMPT_PLACEHOLDER)
                    return null;
                if (!p.ref_img_uuid)
                    return null;
                if (!p.value)
                    return null;
                const imgMode = imgModes.find((m) => m.name === p.name);
                if (!imgMode)
                    return null;
                return {
                    uuid: imgMode.uuid,
                    name: imgMode.name,
                    type: "ref_image",
                    weight: p.weight,
                    value: p.value,
                    sub_type: p.sub_type,
                    ref_img_uuid: p.ref_img_uuid,
                    extra_value: imgMode.extra_value,
                };
            }
            if (p.type !== "character" && p.type !== "elementum")
                return null;
            if (p.type === "character") {
                const characterInAssigns = options?.characters?.find((c) => c.name === p.name);
                if (characterInAssigns) {
                    return mapTCP2Tag({
                        type: "oc",
                        uuid: characterInAssigns.uuid,
                        name: characterInAssigns.name,
                    }, p.weight);
                }
            }
            if (p.type === "elementum") {
                const elementumInAssigns = options?.elementums?.find((s) => s.name === p.name);
                if (elementumInAssigns) {
                    return mapTCP2Tag({
                        type: "elementum",
                        uuid: elementumInAssigns.uuid,
                        name: elementumInAssigns.name,
                    }, p.weight);
                }
            }
            const res = await tcpApis.searchTCPs({
                keywords: p.name,
                page_index: 0,
                page_size: 1,
                parent_type: p.type === "character" ? "oc" : "elementum",
                sort_scheme: "exact",
            });
            const first = (() => {
                if (!res)
                    return null;
                if ("list" in res) {
                    if (p.type === "character") {
                        return res.list.find((r) => r.type === "oc") ?? null;
                    }
                    if (p.type === "elementum") {
                        return res.list.find((r) => r.type === "elementum") ?? null;
                    }
                    return null;
                }
                return res;
            })();
            if (first) {
                return mapTCP2Tag(first, p.weight);
            }
            return {
                type: "freetext",
                weight: p.weight,
                value: p.name,
            };
        }));
        return resPrompts.filter((r) => r !== null);
    };
    const img2imgModes = async () => {
        return client
            .get("/v1/prompt/full-prompt-tags", {
            params: { domain_name: PRESET_DOMAIN_IMG_REF },
        })
            .then((res) => res.data.tags)
            .catch(() => []);
    };
    return {
        img2imgModes,
        parseVtokens,
    };
};
