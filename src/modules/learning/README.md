# 学习指南模块（Learning Module）

围绕 LangChain 1.0、Next.js 16 与全新的 `ai-elements` UI 组件库，本模块帮助你一步步搭建可运行的 AI Agent 能力。本指南聚焦 `src/modules/learning` 目录，强调实战、真实场景和可视化反馈。

## 模块定位与依赖

- **LangChain 1.0**：核心推理、工具和 Agent API。
- **Next.js App Router**：`src/app/learn/page.tsx` 提供所有示例的交互入口，可直接触达 `/api/learning/examples/*`。
- **ai-elements**：位于 `src/components/ai-elements`，是一套可复用的 Agent UI（会话、推理轨迹、工具节点等）。随着示例升级，可随时在页面中引入这些组件增强展示，例如使用 `Conversation`、`Reasoning`、`Tool` 组件输出模型推理链路。

## 目录速览

```
learning/
├── examples/
│   ├── simple-demo.ts           # 基础对话、历史对话、连接测试
│   └── comprehensive-demo.ts    # 工具、结构化输出、Prompt、Agent
├── config.ts                    # 示例注册与模型参数
├── index.ts                     # 导出入口，供 API 与 UI 引用
└── README.md                    # 本指南
```

`src/app/learn` 负责触发示例；`src/app/api/learning/examples/[type]/route.ts` 作为后端层，调用上述示例函数，与 LangChain 保持同一抽象层次，方便调试。

## 系统化学习路线

| 阶段 | 目标 | 必做示例/文件 | 建议实践 |
| --- | --- | --- | --- |
| 0. 环境准备 | 熟悉依赖与 UI | `simple-demo.ts:testModelConnection` | `pnpm dev` 后先执行“测试连接”，在 `.env.local` 设置 `OPENAI_API_KEY`。 |
| 1. 基础对话 | 掌握 ChatOpenAI 使用与消息结构 | `simpleChatDemo`、`simpleChatWithHistory` | 在 UI 中切换不同 Prompt，观察系统/用户角色差异，可使用 `ai-elements/message` 渲染回复。 |
| 2. 工具 & 数据 | 让 LLM 调用工具并输出结构化数据 | `toolCallingDemo`、`structuredOutputDemo` | 扩展 calculator/weather 工具或新增 Webhook 工具；用 `ai-elements/tool` + `ai-elements/edge` 呈现调用链。 |
| 3. 提示词与对话管理 | 通过模板与上下文控制模型行为 | `conversationDemo`、`promptTemplateDemo` | 将 `chain-of-thought.tsx` 可视化组件接入页面，展示思考路径与模板变量。 |
| 4. Agent 推理 | 学会 orchestrate 工具、记忆和总结 | `simpleAgentDemo` | 为 Agent 添加自定义 search/memory 工具，并用 `ai-elements/plan`、`reasoning` 展示“思考→行动→观察→总结”。 |
| 5. 场景化任务 | 把学习成果迁移到真实业务 | `src/modules/travel` | 将旅行助手中的工具拆分到 Learning 模块练习，或在 learning 页模拟“行程建议”“费用估算”等任务。 |

## 真实场景实践建议

1. **对话看板**：用 `ai-elements/conversation` 渲染模型多轮回复，帮助团队讨论提示词效果。
2. **推理轨迹回放**：接入 `ai-elements/reasoning`、`plan`、`tool`，记录 Agent 的每一步 Thought/Action/Observation，利于调试真实流程。
3. **工具集成演练**：结合 `structuredOutputDemo`，扩展天气/搜索工具为“行程规划 API”“供应商库存 API”，并在 UI 中展示数据卡片。
4. **跨模块迁移**：学习模块完成的 Agent 思想，可快速移植到 `travel` 模块，通过 LangChain 工具复用实现“真实用户下单”或“AI 行程规划表单”。

## 如何扩展示例

1. 在 `examples/` 创建 `*.ts`，导出 async 函数，内部通过 `ChatOpenAI`/`tool`/`Runnable`（LangChain）实现逻辑。
2. 更新 `config.ts` 中的 `learningExamples`，映射新类型到函数，实现 UI 和 API 自动发现。
3. (可选) 在 `src/app/learn/page.tsx` 或新的客户端组件上使用 `ai-elements`，将返回结果以更直观的 Agent UI 呈现。常见模式：执行 API → 保存推理步骤 → 传给 `Reasoning`/`Tool`/`Panel` 组件。

## 进一步阅读

- `docs/学习指南/SETUP.md`：环境搭建与依赖说明。
- `docs/学习指南/DEMO_GUIDE.md`：每个示例的详细输入输出。
- LangChain JS 官方文档：https://js.langchain.com/docs
- `src/modules/travel/README.md`：真实业务模块，可对比学习如何将学习示例投入生产。

通过上述路线，你可以把 Learning 模块当作“LangChain + Next.js + ai-elements”实验场：先理解概念，再补齐工具链，最后落地真实 Agent。保持迭代，每完成一阶段就将实践总结沉淀到新的示例或 UI 视图中，整个项目会逐步成长为覆盖模型推理、工具编排、UI 回放的完整学习体系。
