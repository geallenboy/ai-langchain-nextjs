import { tool } from "langchain";
import { z } from "zod";

type MCPResponse =
  | {
      result?: unknown;
      data?: unknown;
      message?: string;
    }
  | string;

const mockIntel: Record<string, string> = {
  "大阪美食": "大阪道顿堀必吃清单：章鱼烧(35元)、串炸(45元)、和牛寿喜锅(180元)。建议晚饭后逛心斋桥，商铺营业至22:00。",
  "东京温泉": "箱根温泉日归票约 300-400 元/人，含浴衣。周末需提前预约，JR 新宿站至箱根约 90 分钟。",
};

const stringifyMcpResponse = (payload: MCPResponse) => {
  if (typeof payload === "string") return payload;
  if (payload?.result) {
    if (typeof payload.result === "string") return payload.result;
    return JSON.stringify(payload.result, null, 2);
  }
  if (payload?.data) {
    return JSON.stringify(payload.data, null, 2);
  }
  if (payload?.message) {
    return payload.message;
  }
  return JSON.stringify(payload, null, 2);
};

/**
 * MCP 桥接工具
 * 允许 Agent 将查询委托给外部 MCP 服务（如 context7、旅行库存系统）
 */
export const travelIntelMcpTool = tool(
  async ({ query, format, metadata }) => {
    const endpoint = process.env.TRAVEL_MCP_ENDPOINT;
    const toolName = process.env.TRAVEL_MCP_TOOL ?? "travel.intel";

    if (!endpoint) {
      const fallback =
        mockIntel[query] ??
        `未配置 MCP 端点。可在环境变量 TRAVEL_MCP_ENDPOINT 中填入 MCP HTTP 网关地址，然后通过 ${toolName} 工具获取实时数据。当前返回模拟提示供参考。`;
      return fallback;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tool: toolName,
          arguments: {
            query,
            format,
            metadata,
          },
        }),
      });

      if (!response.ok) {
        return `MCP 工具调用失败（${response.status}）。可检查 ${endpoint} 是否可用。`;
      }

      const data = (await response.json()) as MCPResponse;
      return stringifyMcpResponse(data);
    } catch (error) {
      return `调用 MCP 工具时出错：${error instanceof Error ? error.message : error}`;
    }
  },
  {
    name: "travel_intel_mcp",
    description:
      "通过 MCP 服务查询目的地实时资讯、库存或企业内部数据，适合对接 context7 等现有工具链",
    schema: z.object({
      query: z.string().describe("查询内容，如'大阪美食推荐''东京温泉预约'"),
      format: z
        .enum(["insight", "pricing", "inventory"])
        .default("insight")
        .describe("期望的数据类型"),
      metadata: z
        .record(z.string(), z.string())
        .optional()
        .describe("额外上下文，例如用户ID、预算范围"),
    }),
  }
);
