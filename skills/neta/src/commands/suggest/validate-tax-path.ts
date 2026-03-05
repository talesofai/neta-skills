import { Command } from 'commander';
import { apiClient } from '../../api/client';
import {
    validateTaxPathV1Parameters,
    ValidateTaxPathV1Parameters
} from '../../types';

export const validateTaxPathCommand = new Command('validate-tax-path')
    .description('验证玩法标签路径是否有效 (Validate Taxonomy Path)')
    .requiredOption('-p, --path <string>', '完整的分类路径字符串 (例如: "衍生创作类>热门 IP>崩坏星穹铁道")')
    .action(async (options) => {
        try {
            // 1. 解析并验证参数
            // 注意：commander 将 -p 映射为 path，但 types 中定义为 tax_path
            // 我们需要手动映射一下字段名以匹配 Zod Schema
            const rawParams: any = {
                tax_path: options.path,
            };
            
            const validatedParams: ValidateTaxPathV1Parameters = validateTaxPathV1Parameters.parse(rawParams);
            
            // 2. 调用 API
            const result = await apiClient.validateTaxPath(validatedParams);
            
            // 3. 输出结果
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isZodError = error?.constructor?.name === 'ZodError';
            
            console.error(
                JSON.stringify(
                    {
                        error: {
                            code: isZodError ? 'INVALID_PARAMETERS' : 'VALIDATE_PATH_FAILED',
                            message: isZodError ? '参数验证失败: ' + errorMessage : errorMessage,
                        },
                    },
                    null,
                    2,
                ),
            );
            process.exit(1);
        }
    });