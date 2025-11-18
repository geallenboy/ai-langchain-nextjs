"use client";

import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
} from "@/components/ai-elements/message";
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
import {
  Suggestions,
  Suggestion,
} from "@/components/ai-elements/suggestion";
import { Loader } from "@/components/ai-elements/loader";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ai-elements/code-block";

type Role = "user" | "assistant";

interface MessageItem {
  role: Role;
  content: string;
}

type ToolEvent = {
  id: string;
  node: string;
  payload: unknown;
  timestamp: number;
};

const scenarioSuggestions = [
  {
    label: "国内周末游",
    prompt:
      "我想这周末去杭州玩2天，住如家快捷酒店（大概300元/晚），看西湖和灵隐寺，预算1500元够吗？",
  },
  {
    label: "泰国曼谷",
    prompt:
      "我想去泰国曼谷5天，预算5000元人民币，推荐性价比高的酒店和行程，并换算成泰铢看看够不够。",
  },
  {
    label: "跨国对比",
    prompt:
      "比较一下去海南三亚5天和去泰国普吉岛5天，哪个更划算？需要包含天气、酒店区间、预算和建议。",
  },
  {
    label: "大阪美食",
    prompt:
      "下个月去大阪自由行，请结合 MCP 情报列一个3天的美食+景点推荐，并给出预算。",
  },
];

const workflowHighlights = [
  "🌤️ 先确认天气与季节注意事项",
  "🔍 使用搜索/MCP 查实时价格或政策",
  "💱 必要时自动换算货币",
  "🧮 明细方式列出费用与建议",
];

const referenceTasks = [
  {
    title: "如何输出结构化结果？",
    detail:
      "建议包含：天气与注意事项、行程安排（按天）、费用明细、预算建议/备选方案。",
  },
  {
    title: "什么时候调用 MCP？",
    detail:
      "当用户要查库存、特定目的地的活动或企业内部数据时，可使用 travel_intel_mcp。",
  },
  {
    title: "如何处理预算紧张？",
    detail:
      "提供至少两个策略，例如更换酒店档次或调整天数，并列出费用差异。",
  },
];

export default function TravelPlannerPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "error">("idle");
  const [toolEvents, setToolEvents] = useState<ToolEvent[]>([]);
  const [threadId] = useState(() => `travel_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const createEventId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  };

  const handleUpdates = (chunk: unknown) => {
    if (!chunk || typeof chunk !== "object") {
      return;
    }

    const entries: ToolEvent[] = [];
    for (const [node, payload] of Object.entries(
      chunk as Record<string, unknown>
    )) {
      if (node === "__metadata__") continue;
      entries.push({
        id: createEventId(),
        node,
        payload,
        timestamp: Date.now(),
      });
    }

    if (entries.length === 0) return;

    setToolEvents((prev) => {
      const merged = [...prev, ...entries];
      const MAX_LEN = 12;
      return merged.slice(-MAX_LEN);
    });
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMessage: MessageItem = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setStatus("running");

    try {
      const response = await fetch("/api/travel/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: content, threadId }),
      });

      if (!response.ok) {
        throw new Error("请求失败");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim());

          for (const line of lines) {
            try {
              const { mode, chunk: data } = JSON.parse(line);
              if (mode === "updates") {
                handleUpdates(data);
                continue;
              }
              if (mode === "messages" && Array.isArray(data) && data.length > 0) {
                const messageChunk = data[0];
                const textChunk = messageChunk?.kwargs?.content;
                if (textChunk) {
                  assistantMessage += textChunk;
                  setMessages((prev) => {
                    const next = [...prev];
                    const last = next[next.length - 1];
                    if (last && last.role === "assistant") {
                      next[next.length - 1] = {
                        role: "assistant",
                        content: assistantMessage,
                      };
                    } else {
                      next.push({ role: "assistant", content: assistantMessage });
                    }
                    return next;
                  });
                }
              }
            } catch (error) {
              console.error("解析流式响应失败:", error, line);
            }
          }
        }
      }

      setStatus("idle");
    } catch (error) {
      console.error("发送消息错误:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "抱歉，旅行助手暂时不可用，请稍后重试。",
        },
      ]);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-slate-900/70 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/80">
            LangChain · Travel Agent
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
            AI 旅行规划助手
          </h1>
          <p className="mt-3 max-w-3xl text-base text-white/80">
            基于 LangChain 1.0、旅行工具集以及 ai-elements UI。
            支持天气、搜索、MCP 情报、费用计算与货币换算，帮助你在浏览器中快速验证旅行 Agent
            的真实场景。
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <div className="space-y-4">
            <Plan className="border-white/10 bg-slate-900/70" defaultOpen>
              <PlanHeader>
                <div>
                  <PlanTitle>工作流程</PlanTitle>
                  <PlanDescription>
                    旅行 Agent 会按步骤获取天气、调用 MCP/搜索、计算费用并给出建议。你可以根据需要调整提示词。
                  </PlanDescription>
                </div>
                <PlanTrigger />
              </PlanHeader>
              <PlanContent>
                <ul className="space-y-2 text-sm text-white/80">
                  {workflowHighlights.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </PlanContent>
            </Plan>

            <Task className="rounded-3xl border border-white/10 bg-white/5 p-4" defaultOpen>
              <TaskTrigger title="常见问题 & 实战技巧" />
              <TaskContent>
                {referenceTasks.map((task) => (
                  <TaskItem key={task.title}>
                    <p className="font-semibold text-white">{task.title}</p>
                    <p className="text-white/80">{task.detail}</p>
                  </TaskItem>
                ))}
              </TaskContent>
            </Task>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-4 shadow-lg">
              <p className="text-sm uppercase tracking-widest text-white/70">
                快速提示
              </p>
              <p className="mt-2 text-sm text-white/80">
                点击下方建议即可填充输入框，按 Enter 或发送按钮运行。
              </p>
              <div className="mt-4">
                <Suggestions>
                  {scenarioSuggestions.map((scenario) => (
                    <Suggestion
                      key={scenario.label}
                      suggestion={scenario.prompt}
                      className="bg-white/10 text-white hover:bg-white/20"
                      onClick={(next) => setInput(next)}
                    >
                      {scenario.label}
                    </Suggestion>
                  ))}
                </Suggestions>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-white/60">
                  对话板
                </p>
                <p className="text-white/90">Thread: {threadId}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {status === "running" && (
                  <>
                    <Loader size={14} />
                    <span>生成旅行方案...</span>
                  </>
                )}
                {status === "error" && <span className="text-red-300">请求失败</span>}
                {status === "idle" && <span className="text-white/70">待命中</span>}
              </div>
            </div>

            <Conversation className="flex-1">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  title="暂无对话"
                  description="告诉我你的出行计划，Agent 会结合工具生成行程与预算。"
                  className="text-white/80"
                />
              ) : (
                <ConversationContent>
                  {messages.map((message, index) => (
                    <Message key={`${message.role}-${index}`} from={message.role}>
                      <MessageContent>
                        <p className="whitespace-pre-wrap text-sm text-white">
                          {message.content}
                        </p>
                      </MessageContent>
                    </Message>
                  ))}
                  <div ref={messagesEndRef} />
                </ConversationContent>
              )}
              <ConversationScrollButton />
            </Conversation>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-widest text-white/70">
            输入旅行计划
          </p>
          <p className="mt-1 text-sm text-white/70">
            支持 Enter 发送，Shift+Enter 换行。可粘贴任意背景信息（预算、成员、偏好等）。
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="例如：国庆去首尔 4 天，预算 8000 人民币，想体验美食+购物+附近温泉..."
            disabled={loading}
            className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="rounded-full bg-blue-500 px-6 text-white hover:bg-blue-600 disabled:bg-white/30"
            >
              {loading ? "生成中..." : "发送"}
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/30 text-white hover:bg-white/10"
              type="button"
              onClick={() => {
                setMessages([]);
                setInput("");
                setToolEvents([]);
              }}
            >
              清空对话
            </Button>
            <Suggestions className="flex-1">
              {scenarioSuggestions.map((scenario) => (
                <Suggestion
                  key={`input-${scenario.label}`}
                  suggestion={scenario.prompt}
                  className="bg-white/5 text-white hover:bg-white/20"
                  onClick={(next) => setInput(next)}
                >
                  {scenario.label}
                </Suggestion>
              ))}
            </Suggestions>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/70">
                工具调用追踪
              </p>
              <p className="text-xs text-white/60">
                捕获 LangChain 节点（get_weather / search_google / travel_intel_mcp 等）的实时输出，方便调试。
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-white hover:bg-white/10"
              onClick={() => setToolEvents([])}
              disabled={!toolEvents.length}
            >
              清空记录
            </Button>
          </div>
          <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
            {toolEvents.length === 0 ? (
              <p className="text-sm text-white/60">
                尚未收到工具输出。运行一个旅行计划后，天气、搜索、MCP、货币换算等节点的输入输出会显示在这里。
              </p>
            ) : (
              [...toolEvents]
                .reverse()
                .map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/50 p-3"
                  >
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>{event.node}</span>
                      <span>
                        {new Date(event.timestamp).toLocaleTimeString("zh-CN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="mt-2">
                      <CodeBlock
                        code={JSON.stringify(event.payload, null, 2)}
                        language="json"
                        className="[&>div]:border-white/5 [&>div]:bg-slate-900/60"
                      />
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
