import { NextRequest, NextResponse } from "next/server";
import { queryGovernmentKnowledge, governmentKnowledgeBase } from "@/lib/chatbot-kb";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const locale = body?.locale === "ur" ? "ur" : "en";

    if (!message) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message exceeds 500 character limit" },
        { status: 400 }
      );
    }

    const isUrdu = locale === "ur" || /[\u0600-\u06FF]/.test(message);

    // 1. Check for standard greetings
    const lower = message.toLowerCase();
    const isGreeting =
      lower === "hi" ||
      lower === "hello" ||
      lower === "hey" ||
      lower === "salam" ||
      lower === "assalam o alaikum" ||
      lower === "aoa" ||
      message.includes("سلام") ||
      message.includes("آداب");

    if (isGreeting) {
      return NextResponse.json({
        reply: isUrdu
          ? "وعلیکم السلام! میں حکومت بلوچستان اور وزیر اعلیٰ سیکرٹریٹ کا باضابطہ ڈیجیٹل اسسٹنٹ ہوں۔ میں آپ کی کس طرح مدد کر سکتا ہوں؟ آپ وزیر اعلیٰ کی ترجیحات، صوبائی منصوبوں، سیاحت یا عوامی شکایات سے متعلق دریافت کر سکتے ہیں۔"
          : "Welcome to the Office of the Chief Minister of Balochistan. I am the official digital assistant. How may I assist you today? You can ask about Chief Minister Mir Sarfraz Bugti, government priorities, public services, tourism, or citizen grievance redressal.",
        sourceTitle: "Office of the Chief Minister",
        sourceUrl: "https://cm.balochistan.gob.pk",
      });
    }

    // 2. Check if external Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const kbContext = governmentKnowledgeBase
          .map(
            (k) =>
              `TOPIC: ${k.title}\nENGLISH: ${k.contentEn}\nURDU: ${k.contentUr}\nSOURCE: ${k.sourceTitle} (${k.sourceUrl})`
          )
          .join("\n\n---\n\n");

        const systemPrompt = `You are the official Government of Balochistan AI Assistant representing the Office of the Chief Minister (Mir Sarfraz Bugti).
CRITICAL RULES:
1. ONLY provide verified facts based on official Government of Balochistan records provided below.
2. NEVER invent policies, statistics, announcements, dates, or contact numbers.
3. If verified information is not available in the knowledge base, state clearly that official records on this matter are currently unavailable and direct the citizen to call the CM Grievance Helpline at 1160 or visit https://cm.balochistan.gob.pk.
4. Reply in the same language as the user (English or Urdu).
5. Always maintain a professional, respectful, and dignified tone.

OFFICIAL GOVERNMENT KNOWLEDGE BASE:
${kbContext}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [{ text: `${systemPrompt}\n\nUSER QUESTION: ${message}` }],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const replyText =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return NextResponse.json({
              reply: replyText.trim(),
              sourceTitle: "Government of Balochistan Official Record",
              sourceUrl: "https://cm.balochistan.gob.pk",
            });
          }
        }
      } catch {
        // Fallback gracefully to verified knowledge engine below
      }
    }

    // 3. Verified Government Knowledge Engine
    const matched = queryGovernmentKnowledge(message, isUrdu ? "ur" : "en");
    if (matched) {
      return NextResponse.json({
        reply: matched.answer,
        sourceTitle: matched.sourceTitle,
        sourceUrl: matched.sourceUrl,
      });
    }

    // 4. Default verified unavailable notice (strictly avoids inventing answers)
    return NextResponse.json({
      reply: isUrdu
        ? "معذرت، اس مخصوص موضوع سے متعلق تصدیق شدہ سرکاری معلومات فوری طور پر دستیاب نہیں ہیں۔ برائے مہربانی وزیر اعلیٰ شکایات و رابطہ ہیلپ لائن 1160 پر رابطہ کریں یا باضابطہ ویب سائٹ https://cm.balochistan.gob.pk ملاحظہ کریں۔"
        : "Verified official information on this specific query is currently not available in the provincial government database. For official inquiries or assistance, please contact the Chief Minister Secretariat helpline at 1160 or visit the official portal at https://cm.balochistan.gob.pk.",
      sourceTitle: "Chief Minister Secretariat Helpline",
      sourceUrl: "https://cm.balochistan.gob.pk",
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
