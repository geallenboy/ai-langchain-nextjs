# AI旅行规划模块

## ✈️ 模块简介

AI旅行规划模块是一个完整的实战案例，展示如何使用 LangChain 构建智能旅行助手。通过集成天气查询、信息搜索和费用计算等工具，帮助用户规划旅行行程和预算。

## 🎯 模块目标

通过本模块，你将学会：
- 如何构建实用的 AI Agent 系统
- 工具的设计和集成方式
- 系统提示词的编写技巧
- 流式响应的实现方法
- 状态管理和多轮对话

## 📂 目录结构

```
travel/
├── agents/
│   ├── index.ts                 # Agent 定义
│   └── travel-agent.ts          # 旅行 Agent（备份）
├── tools/
│   ├── weather.ts               # 天气查询工具
│   ├── search.ts                # 网络搜索工具
│   ├── calculator.ts            # 计算工具
│   └── index.ts                 # 工具导出
├── config.ts                    # 模块配置
├── index.ts                     # 导出索引
└── README.md                    # 本文档
```

## 🔧 核心功能

### 1. 天气查询 (weatherTool)

**功能**：查询实时天气信息

**支持**：
- OpenWeatherMap API 实时查询
- 未配置 API 时自动使用模拟数据
- 返回温度、天气状况、湿度

**使用示例**：
```typescript
import { weatherTool } from '@/modules/travel/tools';

const result = await weatherTool.invoke({
  location: "北京"
});
```

### 2. 网络搜索 (searchTool)

**功能**：搜索旅游相关信息

**支持**：
- Serper API (Google 搜索)
- 丰富的模拟数据（酒店、景点、价格）
- 智能关键词匹配

**内置模拟数据**：
- 曼谷酒店价格
- 泰国签证政策
- 杭州西湖信息
- 三亚酒店价格
- 普吉岛景点

### 3. 计算工具

- **multiplyTool**：乘法计算（如：每晚价格 × 天数）
- **additionTool**：加法计算（如：酒店 + 餐饮 + 门票）

### 4. 货币换算 (convert_currency)

**功能**：将任意金额从一种货币换算成另一种，默认包含 CNY、USD、THB、JPY 等常用币种。支持通过 `TRAVEL_CURRENCY_RATES`（JSON 字符串）覆盖汇率，便于接入企业实时汇率服务。

### 5. MCP 旅行情报 (travel_intel_mcp)

**功能**：通过 MCP(Model Context Protocol) 网关调用已有的旅行工具或企业内部 API。例如 `context7` 中维护的库存、折扣、目的地情报等。

**使用**：
- 配置 `TRAVEL_MCP_ENDPOINT`（指向你的 MCP HTTP 网关）和可选的 `TRAVEL_MCP_TOOL`
- Agent 在需要实时情报时会调用该工具；若未配置则返回本地模拟数据

### 6. 旅行 Agent

集成所有工具，提供智能旅行规划服务：
- 自动查询天气
- 搜索酒店和景点信息
- 计算总费用
- 生成详细行程建议

## 💻 使用方式

### 通过 Web 界面

访问 http://localhost:3000/travel 开始对话

### 通过 API 调用

```typescript
// POST /api/travel/agent
const response = await fetch('/api/travel/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: '我想去泰国曼谷5天，预算5000元',
    threadId: 'user-123',
  }),
});

// 处理流式响应
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const { mode, chunk: data } = JSON.parse(chunk);

  if (mode === 'messages') {
    console.log(data); // AI 回复内容
  }
}
```

### 直接使用 Agent

```typescript
import { travelAgent } from '@/modules/travel';

const result = await travelAgent.invoke({
  messages: [{ role: "user", content: "杭州周末游" }]
}, {
  configurable: { thread_id: "session-1" }
});
```

## 🎨 示例场景

### 场景一：国内周边游

```
我想这周末去杭州玩2天，住如家快捷酒店（大概300元/晚），
看西湖和灵隐寺，预算1500元够吗？
```

**AI 会做什么**：
1. ✅ 查询杭州天气
2. ✅ 搜索西湖、灵隐寺门票
3. ✅ 计算：酒店300×2 = 600元
4. ✅ 计算：总费用 600 + 200 + 45 = 845元
5. ✅ 结论：1500元预算充足

### 场景二：出境游计划

```
我想去泰国曼谷5天，预算5000元人民币，
推荐性价比高的酒店和行程
```

**AI 会做什么**：
1. ✅ 查询曼谷天气
2. ✅ 搜索曼谷酒店价格
3. ✅ 计算每日预算分配
4. ✅ 生成5天详细行程

### 场景三：预算对比

```
比较一下去海南三亚5天和去泰国普吉岛5天，
哪个更划算？都是中等消费水平
```

**AI 会做什么**：
1. ✅ 分别查询两地天气
2. ✅ 分别搜索价格信息
3. ✅ 分别计算总费用
4. ✅ 对比分析性价比

## ⚙️ 配置说明

### 系统提示词

```typescript
// src/modules/travel/config.ts
export const travelConfig = {
  systemPrompt: `你是一个专业的AI旅行规划助手...`
};
```

系统提示词定义了：
- AI 的角色和能力
- 工作流程指引
- 注意事项
- 回答风格

### 模型配置

```typescript
export const travelConfig = {
  model: {
    name: "gpt-4o-mini",
    temperature: 0.7, // 增加创造性
  },
};
```

### 环境变量

```bash
# 必需
OPENAI_API_KEY=your_openai_key

# 可选（未配置时使用模拟数据）
OPENWEATHERMAP_API_KEY=your_weather_key
SERPER_API_KEY=your_serper_key
# MCP 桥接（可选）
TRAVEL_MCP_ENDPOINT=https://your-mcp-gateway/tools
TRAVEL_MCP_TOOL=travel.intel

# 自定义汇率（JSON 字符串，可选）
TRAVEL_CURRENCY_RATES='{"CNY":1,"USD":7.15,"THB":0.21}'
```

详见：[API密钥配置指南](../../../docs/AI旅行/API_KEYS.md)

## 🛠️ 自定义和扩展

### 添加新工具

1. 在 `tools/` 目录创建新文件

```typescript
// tools/currency.ts
import { tool } from "langchain";
import { z } from "zod";

export const currencyTool = tool(
  async ({ amount, from, to }) => {
    // 汇率转换逻辑
    return `${amount} ${from} = ${result} ${to}`;
  },
  {
    name: "convert_currency",
    description: "货币汇率转换",
    schema: z.object({
      amount: z.number(),
      from: z.string(),
      to: z.string(),
    }),
  }
);
```

2. 导出工具

```typescript
// tools/index.ts
export { currencyTool } from "./currency";
```

3. 注册到 Agent

```typescript
// agents/index.ts
import { currencyTool, travelIntelMcpTool } from "../tools";

export const travelAgent = createAgent({
  tools: [...existingTools, currencyTool, travelIntelMcpTool],
  // ...
});
```

### 接入 MCP 工具

1. 为你现有的 MCP 服务器提供一个简单的 HTTP 网关（接受 `{ tool, arguments }`）
2. 在 `.env.local` 中设置 `TRAVEL_MCP_ENDPOINT` 与 `TRAVEL_MCP_TOOL`
3. Agent 将自动调用 `travel_intel_mcp`，如果网关不可用则回退到 README 中的模拟数据

### 修改提示词

编辑 `config.ts` 中的 `systemPrompt`，可以改变 AI 的行为风格。

### 接入真实 API

替换模拟数据为真实服务：
- 天气：OpenWeatherMap API
- 搜索：Serper/Tavily
- 地图：Google Maps API
- 预订：Booking.com API

## 📖 相关文档

- [AI旅行指南](../../../docs/AI旅行/AI旅行.md)
- [使用指南](../../../docs/AI旅行/TRAVEL_GUIDE.md)
- [API密钥配置](../../../docs/AI旅行/API_KEYS.md)

## 🎓 学习要点

### 1. 工具设计原则

- **单一职责**：每个工具只做一件事
- **优雅降级**：API 失败时提供备选方案
- **清晰描述**：让 AI 理解何时使用工具

### 2. 系统提示词技巧

- 明确角色定位
- 说明工作流程
- 列出注意事项
- 定义回答风格

### 3. 状态管理

- 使用 `threadId` 隔离会话
- 使用 `MemorySaver` 保存历史
- 生产环境可用持久化存储

## 🚀 下一步

- 回到 [学习指南模块](../learning/README.md) 学习基础概念
- 探索 LangGraph 实现更复杂的工作流
- 接入真实 API 构建生产级应用
- 添加更多工具扩展功能

## ❓ 常见问题

### Q: 如何确认工具被调用？

A: 查看浏览器开发者工具的 Console，会显示工具调用信息

### Q: 能否添加语音输入/输出？

A: 可以，集成 Web Speech API 或 OpenAI Whisper

### Q: 如何保存历史规划？

A: 使用持久化检查点（PostgreSQL/SQLite）替换 MemorySaver

### Q: 成本会很高吗？

A: 不会，GPT-4o-mini 很便宜，每次对话约 0.01-0.05 元
