import { Command } from 'commander';
import { apiClient } from '../../api/client';
import {
    suggestCategoriesV1Parameters,
    SuggestCategoriesV1Parameters
} from '../../types';

export const suggestCategoriesCommand = new Command('suggest-categories')
    .description('获取玩法分类层级的导航建议 (Category Navigation Suggestions)')
    .option('-l, --level <number>', '分类层级 (1=一级, 2=二级... 默认 1)', '1')
    .option('-P, --parent-path <string>', '父级分类路径 (获取二级及以上分类时必填)')
    .action(async (options) => {
        try {
            // 1. 解析并验证参数
            const rawParams: any = {
                level: parseInt(options.level, 10),
                parent_path: options.parentPath, // commander 会将 -P 转为 parentPath
            };
            
            // 如果未提供 parent_path 且 level > 1，Zod 可能会报错，或者我们在逻辑中处理
            // 这里依赖 Zod schema 中的 optional 定义，具体业务逻辑由后端校验
            
            const validatedParams: SuggestCategoriesV1Parameters = suggestCategoriesV1Parameters.parse(rawParams);
            
            // 2. 调用 API
            const result = await apiClient.suggestCategories(validatedParams);
            
            // 3. 输出结果
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isZodError = error?.constructor?.name === 'ZodError';
            
            console.error(
                JSON.stringify(
                    {
                        error: {
                            code: isZodError ? 'INVALID_PARAMETERS' : 'SUGGEST_CATEGORIES_FAILED',
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