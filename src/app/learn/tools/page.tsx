import { DemoWorkbench } from "../_components/demo-workbench";
import type { DemoDefinition } from "../_components/demo-workbench";

const TOOL_DEMOS: DemoDefinition[] = [
  {
    type: "tool-calling",
    title: "工具调用",
    objective: "让模型学会决定何时调用 calculator/weather 等工具。",
    description:
      "演示 LangChain 中 `tool()` 定义、Zod schema 描述以及 `bindTools` 的使用，让 LLM 按需执行函数。",
    callouts: ["tool()", "Zod", "bindTools"],
  },
  {
    type: "structured-output",
    title: "结构化输出",
    objective: "以 JSON/Zod schema 约束输出，保障数据可被直接消费。",
    description:
      "展示 `withStructuredOutput` 的使用场景——例如从文本中提取人物信息，为 UI 或 API 返回标准格式。",
    callouts: ["withStructuredOutput", "类型安全", "JSON schema"],
  },
  {
    type: "prompt-template",
    title: "提示词模板",
    objective: "通过模板化提示词注入变量，保持一致的审查/分析风格。",
    description:
      "以代码审查为例，动态拼接语言、代码片段，帮助你在多场景、多语言之间复用 Prompt。",
    callouts: ["模板", "变量注入", "复用"],
  },
];

const TOOL_HIGHLIGHTS = [
  {
    title: "工具与安全",
    detail: "通过 Zod 精确描述参数，减少幻觉输入；ai-elements UI 可视化工具调用链路。",
  },
  {
    title: "数据可消费",
    detail: "结构化输出能直接被 UI 组件（如表格、卡片、ai-elements artifact）读取，方便进一步渲染。",
  },
  {
    title: "模板驱动",
    detail: "让提示词遵循统一模板，支持以配置驱动的方式快速扩展到新场景。",
  },
];

const TOOL_ACTIONS = [
  { label: "调用工具", demoType: "tool-calling" },
  { label: "抽取 JSON", demoType: "structured-output" },
  { label: "模板提示词", demoType: "prompt-template" },
];

export default function ToolsPage() {
  return (
    <div className="space-y-8 text-white">
      <header className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-widest text-white/60">
          Stage 02
        </p>
        <h2 className="text-2xl font-semibold">工具 & 数据实验室</h2>
        <p className="text-white/80">
          学习如何把 LangChain 模型与外部能力连接起来，并获得可直接消费的结构化数据。
          在页面中可以结合 ai-elements 的 tool / artifact 组件，对调用链路和输出进行可视化表达。
        </p>
      </header>
      <DemoWorkbench
        stageTitle="工具阶段"
        stageDescription="掌握工具接入、结构化输出和提示词模板，是构建可执行 Agent 的前置条件。"
        stageHighlights={TOOL_HIGHLIGHTS}
        demos={TOOL_DEMOS}
        quickActions={TOOL_ACTIONS}
        emptyState={{
          title: "选择工具示例",
          description: "运行任意 Demo，查看工具输入、输出以及结构化结果。",
        }}
      />
    </div>
  );
}
