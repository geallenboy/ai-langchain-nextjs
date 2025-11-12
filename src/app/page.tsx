"use client";

import Link from "next/link";

export default function Home() {
  const apps = [
    {
      title: "AI旅行规划助手",
      description: "体验AI如何帮你规划旅行、查询天气、计算预算",
      href: "/travel",
      icon: "✈️",
      color: "from-blue-500 to-indigo-600",
      features: ["天气查询", "信息搜索", "预算计算", "行程规划"],
    },
    {
      title: "LangChain学习中心",
      description: "探索LangChain核心功能的实用示例",
      href: "/learn",
      icon: "📚",
      color: "from-green-500 to-teal-600",
      features: ["基础示例", "工具调用", "Agent系统", "多轮对话"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            LangChain + Next.js 学习项目
          </h1>
          <p className="text-gray-600 mt-2">
            基于 LangChain 1.0 和 Next.js 16 的 AI 应用学习平台
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            欢迎来到 AI 学习之旅
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            这是一个完整的 LangChain 学习项目，通过实际案例帮助你理解 AI
            代理（Agent）、工具调用（Tools）和状态管理的核心概念。
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-1">AI代理</h3>
              <p className="text-sm text-gray-600">
                学习如何让AI主动使用工具完成任务
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-semibold text-gray-900 mb-1">工具系统</h3>
              <p className="text-sm text-gray-600">
                理解工具定义和类型安全的参数验证
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-gray-900 mb-1">流式对话</h3>
              <p className="text-sm text-gray-600">
                体验实时流式响应和状态管理
              </p>
            </div>
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {apps.map((app, idx) => (
            <Link
              key={idx}
              href={app.href}
              className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className={`bg-gradient-to-r ${app.color} p-6 text-white`}
              >
                <div className="text-5xl mb-3">{app.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{app.title}</h3>
                <p className="text-white/90">{app.description}</p>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {app.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>开始体验</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-100 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            快速开始
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">配置环境</h3>
              <p className="text-sm text-gray-600 mb-2">
                在 <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> 中配置 API 密钥
              </p>
              <pre className="text-xs bg-gray-50 p-2 rounded border border-gray-200 overflow-x-auto">
                OPENAI_API_KEY=your_key
              </pre>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">启动项目</h3>
              <p className="text-sm text-gray-600 mb-2">运行开发服务器</p>
              <pre className="text-xs bg-gray-50 p-2 rounded border border-gray-200">
                pnpm dev
              </pre>
            </div>
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="font-semibold text-gray-900 mb-2">开始探索</h3>
              <p className="text-sm text-gray-600">
                选择上方应用，开始你的 LangChain 学习之旅
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            技术栈
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js 16", desc: "React框架" },
              { name: "LangChain 1.0", desc: "AI框架" },
              { name: "TypeScript 5", desc: "类型系统" },
              { name: "Tailwind CSS 4", desc: "样式框架" },
            ].map((tech, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">{tech.name}</div>
                <div className="text-sm text-gray-600 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600">
          <p>
            通过实际案例学习 LangChain，掌握 AI 应用开发的核心技能
          </p>
          <p className="text-sm mt-2">
            查看{" "}
            <a
              href="/docs/AI旅行.md"
              className="text-blue-600 hover:underline"
            >
              AI旅行文档
            </a>{" "}
            了解更多
          </p>
        </div>
      </footer>
    </div>
  );
}
