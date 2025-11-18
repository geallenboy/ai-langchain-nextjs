# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modular Next.js 16 + LangChain 1.0 learning platform demonstrating AI agent development. Features two primary modules: a **Learning Module** with progressive LangChain examples, and a **Travel Module** showcasing a production-ready AI travel planning assistant.

## Development Commands

```bash
# Start development server with Turbopack
pnpm dev

# Build for production (includes type checking)
pnpm build

# Start production server
pnpm start
```

Always run `pnpm build` before creating a pull request to verify types and bundle integrity.

## Core Dependencies

- **Next.js 16.0.1**: App Router with Turbopack
- **LangChain 1.0.3**: AI framework with official 1.0 release APIs
  - `@langchain/openai 1.0.0`: OpenAI integration
  - `@langchain/langgraph 1.0.1`: State management and workflows
  - `@langchain/core 1.0.3`: Core abstractions
  - `@langchain/classic 1.0.1`: Classic API compatibility
- **React 19.2.0** + **TypeScript 5**
- **Tailwind CSS 4** with custom AI component library
- **Zod 4.1.5**: Runtime validation for tool schemas

## Modular Architecture

The codebase follows a strict modular pattern with clear separation between learning materials and production code:

```
src/
├── modules/                       # Self-contained feature modules
│   ├── learning/                  # Learning examples module
│   │   ├── examples/             # Progressive LangChain demos
│   │   │   ├── simple-demo.ts   # Basic chat, history, connection test
│   │   │   └── comprehensive-demo.ts  # Tools, agents, structured output
│   │   ├── config.ts            # Example registry and model config
│   │   ├── index.ts             # Module exports
│   │   └── README.md            # Module documentation
│   │
│   └── travel/                   # Production travel planning module
│       ├── agents/               # Agent definitions
│       │   ├── index.ts         # Main travel agent (LangGraph)
│       │   └── travel-agent.ts  # Alternative implementation
│       ├── tools/               # Reusable tool collection
│       │   ├── weather.ts       # Weather API (OpenWeatherMap)
│       │   ├── search.ts        # Search API (Serper/mock)
│       │   ├── calculator.ts    # Math operations
│       │   ├── currency.ts      # Currency conversion
│       │   ├── mcp-bridge.ts    # MCP protocol integration
│       │   └── index.ts         # Tool exports
│       ├── config.ts            # Agent system prompt and model
│       ├── index.ts             # Module exports
│       └── README.md            # Module documentation
│
├── app/                          # Next.js App Router pages
│   ├── learn/                   # Learning center UI
│   │   ├── _components/        # Learning-specific components
│   │   ├── foundations/page.tsx
│   │   ├── tools/page.tsx
│   │   ├── agents/page.tsx
│   │   └── page.tsx            # Main learning hub
│   ├── travel/page.tsx         # Travel assistant UI
│   └── api/
│       ├── learning/examples/[type]/route.ts  # Learning examples API
│       └── travel/agent/route.ts              # Travel agent streaming API
│
├── components/
│   ├── ui/                     # shadcn/ui base components
│   └── ai-elements/            # Custom AI UX components
│       ├── conversation.tsx    # Chat message display
│       ├── reasoning.tsx       # Chain-of-thought visualization
│       ├── tool.tsx           # Tool call display
│       ├── plan.tsx           # Agent planning UI
│       └── ...                # 20+ AI-specific components
│
└── lib/utils.ts               # Shared utilities (cn, etc.)
```

### Module Import Patterns

```typescript
// Learning module - import examples and config
import { simpleChatDemo, toolCallingDemo, learningConfig } from '@/modules/learning';

// Travel module - import agent and tools
import { travelAgent } from '@/modules/travel';
import { weatherTool, searchTool, currencyTool } from '@/modules/travel/tools';
```

## Key Workflows

### Adding a New Learning Example

1. Create example function in `src/modules/learning/examples/`:
```typescript
export async function myNewDemo(input: string): Promise<string> {
  const model = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });
  const response = await model.invoke(input);
  return response.content;
}
```

2. Register in `src/modules/learning/config.ts`:
```typescript
exampleTypes: {
  "my-new-demo": {
    label: "My New Demo",
    description: "Description here",
    category: "advanced",
  }
}
```

3. Add handler in `src/app/api/learning/examples/[type]/route.ts`

4. Update UI in `src/app/learn/page.tsx` to trigger the new example

### Adding a Tool to Travel Module

1. Create tool file in `src/modules/travel/tools/`:
```typescript
import { tool } from "langchain";
import { z } from "zod";

export const myTool = tool(
  async ({ param }) => {
    // Tool implementation
    return "result";
  },
  {
    name: "my_tool_name",
    description: "Clear description for AI to understand when to use this",
    schema: z.object({
      param: z.string().describe("Parameter description")
    }),
  }
);
```

2. Export from `src/modules/travel/tools/index.ts`:
```typescript
export { myTool } from "./my-tool";
```

3. Register in `src/modules/travel/agents/index.ts`:
```typescript
export const travelAgent = createAgent({
  model,
  tools: [weatherTool, searchTool, myTool], // Add here
  systemPrompt: travelConfig.systemPrompt,
  checkpointer,
});
```

4. Optionally update system prompt in `src/modules/travel/config.ts` to guide tool usage

### Modifying Agent Behavior

Agent configuration lives in module-level `config.ts` files:

```typescript
// src/modules/travel/config.ts
export const travelConfig = {
  model: {
    name: "gpt-4o-mini",    // or "gpt-4o" for better reasoning
    temperature: 0.7,        // 0 = deterministic, 0.7 = balanced, 1.0+ = creative
  },
  systemPrompt: `You are a professional travel planning assistant...`
};
```

### Working with Streaming Responses

Both learning and travel APIs return NDJSON streams:

```typescript
// POST /api/travel/agent or /api/learning/examples/[type]
const response = await fetch('/api/travel/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    input: "Plan a 5-day trip to Bangkok",
    threadId: "user-session-123",
  }),
});

// Parse NDJSON stream
const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (reader) {
  const { done, value } = await reader.read();
  if (done) break;

  const line = decoder.decode(value);
  const { mode, chunk } = JSON.parse(line);

  // mode: "updates" | "messages" | "custom"
  // chunk: actual data (tool calls, LLM tokens, etc.)
}
```

## Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```env
# Required
OPENAI_API_KEY=sk-...

# Optional (tools gracefully degrade to mock data)
OPENWEATHERMAP_API_KEY=...    # Weather tool
SERPER_API_KEY=...             # Search tool

# Optional (for MCP integration)
TRAVEL_MCP_ENDPOINT=https://your-mcp-gateway/tools
TRAVEL_MCP_TOOL=travel.intel
TRAVEL_CURRENCY_RATES='{"CNY":1,"USD":7.15,"THB":0.21}'  # JSON string

# Optional (debugging)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=...
LANGCHAIN_PROJECT=langchain-nextjs-tutorial
```

## AI Elements Component Library

Located in `src/components/ai-elements/`, this is a collection of 20+ React components for building AI UX:

- **Conversation**: `<Conversation>` - Multi-turn chat display
- **Reasoning**: `<Reasoning>` - Chain-of-thought visualization
- **Tool**: `<Tool>` - Tool call rendering
- **Plan**: `<Plan>` - Agent planning steps
- **Artifact**: `<Artifact>` - Code/content artifacts
- **CodeBlock**: `<CodeBlock>` - Syntax highlighting with Shiki
- **Message**: `<Message>` - Individual chat message
- **Checkpoint**: `<Checkpoint>` - State snapshots
- **Node/Edge**: `<Node>`, `<Edge>` - Graph visualization
- ...and more

These components work with LangChain streaming outputs and can be composed to build rich agent interfaces.

## Architecture Decisions

### Why Modular Structure?

- **Learning Module** (`src/modules/learning/`): Safe experimentation space with progressive examples
- **Travel Module** (`src/modules/travel/`): Production-ready reference implementation
- Each module is self-contained with its own `config.ts`, `README.md`, and exports
- Tools and agents can be imported independently for reuse

### Why LangGraph?

- Built-in state management with checkpointers (`MemorySaver`, PostgreSQL, SQLite)
- Multi-turn conversation memory via `thread_id`
- Complex multi-agent workflows and tool orchestration
- Production-grade observability and debugging

### Why MCP Bridge?

The `travel_intel_mcp` tool demonstrates Model Context Protocol integration:
- Allows calling external MCP servers via HTTP gateway
- Enables enterprise API integration (inventory, pricing, etc.)
- Gracefully falls back to mock data when endpoint unavailable

## Common Tasks

### Switching Models

```typescript
// In module config.ts
model: {
  name: "gpt-4o",        // Best reasoning
  name: "gpt-4o-mini",   // Fast and cheap (recommended for development)
  temperature: 0,         // Deterministic
  temperature: 0.7,       // Balanced (recommended for travel agent)
}
```

### Implementing Persistent Memory

Replace `MemorySaver` in agent creation:

```typescript
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

const checkpointer = new PostgresSaver({
  connectionString: process.env.DATABASE_URL,
});

const agent = createAgent({ model, tools, systemPrompt, checkpointer });
```

### Testing Tool Integration

Tools can be tested independently:

```typescript
import { weatherTool } from '@/modules/travel/tools';

const result = await weatherTool.invoke({ location: "Bangkok" });
console.log(result); // Weather data or mock fallback
```

## Documentation Map

- **Project Root**:
  - `README.md` - Getting started guide
  - `AGENTS.md` - Agent development guidelines
  - `CLAUDE.md` - This file

- **Module Documentation**:
  - `src/modules/learning/README.md` - Learning path and examples
  - `src/modules/travel/README.md` - Travel module deep dive

- **User Guides** (`docs/`):
  - `docs/学习指南/` - Learning module walkthroughs
  - `docs/AI旅行/` - Travel assistant usage guide
  - `docs/REFACTOR_SUMMARY.md` - Migration from v1 to modular architecture

## TypeScript Patterns

- Use 2-space indentation
- Prefer explicit types on exported functions
- Leverage Zod schemas for runtime validation
- Component files: PascalCase (`TravelAgent.tsx`)
- Utility files: camelCase (`utils.ts`)
- Keep module boundaries clean - avoid cross-module direct imports of internals