"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function TravelPlannerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [threadId] = useState(() => `thread_${Date.now()}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/travel/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text, threadId }),
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

              if (mode === "messages") {
                // 处理流式token
                // data 是一个数组，第一个元素是消息对象
                if (Array.isArray(data) && data.length > 0) {
                  const messageChunk = data[0];
                  if (messageChunk?.kwargs?.content) {
                    assistantMessage += messageChunk.kwargs.content;
                    setMessages((prev) => {
                      const newMessages = [...prev];
                      const lastMsg = newMessages[newMessages.length - 1];
                      if (lastMsg && lastMsg.role === "assistant") {
                        lastMsg.content = assistantMessage;
                      } else {
                        newMessages.push({ role: "assistant", content: assistantMessage });
                      }
                      return newMessages;
                    });
                  }
                }
              }
            } catch (e) {
              console.error("解析错误:", e, line);
            }
          }
        }
      }
    } catch (error) {
      console.error("发送消息错误:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "抱歉，发生了错误，请重试。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const exampleScenarios = [
    {
      label: "国内周边游",
      prompt: "我想这周末去杭州玩2天，住如家快捷酒店（大概300元/晚），看西湖和灵隐寺，预算1500元够吗？",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "出境游计划",
      prompt: "我想去泰国曼谷5天，预算5000元人民币，推荐性价比高的酒店和行程",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      label: "预算对比",
      prompt: "比较一下去海南三亚5天和去泰国普吉岛5天，哪个更划算？都是中等消费水平",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900">AI旅行规划助手</h1>
        <p className="text-gray-600 text-sm mt-1">
          告诉我你的旅行计划，我会帮你查天气、搜索信息、计算预算
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full p-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-lg p-6 mb-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="text-6xl mb-4">✈️</div>
              <h2 className="text-2xl font-semibold mb-2">开始你的旅行规划</h2>
              <p className="text-center mb-6">
                点击下方示例场景，或直接输入你的问题
              </p>

              {/* Example Scenarios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                {exampleScenarios.map((scenario, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(scenario.prompt)}
                    disabled={loading}
                    className={`${scenario.color} disabled:bg-gray-400 text-white px-6 py-4 rounded-lg transition-all transform hover:scale-105 text-left shadow-md`}
                  >
                    <div className="font-semibold mb-2">{scenario.label}</div>
                    <div className="text-xs opacity-90">{scenario.prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span className="text-gray-600">AI正在思考...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="输入你的旅行计划..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors font-semibold"
            >
              发送
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setMessages([]);
                  setInput("");
                }}
                className="text-xs px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              >
                清空对话
              </button>
              {exampleScenarios.map((scenario, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(scenario.prompt)}
                  disabled={loading}
                  className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors disabled:opacity-50"
                >
                  {scenario.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 text-center text-sm text-gray-600">
        <p>
          支持的功能: 🌤️ 天气查询 | 🔍 信息搜索 | 🧮 费用计算 | 📅 行程规划
        </p>
      </div>
    </div>
  );
}
