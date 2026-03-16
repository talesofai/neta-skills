interface CharacteVtoken {
  type: "official_character_vtoken_adaptor" | "oc_vtoken_adaptor";
  name: string;
  uuid: string;
  weight: number;
  value: string;
}

interface ElementumVtoken {
  type: "elementum";
  name: string;
  uuid: string;
  weight: number;
  value: string;
}

export const mapTCP2Tag = (
  tcp: {
    type: "official" | "oc" | "elementum";
    uuid: string;
    name: string;
  },
  weight = 1,
): CharacteVtoken | ElementumVtoken => {
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

export interface RefImageVtoken {
  type: "ref_image";
  uuid: string;
  value: string;
  weight: number;
  sub_type: string;
  ref_img_uuid?: string;
  name: string;
  extra_value: {
    params: {
      sub_type: string;
      preset_key: string;
      work_flow_model?: "cogvideox-2-rapid" | "cogvideox-2-speed";
    };
    fe_config: {
      tips: string;
      is_support_prompt: false;
      is_support_weight: false;
      additional_image_url: string;
      make_count_overwrite: number;
    };
  };
}

type FreetextVtoken = {
  type: "freetext";
  value: string;
  weight: number;
};

export type Vtokens =
  | CharacteVtoken
  | ElementumVtoken
  | RefImageVtoken
  | FreetextVtoken;

export const SEPARATORS = [",", "，", "。", ";", "；", "!", "！", "?", "？"];

interface SeparatedToken {
  start: number;
  end: number;
  parsedText: string;
}

const parseSeparatedListOfString = <TChar>(
  chars: TChar[],
  getContent: (char: TChar) => string,
): {
  contents: SeparatedToken[];
  separators: SeparatedToken[];
} => {
  let offset = 0;
  const pop = () => (offset >= chars.length ? null : (chars[offset++] ?? null));
  const contents: SeparatedToken[] = [];
  const separators: SeparatedToken[] = [];
  let currentToken = "";
  let startOffset = 0;
  while (true) {
    const next = pop();
    if (!next) {
      break;
    } else if (getContent(next) === "\\") {
      const nextnext = pop();
      if (nextnext) {
        currentToken += getContent(nextnext);
      } else {
        // is this valid?
        currentToken += "\\";
      }
    } else if (SEPARATORS.includes(getContent(next))) {
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
    } else {
      currentToken += getContent(next);
    }
  }
  contents.push({
    start: startOffset,
    end: offset,
    parsedText: currentToken,
  });
  if (contents.length - separators.length !== 1) {
    throw new Error(
      "Assertation failed: contents.length - separators.length !== 1",
    );
  }
  return {
    contents,
    separators,
  };
};

export const REF_IMG_PROMPT_PLACEHOLDER = "REF_IMG_PROMPT_PLACEHOLDER";
export const REF_IMG_PROMPT_INVALID = "REF_IMG_PROMPT_INVALID";

export interface CharacterPrompt {
  type: "character";
  name: string;
  weight: number;
  value: string;
}

interface ElementumPrompt {
  type: "elementum";
  name: string;
  weight: number;
}

interface TextPrompt {
  type: "text"; // 即使生图流程事实上会有更多的类型（emoji,cp_template), freetext也包括在内
  value: string;
  weight: number;
}

interface RefImgPrompt {
  name: string;
  type: "ref_image";
  sub_type: string;
  value: string;
  weight: number;
  ref_img_uuid: string | null;
  extra_value?: {
    params: { sub_type: string; preset_key: string };
    fe_config: {
      make_count_overwrite: number;
      is_support_prompt: boolean;
      is_support_weight: boolean;
      additional_image_url: string;
      tips: string;
    };
  };
}

type Prompt = CharacterPrompt | ElementumPrompt | RefImgPrompt | TextPrompt;

function stringToPrompt(
  promptString: string,
  options?: {
    refImages: Record<string, string>;
  },
): Prompt {
  const str = promptString.trim();
  function extractWeight(str: string): [string, number] {
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

  if (
    (str.startsWith("(参考图") || str.startsWith("(图片捏")) &&
    str.endsWith(")")
  ) {
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

export const splitPrompts = (str: string): string[] => {
  const { contents } = parseSeparatedListOfString([...str], (x) => x);
  return contents.map((x) => x.parsedText.trim()).filter((x) => x !== "");
};

export function stringToPrompts(
  str: string,
  options?: {
    refImages: Record<string, string>;
  },
): Prompt[] {
  const { contents } = parseSeparatedListOfString([...str], (x) => x);
  return contents
    .map((x) => x.parsedText.trim())
    .filter((x) => x !== "")
    .map((text) => stringToPrompt(text, options));
}
