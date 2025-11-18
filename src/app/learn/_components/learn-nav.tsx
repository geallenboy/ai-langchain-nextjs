"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  exact?: boolean;
  description?: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/learn", label: "总览", description: "学习路线" , exact: true},
  { href: "/learn/foundations", label: "基础对话", description: "模型与上下文" },
  { href: "/learn/tools", label: "工具 & 数据", description: "Tool/Output" },
  { href: "/learn/agents", label: "Agent 场景", description: "推理与编排" },
];

export function LearnNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
      {NAV_ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex flex-col rounded-2xl px-4 py-2 text-sm transition-colors",
              "hover:bg-white/15 hover:text-white",
              isActive
                ? "bg-white/20 text-white shadow-inner"
                : "text-slate-100"
            )}
          >
            <span className="font-semibold">{item.label}</span>
            {item.description && (
              <span className="text-[12px] text-white/70">
                {item.description}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
