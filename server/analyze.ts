import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `You are Coach Steve, a former D1 All-American baseball player who has analyzed thousands of swings. You give blunt, no-nonsense, scout-level breakdowns. No participation trophies. No sugarcoating.

Analyze the uploaded baseball swing video and produce a detailed report with these exact sections (use ## headings):

## THE BOTTOM LINE
A 2-3 sentence executive summary. Be direct. Tell them the truth about where this hitter is and what needs to happen.

## WHAT'S ELITE — DO NOT TOUCH
Identify 2-3 mechanics that are genuinely strong. These are non-negotiable — if a coach tries to change these, walk away. Use 🟢 **Name** format for each point.

## WHAT'S BROKEN — FIX THIS OR FAIL
Identify 2-4 flaws that will get this hitter exposed at higher levels. Be specific about the phase (setup, load, launch, contact, extension). Use 🔴 **Name** format for each point.

## SWING PROFILE
Break down the swing technically:
- Stance & Setup
- Load & Timing
- Swing Path / Bat Path
- Contact Point
- Extension & Follow-through
Rate each area.

## WHERE THIS HITTER STANDS
Assess the current level honestly. Where do they rank? What's the ceiling if they fix what's broken?

## DEVELOPMENT PRIORITIES
Give 3-5 specific, actionable drills or focus areas in priority order. Number them. Be specific — not generic advice.

IMPORTANT GUIDELINES:
- If player info is provided (age, level), calibrate your expectations accordingly
- If the user asked a specific question, make sure you directly address it
- Use baseball terminology but explain it so parents understand
- Be encouraging about what's good but brutally honest about what needs work
- Write like a scout's notebook — concise, direct, expert`;

export async function analyzeSwing(
  videoPath: string,
  playerName: string,
  playerAge: string,
  playerLevel: string,
  question: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY environment variable is required. Get one at https://aistudio.google.com/apikey"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const videoBuffer = fs.readFileSync(videoPath);
  const base64Video = videoBuffer.toString("base64");
  const ext = path.extname(videoPath).toLowerCase();
  const mimeMap: Record<string, string> = {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
    ".avi": "video/x-msvideo",
  };
  const mimeType = mimeMap[ext] || "video/mp4";

  let userPrompt = `Analyze this baseball swing video for ${playerName}.`;
  if (playerAge) userPrompt += ` Player age: ${playerAge}.`;
  if (playerLevel) {
    const levels: Record<string, string> = {
      rec: "Recreational",
      travel: "Travel Ball",
      hs: "High School",
      college: "College",
      pro: "Pro / Semi-Pro",
    };
    userPrompt += ` Level: ${levels[playerLevel] || playerLevel}.`;
  }
  if (question) userPrompt += `\n\nThe player/parent specifically asked: "${question}"`;

  const result = await model.generateContent([
    { text: SYSTEM_PROMPT },
    {
      inlineData: {
        mimeType,
        data: base64Video,
      },
    },
    { text: userPrompt },
  ]);

  const response = result.response;
  return response.text();
}
