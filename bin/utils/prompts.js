export const mapTCP2Tag = (tcp, weight = 1) => {
    if (tcp.type === "elementum") {
        return {
            uuid: tcp.uuid,
            name: tcp.name,
            value: tcp.uuid,
            type: "elementum",
            weight,
        };
    }
    return {
        uuid: tcp.uuid,
        name: tcp.name,
        value: tcp.uuid,
        type: "oc_vtoken_adaptor",
        weight,
    };
};
export const SEPARATORS = [",", "，", "。", ";", "；", "!", "！", "?", "？"];
const parseSeparatedListOfString = (chars, getContent) => {
    let offset = 0;
    const pop = () => (offset >= chars.length ? null : (chars[offset++] ?? null));
    const contents = [];
    const separators = [];
    let currentToken = "";
    let startOffset = 0;
    while (true) {
        const next = pop();
        if (!next) {
            break;
        }
        else if (getContent(next) === "\\") {
            const nextnext = pop();
            if (nextnext) {
                currentToken += getContent(nextnext);
            }
            else {
                // is this valid?
                currentToken += "\\";
            }
        }
        else if (SEPARATORS.includes(getContent(next))) {
            // we will insert a separator
            contents.push({
                parsedText: currentToken,
                start: startOffset,
                end: offset - 1,
            });
            separators.push({
                parsedText: getContent(next),
                start: offset - 1,
                end: offset,
            });
            currentToken = "";
            startOffset = offset;
        }
        else {
            currentToken += getContent(next);
        }
    }
    contents.push({
        start: startOffset,
        end: offset,
        parsedText: currentToken,
    });
    if (contents.length - separators.length !== 1) {
        throw new Error("Assertation failed: contents.length - separators.length !== 1");
    }
    return {
        contents,
        separators,
    };
};
export const REF_IMG_PROMPT_PLACEHOLDER = "REF_IMG_PROMPT_PLACEHOLDER";
export const REF_IMG_PROMPT_INVALID = "REF_IMG_PROMPT_INVALID";
function stringToPrompt(promptString, options) {
    const str = promptString.trim();
    function extractWeight(str) {
        const segs = str.split(":");
        if (segs.length > 1) {
            const f = parseFloat(segs[segs.length - 1] ?? "1");
            return [
                segs.slice(0, -1).join(":"),
                Number.isNaN(f) ? 1 : Math.min(Math.max(0.1, f), 2),
            ];
        }
        return [segs[0] ?? "", 1];
    }
    if (str.startsWith("@")) {
        const [name, weight] = extractWeight(str.slice(1));
        return { type: "character", name, weight, value: "" };
    }
    // if (str.startsWith("<") && str.endsWith(">")) {
    //   const [name, weight] = extractWeight(str.slice(1, -1));
    //   return { type: "style", name, weight };
    // }
    if (str.startsWith("/")) {
        const [name, weight] = extractWeight(str.slice(1));
        return { type: "elementum", name, weight };
    }
    if (str.startsWith("参考图-") || str.startsWith("图片捏-")) {
        const [modeAndValue, weight] = extractWeight(str.slice(4));
        const idx = modeAndValue.indexOf("-");
        const mode = idx !== -1 ? modeAndValue.slice(0, idx) : modeAndValue;
        const uuid = idx !== -1 ? modeAndValue.slice(idx + 1) : undefined;
        const refImageUrl = uuid ? options?.refImages?.[uuid] : undefined;
        return {
            name: mode ?? "",
            type: "ref_image",
            value: refImageUrl ?? REF_IMG_PROMPT_PLACEHOLDER,
            weight,
            sub_type: "v1",
            ref_img_uuid: uuid ?? null,
        };
    }
    if ((str.startsWith("(参考图") || str.startsWith("(图片捏")) &&
        str.endsWith(")")) {
        const [modeAndValue, weight] = extractWeight(str.slice(4, -1));
        const idx = modeAndValue.indexOf("-");
        const mode = idx !== -1 ? modeAndValue.slice(0, idx) : modeAndValue;
        const uuid = idx !== -1 ? modeAndValue.slice(idx + 1) : undefined;
        const refImageUrl = uuid ? options?.refImages?.[uuid] : undefined;
        return {
            name: mode ?? "",
            type: "ref_image",
            value: refImageUrl ?? REF_IMG_PROMPT_PLACEHOLDER,
            weight,
            sub_type: "v1",
            ref_img_uuid: uuid ?? null,
        };
    }
    if (str.startsWith("(") && str.endsWith(")")) {
        const [value, weight] = extractWeight(str.slice(1, -1));
        return { type: "text", value, weight };
    }
    // if (str.startsWith("/不要")) {
    //   return {
    //     type: "negative",
    //     value: str.slice(3),
    //   };
    // }
    if (str === "参考图" || str === "图片捏") {
        return {
            name: "",
            type: "ref_image",
            value: REF_IMG_PROMPT_PLACEHOLDER,
            weight: 1,
            sub_type: "v1",
            ref_img_uuid: null,
        };
    }
    return {
        type: "text",
        value: str,
        weight: 1,
    };
}
export const splitPrompts = (str) => {
    const { contents } = parseSeparatedListOfString([...str], (x) => x);
    return contents.map((x) => x.parsedText.trim()).filter((x) => x !== "");
};
export function stringToPrompts(str, options) {
    const { contents } = parseSeparatedListOfString([...str], (x) => x);
    return contents
        .map((x) => x.parsedText.trim())
        .filter((x) => x !== "")
        .map((text) => stringToPrompt(text, options));
}
