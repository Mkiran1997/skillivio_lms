// /app/api/ai-outline/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { title, description } = await req.json();

  const prompt = `
  Create a course outline for:
  Title: ${title}
  Description: ${description}

  Return JSON with modules and lessons.
  `;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();

  return NextResponse.json(data);
}