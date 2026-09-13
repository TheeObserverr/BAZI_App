import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateBazi, type BirthInput } from "@/lib/bazi";
import { summarizeZiwei } from "@/lib/ziwei";

export const runtime = "nodejs";

const MAX_TURNS = 10;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  input: BirthInput;
  readingSummary: string;
  history: ChatMessage[];
  question: string;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is not configured with a GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as RequestBody;
    const { input, readingSummary, history, question } = body;

    if (!input || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const priorUserTurns = (history ?? []).filter((m) => m.role === "user").length;
    if (priorUserTurns >= MAX_TURNS) {
      return NextResponse.json(
        { error: `You've reached the ${MAX_TURNS}-question limit for this reading.` },
        { status: 429 }
      );
    }

    const bazi = calculateBazi(input);
    const ziwei = summarizeZiwei(input.year, input.month, input.day, input.timeUnknown ? null : input.hour, input.gender);

    const chartLine = `Day Master ${bazi.dayMaster.char} (${bazi.dayMaster.element}/${bazi.dayMaster.polarity}), ${bazi.dayMasterStrength} (${bazi.supportivePercent}% supportive), dominant element ${bazi.dominantElement}. Pillars: year ${bazi.pillars.year.ganZhi}, month ${bazi.pillars.month.ganZhi}, day ${bazi.pillars.day.ganZhi}, hour ${bazi.pillars.hour.known ? bazi.pillars.hour.ganZhi : "unknown"}. Current 10-year cycle: ${bazi.currentLuckCycle ? `${bazi.currentLuckCycle.ganZhi} (${bazi.currentLuckCycle.startYear}-${bazi.currentLuckCycle.endYear})` : "n/a"}.`;

    const secondarySignal = ziwei
      ? `Secondary temperament signal (never name the technique): soul marker ${ziwei.soulStar}, expression marker ${ziwei.bodyStar}.`
      : "";

    const systemContext = `You are continuing a warm, personalized reading you already gave this person, based on their birth chart. Answer their follow-up question directly and specifically, in 2-5 sentences, staying consistent with the reading below. Never mention technique names like "Ba Zi", "Four Pillars", "Zi Wei Dou Shu", or "Purple Star Astrology" — just speak plainly about them and their chart/cycle. If asked something totally unrelated to their personality, career, wealth, health, or life cycle, gently steer back to what their chart can speak to.

Chart data: ${chartLine}
${secondarySignal}

The reading you already gave them:
${readingSummary}`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const chatHistory = (history ?? []).slice(-MAX_TURNS * 2).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemContext }] },
        { role: "model", parts: [{ text: "Understood — I'll answer their follow-up questions in that voice." }] },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(question);
    const answer = result.response.text();

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("chat route error", err);
    return NextResponse.json({ error: "Something went wrong answering that." }, { status: 500 });
  }
}
