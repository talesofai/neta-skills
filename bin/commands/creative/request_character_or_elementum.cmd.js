import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
    parameters: Type.Object({
        name: Type.String(),
        uuid: Type.String(),
        parent_type: Type.String(),
    }),
}), import.meta);
const requestCharacterOrElementumV1Parameters = Type.Object({
    name: Type.Optional(Type.String({ description: meta.parameters.name })),
    uuid: Type.Optional(Type.String({ description: meta.parameters.uuid })),
    parent_type: Type.Union([
        Type.Literal("character"),
        Type.Literal("elementum"),
        Type.Literal("both"),
    ], { default: "both", description: meta.parameters.parent_type }),
});
export const requestCharacterOrElementum = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: requestCharacterOrElementumV1Parameters,
}, async ({ name, uuid, parent_type }, { log, apis }) => {
    const targetType = parent_type === "both" ? ["character", "elementum"] : [parent_type];
    const getTcp = async () => {
        if (!uuid && !name) {
            throw new Error("必须提供name或uuid参数之一");
        }
        if (uuid) {
            return await apis.tcp.tcpProfile(uuid);
        }
        if (name) {
            const res = await apis.tcp.searchTCPs({
                keywords: name,
                page_index: 0,
                page_size: 1,
                sort_scheme: "exact",
                parent_type: parent_type === "both"
                    ? ["oc", "elementum"]
                    : parent_type === "character"
                        ? "oc"
                        : "elementum",
            });
            if (!res)
                return null;
            if (res.list.length === 0)
                return null;
            const first = res.list[0];
            if (!first)
                return null;
            return apis.tcp.tcpProfile(first.uuid);
        }
        return null;
    };
    const tcp = await getTcp();
    if (!tcp) {
        throw new Error(`未找到角色或元素: ${name || uuid}`);
    }
    if (tcp.type === "oc" || tcp.type === "official") {
        if (!targetType.includes("character")) {
            throw new Error(`找到的类型为"character"（角色），但指定了parent_type="elementum"（风格元素）。请调整parent_type参数或使用不同的名称搜索。`);
        }
        const assignValue = {
            type: "character",
            uuid: tcp.uuid,
            name: tcp.name,
            age: tcp.oc_bio.age,
            interests: tcp.oc_bio.interests,
            persona: tcp.oc_bio.persona,
            description: tcp.oc_bio.description,
            occupation: tcp.oc_bio.occupation,
            avatar_img: tcp.config.avatar_img,
            header_img: tcp.config.header_img,
        };
        return {
            detail: assignValue,
        };
    }
    if (tcp.type === "elementum") {
        if (!targetType.includes("elementum")) {
            throw new Error(`找到的类型为"elementum"（风格元素），但指定了parent_type="character"（角色）。请调整parent_type参数或使用不同的名称搜索。`);
        }
        const assignValue = {
            type: "elementum",
            uuid: tcp.uuid,
            name: tcp.name,
            description: tcp.oc_bio.description,
            avatar_img: tcp.config.avatar_img,
        };
        return {
            detail: assignValue,
        };
    }
    log.warn(`request_character_or_elementum: unknown tcp type: ${tcp.type}`);
    throw new Error(`未知TCP类型: ${tcp.type}`);
});
