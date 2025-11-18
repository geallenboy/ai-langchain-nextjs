import type { ReactNode } from "react";
import Link from "next/link";
import { LearnNav } from "./_components/learn-nav";
import { Button } from "@/components/ui/button";

export default function LearnLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:px-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-widest text-white/70">
            LangChain · Learning Track
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
            基于 LangChain 的 AI Agent 学习实验室
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/80">
            结合 Next.js、LangChain 1.0 与 ai-elements UI，循序渐进掌握
            Prompt、Tool、Agent、调试可视化等能力。通过 Demo 页面即可调用
            `/api/learning/examples/*`，快速验证想法。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary" className="rounded-full bg-white text-slate-900 hover:bg-white/80">
              <Link href="/learn/foundations">开始基础练习</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10">
              <Link href="/travel">查看实战 Agent</Link>
            </Button>
          </div>
        </section>

        <LearnNav />

        <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl backdrop-blur">
          {children}
        </section>
      </div>
    </div>
  );
}
