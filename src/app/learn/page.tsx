import Link from "next/link";
import {
  Plan,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/components/ai-elements/task";
import { Button } from "@/components/ui/button";

const STAGES = [
  {
    title: "基础对话 & 上下文",
    summary: "测试连接、单轮/多轮对话、消息结构解析。",
    link: "/learn/foundations",
    highlights: ["ChatOpenAI", "system/user Prompt", "历史记录"],
  },
  {
    title: "工具与结构化数据",
    summary: "Tool Calling、Zod schema、Prompt 模板化。",
    link: "/learn/tools",
    highlights: ["tool()", "withStructuredOutput", "模板复用"],
  },
  {
    title: "Agent 推理与场景",
    summary: "思考-行动-观察循环，输出可视化，迁移到 travel 模块。",
    link: "/learn/agents",
    highlights: ["推理链", "工具协调", "场景演练"],
  },
];

const PRACTICES = [
  {
    title: "使用 ai-elements 调试推理",
    details:
      "在 Demo 页面中接入 conversation、plan、tool 组件，让团队看到中间过程，快速定位提示词或工具问题。",
  },
  {
    title: "映射到真实业务",
    details:
      "完成 demo 后，把同样的 LangChain 调用迁移到 travel 模块，验证在真实 API + UI 中的表现。",
  },
  {
    title: "扩展工具集",
    details:
      "沿用 `toolCallingDemo` 的写法添加新的工具，如价格查询、库存服务，并通过结构化输出保证可消费性。",
  },
];

export default function LearnOverviewPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-900/50 p-6 text-white">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-widest text-white/60">
            学习导航
          </p>
          <h2 className="text-2xl font-semibold">
            将 LangChain 知识拆分为三个 Demo 分区
          </h2>
          <p className="text-base text-white/80">
            每个分区都配有 ai-elements 组件打造的交互式工作台，你可以随时切换场景、
            查看推理过程并复用示例代码到业务模块。
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {STAGES.map((stage) => (
          <div
            key={stage.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-lg"
          >
            <p className="text-sm uppercase tracking-wide text-white/70">
              Stage
            </p>
            <h3 className="mt-2 text-xl font-semibold">{stage.title}</h3>
            <p className="mt-2 text-sm text-white/80">{stage.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
              {stage.highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 px-3 py-1"
                >
                  {item}
                </span>
              ))}
            </div>
            <Button
              asChild
              variant="secondary"
              className="mt-4 w-full rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href={stage.link}>进入 {stage.title}</Link>
            </Button>
          </div>
        ))}
      </section>

      <Plan className="border-white/10 bg-slate-900/70 text-white" defaultOpen>
        <PlanHeader>
          <div>
            <PlanTitle>三阶段路线</PlanTitle>
            <PlanDescription>
              每阶段配套 Demo 页面与 API：`/api/learning/examples/*`
              按照这些顺序可逐步从对话、工具走向 Agent。
            </PlanDescription>
          </div>
          <PlanTrigger />
        </PlanHeader>
        <PlanContent>
          <div className="grid gap-4 md:grid-cols-3">
            {STAGES.map((stage) => (
              <div
                key={stage.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm"
              >
                <p className="text-xs uppercase tracking-widest text-white/60">
                  {stage.title}
                </p>
                <p className="text-white/80">{stage.summary}</p>
                <p className="mt-2 text-xs text-white/60">
                  页面：{stage.link}
                </p>
              </div>
            ))}
          </div>
        </PlanContent>
      </Plan>

      <section className="grid gap-4 lg:grid-cols-3">
        {PRACTICES.map((item) => (
          <Task
            key={item.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-4 text-white"
            defaultOpen={false}
          >
            <TaskTrigger title={item.title} />
            <TaskContent>
              <TaskItem className="text-white/80">{item.details}</TaskItem>
            </TaskContent>
          </Task>
        ))}
      </section>
    </div>
  );
}
