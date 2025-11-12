"use client";

import { useState } from "react";

interface DemoButton {
    type: string;
    label: string;
    description: string;
    color: string;
}

export default function SimpleLearnPage() {
    const [output, setOutput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const runExample = async (exampleType: string) => {
        setLoading(true);
        setOutput("正在运行示例...");

        try {
            const response = await fetch(`/api/learning/examples/${exampleType}`, {
                method: "POST",
            });

            const data = await response.json();
            setOutput(data.result || data.error);
        } catch (error) {
            setOutput(`错误: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const basicDemos: DemoButton[] = [
        {
            type: "test-connection",
            label: "测试连接",
            description: "验证 OpenAI API 配置",
            color: "bg-blue-500 hover:bg-blue-600"
        },
        {
            type: "simple-chat",
            label: "简单聊天",
            description: "基础单轮对话",
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            type: "simple-history",
            label: "历史对话",
            description: "多轮对话示例",
            color: "bg-purple-500 hover:bg-purple-600"
        }
    ];

    const advancedDemos: DemoButton[] = [
        {
            type: "tool-calling",
            label: "工具调用",
            description: "AI 调用计算器和天气工具",
            color: "bg-orange-500 hover:bg-orange-600"
        },
        {
            type: "structured-output",
            label: "结构化输出",
            description: "返回 JSON 格式数据",
            color: "bg-pink-500 hover:bg-pink-600"
        },
        {
            type: "conversation",
            label: "多轮对话",
            description: "上下文管理示例",
            color: "bg-indigo-500 hover:bg-indigo-600"
        },
        {
            type: "prompt-template",
            label: "提示词模板",
            description: "动态提示词生成",
            color: "bg-teal-500 hover:bg-teal-600"
        },
        {
            type: "simple-agent",
            label: "简单 Agent",
            description: "推理和工具使用",
            color: "bg-red-500 hover:bg-red-600"
        }
    ];

    return (
        <div className="container mx-auto p-8 font-sans max-w-7xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-gray-900">LangChain 学习中心</h1>
                <p className="text-gray-600">探索 LangChain 1.0 的核心功能和实用示例</p>
            </div>

            <div className="space-y-8">
                {/* 基础示例 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">基础示例</h2>
                    <p className="text-gray-600 mb-4 text-sm">开始学习 LangChain 的基本功能</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {basicDemos.map((demo) => (
                            <button
                                key={demo.type}
                                onClick={() => runExample(demo.type)}
                                disabled={loading}
                                className={`${demo.color} disabled:bg-gray-400 text-white px-6 py-4 rounded-lg transition-colors text-left`}
                            >
                                <div className="font-semibold mb-1">{demo.label}</div>
                                <div className="text-xs opacity-90">{demo.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* 进阶示例 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">进阶示例</h2>
                    <p className="text-gray-600 mb-4 text-sm">探索 LangChain 的高级特性</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {advancedDemos.map((demo) => (
                            <button
                                key={demo.type}
                                onClick={() => runExample(demo.type)}
                                disabled={loading}
                                className={`${demo.color} disabled:bg-gray-400 text-white px-6 py-4 rounded-lg transition-colors text-left`}
                            >
                                <div className="font-semibold mb-1">{demo.label}</div>
                                <div className="text-xs opacity-90">{demo.description}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 输出区域 */}
            <div className="mt-8 bg-gray-50 rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">输出结果</h2>
                    {loading && (
                        <div className="flex items-center gap-2 text-blue-600">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            <span className="text-sm">运行中...</span>
                        </div>
                    )}
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-white p-6 rounded-lg border border-gray-300 text-gray-900 font-mono max-h-96 overflow-y-auto">
                    {output || "👆 点击上方按钮运行示例，结果将显示在这里"}
                </pre>
            </div>

            {/* 快速开始指南 */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">快速开始指南</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl mb-2">🔑</div>
                        <h4 className="font-semibold mb-2">1. 配置 API Key</h4>
                        <p>在 <code className="bg-gray-100 px-2 py-1 rounded text-xs">.env.local</code> 中设置 <code className="bg-gray-100 px-2 py-1 rounded text-xs">OPENAI_API_KEY</code></p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl mb-2">✅</div>
                        <h4 className="font-semibold mb-2">2. 测试连接</h4>
                        <p>点击"测试连接"按钮验证配置是否正确</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-2xl mb-2">🚀</div>
                        <h4 className="font-semibold mb-2">3. 探索示例</h4>
                        <p>从基础到进阶，逐步了解 LangChain 的强大功能</p>
                    </div>
                </div>
            </div>

            {/* 功能说明 */}
            <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">示例说明</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">工具调用 (Tool Calling)</h4>
                        <p className="text-gray-600">展示如何让 AI 调用自定义工具，如计算器和天气查询</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">结构化输出 (Structured Output)</h4>
                        <p className="text-gray-600">从文本中提取结构化数据，返回 JSON 格式结果</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">多轮对话 (Conversation)</h4>
                        <p className="text-gray-600">演示如何维护对话上下文，实现连贯的多轮交互</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">提示词模板 (Prompt Template)</h4>
                        <p className="text-gray-600">使用模板动态生成提示词，实现代码审查功能</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">简单 Agent</h4>
                        <p className="text-gray-600">展示 Agent 如何推理、决策并使用工具完成任务</p>
                    </div>
                </div>
            </div>
        </div>
    );
}