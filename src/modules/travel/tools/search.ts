import { tool } from "langchain";
import { z } from "zod";

/**
 * 网络搜索工具
 * 支持 Serper API (Google 搜索)，未配置时使用模拟数据
 */
export const searchTool = tool(
  async ({ query }) => {
    try {
      const apiKey = process.env.SERPER_API_KEY;

      if (!apiKey) {
        // 返回模拟搜索结果
        const mockResults: Record<string, string> = {
          "曼谷酒店": "曼谷酒店价格范围: 经济型酒店200-400元/晚，中档酒店500-800元/晚，豪华酒店1000元以上/晚。推荐区域：暹罗广场、素坤逸路。",
          "泰国签证": "泰国对中国游客实行落地签政策，费用约2000泰铢(约400元人民币)，也可提前办理旅游签证。",
          "杭州西湖": "西湖景区免费开放，周边景点包括雷峰塔(40元)、灵隐寺(45元)。建议游玩时间2-3小时。",
          "三亚酒店": "三亚酒店价格: 经济型300-500元/晚，海景房600-1200元/晚，五星级酒店1500元以上/晚。",
          "普吉岛": "普吉岛热门景点: 芭东海滩(免费)、皮皮岛一日游(约300元)、大佛(免费)。推荐5-10月旅游。"
        };

        // 模糊匹配
        for (const [key, value] of Object.entries(mockResults)) {
          if (query.includes(key) || key.includes(query)) {
            return value;
          }
        }

        return `关于"${query}"的搜索结果: 建议提前规划，查询最新价格和政策信息。`;
      }

      // 真实搜索API调用 (使用Serper.dev)
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, gl: "cn", hl: "zh-cn" }),
      });

      if (!response.ok) {
        return `搜索"${query}"时出错，请稍后重试。`;
      }

      const data = await response.json();
      const results = data.organic?.slice(0, 3).map((item: any) =>
        `${item.title}: ${item.snippet}`
      ).join("\n") || "未找到相关结果";

      return results;
    } catch (error) {
      return `搜索"${query}"时出错: ${error}`;
    }
  },
  {
    name: "search_google",
    description: "在网上搜索最新信息，如酒店价格、景点门票、旅游攻略等",
    schema: z.object({
      query: z.string().describe("搜索关键词，例如：曼谷酒店价格、西湖门票")
    }),
  }
);
