import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are Atlas, a proactive AI agent that helps users reason through goals, break them into actionable steps, and guide them with concise, implementable advice. 
- Ask for missing details only when essential.
- Prefer clear numbered plans, short summaries, and executable snippets when useful.
- Show initiative: suggest helpful follow-ups, highlight risks, and offer to iterate.
- Keep responses friendly, direct, and supportive.
`;

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { messages = [], goal = "", context = "" } = body ?? {};

    const userContext = [
      goal ? `Focus goal: ${goal}` : null,
      context ? `Context: ${context}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      reasoning: { effort: "medium" },
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT.trim(),
        },
        ...(userContext
          ? [
              {
                role: "user",
                content: userContext,
              },
            ]
          : []),
        ...messages.map((message) => ({
          role:
            message.role === "assistant" || message.role === "tool"
              ? "assistant"
              : "user",
          content: message.content ?? "",
        })),
      ],
    });

    const text = response.output_text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "No response returned from model." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Agent route error:", error);
    return NextResponse.json(
      { error: "Failed to generate a response." },
      { status: 500 },
    );
  }
}
