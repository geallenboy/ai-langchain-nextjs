import { DemoWorkbench } from "../_components/demo-workbench";
import type { DemoDefinition } from "../_components/demo-workbench";

const FOUNDATION_DEMOS: DemoDefinition[] = [
  {
    type: "test-connection",
    title: "模型连接自检",
    objective: "检查环境变量与 OpenAI Key，验证项目能与 LangChain 模型握手。",
    description:
      "调用 ChatOpenAI 并期待固定回复，确认网络、Key、模型名称等配置无误，避免后续调试被环境问题阻塞。",
    callouts: ["OPENAI_API_KEY", "ChatOpenAI", "错误捕获"],
  },
  {
    type: "simple-chat",
    title: "单轮对话",
    objective: "理解 system/user 角色与基础 Prompt 结构。",
    description:
      "发送一条简单问题，观察 LangChain 如何封装 prompt 并返回字符串内容，是后续所有 Demo 的起点。",
    callouts: ["System Prompt", "temperature", "invoke()"],
  },
  {
    type: "simple-history",
    title: "带历史记录的对话",
    objective: "通过 message 数组维护上下文，打好多轮对话基础。",
    description:
      "准备 system/user/assistant 多条消息，让模型理解历史并继续回答，帮助你熟悉消息持久化策略。",
    callouts: ["上下文", "消息数组", "多轮"],
  },
  {
    type: "conversation",
    title: "对话轨迹回放",
    objective: "模拟真实多轮互动，记录完整问答轨迹。",
    description:
      "将每轮输出 append 回 messages，形成 LangChain 推荐的 Conversation Loop，可直接迁移到业务场景。",
    callouts: ["Conversation Demo", "LangGraph 迁移", "回放"],
  },
];

const FOUNDATION_HIGHLIGHTS = [
  {
    title: "消息建模",
    detail: "熟悉 System/User/Assistant 角色，理解 prompt 在 LangChain 中的封装方式。",
  },
  {
    title: "上下文管理",
    detail: "掌握如何以数组维护历史记录，为之后的 Tool/Agent 提供可靠的记忆输入。",
  },
  {
    title: "错误诊断",
    detail: "在页面内直接验证 Key、网络以及模型名配置，建立排错心智模型。",
  },
];

const FOUNDATION_ACTIONS = [
  { label: "连接自检", demoType: "test-connection" },
  { label: "基础聊天", demoType: "simple-chat" },
  { label: "上下文历史", demoType: "simple-history" },
  { label: "多轮对话", demoType: "conversation" },
];

export default function FoundationsPage() {
  return (
    <div className="space-y-8 text-white">
      <header className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm uppercase tracking-widest text-white/60">
          Stage 01
        </p>
        <h2 className="text-2xl font-semibold">基础对话实验室</h2>
        <p className="text-white/80">
          通过多个 Demo 建立“模型调用 + 消息上下文”心智，确保每位贡献者都能读懂
          LangChain 的最小闭环，实现从输入到输出的自给自足。
        </p>
      </header>
      <DemoWorkbench
        stageTitle="对话阶段"
        stageDescription="先确认模型可用，再掌握单轮、多轮与 conversation 轨迹，为工具和 Agent 奠定基础。"
        stageHighlights={FOUNDATION_HIGHLIGHTS}
        demos={FOUNDATION_DEMOS}
        quickActions={FOUNDATION_ACTIONS}
        emptyState={{
          title: "选择基础示例",
          description: "点击左侧卡片或快捷按钮运行 Demo，结果会显示在右侧对话区。",
        }}
      />
    </div>
  );
}
