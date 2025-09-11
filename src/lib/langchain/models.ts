import { initChatModel } from "langchain/chat_models";

const model = await initChatModel(
    "anthropic:claude-3-7-sonnet-latest",
    "temperature": 0
);