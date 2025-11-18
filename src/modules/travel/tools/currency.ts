import { tool } from "langchain";
import { z } from "zod";

const DEFAULT_RATES: Record<string, number> = {
  CNY: 1,
  USD: 7.2,
  EUR: 7.9,
  THB: 0.2,
  JPY: 0.048,
  HKD: 0.92,
};

const customRates = (() => {
  try {
    if (!process.env.TRAVEL_CURRENCY_RATES) return null;
    return JSON.parse(process.env.TRAVEL_CURRENCY_RATES) as Record<
      string,
      number
    >;
  } catch {
    return null;
  }
})();

const RATES = {
  ...DEFAULT_RATES,
  ...(customRates ?? {}),
};

const normalizeCode = (code: string) => code.trim().toUpperCase();

const convertCurrency = (amount: number, from: string, to: string) => {
  const normalizedFrom = normalizeCode(from);
  const normalizedTo = normalizeCode(to);
  const fromRate = RATES[normalizedFrom] ?? RATES.CNY;
  const toRate = RATES[normalizedTo] ?? RATES.CNY;
  const amountInCny = amount * fromRate;
  return {
    value: Number((amountInCny / toRate).toFixed(2)),
    fromCode: normalizedFrom,
    toCode: normalizedTo,
  };
};

/**
 * 货币换算工具
 * 支持常见币种换算，可在没有实时汇率时使用默认值
 */
export const currencyTool = tool(
  async ({ amount, from, to }) => {
    const result = convertCurrency(amount, from, to);
    return `${amount} ${result.fromCode} ≈ ${result.value} ${result.toCode}（使用内置汇率，可用 TRAVEL_CURRENCY_RATES 配置最新数据）`;
  },
  {
    name: "convert_currency",
    description:
      "货币换算工具，帮助用户把预算转换为目标国家或目的地常用货币，便于费用估算",
    schema: z.object({
      amount: z.number().describe("金额"),
      from: z.string().describe("原币种，如：CNY、USD"),
      to: z.string().describe("目标币种，如：THB、EUR"),
    }),
  }
);
