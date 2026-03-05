import {Command, Option} from 'commander';
import { apiClient } from '../../api/client';
import type { SuggestContentV1Parameters, SuggestContentV1Result } from '../../types';

// 使用 types.ts 中定义的标准类型
// SuggestContentV1Parameters 已包含完整的业务数据结构

export const suggestContentCommand = new Command('suggest-content')
    .description('🧠 智能内容流引擎 (支持推荐/搜索/精确筛选三模式)')
    
    // ==================
    // 1. 全局基础参数
    // ==================
    .option('-i, --intent-text <string>', '💬 用户自然语言意图 (用于日志记录或未来接入 LLM 解析)')
    .option('-l, --limit <number>', '📄 每页数量 (page_size)', '20')
    .option('-p, --page <number>', '🔢 页码 (page_index)', '0')
    .option('-o, --output <format>', '输出格式: json | table (暂未实现 table)', 'json')
    
    // ==================
    // 2. 模式选择 (核心)
    // ==================
    .addOption(
        new Option('-m, --mode <type>', '🎯 业务模式 (recommend: 重多样性/热度; search: 重相关性; exact: 严格匹配)')
            .choices(['recommend', 'search', 'exact'])
            .default('recommend')
    )
    
    // ==================
    // 3. 模式特有参数 (自动映射到 business_data)
    // ==================
    
    // [Search 模式专用]
    .option('-k, --keywords <string>', '🔍 [Search] 关键词列表 (逗号分隔)', '')
    
    // [Exact/Search 模式专用] - 分类路径
    .option('-t, --tax-paths <string>', '🏷️ [Exact/Search] 分类路径 (逗号分隔，支持 ">" 层级，例: "科幻>AI,生活")', '')
    
    // [Recommend 模式专用] - 分层级分类 (如果不使用 tax_paths)
    .option('--primaries <string>', '📂 [Recommend] 一级分类列表 (逗号分隔)', '')
    .option('--secondaries <string>', '📂 [Recommend] 二级分类列表 (逗号分隔)', '')
    .option('--tertiaries <string>', '📂 [Recommend] 三级分类列表 (逗号分隔)', '')
    
    // [全局排除]
    .option('-x, --exclude-keywords <string>', '🚫 排除关键词 (逗号分隔)', '')
    .option('-X, --exclude-paths <string>', '🚫 排除分类路径 (逗号分隔)', '')
    
    // ==================
    // 4. 高级透传模式 (绕过自动映射)
    // ==================
    .option('-b, --raw-business <json>', '⚙️ [高级] 直接传入完整的 business_data JSON (优先级最高，会覆盖上述所有业务参数)')
    
    .action(async (options) => {
        try {
            // --- Step 1: 准备基础请求体 ---
            const requestPayload: SuggestContentV1Parameters = {
                page_index: parseInt(options.page, 10),
                page_size: parseInt(options.limit, 10),
                scene: 'agent_intent',
                biz_trace_id: '',
                business_data: {
                    intent: options.mode as 'recommend' | 'search' | 'exact',
                    search_keywords: [],
                    tax_paths: [],
                    tax_primaries: [],
                    tax_secondaries: [],
                    tax_tertiaries: [],
                    exclude_keywords: [],
                    exclude_tax_paths: [],
                },
            };
            
            // --- Step 2: 构建 business_data ---
            
            if (options.rawBusiness) {
                // 【高级模式】直接解析 JSON
                try {
                    // 合并到请求体中
                    requestPayload.business_data = JSON.parse(options.rawBusiness);
                } catch (e) {
                    throw new Error(`无效的 JSON 格式：${options.rawBusiness}`);
                }
            } else {
                // 【标准模式】CLI 自动组装
                
                // 2.1 设置意图
                requestPayload.business_data.intent = options.mode as any;
                
                // 2.2 处理关键词 (Search 模式)
                if (options.keywords) {
                    requestPayload.business_data.search_keywords = options.keywords.split(',').map((s:string) => s.trim()).filter(Boolean);
                }
                
                // 2.3 处理分类路径 (Exact/Search 模式优先，Recommend 模式也可用)
                if (options.taxPaths) {
                    requestPayload.business_data.tax_paths = options.taxPaths.split(',').map((s:string) => s.trim()).filter(Boolean);
                }
                
                // 2.4 处理分层级分类 (Recommend 模式特有)
                if (options.primaries) {
                    requestPayload.business_data.tax_primaries = options.primaries.split(',').map((s:string) => s.trim()).filter(Boolean);
                }
                if (options.secondaries) {
                    requestPayload.business_data.tax_secondaries = options.secondaries.split(',').map((s:string) => s.trim()).filter(Boolean);
                }
                if (options.tertiaries) {
                    requestPayload.business_data.tax_tertiaries = options.tertiaries.split(',').map((s:string) => s.trim()).filter(Boolean);
                }
                
                // 2.5 处理排除项
                if (options.excludeKeywords) {
                    requestPayload.business_data.exclude_keywords = options.excludeKeywords.split(',').map((s:string) => s.trim()).filter(Boolean);
                }
                if (options.excludePaths) {
                    requestPayload.business_data.exclude_tax_paths = options.excludePaths.split(',').map((s:string) => s.trim()).filter(Boolean);
                }
                
                // --- Step 3: 简单的客户端校验与提示 ---
                if (requestPayload.business_data.intent === 'search' &&
                    !requestPayload.business_data.search_keywords?.length &&
                    !requestPayload.business_data.tax_paths?.length) {
                    console.warn('⚠️ 警告: Search 模式下未提供 keywords 或 tax_paths，可能返回非预期结果。');
                }
            }
            
            // --- Step 4: 调用 API ---
            // 打印调试信息 (可选，生产环境可去掉)
            // console.error('📤 Request Payload:', JSON.stringify(requestPayload, null, 2));
            
            const result = await apiClient.suggestContent(requestPayload);
            
            // --- Step 5: 输出结果 ---
            console.log(JSON.stringify(result, null, 2));
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            // 简单的错误分类
            const errorCode = errorMessage.includes('JSON') ? 'INVALID_JSON' : 'REQUEST_FAILED';
            
            console.error(
                JSON.stringify({
                    error: {
                        code: errorCode,
                        message: errorMessage,
                        hint: '使用 -h 查看帮助，或使用 -b 传入原始 JSON 调试',
                    },
                }, null, 2)
            );
            process.exit(1);
        }
    });