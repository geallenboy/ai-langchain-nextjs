/**
 * 旅行规划 Agent
 * 使用 LangGraph 创建具有记忆和工具调用能力的 AI 代理
 */

import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { weatherTool, searchTool, multiplyTool, additionTool } from "../tools";
import { travelConfig } from "../config";

// 初始化聊天模型
const model = new ChatOpenAI({
  model: travelConfig.model.name,
  temperature: travelConfig.model.temperature,
});

// 使用内存检查点管理对话状态
// 生产环境可替换为 PostgreSQL/SQLite/Redis
const checkpointer = new MemorySaver();

/**
 * 创建旅行规划 Agent
 * 集成了天气查询、搜索、计算等工具
 */
export const travelAgent = createAgent({
  model,
  tools: [weatherTool, searchTool, multiplyTool, additionTool],
  systemPrompt: travelConfig.systemPrompt,
  checkpointer,
});

export type TravelAgent = typeof travelAgent;
