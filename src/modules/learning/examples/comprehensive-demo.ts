import { ChatOpenAI } from "@langchain/openai";
import { tool } from "langchain";
import { z } from "zod";
import { HumanMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";

/**
 * Demo 1: 工具调用 (Tool Calling)
 * 展示 LangChain 如何让 AI 调用自定义工具
 */
export async function toolCallingDemo() {
    try {
        // 定义一个计算器工具
        const calculatorTool = tool(
            ({ operation, a, b }) => {
                switch (operation) {
                    case "add":
                        return `${a} + ${b} = ${a + b}`;
                    case "subtract":
                        return `${a} - ${b} = ${a - b}`;
                    case "multiply":
                        return `${a} × ${b} = ${a * b}`;
                    case "divide":
                        return b !== 0 ? `${a} ÷ ${b} = ${a / b}` : "错误：除数不能为0";
                    default:
                        return "不支持的操作";
                }
            },
            {
                name: "calculator",
                description: "执行基本的数学运算",
                schema: z.object({
                    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("运算类型"),
                    a: z.number().describe("第一个数字"),
                    b: z.number().describe("第二个数字"),
                }),
            }
        );

        // 定义一个天气查询工具
        const weatherTool = tool(
            ({ city }) => {
                // 模拟天气数据
                const mockWeather: Record<string, string> = {
                    "北京": "晴天，15-25°C",
                    "上海": "多云，18-26°C",
                    "深圳": "小雨，22-28°C",
                };
                return mockWeather[city] || `抱歉，暂无${city}的天气数据`;
            },
            {
                name: "get_weather",
                description: "查询指定城市的天气情况",
                schema: z.object({
                    city: z.string().describe("城市名称"),
                }),
            }
        );

        // 创建支持工具的模型
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
        });

        const modelWithTools = model.bindTools([calculatorTool, weatherTool]);

        // 调用模型
        const response = await modelWithTools.invoke([
            new SystemMessage("你是一个有用的助手，可以使用工具来回答问题。"),
            new HumanMessage("请帮我计算 123 乘以 456，然后告诉我北京的天气"),
        ]);

        // 处理工具调用
        let result = "AI 响应：\n\n";

        if (response.tool_calls && response.tool_calls.length > 0) {
            result += "工具调用情况：\n";
            for (const toolCall of response.tool_calls) {
                result += `\n工具名称: ${toolCall.name}\n`;
                result += `参数: ${JSON.stringify(toolCall.args, null, 2)}\n`;

                // 执行工具
                if (toolCall.name === "calculator") {
                    const toolResult = await calculatorTool.invoke(toolCall);
                    result += `结果: ${toolResult}\n`;
                } else if (toolCall.name === "get_weather") {
                    const toolResult = await weatherTool.invoke(toolCall);
                    result += `结果: ${toolResult}\n`;
                }
            }
        } else {
            result += String(response.content);
        }

        return result;
    } catch (error) {
        console.error("工具调用示例错误:", error);
        return `工具调用示例运行出错: ${error}`;
    }
}

/**
 * Demo 2: 结构化输出 (Structured Output)
 * 让 AI 返回符合特定格式的数据
 */
export async function structuredOutputDemo() {
    try {
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
        });

        // 定义输出结构
        const schema = z.object({
            name: z.string().describe("人物名称"),
            age: z.number().describe("年龄"),
            occupation: z.string().describe("职业"),
            skills: z.array(z.string()).describe("技能列表"),
            bio: z.string().describe("简短的个人介绍"),
        });

        // 使用 withStructuredOutput 确保返回符合 schema 的数据
        const structuredModel = model.withStructuredOutput(schema, {
            name: "person_info",
        });

        const response = await structuredModel.invoke([
            new SystemMessage("你是一个数据提取助手，从文本中提取结构化信息。"),
            new HumanMessage(
                "请从以下文本提取信息：李明是一位32岁的软件工程师，擅长Python、TypeScript和AI应用开发。他在科技行业工作了8年，专注于构建智能系统。"
            ),
        ]);

        return `结构化输出结果：\n\n${JSON.stringify(response, null, 2)}`;
    } catch (error) {
        console.error("结构化输出示例错误:", error);
        return `结构化输出示例运行出错: ${error}`;
    }
}

/**
 * Demo 3: 多轮对话与上下文管理
 * 展示如何处理多轮对话，保持上下文
 */
export async function conversationDemo() {
    try {
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.7,
        });

        // 模拟多轮对话
        const messages: BaseMessage[] = [
            new SystemMessage("你是一个友好的编程导师，擅长解释技术概念。"),
            new HumanMessage("什么是 LangChain？"),
        ];

        const response1 = await model.invoke(messages);
        messages.push(response1);

        // 第二轮对话
        messages.push(new HumanMessage("它和 LangGraph 有什么区别？"));
        const response2 = await model.invoke(messages);
        messages.push(response2);

        // 第三轮对话
        messages.push(new HumanMessage("给我一个使用场景的例子"));
        const response3 = await model.invoke(messages);

        let result = "多轮对话记录：\n\n";
        result += `用户: 什么是 LangChain？\n`;
        result += `AI: ${String(response1.content)}\n\n`;
        result += `用户: 它和 LangGraph 有什么区别？\n`;
        result += `AI: ${String(response2.content)}\n\n`;
        result += `用户: 给我一个使用场景的例子\n`;
        result += `AI: ${String(response3.content)}\n`;

        return result;
    } catch (error) {
        console.error("对话示例错误:", error);
        return `对话示例运行出错: ${error}`;
    }
}

/**
 * Demo 4: 提示词模板与变量替换
 * 展示如何使用模板创建动态提示词
 */
export async function promptTemplateDemo() {
    try {
        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.7,
        });

        // 定义一个代码审查提示词模板
        const createCodeReviewPrompt = (language: string, code: string) => {
            return [
                new SystemMessage(
                    `你是一位资深的${language}工程师，专注于代码质量和最佳实践。`
                ),
                new HumanMessage(
                    `请审查以下${language}代码，指出潜在问题并给出改进建议：\n\n\`\`\`${language}\n${code}\n\`\`\``
                ),
            ];
        };

        // 示例代码
        const sampleCode = `
function calculateTotal(items) {
    var total = 0;
    for (var i = 0; i < items.length; i++) {
        total = total + items[i].price;
    }
    return total;
}`;

        const messages = createCodeReviewPrompt("javascript", sampleCode);
        const response = await model.invoke(messages);

        return `代码审查结果：\n\n${String(response.content)}`;
    } catch (error) {
        console.error("提示词模板示例错误:", error);
        return `提示词模板示例运行出错: ${error}`;
    }
}

/**
 * Demo 5: 简单的 Agent 工作流
 * 展示如何创建一个能够推理和行动的 Agent
 */
export async function simpleAgentDemo() {
    try {
        // 定义工具集
        const searchTool = tool(
            ({ query }) => {
                // 模拟搜索结果
                const mockResults: Record<string, string> = {
                    "langchain": "LangChain 是一个用于构建 LLM 应用的框架，提供了链式调用、代理、记忆等功能。",
                    "nextjs": "Next.js 是一个 React 框架，支持服务端渲染、静态生成和 API 路由。",
                    "typescript": "TypeScript 是 JavaScript 的超集，添加了静态类型系统。",
                };

                const lowerQuery = query.toLowerCase();
                for (const [key, value] of Object.entries(mockResults)) {
                    if (lowerQuery.includes(key)) {
                        return value;
                    }
                }
                return "未找到相关信息";
            },
            {
                name: "search",
                description: "搜索知识库获取信息",
                schema: z.object({
                    query: z.string().describe("搜索查询"),
                }),
            }
        );

        const model = new ChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0,
        });

        const modelWithTools = model.bindTools([searchTool]);

        // Agent 推理过程
        const response = await modelWithTools.invoke([
            new SystemMessage(
                "你是一个研究助手。当需要查找信息时，使用 search 工具。始终先思考是否需要使用工具。"
            ),
            new HumanMessage("LangChain 和 Next.js 分别是什么？它们可以一起使用吗？"),
        ]);

        let result = "Agent 工作流：\n\n";

        if (response.tool_calls && response.tool_calls.length > 0) {
            result += "Agent 决定使用工具：\n\n";
            const toolResults: string[] = [];
            for (const toolCall of response.tool_calls) {
                result += `工具: ${toolCall.name}\n`;
                result += `查询: ${JSON.stringify(toolCall.args)}\n`;
                const toolMessage = await searchTool.invoke(toolCall);
                const toolResult = String(toolMessage.content);
                toolResults.push(toolResult);
                result += `结果: ${toolResult}\n\n`;
            }

            // 获取最终响应
            const finalResponse = await model.invoke([
                new SystemMessage("基于工具返回的信息，给出综合性的回答。"),
                new HumanMessage("LangChain 和 Next.js 分别是什么？它们可以一起使用吗？"),
                new SystemMessage(`工具返回的信息：${toolResults.join("; ")}`),
            ]);

            result += `\nAgent 最终回答：\n${String(finalResponse.content)}`;
        } else {
            result += `Agent 回答（未使用工具）：\n${String(response.content)}`;
        }

        return result;
    } catch (error) {
        console.error("Agent 示例错误:", error);
        return `Agent 示例运行出错: ${error}`;
    }
}
