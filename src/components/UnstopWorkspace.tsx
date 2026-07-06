"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, CheckCircle2, Clock, Award, Star, Code, Terminal, 
  Sparkles, Send, Play, Check, ChevronRight, Upload, 
  AlertCircle, HelpCircle, User, MessageSquare, ExternalLink, RefreshCw 
} from "lucide-react";

interface UnstopWorkspaceProps {
  event: {
    name: string;
    host: string;
    category: string;
    dates: string;
    prize: string;
    match: number;
    url: string;
    jd: string;
  };
  onClose: () => void;
  activeResume: {
    name: string;
    score: number;
    skills: string[];
  };
  apiKey?: string;
}

// Track details mapping for all 15 events
const eventTrackDetails: Record<string, {
  track: "coding" | "case";
  title: string;
  problemStatement?: string;
  templateCode?: string;
  testCases?: Array<{ input: unknown; expected: unknown; description: string }>;
  casePrompt?: string;
  keywords?: string[];
}> = {
  "TCS CodeVita Season 12": {
    track: "coding",
    title: "Array Closest to Zero",
    problemStatement: "Write a JavaScript function `findClosestToZero(arr)` that takes an array of integers and returns the number closest to zero. If two numbers are equally close, return the positive one. (e.g., if array has -4 and 4, return 4).",
    templateCode: `function findClosestToZero(arr) {
  // Write your code here
  if (!arr || arr.length === 0) return 0;
  let closest = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(arr[i]) < Math.abs(closest)) {
      closest = arr[i];
    } else if (Math.abs(arr[i]) === Math.abs(closest)) {
      if (arr[i] > closest) {
        closest = arr[i];
      }
    }
  }
  return closest;
}`,
    testCases: [
      { input: [2, 5, -3, 1, 9], expected: 1, description: "Simple mixed positive/negative list" },
      { input: [-4, 4, 9, -2, 2], expected: 2, description: "Equidistant positive/negative ties" },
      { input: [-10, -5, -8], expected: -5, description: "All negative numbers" }
    ]
  },
  "Amazon ML Challenge 2026": {
    track: "coding",
    title: "Min-Max Feature Scaler",
    problemStatement: "Write a function `scaleFeatures(arr)` that takes an array of numbers and returns a new array with values normalized between 0 and 1. If all elements in the array are equal, return an array of 0s.",
    templateCode: `function scaleFeatures(arr) {
  // Normalize array features
  if (!arr || arr.length === 0) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (max === min) return arr.map(() => 0);
  return arr.map(x => (x - min) / (max - min));
}`,
    testCases: [
      { input: [10, 20, 30], expected: [0, 0.5, 1], description: "Standard feature scaling" },
      { input: [5, 5, 5], expected: [0, 0, 0], description: "All equal elements fallback" },
      { input: [-1, 0, 1], expected: [0, 0.5, 1], description: "Negative to positive range scaling" }
    ]
  },
  "Google Girl Hackathon 2026": {
    track: "coding",
    title: "Balanced Bracket Validator",
    problemStatement: "Write a function `isBalanced(s)` that takes a string containing bracket characters '()', '[]', and '{}' and returns true if the input string is balanced, false otherwise.",
    templateCode: `function isBalanced(s) {
  // Check balanced parentheses
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (let char of s) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char);
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
    testCases: [
      { input: "()[]{}", expected: true, description: "All brackets correctly matched" },
      { input: "([)]", expected: false, description: "Nested brackets misordered" },
      { input: "{[()]}", expected: true, description: "Deeply nested balanced brackets" }
    ]
  },
  "Uber HackTag 2.0": {
    track: "coding",
    title: "Grid Path Manhattan Calculator",
    problemStatement: "Write a function `findShortestRoute(grid)` that takes a grid (represented as [rows, cols]) and calculates the minimum Manhattan distance from the starting position [0, 0] to the destination [rows - 1, cols - 1]. Code should return (rows - 1) + (cols - 1) as output.",
    templateCode: `function findShortestRoute(grid) {
  // grid layout: [rows, cols]
  if (!grid || grid.length < 2) return 0;
  return (grid[0] - 1) + (grid[1] - 1);
}`,
    testCases: [
      { input: [3, 3], expected: 4, description: "3x3 Grid traversal" },
      { input: [5, 5], expected: 8, description: "5x5 Grid traversal" },
      { input: [1, 4], expected: 3, description: "Single-row 1x4 traversal" }
    ]
  },
  "Microsoft Imagine Cup 2026": {
    track: "coding",
    title: "Toxic Comment Sentiment Filter",
    problemStatement: "Write a function `filterNegative(arr)` that filters out any strings in an array containing words indicating negative sentiments: 'fail', 'bad', 'error', 'broken'. Output should be case-insensitive.",
    templateCode: `function filterNegative(arr) {
  // Filter toxic keywords
  const badWords = ['fail', 'bad', 'error', 'broken'];
  return arr.filter(str => {
    const lower = str.toLowerCase();
    return !badWords.some(word => lower.includes(word));
  });
}`,
    testCases: [
      { input: ["This is good", "Bad API error", "Fix this crash"], expected: ["This is good", "Fix this crash"], description: "Filters out bad and error words" },
      { input: ["No failures here", "System working fine"], expected: ["No failures here", "System working fine"], description: "No matches found" },
      { input: ["Broken pipe", "Failed build"], expected: [], description: "All elements contain toxic keywords" }
    ]
  },
  "ICICI Beat The Curve": {
    track: "coding",
    title: "JWT Structure Authenticator",
    problemStatement: "Write a function `validateToken(token)` that verifies if a given string has the structure of a JWT (3 dot-separated base64 parts). Returns true if it contains exactly 2 dot dividers and no spaces, false otherwise.",
    templateCode: `function validateToken(token) {
  // Validate token split parts
  if (!token || token.includes(' ')) return false;
  const parts = token.split('.');
  return parts.length === 3;
}`,
    testCases: [
      { input: "header.payload.signature", expected: true, description: "Standard valid JWT format" },
      { input: "header.payload", expected: false, description: "Missing signature segment" },
      { input: "header.pay load.signature", expected: false, description: "Token containing whitespace characters" }
    ]
  },
  "JSW Challenge 2026": {
    track: "coding",
    title: "Directory Tree Depth Counter",
    problemStatement: "Write a function `getDepth(node)` that calculates the maximum nesting depth of an object tree representing folder nodes. Each node object can have a children array of nested node objects. Return the maximum depth.",
    templateCode: `function getDepth(node) {
  // Calculate nested tree levels
  if (!node) return 0;
  if (!node.children || node.children.length === 0) return 1;
  const childDepths = node.children.map(child => getDepth(child));
  return 1 + Math.max(...childDepths);
}`,
    testCases: [
      { input: { name: "root", children: [] }, expected: 1, description: "Single root folder with zero children" },
      { 
        input: { 
          name: "src", 
          children: [
            { name: "components", children: [{ name: "button", children: [] }] },
            { name: "styles", children: [] }
          ] 
        }, 
        expected: 3, 
        description: "Standard folder nesting structure" 
      }
    ]
  },
  // Case track mappings
  "Flipkart Runway Season 4": {
    track: "case",
    title: "Frontend Components Layout Design Proposal",
    casePrompt: "Flipkart seeks a proposal for a responsive, accessible cart checkout interface. Describe your layout choices (grids/flexbox), accessibility hooks (ARIA tags), state optimizations (React query/cache), and component isolation rules. (Word count: min 50 words).",
    keywords: ["layout", "aria", "component", "state", "grid", "react"]
  },
  "L'Oreal Brandstorm 2026": {
    track: "case",
    title: "Premium Beauty-Tech Product & UX Strategy",
    casePrompt: "Propose a mobile beauty consultant feature powered by client-side WebGL filter masks. Outline the client user flow, real-time image rendering latency optimizations, customer data retention policies, and UI feedback systems. (Word count: min 50 words).",
    keywords: ["latency", "rendering", "ux", "mask", "filter", "data"]
  },
  "Reliance TUP 9.0": {
    track: "case",
    title: "SaaS Platform Monetization & MVP Feasibility",
    casePrompt: "Create a startup feasibility canvas for an automated retail telemetry SaaS. Specify the customer acquisition strategy (CAC), recurring pricing structure, database architecture (relational SQL/cache), and launch milestone timelines. (Word count: min 50 words).",
    keywords: ["cac", "saas", "pricing", "database", "market", "revenue"]
  },
  "Schneider Go Green 2026": {
    track: "case",
    title: "IoT Smart Energy Distribution Grid Strategy",
    casePrompt: "Provide a plan for an IoT-based home microgrid optimization dashboard. Detail how you will query live sensor telemetry, clean high-volume raw streams, represent grid status visually, and handle local battery threshold alerts. (Word count: min 50 words).",
    keywords: ["iot", "telemetry", "dashboard", "battery", "sensor", "energy"]
  },
  "Hero Campus Challenge Season 10": {
    track: "case",
    title: "Automobile Telemetry Dashboard Architecture",
    casePrompt: "Draft an architecture outline for an in-car analytics dashboard showing driver speed anomalies. Detail the network transfer layer (WebSockets/MQTT), database clustering, real-time chart rendering updates, and visual notification states. (Word count: min 50 words).",
    keywords: ["websockets", "mqtt", "telemetry", "chart", "real-time", "visual"]
  },
  "Tata Imagination Challenge 2026": {
    track: "case",
    title: "Global Supply Chain Congestion Resolver Design",
    casePrompt: "Detail an optimization dashboard for logistics cargo routing. Propose routing visualization maps, real-time delivery delay alerts, cloud server database configurations, and standard API endpoint models to feed client graphs. (Word count: min 50 words).",
    keywords: ["logistics", "routing", "map", "api", "database", "latency"]
  },
  "Deloitte Maverick Season 13": {
    track: "case",
    title: "Client Financial Asset Telemetry Analytics Panel",
    casePrompt: "Detail a business case study for an executive portal mapping client portfolio risks. Outline the dynamic data widgets, security authentication measures (JWT/roles), caching layers (Redis), and presentation formatting requirements. (Word count: min 50 words).",
    keywords: ["redis", "jwt", "roles", "portfolio", "widgets", "security"]
  },
  "Aditya Birla Group BizLabs 2026": {
    track: "case",
    title: "Enterprise Supply Chain Logistics Scaling Plan",
    casePrompt: "Outline a scaling strategy to manage high-volume logistics dispatching telemetry. Provide details on server horizontal load balancing, docker microservice containers, PostgreSQL partition strategies, and dashboard rendering speeds. (Word count: min 50 words).",
    keywords: ["load balancing", "docker", "postgresql", "partition", "dashboard", "dispatch"]
  }
};

// MCQ Quiz questions list based on track
const codingMCQs = [
  {
    q: "What is the average time complexity of looking up a key in a Hash Map?",
    opts: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    ans: 0
  },
  {
    q: "Which protocol is standard for pushing real-time bidirectional message updates between a browser and a server?",
    opts: ["HTTP/1.1", "WebSockets", "gRPC over UDP", "FTP"],
    ans: 1
  },
  {
    q: "Which hook is correct in React to store a persistent mutable value that does not trigger a re-render when changed?",
    opts: ["useState", "useEffect", "useMemo", "useRef"],
    ans: 3
  }
];

const caseMCQs = [
  {
    q: "What does CAC stand for in SaaS business analytics?",
    opts: ["Customer Acquisition Cost", "Capital Asset Capitalization", "Client Agreement Contract", "Cohort Activity Count"],
    ans: 0
  },
  {
    q: "Which layout approach is best suited for aligning elements in both rows and columns simultaneously in modern CSS?",
    opts: ["CSS Floats", "Flexbox Grid", "CSS Grid Layout", "Block Layout Blocks"],
    ans: 2
  },
  {
    q: "What is the primary benefit of developing a Minimum Viable Product (MVP)?",
    opts: ["To maximize early stage revenues", "To validate core hypothesis with minimum cost", "To scale infrastructure databases", "To replace full product designers"],
    ans: 1
  }
];

export default function UnstopWorkspace({ event, onClose, activeResume, apiKey }: UnstopWorkspaceProps) {
  const eventDetails = eventTrackDetails[event.name] || {
    track: "coding" as const,
    title: "Algorithmic Challenge",
    problemStatement: "Write a JavaScript function to return the sum of two integers.",
    templateCode: "function sum(a, b) {\n  return a + b;\n}",
    testCases: [{ input: [1, 2], expected: 3, description: "1 + 2 = 3" }]
  };

  // Local state retrieved from localStorage
  const localStoragePrefix = `career_os_unstop_progress_${event.name.replace(/\s+/g, "_")}`;
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentRound, setCurrentRound] = useState(1); // 1: Quiz, 2: Coding/Case, 3: Interview, 4: Finished
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Round 2 states (Coding)
  const [codeValue, setCodeValue] = useState(eventDetails.templateCode || "");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [codeSubmitted, setCodeSubmitted] = useState(false);

  // Round 2 states (Case)
  const [caseProposalText, setCaseProposalText] = useState("");
  const [caseSubmitted, setCaseSubmitted] = useState(false);
  const [caseScore, setCaseScore] = useState<number | null>(null);
  const [caseFeedbackText, setCaseFeedbackText] = useState("");

  // Round 3 states (Interview Chat)
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "Sarah" | "You"; text: string }>>([]);
  const [userInputMessage, setUserInputMessage] = useState("");
  const [interviewSubmitted, setInterviewSubmitted] = useState(false);
  const [interviewScore, setInterviewScore] = useState<number | null>(null);

  // Final Ranking states
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [finalRank, setFinalRank] = useState<number | null>(null);

  // Confetti trigger
  const [showConfetti, setShowConfetti] = useState(false);

  // Leaderboard data
  const [eventLeaderboard, setEventLeaderboard] = useState<Array<{ name: string; college: string; score: number; status: string }>>([
    { name: "Priya Sharma", college: "IIT Delhi", score: 98, status: "Submitted" },
    { name: "Rohan Patel", college: "BITS Pilani", score: 95, status: "Submitted" },
    { name: "Amit Verma", college: "NIT Trichy", score: 92, status: "Submitted" },
    { name: "Ananya Iyer", college: "DTU", score: 88, status: "Submitted" },
    { name: "Vikram Malhotra", college: "RVCE Bangalore", score: 85, status: "Submitted" }
  ]);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedReg = localStorage.getItem(`${localStoragePrefix}_registered`);
      const savedRound = localStorage.getItem(`${localStoragePrefix}_round`);
      const savedQuizAns = localStorage.getItem(`${localStoragePrefix}_quiz_ans`);
      const savedQuizFin = localStorage.getItem(`${localStoragePrefix}_quiz_fin`);
      const savedQuizScr = localStorage.getItem(`${localStoragePrefix}_quiz_scr`);
      const savedCode = localStorage.getItem(`${localStoragePrefix}_code`);
      const savedCodeSub = localStorage.getItem(`${localStoragePrefix}_code_sub`);
      const savedCaseTxt = localStorage.getItem(`${localStoragePrefix}_case_txt`);
      const savedCaseSub = localStorage.getItem(`${localStoragePrefix}_case_sub`);
      const savedCaseScr = localStorage.getItem(`${localStoragePrefix}_case_scr`);
      const savedCaseFdb = localStorage.getItem(`${localStoragePrefix}_case_fdb`);
      const savedChat = localStorage.getItem(`${localStoragePrefix}_chat`);
      const savedIntSub = localStorage.getItem(`${localStoragePrefix}_int_sub`);
      const savedIntScr = localStorage.getItem(`${localStoragePrefix}_int_scr`);
      const savedFinScr = localStorage.getItem(`${localStoragePrefix}_fin_scr`);
      const savedFinRnk = localStorage.getItem(`${localStoragePrefix}_fin_rnk`);

      setTimeout(() => {
        if (savedReg) setIsRegistered(savedReg === "true");
        if (savedRound) setCurrentRound(parseInt(savedRound, 10));
        if (savedQuizAns) setQuizAnswers(JSON.parse(savedQuizAns));
        if (savedQuizFin) setQuizFinished(savedQuizFin === "true");
        if (savedQuizScr) setQuizScore(parseInt(savedQuizScr, 10));
        if (savedCode) setCodeValue(savedCode);
        if (savedCodeSub) setCodeSubmitted(savedCodeSub === "true");
        if (savedCaseTxt) setCaseProposalText(savedCaseTxt);
        if (savedCaseSub) setCaseSubmitted(savedCaseSub === "true");
        if (savedCaseScr) setCaseScore(parseInt(savedCaseScr, 10));
        if (savedCaseFdb) setCaseFeedbackText(savedCaseFdb);
        if (savedChat) setChatHistory(JSON.parse(savedChat));
        if (savedIntSub) setInterviewSubmitted(savedIntSub === "true");
        if (savedIntScr) setInterviewScore(parseInt(savedIntScr, 10));
        if (savedFinScr) setFinalScore(parseInt(savedFinScr, 10));
        if (savedFinRnk) setFinalRank(parseInt(savedFinRnk, 10));
      }, 0);
    } catch (e) {
      console.error("Error reading localStorage for Unstop workspace", e);
    }
  }, [localStoragePrefix]);

  // Sync to LocalStorage helpers
  const saveToLocal = (key: string, val: unknown) => {
    try {
      localStorage.setItem(`${localStoragePrefix}_${key}`, String(val));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRegister = () => {
    setIsRegistered(true);
    setCurrentRound(1);
    saveToLocal("registered", true);
    saveToLocal("round", 1);
    
    // Seed initial Recruiter Interview message
    const initialChat = [
      { 
        sender: "Sarah" as const, 
        text: `Hi! Welcome to the final interview round of the ${event.name}. I've reviewed your resume and round submissions. Let's start: can you explain why you chose your tech stack or approach for your submission?` 
      }
    ];
    setChatHistory(initialChat);
    try {
      localStorage.setItem(`${localStoragePrefix}_chat`, JSON.stringify(initialChat));
    } catch(e){}
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your progress for this challenge?")) {
      setIsRegistered(false);
      setCurrentRound(1);
      setQuizAnswers({});
      setQuizFinished(false);
      setQuizScore(null);
      setCodeValue(eventDetails.templateCode || "");
      setConsoleLogs([]);
      setCodeSubmitted(false);
      setCaseProposalText("");
      setCaseSubmitted(false);
      setCaseScore(null);
      setCaseFeedbackText("");
      setChatHistory([]);
      setUserInputMessage("");
      setInterviewSubmitted(false);
      setInterviewScore(null);
      setFinalScore(null);
      setFinalRank(null);
      
      const keys = ["registered", "round", "quiz_ans", "quiz_fin", "quiz_scr", "code", "code_sub", "case_txt", "case_sub", "case_scr", "case_fdb", "chat", "int_sub", "int_scr", "fin_scr", "fin_rnk"];
      keys.forEach(k => {
        try { localStorage.removeItem(`${localStoragePrefix}_${k}`); } catch(e){}
      });
    }
  };

  // Evaluate Round 1 MCQ Quiz
  const activeQuestions = eventDetails.track === "coding" ? codingMCQs : caseMCQs;

  const handleSelectQuizOption = (qIdx: number, oIdx: number) => {
    if (quizFinished) return;
    const updated = { ...quizAnswers, [qIdx]: oIdx };
    setQuizAnswers(updated);
    try {
      localStorage.setItem(`${localStoragePrefix}_quiz_ans`, JSON.stringify(updated));
    } catch(e){}
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(quizAnswers).length < activeQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    let score = 0;
    activeQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.ans) {
        score += 1;
      }
    });

    setQuizScore(score);
    setQuizFinished(true);
    setCurrentRound(2);
    
    saveToLocal("quiz_scr", score);
    saveToLocal("quiz_fin", true);
    saveToLocal("round", 2);
  };

  // Compile Code for Coding Track
  const handleRunTestCases = () => {
    setConsoleLogs([`> Initiating runtime compilation for: ${eventDetails.title}...`]);
    
    setTimeout(() => {
      try {
        // Safe evaluation scope. Replace function name standard
        const compiledFn = new Function(`return ${codeValue}`)();
        if (typeof compiledFn !== "function") {
          throw new Error("Could not find a valid executable function in the text area.");
        }

        const logs: string[] = [];
        let allPassed = true;
        const cases = eventDetails.testCases || [];

        cases.forEach((tc, idx) => {
          logs.push(`> Running Test Case ${idx + 1}: ${tc.description}...`);
          logs.push(`  Input: ${JSON.stringify(tc.input)}`);
          
          // Clone inputs to prevent mutation side-effects
          const inputClone = JSON.parse(JSON.stringify(tc.input));
          const output = compiledFn(inputClone);
          
          logs.push(`  Output: ${JSON.stringify(output)}`);

          const isMatch = JSON.stringify(output) === JSON.stringify(tc.expected);
          if (isMatch) {
            logs.push(`  [SUCCESS] Match found: ${JSON.stringify(output)}`);
          } else {
            logs.push(`  [FAILED] Expected ${JSON.stringify(tc.expected)}, got ${JSON.stringify(output)}`);
            allPassed = false;
          }
        });

        if (allPassed) {
          logs.push(`> Compile success: All ${cases.length} test cases verified!`);
        } else {
          logs.push(`> Validation warning: Some test cases did not pass. Check algorithm criteria.`);
        }
        setConsoleLogs(prev => [...prev, ...logs]);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setConsoleLogs(prev => [
          ...prev, 
          `> Compilation Error: ${errMsg}`,
          `> Double check syntax, braces, brackets, and ensure you have returning statements.`
        ]);
      }
    }, 400);
  };

  const handleSubmitCode = () => {
    if (consoleLogs.length === 0) {
      alert("Please run your test cases at least once before submitting.");
      return;
    }
    // Calculate a mock score based on code text structure & tests passed in log
    const containsPassed = consoleLogs.some(log => log.includes("All ") && log.includes("test cases verified"));
    const score = containsPassed ? 95 : 65;

    setCodeSubmitted(true);
    setCurrentRound(3);
    
    saveToLocal("code_sub", true);
    saveToLocal("code", codeValue);
    saveToLocal("round", 3);
    
    // Seed initial Recruiter Interview message
    const initialChat = [
      { 
        sender: "Sarah" as const, 
        text: `Hi! Welcome to the final interview round of the ${event.name}. I've reviewed your resume and round submissions. Let's start: can you explain why you chose your tech stack or approach for your submission?` 
      }
    ];
    setChatHistory(initialChat);
    try {
      localStorage.setItem(`${localStoragePrefix}_chat`, JSON.stringify(initialChat));
    } catch(e){}
  };

  // Submit Case/Proposal
  const handleSubmitCase = () => {
    const wordCount = caseProposalText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 40) {
      alert(`Your proposal is too brief (${wordCount} words). Please write at least 40 words detailing your approach.`);
      return;
    }

    // Match keywords to calculate score
    const userLower = caseProposalText.toLowerCase();
    const matches = (eventDetails.keywords || []).filter(kw => userLower.includes(kw));
    const matchedCount = matches.length;
    
    // Base score calculations
    let score = 60 + Math.min(matchedCount * 7, 30) + Math.min(Math.floor(wordCount / 10), 10);
    score = Math.min(score, 100);

    const feedback = `AI Evaluator Feedback:\nYour proposal covers key aspects of the prompt. We detected the use of domain terms: [${matches.join(", ")}]. ${
      score > 85 
        ? "Excellent coverage of systems scaling and interface alignment rules." 
        : "Good starting canvas, but you could provide deeper details on latencies and databases."
    }`;

    setCaseScore(score);
    setCaseFeedbackText(feedback);
    setCaseSubmitted(true);
    setCurrentRound(3);

    saveToLocal("case_scr", score);
    saveToLocal("case_fdb", feedback);
    saveToLocal("case_sub", true);
    saveToLocal("case_txt", caseProposalText);
    saveToLocal("round", 3);
    
    // Seed initial Recruiter Interview message
    const initialChat = [
      { 
        sender: "Sarah" as const, 
        text: `Hi! Welcome to the final interview round of the ${event.name}. I've reviewed your resume and round submissions. Let's start: can you explain why you chose your tech stack or approach for your submission?` 
      }
    ];
    setChatHistory(initialChat);
    try {
      localStorage.setItem(`${localStoragePrefix}_chat`, JSON.stringify(initialChat));
    } catch(e){}
  };

  // Chat/Interview logic
  const handleSendChatMessage = async () => {
    if (!userInputMessage.trim()) return;
    
    const userText = userInputMessage.trim();
    const updatedHistory = [...chatHistory, { sender: "You" as const, text: userText }];
    setChatHistory(updatedHistory);
    setUserInputMessage("");
    try {
      localStorage.setItem(`${localStoragePrefix}_chat`, JSON.stringify(updatedHistory));
    } catch(e){}

    // Simulate Sarah's responses based on chat history length
    const turnCount = updatedHistory.filter(h => h.sender === "You").length;
    
    let sarahResponse = "";
    if (turnCount === 1) {
      sarahResponse = `Excellent choice. Given the specifications for ${event.host}, how would you ensure this system scales efficiently to support over 100,000 active concurrent users?`;
    } else if (turnCount === 2) {
      sarahResponse = `Great insights on optimization. Finally, how do you approach developer conflict within your team when deciding on styling choices or architecture decisions?`;
    } else {
      sarahResponse = "Thank you! I have gathered enough notes from our conversation. Please click 'Finish Challenge & Submit' below to compute your leaderboard rating.";
    }

    setTimeout(() => {
      const nextHistory = [...updatedHistory, { sender: "Sarah" as const, text: sarahResponse }];
      setChatHistory(nextHistory);
      try {
        localStorage.setItem(`${localStoragePrefix}_chat`, JSON.stringify(nextHistory));
      } catch(e){}
    }, 800);
  };

  const handleFinishChallenge = () => {
    // Calculate final scores
    const round1Weighted = ((quizScore || 0) / activeQuestions.length) * 30; // Max 30 pts
    const round2Score = eventDetails.track === "coding" 
      ? (codeSubmitted ? 95 : 0) 
      : (caseScore || 0);
    const round2Weighted = (round2Score / 100) * 45; // Max 45 pts
    
    // Interview score based on length of responses
    const userTexts = chatHistory.filter(h => h.sender === "You").map(h => h.text).join(" ");
    const wordCount = userTexts.split(/\s+/).filter(Boolean).length;
    const calculatedIntScore = Math.min(50 + Math.floor(wordCount / 3), 100);
    const round3Weighted = (calculatedIntScore / 100) * 25; // Max 25 pts

    const totalCalculated = Math.round(round1Weighted + round2Weighted + round3Weighted);
    
    // Leaderboard placement slot
    let finalRankCalculated = 12;
    if (totalCalculated >= 95) finalRankCalculated = 4;
    else if (totalCalculated >= 85) finalRankCalculated = 6;
    else if (totalCalculated >= 75) finalRankCalculated = 9;

    setFinalScore(totalCalculated);
    setFinalRank(finalRankCalculated);
    setInterviewScore(calculatedIntScore);
    setCurrentRound(4);
    setShowConfetti(true);

    saveToLocal("fin_scr", totalCalculated);
    saveToLocal("fin_rnk", finalRankCalculated);
    saveToLocal("int_scr", calculatedIntScore);
    saveToLocal("round", 4);
    
    setTimeout(() => {
      setShowConfetti(false);
    }, 4500);
  };

  // Add the User (Alex Mercer) to the local leaderboard if completed
  const activeLeaderboard = [...eventLeaderboard];
  if (currentRound === 4 && finalScore !== null && finalRank !== null) {
    const isPresent = activeLeaderboard.some(l => l.name.includes("Alex Mercer"));
    if (!isPresent) {
      activeLeaderboard.push({
        name: "Alex Mercer (You)",
        college: "University of Technology",
        score: finalScore,
        status: "Completed"
      });
    }
  }
  const sortedLeaderboard = activeLeaderboard.sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 relative text-left">
      
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <button
          onClick={onClose}
          className="flex items-center gap-2.5 text-base font-bold text-slate-350 hover:text-slate-100 transition-colors py-2 cursor-pointer group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Opportunities Hub</span>
        </button>

        {isRegistered && (
          <button
            onClick={handleResetProgress}
            className="text-xs font-bold text-rose-400 hover:text-rose-350 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            Reset Challenge Progress
          </button>
        )}
      </div>

      {/* Confetti Celebration Banner */}
      {showConfetti && (
        <div className="bg-gradient-to-r from-emerald-600/30 via-teal-600/20 to-transparent border border-emerald-500/30 rounded-3xl p-6 text-center animate-bounce">
          <h4 className="text-xl font-extrabold text-emerald-400 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" /> Congratulations! You completed the assessment.
          </h4>
          <p className="text-slate-300 text-sm mt-1">Check the Leaderboard below to view your ranking among applicants!</p>
        </div>
      )}

      {/* Hero Banner Area */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-violet-600/10 rounded-full blur-[80px]" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[12px] font-extrabold text-violet-400 bg-violet-600/20 border border-violet-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
                {event.category}
              </span>
              <span className="text-[12px] font-extrabold text-amber-400 bg-amber-600/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {event.dates}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              {event.name}
            </h1>
            <p className="text-base text-slate-400 font-light leading-relaxed">
              Hosted by <strong className="text-slate-200 font-semibold">{event.host}</strong> • Verified Live Unstop Challenge
            </p>
          </div>

          <div className="shrink-0">
            {!isRegistered ? (
              <button
                onClick={handleRegister}
                className="py-4 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl text-base font-extrabold shadow-lg shadow-violet-600/20 transition-all scale-100 hover:scale-[1.02] cursor-pointer flex items-center gap-2 group"
              >
                <span>Register for Challenge</span>
                <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <div className="py-3 px-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 text-base font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5" /> Registered & Active
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Stepper & Right Workspace */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Stages, Prizes & Resume Context */}
        <div className="space-y-8">
          
          {/* Stepper Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-5 pb-3 border-b border-slate-800">
              Challenge Rounds Progress
            </h3>

            <div className="space-y-6">
              
              {/* Round 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    currentRound > 1 
                      ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                      : currentRound === 1 && isRegistered
                      ? "bg-violet-600 border-violet-600 text-white animate-pulse" 
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}>
                    {currentRound > 1 ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : "1"}
                  </div>
                  <div className="w-0.5 h-10 bg-slate-800" />
                </div>
                <div className="text-left">
                  <h4 className={`text-base font-bold ${currentRound >= 1 && isRegistered ? "text-slate-100" : "text-slate-500"}`}>
                    Round 1: Profile MCQ Qualifier
                  </h4>
                  <p className="text-xs text-slate-400">3 structural MCQ questions</p>
                </div>
              </div>

              {/* Round 2 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    currentRound > 2 
                      ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                      : currentRound === 2
                      ? "bg-violet-600 border-violet-600 text-white animate-pulse" 
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}>
                    {currentRound > 2 ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : "2"}
                  </div>
                  <div className="w-0.5 h-10 bg-slate-800" />
                </div>
                <div className="text-left">
                  <h4 className={`text-base font-bold ${currentRound >= 2 ? "text-slate-100" : "text-slate-500"}`}>
                    Round 2: Main Assessment
                  </h4>
                  <p className="text-xs text-slate-400">
                    {eventDetails.track === "coding" ? "Interactive Coding Sandbox" : "Business Feasibility Submission"}
                  </p>
                </div>
              </div>

              {/* Round 3 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    currentRound > 3 
                      ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                      : currentRound === 3
                      ? "bg-violet-600 border-violet-600 text-white animate-pulse" 
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}>
                    {currentRound > 3 ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : "3"}
                  </div>
                  <div className="w-0.5 h-10 bg-slate-800" />
                </div>
                <div className="text-left">
                  <h4 className={`text-base font-bold ${currentRound >= 3 ? "text-slate-100" : "text-slate-500"}`}>
                    Round 3: Virtual Interview
                  </h4>
                  <p className="text-xs text-slate-400">AI Recruiter conversational panel</p>
                </div>
              </div>

              {/* Round 4 */}
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                    currentRound === 4 
                      ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                      : "bg-slate-950 border-slate-800 text-slate-500"
                  }`}>
                    {currentRound === 4 ? <Check className="h-4.5 w-4.5 stroke-[3]" /> : "4"}
                  </div>
                </div>
                <div className="text-left">
                  <h4 className={`text-base font-bold ${currentRound === 4 ? "text-slate-100" : "text-slate-500"}`}>
                    Evaluation Complete
                  </h4>
                  <p className="text-xs text-slate-400">Check final leaderboard rank</p>
                </div>
              </div>

            </div>
          </div>

          {/* Perks & Prizes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="text-amber-400 h-5 w-5" />
              Prizes & Perks
            </h3>
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
              <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Total Reward pool</span>
              <p className="text-lg font-black text-amber-400">{event.prize}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Participation Merit Certificate
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Resume compatibility badge
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Direct review check by hiring managers
              </li>
            </ul>
          </div>

          {/* Active Resume Link Compatibility */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
              <CheckCircle2 className="text-emerald-400 h-5 w-5" />
              Linked Resume Score
            </h3>
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-300 block truncate max-w-[150px]">
                  {activeResume.name}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Resume in Console</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">{activeResume.score}%</span>
                <span className="block text-[8px] text-slate-500 uppercase font-bold">ATS Match</span>
              </div>
            </div>
            <p className="text-xs text-slate-455 font-light leading-relaxed">
              Your resume represents a strong technical foundation for this event. Score high in Round 2 to boost your ultimate placement.
            </p>
          </div>

        </div>

        {/* Right Side: Interactive Working Space */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Console Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden min-h-[500px]">
            
            {/* If NOT Registered */}
            {!isRegistered && (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-6 py-16">
                <div className="h-16 w-16 bg-violet-600/15 border border-violet-500/25 rounded-3xl flex items-center justify-center text-violet-400">
                  <Code className="h-8 w-8" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-xl font-bold text-slate-200">Challenge Workspace Locked</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    You have not registered for this competition yet. Click the registration button above to unlock your MCQ screening test and coding sandbox environments!
                  </p>
                </div>
              </div>
            )}

            {/* If Registered - Round 1: MCQ Quiz */}
            {isRegistered && currentRound === 1 && (
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-200">Round 1: Screening Test</h3>
                    <p className="text-sm text-slate-400">Answer the following screening questions to verify technical competency.</p>
                  </div>
                  <span className="text-xs font-bold text-violet-400 bg-violet-600/10 px-3 py-1.5 rounded-xl border border-violet-500/20 shrink-0">
                    3 Questions Remaining
                  </span>
                </div>

                <div className="space-y-8 py-4">
                  {activeQuestions.map((item, qIdx) => (
                    <div key={qIdx} className="space-y-4">
                      <h4 className="text-base font-bold text-slate-200">
                        {qIdx + 1}. {item.q}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3.5">
                        {item.opts.map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                            className={`p-4 rounded-2xl border text-sm font-semibold transition-all cursor-pointer text-left flex justify-between items-center ${
                              quizAnswers[qIdx] === oIdx
                                ? "bg-violet-600/15 border-violet-500 text-violet-300"
                                : "bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-350 hover:text-slate-250"
                            }`}
                          >
                            <span>{opt}</span>
                            {quizAnswers[qIdx] === oIdx && <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-6 flex justify-end">
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < activeQuestions.length}
                    className="py-3 px-8 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl text-base font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:shadow-none"
                  >
                    <span>Submit and Proceed</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* If Registered - Round 2: Main Assessment (Coding) */}
            {isRegistered && currentRound === 2 && eventDetails.track === "coding" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <Code className="text-violet-400 h-5 w-5" />
                    Round 2: Algorithmic Sandbox Challenge
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Implement your solution code and compile it against local tests before submitting.</p>
                </div>

                {/* Problem Statement Box */}
                <div className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Problem: {eventDetails.title}
                  </h4>
                  <p className="text-base text-slate-300 leading-relaxed font-light font-mono">
                    {eventDetails.problemStatement}
                  </p>
                </div>

                {/* Code Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-550 font-bold px-2">
                    <span>JavaScript Runtime Editor</span>
                    <span>Standard returning signature</span>
                  </div>
                  <textarea
                    value={codeValue}
                    onChange={(e) => setCodeValue(e.target.value)}
                    className="w-full h-64 p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-y"
                    placeholder="// Write function code here..."
                  />
                </div>

                {/* Compiler Log Console */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-550 font-bold px-2 flex items-center gap-1">
                    <Terminal className="h-3.5 w-3.5" /> Output log console
                  </span>
                  <div className="w-full h-32 p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-400 overflow-y-auto space-y-1">
                    {consoleLogs.length === 0 ? (
                      <span className="text-slate-600">{"// Output log console empty. Click \"Run Test Cases\" to trigger compilation."}</span>
                    ) : (
                      consoleLogs.map((log, idx) => (
                        <div key={idx} className={
                          log.includes("[SUCCESS]") || log.includes("success") 
                            ? "text-emerald-400" 
                            : log.includes("[FAILED]") || log.includes("Error") 
                            ? "text-rose-400" 
                            : "text-slate-400"
                        }>
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6 flex justify-between items-center">
                  <button
                    onClick={handleRunTestCases}
                    className="py-3 px-6 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/50 rounded-2xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Play className="h-4.5 w-4.5" />
                    <span>Run Test Cases</span>
                  </button>

                  <button
                    onClick={handleSubmitCode}
                    className="py-3 px-8 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-base font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Submit & Proceed</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* If Registered - Round 2: Main Assessment (Case Study) */}
            {isRegistered && currentRound === 2 && eventDetails.track === "case" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <Upload className="text-violet-400 h-5 w-5" />
                    Round 2: Pitch & Case Study Submission
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Provide a text proposal of your solution. Our AI evaluator checks feasibility based on domain keywords.</p>
                </div>

                {/* Prompt Box */}
                <div className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Topic: {eventDetails.title}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                    {eventDetails.casePrompt}
                  </p>
                </div>

                {/* Uploader Input text */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-550 font-bold px-2">
                    <span>Executive Proposal Summary</span>
                    <span>Min 40 words • Words: {caseProposalText.trim().split(/\s+/).filter(Boolean).length}</span>
                  </div>
                  <textarea
                    value={caseProposalText}
                    onChange={(e) => setCaseProposalText(e.target.value)}
                    className="w-full h-52 p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-sm text-slate-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-y"
                    placeholder="Describe your design structure, user flow layout, network data transfers, state models, or metrics databases..."
                  />
                </div>

                {/* PDF/Slides Mock Uploader */}
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center space-y-3">
                  <div className="h-10 w-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center mx-auto text-slate-500">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-300 block">Upload Slides / Pitch Deck</span>
                    <span className="text-xs text-slate-500">PDF or PPTX file formats only (Max 15MB)</span>
                  </div>
                  <button className="text-xs font-bold text-violet-400 bg-violet-600/10 border border-violet-500/20 px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-violet-600/20 transition-all">
                    Choose Presentation file
                  </button>
                </div>

                <div className="border-t border-slate-800 pt-6 flex justify-end">
                  <button
                    onClick={handleSubmitCase}
                    className="py-3 px-8 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl text-base font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Submit & Proceed</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* If Registered - Round 3: Recruiter Interview Chatbot */}
            {isRegistered && currentRound === 3 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                    <MessageSquare className="text-violet-400 h-5 w-5" />
                    Round 3: Virtual Recruiter Screen
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">Converse with Sarah, Technical Recruiter at {event.host}. Complete 3 messaging exchanges.</p>
                </div>

                {/* Chat Message list */}
                <div className="w-full h-80 bg-slate-950 border border-slate-800 rounded-3xl p-5 overflow-y-auto space-y-4 flex flex-col justify-end">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {chatHistory.map((msg, idx) => (
                      <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.sender === "You" ? "ml-auto flex-row-reverse" : ""}`}>
                        <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                          msg.sender === "You" ? "bg-violet-600 text-white" : "bg-slate-850 border border-slate-700 text-amber-400"
                        }`}>
                          {msg.sender === "You" ? <User className="h-4 w-4" /> : "S"}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.sender === "You" 
                            ? "bg-violet-600/15 border border-violet-500/20 text-slate-200 rounded-tr-none" 
                            : "bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none"
                        }`}>
                          <strong className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                            {msg.sender}
                          </strong>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat messaging input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={userInputMessage}
                    onChange={(e) => setUserInputMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSendChatMessage(); }}
                    className="flex-1 py-3.5 px-5 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    placeholder="Type your response to Sarah..."
                  />
                  <button
                    onClick={handleSendChatMessage}
                    className="h-12 w-12 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors shadow-lg shadow-violet-600/10"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>

                {/* Final Submission Button */}
                {chatHistory.filter(h => h.sender === "You").length >= 3 && (
                  <div className="border-t border-slate-800 pt-6 flex justify-end">
                    <button
                      onClick={handleFinishChallenge}
                      className="py-4 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-base font-extrabold shadow-lg transition-all flex items-center gap-2 cursor-pointer scale-100 hover:scale-[1.02]"
                    >
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <span>Finish Challenge & Submit</span>
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* If Registered - Round 4: Completed Workspace Stats */}
            {isRegistered && currentRound === 4 && (
              <div className="space-y-6 text-center py-8">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/25 rounded-full flex items-center justify-center text-emerald-400 mx-auto animate-pulse">
                  <Check className="h-8 w-8 stroke-[3.5]" />
                </div>
                
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-2xl font-black text-slate-100">Submission Evaluation Complete!</h2>
                  <p className="text-sm text-slate-450 leading-relaxed">
                    Thank you for participating in the {event.name}. Your rounds profiles have been graded and compiled into the live Unstop event records.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto pt-6">
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">R1 (Quiz)</span>
                    <strong className="text-base font-extrabold text-slate-200">
                      {quizScore} / {activeQuestions.length}
                    </strong>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">R2 (Assessment)</span>
                    <strong className="text-base font-extrabold text-slate-200">
                      {eventDetails.track === "coding" ? "95" : caseScore} / 100
                    </strong>
                  </div>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">R3 (Interview)</span>
                    <strong className="text-base font-extrabold text-slate-200">
                      {interviewScore} / 100
                    </strong>
                  </div>
                  <div className="p-4 bg-violet-600/10 border border-violet-500/20 rounded-2xl shadow-inner">
                    <span className="block text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-1">Total score</span>
                    <strong className="text-lg font-black text-violet-400">{finalScore} %</strong>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-amber-600/10 via-amber-600/5 to-transparent border border-amber-500/20 rounded-2xl max-w-md mx-auto flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">Event Placement</span>
                    <strong className="text-lg font-bold text-slate-200">Live Leaderboard Rank</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-amber-400"># {finalRank}</span>
                  </div>
                </div>

                {caseFeedbackText && (
                  <div className="max-w-md mx-auto p-4 bg-slate-950 border border-slate-800 rounded-xl text-left font-mono text-xs text-slate-400 whitespace-pre-line leading-relaxed">
                    {caseFeedbackText}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Live Leaderboard list */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5 mb-6">
              <div className="text-left space-y-1">
                <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                  <Star className="text-amber-400 h-5.5 w-5.5" />
                  Live Event Leaderboard
                </h3>
                <p className="text-sm text-slate-400">Current ranks of the highest-scoring student candidates in this track.</p>
              </div>

              <span className="text-xs font-bold text-slate-500 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl">
                Track: {eventDetails.track === "coding" ? "Algorithmic Development" : "SaaS Feasibility Business"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-550 uppercase tracking-widest">
                    <th className="pb-3 pl-2">Rank</th>
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3 hidden sm:table-cell">Institution</th>
                    <th className="pb-3 text-right pr-2">ATS Comp Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-sm">
                  {sortedLeaderboard.map((item, idx) => {
                    const isUser = item.name.includes("You");
                    return (
                      <tr key={idx} className={`group ${isUser ? "bg-violet-600/10 border-y border-violet-500/25" : "hover:bg-slate-850/30"}`}>
                        <td className={`py-4 pl-2 font-black ${
                          idx === 0 ? "text-amber-400" : idx === 1 ? "text-slate-300" : idx === 2 ? "text-amber-600" : "text-slate-500"
                        }`}>
                          # {idx + 1}
                        </td>
                        <td className="py-4">
                          <span className={`font-bold block ${isUser ? "text-violet-400" : "text-slate-350"}`}>
                            {item.name}
                          </span>
                          <span className="text-[10px] text-slate-500 sm:hidden block mt-0.5">{item.college}</span>
                        </td>
                        <td className="py-4 text-slate-400 font-light hidden sm:table-cell">
                          {item.college}
                        </td>
                        <td className="py-4 text-right pr-2 font-extrabold text-slate-200">
                          {item.score} %
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
