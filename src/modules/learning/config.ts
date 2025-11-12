/**
 * 学习指南模块配置
 */

export const learningConfig = {
  // 模型配置
  model: {
    name: "gpt-4o-mini",
    temperature: 0, // 确定性输出，适合学习示例
  },

  // 示例类型定义
  exampleTypes: {
    // 基础示例
    "test-connection": {
      label: "测试连接",
      description: "验证 OpenAI API 配置",
      category: "basic",
    },
    "simple-chat": {
      label: "简单聊天",
      description: "基础单轮对话",
      category: "basic",
    },
    "simple-history": {
      label: "历史对话",
      description: "多轮对话示例",
      category: "basic",
    },

    // 进阶示例
    "tool-calling": {
      label: "工具调用",
      description: "AI 调用计算器和天气工具",
      category: "advanced",
    },
    "structured-output": {
      label: "结构化输出",
      description: "返回 JSON 格式数据",
      category: "advanced",
    },
    "conversation": {
      label: "多轮对话",
      description: "上下文管理示例",
      category: "advanced",
    },
    "prompt-template": {
      label: "提示词模板",
      description: "动态提示词生成",
      category: "advanced",
    },
    "simple-agent": {
      label: "简单 Agent",
      description: "推理和工具使用",
      category: "advanced",
    },
  },
} as const;

export type ExampleType = keyof typeof learningConfig.exampleTypes;
