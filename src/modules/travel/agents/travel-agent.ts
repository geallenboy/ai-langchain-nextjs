import { createAgent, tool } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// 初始化聊天模型
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7, // 增加一些创造性，适合旅行规划
});

// 1. 天气查询工具
const get_weather = tool(
  async ({ location }) => {
    try {
      const apiKey = process.env.OPENWEATHERMAP_API_KEY;

      if (!apiKey) {
        return `天气API未配置。模拟数据: ${location}当前温度28°C，晴天，适合旅游。`;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=zh_cn`
      );

      if (!response.ok) {
        return `无法获取${location}的天气信息。模拟数据: 温度25°C，晴天。`;
      }

      const data = await response.json();
      const temp = Math.round(data.main.temp);
      const description = data.weather[0].description;
      const humidity = data.main.humidity;

      return `${location}当前天气: 温度${temp}°C，${description}，湿度${humidity}%`;
    } catch (error) {
      return `查询${location}天气时出错。模拟数据: 温度25°C，适合旅游。`;
    }
  },
  {
    name: "get_weather",
    description: "查询指定地点的实时天气信息，包括温度、天气状况和湿度",
    schema: z.object({
      location: z.string().describe("城市名称，例如：北京、曼谷、Bangkok")
    }),
  }
);

// 2. 网络搜索工具
const search_google = tool(
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

// 3. 乘法计算工具
const multiply = tool(
  ({ a, b }) => {
    const result = a * b;
    return `${a} × ${b} = ${result}`;
  },
  {
    name: "multiply",
    description: "计算两个数的乘积，用于计算总费用（如：每晚价格 × 天数）",
    schema: z.object({
      a: z.number().describe("第一个数字"),
      b: z.number().describe("第二个数字")
    }),
  }
);

// 4. 加法计算工具
const addition = tool(
  ({ numbers }) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const calculation = numbers.join(" + ");
    return `${calculation} = ${sum}`;
  },
  {
    name: "addition",
    description: "计算多个数字的总和，用于计算总预算（如：酒店 + 餐饮 + 门票）",
    schema: z.object({
      numbers: z.array(z.number()).describe("要相加的数字数组")
    }),
  }
);

// 旅行助手的系统提示词
const systemPrompt = `你是一个专业的AI旅行规划助手，帮助用户规划旅行行程和预算。

你的能力：
- 🌤️ 查询实时天气（get_weather）
- 🔍 搜索旅游信息（search_google）：酒店价格、景点门票、交通费用等
- 🧮 计算费用（multiply, addition）：帮助用户算账

工作流程：
1. 理解用户的旅行需求（目的地、天数、预算）
2. 主动查询天气情况
3. 搜索酒店、景点、餐饮等价格信息
4. 计算总费用，评估预算是否充足
5. 给出详细的行程建议和预算分配

注意事项：
- 始终使用工具获取最新信息，不要依赖过时的知识
- 计算费用时要详细列出每项开销
- 如果预算不足，提供省钱建议
- 给出的行程要具体、可执行

回答风格：友好、专业、实用。用中文回答。`;

// 短期用内存检查点；后续可换 PG/SQLite/Redis 的持久化实现
const checkpointer = new MemorySaver();

export const agent = createAgent({
  model,
  tools: [get_weather, search_google, multiply, addition],
  systemPrompt,
  checkpointer,
});
