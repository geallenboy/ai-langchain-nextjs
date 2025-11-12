import { tool } from "langchain";
import { z } from "zod";

/**
 * 乘法计算工具
 * 用于计算总费用（如：每晚价格 × 天数）
 */
export const multiplyTool = tool(
  ({ a, b }) => {
    const result = a * b;
    return `${a} × ${b} = ${result}`;
  },
  {
    name: "multiply",
    description: "计算两个数的乘积，用于计算总费用（如：每晚价格 × 天数）",
    schema: z.object({
      a: z.number().describe("第一个数字"),
      b: z.number().describe("第二个数字")
    }),
  }
);

/**
 * 加法计算工具
 * 用于计算总预算（如：酒店 + 餐饮 + 门票）
 */
export const additionTool = tool(
  ({ numbers }) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const calculation = numbers.join(" + ");
    return `${calculation} = ${sum}`;
  },
  {
    name: "addition",
    description: "计算多个数字的总和，用于计算总预算（如：酒店 + 餐饮 + 门票）",
    schema: z.object({
      numbers: z.array(z.number()).describe("要相加的数字数组")
    }),
  }
);
