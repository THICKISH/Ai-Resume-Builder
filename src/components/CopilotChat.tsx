"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Send, X, Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

interface CopilotChatProps {
  apiKey: string;
  activeTab: string;
  resumeData: unknown;
}

export default function CopilotChat({ apiKey, activeTab, resumeData }: CopilotChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi! I am your CareerOS AI Copilot. I see you're currently exploring the dashboard. How can I help you build your resume, prepare for interviews, or look at your skill gap today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Handle Tab-change contextual messages
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    let text = "";
    switch (activeTab) {
      case "dashboard":
        text = "Back to the control center! You can ask me to summarize your Career DNA or query missing skills.";
        break;
      case "dna":
        text = "Ready to audit your Career DNA? Ask me how to optimize your GitHub profile keywords or LinkedIn summary.";
        break;
      case "resume":
        text = "In the Resume builder! You can paste a bullet point here and ask: 'Rewrite this resume accomplishment using the STAR format.'";
        break;
      case "match":
        text = "Job Matching active. Ask me what keywords recruiters search for in this specific job sector.";
        break;
      case "interview":
        text = "Interview Prep mode! Ask me for technical questions related to JavaScript, Python, or behavioral questions for top companies.";
        break;
      case "roadmap":
        text = "Roadmap center. Need learning resources? Tell me what language you want to learn, and I will outline a quick study guide.";
        break;
      case "projects":
        text = "Project Generator! Tell me your target role and I can outline a unique full-stack project idea for you.";
        break;
      case "portfolio":
        text = "Portfolio preview! Ask me how to write a compelling 'About Me' section for your portfolio home page.";
        break;
      case "recruiter":
        text = "Recruiter view. Ask me how AI rankings help you screen candidates based on technical skill index scores.";
        break;
      default:
        text = "How can I help you with your career progression?";
    }
    
    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `tab-change-${activeTab}-${Date.now()}`,
          sender: "bot",
          text,
          timestamp: new Date(),
        },
      ]);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      if (apiKey) {
        // Dynamic integration with Gemini API
        const response = await fetch(
          `https://generativelink.gemini.api/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, // Fallback mock url or normal Gemini URL
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are CareerOS AI Copilot. Help the user with their career path, resumes, portfolios, or interviews. Keep answers highly professional, encouraging, and under 3 paragraphs. 
                      Context: User is on tab "${activeTab}". User Resume Data: ${JSON.stringify(resumeData || {})}. 
                      User Question: ${userText}`,
                    },
                  ],
                },
              ],
            }),
          }
        ).then(r => r.json());

        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't connect to Gemini. Here is a simulated response: Make sure your resume uses strong action verbs and quantifies results (e.g., 'saved 15 hours per week by automation').";
        
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Highly intelligent mock replies
        setTimeout(() => {
          let responseText = "";
          const lower = userText.toLowerCase();

          if (lower.includes("resume") || lower.includes("ats") || lower.includes("rewrite")) {
            responseText = "To make your resume ATS-friendly, follow the STAR structure: Situation, Task, Action, Result. For example, instead of 'Wrote unit tests', write 'Authored 45+ unit tests using Jest, raising codebase test coverage from 68% to 85% and reducing production bugs by 18%'.";
          } else if (lower.includes("interview") || lower.includes("question") || lower.includes("prepare")) {
            responseText = "When answering behavioral questions, structure your answer in 2 minutes. Start with the problem context, detail the technical actions you took, and conclude with the business metrics achieved. Would you like me to run a mock question for you in the Interview Copilot tab?";
          } else if (lower.includes("project") || lower.includes("portfolio")) {
            responseText = "For a standout portfolio project, don't build generic apps like Todo lists. Build real-world utility solutions, e.g., an automated invoice tracker with email reminders or an AI image background remover using open APIs. Check out the 'AI Project Generator' tab for full specifications!";
          } else if (lower.includes("skill") || lower.includes("learn") || lower.includes("roadmap")) {
            responseText = "Focus on cloud and typescript architectures. The industry currently highly values Next.js, PostgreSQL, Docker containers, and familiarity with embedding pipelines (Vector databases). Open the 'AI Learning Roadmap' tab to see a week-by-week curriculum!";
          } else {
            responseText = `That's an interesting question about your career goals. As your CareerOS Copilot, I recommend focusing on building hands-on projects to validate your skills, optimizing your resume for ATS keywords, and practicing mock interviews here. Let me know if you want me to write a custom project draft or outline a learning roadmap!`;
          }

          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: "bot",
              text: responseText,
              timestamp: new Date(),
            },
          ]);
        }, 1000);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "I ran into a connection error. Please verify your API key in the top-right settings, or proceed with the built-in offline mock simulation mode!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[480px] rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-violet-400" />
                <span className="font-semibold text-sm text-slate-100">CareerOS AI Copilot</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.sender === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-slate-800 text-slate-300 border border-slate-700"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-violet-600/90 text-white rounded-tr-none"
                      : "bg-slate-800/80 text-slate-300 border border-slate-700/50 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[9px] mt-1 opacity-55 text-right">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="h-8 w-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="p-3 rounded-2xl rounded-tl-none bg-slate-800/80 text-slate-400 border border-slate-700/50 text-xs flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/40 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your career path..."
              className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-violet-500/80 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-50 disabled:hover:bg-violet-600 flex items-center justify-center cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 group relative cursor-pointer"
      >
        <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </button>
    </div>
  );
}
