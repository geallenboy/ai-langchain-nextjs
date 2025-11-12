import { tool } from "langchain";
import { z } from "zod";

/**
 * 天气查询工具
 * 支持 OpenWeatherMap API 实时查询，未配置时使用模拟数据
 */
export const weatherTool = tool(
  async ({ location }) => {
    try {
      const apiKey = process.env.OPENWEATHERMAP_API_KEY;

      if (!apiKey) {
        return `天气API未配置。模拟数据: ${location}当前温度28°C，晴天，适合旅游。`;
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=zh_cn`
      );

      if (!response.ok) {
        return `无法获取${location}的天气信息。模拟数据: 温度25°C，晴天。`;
      }

      const data = await response.json();
      const temp = Math.round(data.main.temp);
      const description = data.weather[0].description;
      const humidity = data.main.humidity;

      return `${location}当前天气: 温度${temp}°C，${description}，湿度${humidity}%`;
    } catch (error) {
      return `查询${location}天气时出错。模拟数据: 温度25°C，适合旅游。`;
    }
  },
  {
    name: "get_weather",
    description: "查询指定地点的实时天气信息，包括温度、天气状况和湿度",
    schema: z.object({
      location: z.string().describe("城市名称，例如：北京、曼谷、Bangkok")
    }),
  }
);
