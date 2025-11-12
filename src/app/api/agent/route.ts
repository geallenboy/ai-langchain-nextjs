/**
 * 旧API路由 - 为向后兼容保留
 * @deprecated 请使用 /api/travel/agent
 */

import { travelAgent } from "@/modules/travel";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { input, threadId, context } = await req.json();

  // 多种流模式并行：updates(步骤更新) + messages(LLM tokens) + custom(自定义writer)
  const stream = await travelAgent.stream(
    { messages: [{ role: "user", content: String(input ?? "") }] },
    {
      streamMode: ["updates", "messages", "custom"],
      configurable: { thread_id: String(threadId ?? "default") },
      context: context ?? {}, // 可传 user_id 等，工具里能拿到
    }
  );

  const encoder = new TextEncoder();
  const rs = new ReadableStream({
    async start(controller) {
      for await (const [mode, chunk] of stream) {
        controller.enqueue(encoder.encode(JSON.stringify({ mode, chunk }) + "\n"));
      }
      controller.close();
    },
  });

  return new Response(rs, { headers: { "Content-Type": "application/x-ndjson" } });
}
