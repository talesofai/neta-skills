import { Type } from "@sinclair/typebox";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
const meta = parseMeta(Type.Object({
    name: Type.String(),
    title: Type.String(),
    description: Type.String(),
}), import.meta);
const validateTaxPathV1Parameters = Type.Object({
    tax_path: Type.String({ minLength: 1 }),
});
export const validateTaxPath = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: validateTaxPathV1Parameters,
}, async ({ tax_path }, { apis }) => {
    const result = await apis.recsys.validateTaxPath({
        tax_path,
    });
    return {
        valid: result.valid || false,
    };
});
