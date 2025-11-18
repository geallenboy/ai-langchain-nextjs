"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
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
  Suggestions,
  Suggestion,
} from "@/components/ai-elements/suggestion";
import { Loader } from "@/components/ai-elements/loader";
import { cn } from "@/lib/utils";

type DemoMessage = {
  id: string;
  role: "user" | "assistant";
  heading?: string;
  content: string;
};

export type DemoDefinition = {
  type: string;
  title: string;
  description: string;
  objective: string;
  callouts?: string[];
};

type StageHighlight = {
  title: string;
  detail: string;
};

type QuickAction = {
  label: string;
  demoType: string;
};

export type DemoWorkbenchProps = {
  stageTitle: string;
  stageDescription: string;
  stageHighlights?: StageHighlight[];
  demos: DemoDefinition[];
  quickActions?: QuickAction[];
  emptyState?: {
    title: string;
    description: string;
  };
};

const createId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export function DemoWorkbench({
  stageTitle,
  stageDescription,
  stageHighlights,
  demos,
  quickActions,
  emptyState = {
    title: "选择一个示例",
    description:
      "从左侧任务卡片中选择并运行一个 Demo，输出会实时呈现在这里。",
  },
}: DemoWorkbenchProps) {
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [messages, setMessages] = useState<DemoMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const currentDemo = useMemo(
    () => demos.find((demo) => demo.type === selectedDemo),
    [demos, selectedDemo]
  );

  const runDemo = async (type: string) => {
    const demo = demos.find((item) => item.type === type);
    if (!demo) return;

    setSelectedDemo(type);
    setIsRunning(true);

    const introMessage: DemoMessage = {
      id: createId(),
      role: "user",
      heading: `执行 ${demo.title}`,
      content: `${demo.objective}\n\n${demo.description}`,
    };

    setMessages([introMessage]);

    try {
      const response = await fetch(`/api/learning/examples/${type}`, {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "示例运行失败");
      }

      const outputMessage: DemoMessage = {
        id: createId(),
        role: "assistant",
        heading: "LangChain 输出",
        content: String(data.result ?? "没有返回内容"),
      };

      setMessages((prev) => [...prev, outputMessage]);
    } catch (error) {
      const errorMessage: DemoMessage = {
        id: createId(),
        role: "assistant",
        heading: "运行出错",
        content: error instanceof Error ? error.message : String(error),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Plan
          className="border-white/10 bg-slate-900/50 text-white"
          defaultOpen
          isStreaming={isRunning}
        >
          <PlanHeader>
            <div className="space-y-2">
              <PlanTitle>{stageTitle}</PlanTitle>
              <PlanDescription>{stageDescription}</PlanDescription>
            </div>
            <PlanAction>
              <PlanTrigger />
            </PlanAction>
          </PlanHeader>
          {stageHighlights && (
            <PlanContent>
              <div className="space-y-4 text-sm text-slate-200">
                {stageHighlights.map((highlight) => (
                  <div
                    key={highlight.title}
                    className="rounded-xl border border-white/10 bg-white/5 p-3"
                  >
                    <p className="font-semibold text-white">
                      {highlight.title}
                    </p>
                    <p className="text-slate-200/90">{highlight.detail}</p>
                  </div>
                ))}
              </div>
            </PlanContent>
          )}
          {quickActions && quickActions.length > 0 && (
            <PlanFooter className="flex w-full flex-wrap gap-2 border-t border-white/5 pt-3">
              <Suggestions className="w-full">
                {quickActions.map((action) => (
                  <Suggestion
                    key={action.demoType}
                    suggestion={action.label}
                    onClick={() => runDemo(action.demoType)}
                    className="bg-white/10 text-white hover:bg-white/20"
                  />
                ))}
              </Suggestions>
            </PlanFooter>
          )}
        </Plan>

        <div className="relative flex min-h-[420px] flex-col rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                当前 Demo
              </p>
              <p className="text-base font-semibold text-white">
                {currentDemo ? currentDemo.title : "未选择"}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "border-white/10 bg-white/10 text-white",
                isRunning && "animate-pulse"
              )}
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <Loader size={14} /> 运行中
                </span>
              ) : (
                "待命"
              )}
            </Badge>
          </div>
          <Conversation className="flex-1">
            {messages.length === 0 ? (
              <ConversationEmptyState
                title={emptyState.title}
                description={emptyState.description}
                className="text-white/80"
              />
            ) : (
              <ConversationContent>
                {messages.map((message) => (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {message.heading && (
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          {message.heading}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap text-sm text-white">
                        {message.content}
                      </p>
                    </MessageContent>
                  </Message>
                ))}
              </ConversationContent>
            )}
            <ConversationScrollButton />
          </Conversation>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          demos.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
        )}
      >
        {demos.map((demo) => (
          <Task
            key={demo.type}
            defaultOpen={demo.type === demos[0]?.type}
            className={cn(
              "rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-white shadow-lg backdrop-blur",
              selectedDemo === demo.type && "border-primary/60 shadow-primary/20"
            )}
          >
            <div className="flex items-start justify-between">
              <TaskTrigger title={demo.title} />
              <Button
                size="sm"
                className="rounded-full bg-white/20 text-white hover:bg-white/30"
                onClick={() => runDemo(demo.type)}
                disabled={isRunning && selectedDemo === demo.type}
              >
                {isRunning && selectedDemo === demo.type ? "运行中..." : "运行"}
              </Button>
            </div>
            <TaskContent>
              <TaskItem className="text-white/80">{demo.objective}</TaskItem>
              <TaskItem>{demo.description}</TaskItem>
              {demo.callouts && demo.callouts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {demo.callouts.map((callout) => (
                    <Badge
                      key={callout}
                      variant="secondary"
                      className="bg-white/10 text-white"
                    >
                      {callout}
                    </Badge>
                  ))}
                </div>
              )}
            </TaskContent>
          </Task>
        ))}
      </div>
    </div>
  );
}
