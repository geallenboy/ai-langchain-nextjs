/**
 * 学习示例 API
 * 执行各种 LangChain 学习示例
 */

import { NextRequest, NextResponse } from "next/server";
import {
  simpleChatDemo,
  simpleChatWithHistory,
  testModelConnection,
  toolCallingDemo,
  structuredOutputDemo,
  conversationDemo,
  promptTemplateDemo,
  simpleAgentDemo,
} from "@/modules/learning";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;

    console.log(`运行学习示例: ${type}`);

    let result: string;

    switch (type) {
      case "simple-chat":
        result = await simpleChatDemo();
        break;
      case "simple-history":
        result = await simpleChatWithHistory();
        break;
      case "test-connection":
        result = await testModelConnection();
        break;
      case "tool-calling":
        result = await toolCallingDemo();
        break;
      case "structured-output":
        result = await structuredOutputDemo();
        break;
      case "conversation":
        result = await conversationDemo();
        break;
      case "prompt-template":
        result = await promptTemplateDemo();
        break;
      case "simple-agent":
        result = await simpleAgentDemo();
        break;
      default:
        return NextResponse.json(
          { error: `未知的示例类型: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ result, type });
  } catch (error) {
    console.error("示例运行错误:", error);
    return NextResponse.json(
      { error: `示例运行失败: ${error}` },
      { status: 500 }
    );
  }
}
