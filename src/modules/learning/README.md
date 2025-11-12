# 学习指南模块

## 📚 模块简介

学习指南模块提供了一系列 LangChain 1.0 的实用示例，从基础到进阶，帮助开发者快速上手 LangChain 框架。

## 🎯 学习目标

通过本模块，你将学会：
- LangChain 的基本概念和使用方法
- 如何定义和使用工具（Tools）
- 结构化输出的实现方式
- 多轮对话的上下文管理
- 提示词模板的设计
- 简单 Agent 的构建

## 📂 目录结构

```
learning/
├── examples/
│   ├── simple-demo.ts           # 基础示例
│   └── comprehensive-demo.ts    # 进阶示例
├── config.ts                    # 模块配置
├── index.ts                     # 导出索引
└── README.md                    # 本文档
```

## 🔧 示例列表

### 基础示例

#### 1. 测试连接 (test-connection)
- **功能**：验证 OpenAI API 配置是否正确
- **适用场景**：初次设置项目时，确认环境变量配置
- **核心概念**：ChatOpenAI 模型初始化

#### 2. 简单聊天 (simple-chat)
- **功能**：单轮对话示例
- **适用场景**：基础的 AI 对话场景
- **核心概念**：模型调用、消息传递

#### 3. 历史对话 (simple-history)
- **功能**：多轮对话，带历史记录
- **适用场景**：需要上下文理解的对话
- **核心概念**：消息历史管理、角色定义

### 进阶示例

#### 4. 工具调用 (tool-calling)
- **功能**：展示 AI 如何调用自定义工具
- **包含工具**：计算器（加减乘除）、天气查询（模拟数据）
- **核心概念**：`tool()` 函数、Zod schema、工具绑定

#### 5. 结构化输出 (structured-output)
- **功能**：从文本中提取结构化数据，返回 JSON 格式
- **适用场景**：信息提取、数据规范化、API 集成
- **核心概念**：`withStructuredOutput()` 方法、类型安全

#### 6. 多轮对话 (conversation)
- **功能**：演示完整的多轮对话流程
- **适用场景**：聊天机器人、客服系统、教学助手
- **核心概念**：消息数组管理、上下文累积

#### 7. 提示词模板 (prompt-template)
- **功能**：使用模板动态生成提示词
- **适用场景**：批量处理、多语言适配、提示词复用
- **核心概念**：函数式提示词、变量替换

#### 8. 简单 Agent (simple-agent)
- **功能**：展示 Agent 如何推理、决策并使用工具
- **适用场景**：研究助手、自动化任务、复杂查询
- **核心概念**：Agent 推理、工具选择、结果整合

## 💻 使用方式

### 通过 Web 界面

访问 http://localhost:3000/learning 查看所有示例

### 通过 API 调用

```typescript
// POST /api/learning/examples/{type}
const response = await fetch('/api/learning/examples/simple-chat', {
  method: 'POST',
});
const data = await response.json();
console.log(data.result);
```

### 直接调用示例函数

```typescript
import { simpleChatDemo } from '@/modules/learning';

const result = await simpleChatDemo();
console.log(result);
```

## ⚙️ 配置说明

### 模型配置

```typescript
// src/modules/learning/config.ts
export const learningConfig = {
  model: {
    name: "gpt-4o-mini",
    temperature: 0, // 确定性输出
  },
};
```

### 添加新示例

1. 在 `examples/` 目录创建新文件
2. 导出 async 函数
3. 在 `config.ts` 注册示例类型
4. 在 API 路由添加处理逻辑

示例代码：

```typescript
// examples/my-demo.ts
export async function myDemo() {
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  const response = await model.invoke([
    new HumanMessage("你的问题")
  ]);

  return String(response.content);
}
```

## 📖 相关文档

- [详细示例说明](../../../docs/学习指南/DEMO_GUIDE.md)
- [设置指南](../../../docs/学习指南/SETUP.md)
- [LangChain 官方文档](https://js.langchain.com/docs)

## 🎓 学习路径

1. **第1天**：基础示例（测试连接、简单聊天、历史对话）
2. **第2-3天**：进阶示例（工具调用、结构化输出、提示词模板）
3. **第4-7天**：高级示例（多轮对话、Agent 系统）
4. **实战项目**：应用到实际场景

## ❓ 常见问题

### Q: API 调用失败？
A: 检查 `.env.local` 中的 `OPENAI_API_KEY` 是否配置正确

### Q: 工具没有被调用？
A: 确保工具描述清晰，让 AI 明白何时使用工具

### Q: 结构化输出格式不对？
A: 检查 Zod schema 定义，确保字段描述清晰

## 🚀 下一步

- 探索 [AI旅行模块](../travel/README.md) 了解实际应用
- 学习 LangGraph 实现复杂工作流
- 构建自己的 LangChain 应用
