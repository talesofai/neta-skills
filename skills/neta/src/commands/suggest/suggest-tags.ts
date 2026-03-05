import { Command } from 'commander';
import { apiClient } from '../../api/client';
import {
    suggestTagsV1Parameters,
    SuggestTagsV1Parameters
} from '../../types';

export const suggestTagsCommand = new Command('suggest-tags')
    .description('基于完整关键词获取相关标签建议 (Tag Matching Suggestions)')
    .requiredOption('-k, --keyword <string>', '完整的搜索意图词')
    .option('-s, --size <number>', '返回数量 (默认 10)', '10')
    .action(async (options) => {
        try {
            // 1. 解析并验证参数
            const rawParams: any = {
                keyword: options.keyword,
                size: parseInt(options.size, 10),
            };
            
            const validatedParams: SuggestTagsV1Parameters = suggestTagsV1Parameters.parse(rawParams);
            
            // 2. 调用 API
            const result = await apiClient.suggestTags(validatedParams);
            
            // 3. 输出结果
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isZodError = error?.constructor?.name === 'ZodError';
            
            console.error(
                JSON.stringify(
                    {
                        error: {
                            code: isZodError ? 'INVALID_PARAMETERS' : 'SUGGEST_TAGS_FAILED',
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