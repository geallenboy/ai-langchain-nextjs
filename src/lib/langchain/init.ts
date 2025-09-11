import { createAgent, tool } from "langchain";

const getWeather = tool((city: string) => `It's always sunny in ${city}!`, {
    name: "get_weather",
    description: "Get the weather for a given city",
});

const agent = createAgent({
    model: "anthropic:claude-3-7-sonnet-latest",
    tools: [getWeather],
});

console.log(
    await agent.invoke({
        messages: [{ role: "user", content: "What's the weather in Tokyo?" }],
    })
);