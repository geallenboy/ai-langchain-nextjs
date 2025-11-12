import { ChatOpenAI } from "@langchain/openai";

// 最简单的聊天示例，用于演示基本功能
export async function simpleChatDemo() {
    try {
        const model = new ChatOpenAI({
            model: "gpt-4",
            temperature: 0.7
        });

        const response = await model.invoke("你好！请简单介绍一下什么是LangChain？");
        
        // 确保返回字符串类型
        if (typeof response.content === 'string') {
            return response.content;
        } else if (Array.isArray(response.content)) {
            return response.content.map(block => 
                typeof block === 'string' ? block : block.text || '[内容]'
            ).join('');
        } else {
            return "收到了AI的回复，但格式不是纯文本。";
        }
    } catch (error) {
        console.error("聊天示例错误:", error);
        return `聊天示例运行出错: ${error}`;
    }
}

// 带历史记录的简单聊天
export async function simpleChatWithHistory() {
    try {
        const model = new ChatOpenAI({
            model: "gpt-4",
            temperature: 0.7
        });

        const messages = [
            { role: "system" as const, content: "你是一个友好的AI助手。" },
            { role: "user" as const, content: "什么是LangChain？" },
            { role: "assistant" as const, content: "LangChain是一个用于构建AI应用的框架。" },
            { role: "user" as const, content: "它有哪些主要特性？" }
        ];

        const response = await model.invoke(messages);
        
        // 处理返回值
        if (typeof response.content === 'string') {
            return response.content;
        } else if (Array.isArray(response.content)) {
            return response.content.map(block => 
                typeof block === 'string' ? block : block.text || '[内容]'
            ).join('');
        } else {
            return "收到了AI的回复，但格式不是纯文本。";
        }
    } catch (error) {
        console.error("历史聊天示例错误:", error);
        return `历史聊天示例运行出错: ${error}`;
    }
}

// 测试模型连接
export async function testModelConnection() {
    try {
        const model = new ChatOpenAI({
            model: "gpt-4",
            temperature: 0
        });

        const response = await model.invoke("请回复：连接成功");
        
        return `模型连接成功！回复: ${String(response.content)}`;
    } catch (error) {
        console.error("模型连接测试错误:", error);
        return `模型连接失败: ${error}`;
    }
}