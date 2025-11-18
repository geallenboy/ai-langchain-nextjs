import { DemoWorkbench } from "../_components/demo-workbench";
import type { DemoDefinition } from "../_components/demo-workbench";

const AGENT_DEMOS: DemoDefinition[] = [
  {
    type: "simple-agent",
    title: "Simple Agent",
    objective: "体验思考 → 行动 → 观察 → 总结的 LangChain Agent 循环。",
    description:
      "Agent 会分析需求、决定是否调用 search 工具，并基于工具返回再生成最终答案，演示最小可行的 Agent 工作流。",
    callouts: ["推理链", "工具协调", "结果总结"],
  },
];

const AGENT_HIGHLIGHTS = [
  {
    title: "计划可视化",
    detail: "结合 ai-elements 中的 plan、reasoning、tool 组件，重现 Agent 推理轨迹，为调试提供透明度。",
  },
  {
    title: "真实场景映射",
    detail: "Travel 模块中的 AI 行程助手与这里的 Demo 共享理念——LangChain 负责 orchestrate，Next.js + ai-elements 负责可视化交互。",
  },
  {
    title: "安全执行",
    detail: "通过系统提示词限制行为，明确何时调用工具，并在最终回答前汇总工具输出。",
  },
];

const AGENT_ACTIONS = [{ label: "运行 Agent", demoType: "simple-agent" }];

export default function AgentsPage() {
  return (
    <div className="space-y-8 text-white">
      <header className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-widest text-white/60">
          Stage 03
        </p>
        <h2 className="text-2xl font-semibold">Agent 推理实验室</h2>
        <p className="text-white/80">
          把前两个阶段的成果（对话、工具、结构化数据）串联起来，打造真正能推理和行动的 Agent。
          此处的 Demo 与 `src/modules/travel` 的生产级实现有共同的系统提示、工具和记忆策略，可作为迁移桥梁。
        </p>
      </header>
      <DemoWorkbench
        stageTitle="Agent 阶段"
        stageDescription="观察 Agent 如何抉择调用工具、记录观察内容并生成最终回答。"
        stageHighlights={AGENT_HIGHLIGHTS}
        demos={AGENT_DEMOS}
        quickActions={AGENT_ACTIONS}
        emptyState={{
          title: "运行 Agent Demo",
          description: "点击左侧卡片即可触发 Agent 推理流程，查看工具调用与总结。",
        }}
      />
    </div>
  );
}
