import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  );
  const data = await res.json();
  const names = (data.models ?? []).map((m: { name: string }) => m.name);
  return NextResponse.json({ models: names, raw: data.error ?? null });
}
