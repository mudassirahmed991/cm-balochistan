"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Bot,
  ExternalLink,
  MessageSquare,
  Minus,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  sourceTitle?: string;
  sourceUrl?: string;
  timestamp: string;
}

export function AIChatbot() {
  const pathname = usePathname();
  const { locale } = useLanguage();

  // Hide inside admin portal
  if (pathname.startsWith("/enter") || pathname.startsWith("/admin")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialGreetingEn =
    "Welcome to the official Government of Balochistan AI Assistant. I can assist you with official information about Chief Minister Mir Sarfraz Bugti, government priorities, public initiatives, provincial tourism, and citizen grievance redressal.";
  const initialGreetingUr =
    "حکومت بلوچستان کے باضابطہ ڈیجیٹل اسسٹنٹ میں خوش آمدید۔ آپ وزیر اعلیٰ میر سرفراز بگٹی، حکومتی ترجیحات، صوبائی ترقیاتی منصوبوں، سیاحت اور عوامی شکایات کے اندراج کے بارے میں معلومات حاصل کر سکتے ہیں۔";

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: locale === "ur" ? initialGreetingUr : initialGreetingEn,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [locale, messages.length]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, locale }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: "b-" + Date.now(),
        sender: "bot",
        text:
          data.reply ||
          (locale === "ur"
            ? "معذرت، اس وقت جواب دینے میں دشواری پیش آ رہی ہے۔"
            : "An unexpected error occurred. Please try again later."),
        sourceTitle: data.sourceTitle,
        sourceUrl: data.sourceUrl,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "bot",
          text:
            locale === "ur"
              ? "معذرت، رابطہ قائم نہیں ہو سکا۔ برائے مہربانی اپنا انٹرنیٹ کنکشن چیک کریں۔"
              : "Unable to connect to the assistant server. Please check your network connection.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: locale === "ur" ? initialGreetingUr : initialGreetingEn,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const suggestionPills = [
    { en: "Who is the Chief Minister?", ur: "وزیر اعلیٰ کون ہیں؟" },
    { en: "CM Priorities & Education", ur: "تعلیمی ایمرجنسی اور ترجیحات" },
    { en: "Tourism places in Balochistan", ur: "بلوچستان کے اہم سیاحتی مقامات" },
    { en: "How to register a complaint?", ur: "شکایت کیسے درج کروائیں؟" },
  ];

  return (
    <>
      {/* Floating Launcher Button at Bottom Right */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open Chief Minister AI Assistant"
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            left: "auto",
            zIndex: 9999,
          }}
          className="!fixed floating-bottom-right-btn flex h-14 w-14 items-center justify-center rounded-2xl btn-3d-emerald shadow-3d-hover cursor-pointer header-tactile-btn group"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="h-7 w-7 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-400 ring-2 ring-white">
              <Sparkles className="h-2 w-2 text-pine-950" />
            </span>
          </div>
          {/* Tooltip on Desktop */}
          <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-pine-950/95 px-3 py-1.5 text-xs font-semibold text-white shadow-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 hidden sm:block">
            {locale === "ur" ? "وزیر اعلیٰ AI اسسٹنٹ" : "CM Balochistan AI Assistant"}
          </span>
        </button>
      )}

      {/* Modern Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: "24px",
            bottom: "24px",
            left: "auto",
            zIndex: 9999,
          }}
          className={cn(
            "!fixed flex flex-col rounded-2xl glass-card-3d shadow-2xl border border-white/95 overflow-hidden transition-all duration-300 w-[calc(100vw-2rem)] sm:w-[400px]",
            isMinimized ? "h-16" : "h-[540px] max-h-[85vh]"
          )}
        >
          {/* Window Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-pine-950 via-pine-900 to-pine-800 px-4 py-3 text-white shrink-0 select-none">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 p-1 border border-white/15">
                <Image
                  src="/images/balochistan-logo.png"
                  alt="Government of Balochistan"
                  width={28}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold tracking-wide text-white truncate">
                  {locale === "ur" ? "وزیر اعلیٰ AI اسسٹنٹ" : "CM Balochistan AI"}
                </span>
                <span className="text-[10px] text-gold-300 font-medium truncate flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {locale === "ur" ? "آن لائن — سرکاری معاون" : "Official Government Assistant"}
                </span>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title={locale === "ur" ? "چیٹ صاف کریں" : "Clear conversation"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximize" : "Minimize"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Window Body (When not minimized) */}
          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-paper/60 text-xs">
                {messages.map((m) => {
                  const isBot = m.sender === "bot";
                  return (
                    <div
                      key={m.id}
                      className={cn(
                        "flex gap-2.5 items-start",
                        isBot ? "justify-start" : "justify-end"
                      )}
                    >
                      {isBot && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pine-900 text-white shadow-sm mt-0.5">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[82%] rounded-2xl p-3 shadow-sm leading-relaxed",
                          isBot
                            ? "bg-white text-pine-950 border border-pine-900/10 rounded-tl-none"
                            : "bg-pine-800 text-white rounded-tr-none shadow-md"
                        )}
                      >
                        <p className="whitespace-pre-line select-text">{m.text}</p>

                        {/* Verified Source Citation */}
                        {m.sourceUrl && (
                          <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                            <span className="text-pine-700/80 font-semibold truncate max-w-[190px]">
                              {m.sourceTitle || "Official Government Source"}
                            </span>
                            <a
                              href={m.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-pine-800 hover:text-pine-950 font-bold underline ml-1"
                            >
                              <span>{locale === "ur" ? "لنک" : "Source"}</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        )}

                        <span
                          className={cn(
                            "mt-1 block text-[9px] text-right font-medium",
                            isBot ? "text-gray-400" : "text-white/60"
                          )}
                        >
                          {m.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Loading Bubble */}
                {loading && (
                  <div className="flex gap-2 items-center text-pine-700 bg-white border border-pine-900/10 rounded-2xl rounded-tl-none px-3.5 py-2.5 w-max shadow-sm">
                    <Bot className="h-4 w-4 animate-spin text-pine-800" />
                    <span className="text-xs font-semibold">
                      {locale === "ur"
                        ? "معلومات تصدیق ہو رہی ہیں..."
                        : "Retrieving verified records..."}
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Pills */}
              {messages.length <= 2 && (
                <div className="p-2.5 bg-pine-50/70 border-t border-pine-900/10 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                  {suggestionPills.map((pill) => (
                    <button
                      key={pill.en}
                      type="button"
                      onClick={() => handleSend(locale === "ur" ? pill.ur : pill.en)}
                      className="whitespace-nowrap rounded-lg border border-pine-900/15 bg-white px-2.5 py-1 text-[11px] font-semibold text-pine-900 shadow-2xs hover:bg-pine-100 hover:border-pine-900/30 transition-colors shrink-0 cursor-pointer"
                    >
                      {locale === "ur" ? pill.ur : pill.en}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 p-3 bg-white border-t border-pine-900/10 shrink-0"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    locale === "ur"
                      ? "اپنا سوال یہاں ٹائپ کریں..."
                      : "Ask about CM initiatives, Balochistan..."
                  }
                  className="flex-1 rounded-xl bg-paper px-3.5 py-2 text-xs text-pine-950 placeholder:text-gray-400 border border-pine-900/15 focus:outline-none focus:border-pine-700 focus:ring-1 focus:ring-pine-700 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send query"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl btn-3d-emerald text-white disabled:opacity-40 disabled:cursor-not-allowed header-tactile-btn cursor-pointer shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
