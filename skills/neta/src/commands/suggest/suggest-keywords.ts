import { Command } from 'commander';
import { apiClient } from '../../api/client.ts';
import {
    suggestKeywordsV1Parameters,
    SuggestKeywordsV1Parameters
} from '../../types.ts';

export const suggestKeywordsCommand = new Command('suggest-keywords')
    .description('获取搜索关键词的自动补全建议 (Search Keyword Autocomplete)')
    .requiredOption('-p, --prefix <string>', '用户输入的前缀字符串')
    .option('-s, --size <number>', '返回建议的数量 (默认 10)', '10')
    .action(async (options) => {
        try {
            // 1. 解析并验证参数 (利用 Zod Schema)
            const rawParams: any = {
                prefix: options.prefix,
                size: parseInt(options.size, 10),
            };
            
            const validatedParams: SuggestKeywordsV1Parameters = suggestKeywordsV1Parameters.parse(rawParams);
            
            // 2. 调用 API
            const result = await apiClient.suggestKeywords(validatedParams);
            
            // 3. 输出结果
            console.log(JSON.stringify(result, null, 2));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const isZodError = error?.constructor?.name === 'ZodError';
            
            console.error(
                JSON.stringify(
                    {
                        error: {
                            code: isZodError ? 'INVALID_PARAMETERS' : 'SUGGEST_KEYWORDS_FAILED',
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