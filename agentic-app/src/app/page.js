"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const quickStarts = [
  "Plan a four-week MVP delivery roadmap with milestones.",
  "Design a customer discovery interview script for a fintech app.",
  "Create a marketing launch plan targeting early adopters.",
  "Outline a study path to learn generative AI tooling in 30 days.",
];

export default function Home() {
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      id: "intro",
      role: "assistant",
      content:
        "Hey, I'm Atlas — your autonomous execution partner. Set a goal, give me any guardrails, and I'll turn it into a concrete plan with actionable next steps.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal,
          context,
          messages: [...messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.message?.trim();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            reply ||
            "I wasn't able to think of a plan just now. Give it another shot in a moment.",
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Something interrupted my train of thought. Check your connection or API key and we can try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const activeGoal = useMemo(() => goal.trim(), [goal]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-8 lg:px-12">
        <header className="mb-8 space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300/80">
            Atlas Autonomous Agent
          </p>
          <h1 className="text-3xl font-semibold text-zinc-50 sm:text-4xl">
            Orchestrate complex workstreams with an AI operator.
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Describe where you want to go, share the constraints, and Atlas will
            turn it into stepwise execution plans, risk assessments, and smart
            follow-ups. Built for founders, operators, and builders shipping at
            speed.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {quickStarts.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setGoal((prev) => prev || suggestion);
                  setInput(suggestion);
                }}
                className="rounded-full border border-indigo-500/40 px-4 py-2 text-xs font-medium text-indigo-200 transition hover:border-indigo-300 hover:bg-indigo-400/10 sm:text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 rounded-3xl border border-white/5 bg-zinc-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Primary goal
              </span>
              <input
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                placeholder="Ship a polished MVP in four weeks."
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-zinc-300">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Constraints & context
              </span>
              <input
                value={context}
                onChange={(event) => setContext(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
                placeholder="Team of 2 devs, $5k budget, need alpha testers."
              />
            </label>
          </div>

          <div
            ref={chatRef}
            className="relative max-h-[420px] min-h-[240px] space-y-4 overflow-y-auto rounded-3xl border border-white/5 bg-black/40 p-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-sm leading-relaxed sm:text-base ${
                    message.role === "assistant"
                      ? "bg-indigo-500/15 text-indigo-100"
                      : "bg-indigo-500 text-white"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-3xl bg-indigo-500/15 px-4 py-3 text-sm text-indigo-100">
                  <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-indigo-300" />
                  Atlas is working through it…
                </div>
              </div>
            )}
          </div>

          <label className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Tell Atlas what to do next
            </span>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="h-32 resize-none rounded-3xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              placeholder={
                activeGoal
                  ? "Ask for deliverables, deeper research, or risk checks…"
                  : "Start by telling Atlas what outcome you need…"
              }
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500">
              Atlas taps OpenAI&apos;s GPT-4.1-mini. Keep your API key secure
              inside environment variables.
            </p>
            <button
              type="submit"
              disabled={isThinking}
              className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:cursor-not-allowed disabled:bg-indigo-500/50"
            >
              {isThinking ? "Generating…" : "Deploy Atlas"}
            </button>
          </div>
        </form>
      </main>
      <footer className="px-4 pb-6 text-center text-xs text-zinc-600 sm:px-8">
        Built with Next.js · Ready for Vercel in one command.
      </footer>
    </div>
  );
}
