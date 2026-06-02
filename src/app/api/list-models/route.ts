import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const models = await genAI.listModels();
  const names: string[] = [];
  for await (const m of models) {
    names.push(m.name);
  }
  return NextResponse.json({ models: names });
}
