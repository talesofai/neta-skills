import z from "zod";
import { parseMeta } from "../../utils/parse_meta.js";
import { createCommand } from "../factory.js";
import { validateTaxPathV1Parameters, validateTaxPathV1ResultSchema, } from "../schema.js";
const meta = parseMeta(z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
}), import.meta);
export const validateTaxPath = createCommand({
    name: meta.name,
    title: meta.title,
    description: meta.description,
    inputSchema: validateTaxPathV1Parameters,
    outputSchema: validateTaxPathV1ResultSchema,
}, async ({ tax_path }, { log, apis }) => {
    log.debug("validate_tax_path: tax_path: %s", tax_path);
    const result = await apis.recsys.validateTaxPath({
        tax_path,
    });
    return {
        valid: result.valid || false,
    };
});
