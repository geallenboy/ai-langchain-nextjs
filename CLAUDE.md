# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于Next.js 16和LangChain的AI应用学习项目，使用TypeScript开发。项目集成了LangChain框架用于构建AI代理和工具，使用Tailwind CSS 4进行样式设计。

**重要提示**: 项目当前处于简化版本。完整版示例文件（如`basic-chat.ts`、`tools-examples.ts`等）已备份，因为LangChain 1.0-alpha API变更需要适配。

## 核心依赖

- **Next.js 16.0.1**: 使用App Router架构和Turbopack
- **LangChain 1.0.3**: AI代理框架核心包
  - `@langchain/openai 1.0.0`: OpenAI集成
  - `@langchain/langgraph 1.0.1`: 图状态管理和工作流
  - `@langchain/core 1.0.3`: 核心抽象和工具
  - `@langchain/classic 1.0.1`: 经典API兼容
- **React 19.2.0**: 最新版本React
- **TypeScript 5**: 类型系统
- **Tailwind CSS 4**: 样式框架
- **Zod 4.1.5**: 模式验证和工具参数验证

## 开发命令

```bash
# 启动开发服务器（使用Turbopack）
pnpm dev

# 构建生产版本（使用Turbopack）
pnpm build

# 启动生产服务器
pnpm start
```

## 项目架构

### 目录结构
```
src/
├── app/
│   ├── page.tsx              # 主页
│   ├── layout.tsx            # 全局布局
│   ├── learn/
│   │   ├── page.tsx          # 学习页面（简化版，正在使用）
│   │   └── page-full.tsx     # 完整版页面（备用）
│   └── api/
│       ├── agent/
│       │   └── route.ts      # Agent流式API端点
│       └── examples/[type]/
│           └── route.ts      # 示例执行API端点
├── agents/
│   └── agent.ts              # LangGraph代理定义
└── lib/langchain/
    ├── models.ts             # ChatOpenAI模型配置
    ├── prompt.ts             # 系统提示词
    ├── init.ts.backup        # Agent初始化（备份）
    ├── tools.ts.backup       # 工具定义（备份）
    └── examples/
        └── simple-demo.ts    # 简单示例（当前使用）
```

### 核心组件说明

#### 1. Agent架构 (`src/agents/agent.ts`)
- 使用`createAgent()`创建LangGraph代理
- 配置工具（如search工具示例）
- 使用`MemorySaver`作为内存检查点
- 系统提示词定义代理行为

#### 2. API路由
- **`/api/agent`**: POST端点，处理Agent流式响应
  - 支持多种流模式: `updates`、`messages`、`custom`
  - 使用线程ID管理会话状态
  - 返回NDJSON格式的流式数据
- **`/api/examples/[type]`**: POST端点，执行学习示例
  - 支持类型: `test-connection`, `simple-chat`, `simple-history`

#### 3. 当前示例 (`simple-demo.ts`)
- **testModelConnection**: 测试OpenAI API连接
- **simpleChatDemo**: 基础单轮对话
- **simpleChatWithHistory**: 多轮对话带历史记录

#### 4. 模型配置 (`models.ts`)
- 默认模型: `gpt-4o`
- Temperature: 0（确定性输出）
- 可根据需要调整模型参数

### 技术特性

- **流式响应**: Agent API支持实时流式输出
- **状态管理**: 使用LangGraph管理对话状态和检查点
- **工具系统**: 使用Zod进行类型安全的工具参数验证
- **线程管理**: 通过thread_id实现多会话隔离
- **模块化设计**: 代理、工具、示例分离，易于扩展
- **类型安全**: 完整的TypeScript类型定义

## 环境配置

### 必需的环境变量
在`.env.local`文件中配置：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

获取API密钥：访问 [OpenAI Platform](https://platform.openai.com) → API Keys → Create new secret key

## 开发工作流

### 添加新工具
1. 在`src/agents/agent.ts`中使用`tool()`函数定义工具
2. 使用Zod定义工具参数schema
3. 在`createAgent`的tools数组中注册工具
4. 更新系统提示词说明工具用途

示例：
```typescript
const myTool = tool(
  ({ param }) => {
    // 工具实现
    return result;
  },
  {
    name: "tool_name",
    description: "工具描述",
    schema: z.object({
      param: z.string().describe("参数说明")
    }),
  }
);
```

### 添加新示例
1. 在`src/lib/langchain/examples/`中创建新示例文件
2. 导出async函数，返回字符串结果
3. 在`src/app/api/examples/[type]/route.ts`添加路由处理
4. 在学习页面添加对应按钮

### 修改Agent行为
- 编辑`src/agents/agent.ts`中的systemPrompt
- 调整模型参数（model, temperature）
- 配置不同的checkpointer（MemorySaver, 或持久化方案）

### 处理流式响应
Agent API返回NDJSON格式，每行是一个JSON对象：
```typescript
{ mode: "updates" | "messages" | "custom", chunk: any }
```

## 常见开发任务

### 切换模型
编辑`src/lib/langchain/models.ts`或`src/agents/agent.ts`中的model参数：
- `gpt-4o`: 最新GPT-4优化版本
- `gpt-4o-mini`: 快速轻量版本
- `gpt-4`: 标准GPT-4

### 调整响应风格
修改temperature参数：
- `0`: 确定性、一致性输出
- `0.7`: 平衡创造性和准确性
- `1.0+`: 更有创造性、多样性

### 实现持久化记忆
替换`MemorySaver`为持久化方案：
- PostgreSQL: 使用`@langchain/langgraph-checkpoint-postgres`
- SQLite: 使用`@langchain/langgraph-checkpoint-sqlite`
- Redis: 实现自定义checkpointer

## 项目状态说明

当前项目是**简化版本**，原因：
- LangChain从alpha版本升级到1.0正式版，API有重大变更
- 完整版示例文件已备份（`.backup`后缀）
- 简化版使用最新API，稳定可运行

恢复完整版本：
1. 参考`TROUBLESHOOTING.md`了解兼容性问题
2. 根据LangChain 1.0文档更新API调用
3. 测试工具定义、代理创建等功能

## 架构决策

### 为什么使用LangGraph？
- 提供状态管理和检查点机制
- 支持复杂的多步骤工作流
- 更好的对话历史和记忆管理
- 适合构建生产级AI应用

### 为什么分离agents和lib/langchain？
- `agents/`: 面向应用的完整代理实现
- `lib/langchain/`: 学习示例和可复用组件
- 清晰分离学习代码和生产代码

### API路由设计
- `/api/agent`: 生产级代理端点，支持流式和状态管理
- `/api/examples/[type]`: 学习示例端点，简单易懂