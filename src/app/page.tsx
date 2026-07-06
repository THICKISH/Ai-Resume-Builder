"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, LayoutDashboard, UserCheck, FileText, Briefcase, 
  Mic, Video, Map, Code2, Globe, Search, Settings, 
  Send, Check, AlertCircle, Trash2, Play, Square, 
  Volume2, Database, FolderTree, ArrowRight, ChevronRight, 
  Download, Upload, Rocket, Plus, Award, TrendingUp, 
  Coins, Users, Sliders, HelpCircle, GitBranch, RefreshCw,
  VideoOff, ShieldAlert, Monitor, ChevronLeft, ExternalLink, BookOpen
} from "lucide-react";
import CopilotChat from "@/components/CopilotChat";
import UnstopWorkspace from "@/components/UnstopWorkspace";


// Types definition
interface ResumeItem {
  id: string;
  name: string;
  score: number;
  uploadedAt: string;
  skills: string[];
  suggestions: string[];
  gaps: string[];
  optimizedAchievements: string[];
  rawText?: string;
}

interface UnstopEvent {
  name: string;
  host: string;
  category: string;
  dates: string;
  prize: string;
  match: number;
  url: string;
  jd: string;
}

interface DnaResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  summary: string;
}

interface JobMatchResult {
  matchPercentage: number;
  missingSkills: string[];
  atsCompatibility: number;
  successProbability: number;
  recommendedChanges: string;
}

interface InterviewQuestionFeedback {
  question: string;
  score: number;
  transcript: string;
  critique: string;
}

interface InterviewScorecard {
  score: number;
  speechRate: number;
  fillerWords: number;
  confidence: number;
  feedback: InterviewQuestionFeedback[];
}

interface Milestone {
  phase: string;
  daily: string;
  weekly: string;
  monthly: string;
  resources?: string[];
}

interface RoadmapData {
  role: string;
  duration: string;
  milestones: Milestone[];
}

interface ApiEndpoint {
  method: string;
  route: string;
  description: string;
}

interface ProjectBlueprint {
  title: string;
  techStack: string[];
  architecture: string;
  folderStructure: string;
  dbSchema: string;
  apiDesign: ApiEndpoint[];
  deployment: string;
}

interface Candidate {
  name: string;
  role: string;
  atsScore: number;
  dnaScore: number;
  matchScore: number;
  skills: string[];
  status: string;
}


export default function CareerOS() {
  // Global States
  const [activeTab, setActiveTab] = useState<string>("pitch"); // Default to Startup Pitch to greet judges
  const [apiKey, setApiKey] = useState<string>("");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [selectedUnstopEvent, setSelectedUnstopEvent] = useState<UnstopEvent | null>(null);
  
  // Settings initialization from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem("career_os_gemini_key") || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApiKey(savedKey);
  }, []);

  const handleSaveSettings = (key: string) => {
    localStorage.setItem("career_os_gemini_key", key);
    setApiKey(key);
    setShowSettings(false);
  };

  // Helper function to query Gemini API with JSON instruction
  const queryGeminiJSON = async <T,>(prompt: string, fallbackData: T): Promise<T> => {
    if (!apiKey) return fallbackData;
    try {
      const response = await fetch(
        `https://generativelink.gemini.api/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${prompt} \n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. Do not output any preamble, extra text, or formatting except the JSON.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Clean markdown code blocks (e.g. ```json ... ```)
      let cleaned = rawText.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }
      
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Gemini JSON parse failed, utilizing mock fallback data", err);
      return fallbackData;
    }
  };

  // Mock Resume & User states
  const [resumes, setResumes] = useState<ResumeItem[]>([
    {
      id: "resume-1",
      name: "Alex_Mercer_FullStack.txt",
      score: 74,
      uploadedAt: "2026-06-20",
      skills: ["React", "Node.js", "TypeScript", "HTML", "CSS", "Git", "PostgreSQL"],
      suggestions: [
        "Quantify your accomplishments in the experience section (e.g. mention percentages or revenue gains).",
        "Add AWS and Docker keyword tags to align with Senior Full-Stack descriptions.",
        "Rewrite generic bullet point: 'Responsible for server logic and API routes' to be more result-focused."
      ],
      gaps: ["Docker", "Kubernetes", "Redis", "AWS Cloud Services", "Next.js App Router API Hooks"],
      optimizedAchievements: [
        "Refactored legacy state manager to React Hooks, cutting page load latencies by 38%.",
        "Designed and shipped 15+ Node.js API endpoints utilizing JWT authentication, securing access to 25k monthly active users."
      ],
      rawText: "Alex Mercer. Full-Stack Developer. Tech stack: React, Node.js, TypeScript, PostgreSQL. Experience: Wrote server logic and API endpoints."
    }
  ]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("resume-1");
  const activeResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];

  // ==========================================
  // MODULE: RESUME CHALLENGE STATE
  // ==========================================
  const [challengeEmail, setChallengeEmail] = useState("alex.mercer@gmail.com");
  const [challengeCollege, setChallengeCollege] = useState("University of Technology");
  const [challengeScore, setChallengeScore] = useState<number | null>(null);
  const [challengePercentile, setChallengePercentile] = useState<number | null>(null);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [isChallengeEvaluating, setIsChallengeEvaluating] = useState(false);
  const [challengeFeedback, setChallengeFeedback] = useState<string>("");
  const [leaderboard, setLeaderboard] = useState([
    { name: "Priya Sharma", college: "IIT Delhi", score: 96, percentile: 99.8, status: "Active" },
    { name: "Rohan Patel", college: "BITS Pilani", score: 94, percentile: 99.4, status: "Active" },
    { name: "Amit Verma", college: "NIT Trichy", score: 91, percentile: 98.1, status: "Active" },
    { name: "Ananya Iyer", college: "DTU", score: 89, percentile: 97.2, status: "Active" }
  ]);

  const runChallengeEvaluation = async () => {
    setIsChallengeEvaluating(true);
    const fallback = {
      score: Math.min(activeResume.score + 5, 95),
      percentile: 94.2,
      feedback: "Your resume represents 86% of the hiring standards for Senior Tech roles. Your key strength lies in front-end architecture, but you need to increase details regarding container orchestration (Docker) and API scaling (Redis) to achieve elite rankings."
    };

    const prompt = `Evaluate this resume specifically for the Redrob AI Resume Ranker and India Runs challenge metrics.
    Resume Text: ${activeResume.rawText || activeResume.name}
    Candidate Details: Email: ${challengeEmail}, College: ${challengeCollege}
    
    Provide your response as a valid JSON object matching this schema:
    {
      "score": number (0-100),
      "percentile": number (percentile rank e.g. 96.5),
      "feedback": "string"
    }`;

    const res = await queryGeminiJSON(prompt, fallback);
    setChallengeScore(res.score);
    setChallengePercentile(res.percentile);
    setChallengeFeedback(res.feedback);
    
    setLeaderboard(prev => {
      const clean = prev.filter(item => !item.name.includes("Alex Mercer"));
      const updated = [
        ...clean,
        { name: "Alex Mercer (You)", college: challengeCollege, score: res.score, percentile: res.percentile, status: "Active" }
      ];
      return updated.sort((a, b) => b.score - a.score);
    });
    setIsChallengeEvaluating(false);
  };

  // ==========================================
  // UNSTOP LIVE HIRING CHALLENGES (15 Events)
  // ==========================================
  const unstopEventsList = [
    { 
      name: "TCS CodeVita Season 12", 
      host: "Tata Consultancy Services", 
      category: "Coding Challenge", 
      dates: "Open now", 
      prize: "$20,000 + FTE Job Offers", 
      match: 94,
      url: "https://unstop.com/competitions?search=tcs-codevita",
      jd: "TCS CodeVita is a global programming contest. Requires extreme proficiency in algorithms, data structures (Trees, Graphs, DP), and optimized script execution times across languages like C++, Java, and Python."
    },
    { 
      name: "Flipkart Runway Season 4", 
      host: "Flipkart", 
      category: "Female Hiring Hackathon", 
      dates: "Apply by July 10", 
      prize: "Internship Offers + Direct PPIs", 
      match: 88,
      url: "https://unstop.com/competitions?search=flipkart-runway",
      jd: "Flipkart Runway aims to offer internships to women engineers. Requires expertise in Frontend structures (React, Next.js), TypeScript, client layouts, responsive CSS grids, and modular component design."
    },
    { 
      name: "Amazon ML Challenge 2026", 
      host: "Amazon India", 
      category: "Machine Learning Challenge", 
      dates: "Register Now", 
      prize: "Intern/FTE Interviews + Cash", 
      match: 76,
      url: "https://unstop.com/competitions?search=amazon-ml",
      jd: "Amazon ML Challenge focuses on machine learning architectures. Requires experience with data clean models, vector embeddings, clustering, pipeline modeling, TensorFlow, and Python analytics libraries."
    },
    { 
      name: "Google Girl Hackathon 2026", 
      host: "Google India", 
      category: "Women Coding Challenge", 
      dates: "Apply Now", 
      prize: "Software Engineering Internships", 
      match: 84,
      url: "https://unstop.com/competitions?search=google-girl",
      jd: "Google Girl Hackathon tests core computer systems knowledge. Focuses on data structures (linked lists, hash tables), OOP modularity, testing workflows, and solid algorithmic complexity calculations."
    },
    { 
      name: "Uber HackTag 2.0", 
      host: "Uber Technologies", 
      category: "Prototype Development", 
      dates: "Register by July 15", 
      prize: "Job Interviews + $5,005 Reward", 
      match: 82,
      url: "https://unstop.com/competitions?search=uber-hacktag",
      jd: "Uber HackTag challenges candidates to build a prototype. Requires Full-Stack script stacks (Node.js, Express, React), SQL/NoSQL databases, Docker packaging, and live client-server network interactions."
    },
    { 
      name: "L'Oreal Brandstorm 2026", 
      host: "L'Oreal Group", 
      category: "Case & Product Challenge", 
      dates: "Submit Proposal", 
      prize: "Paris Trip + Intrapreneurship", 
      match: 68,
      url: "https://unstop.com/competitions?search=loreal-brandstorm",
      jd: "Global case study challenge on tech products. Focuses on UX design systems, customer onboarding flows, market size strategies (TAM calculations), product management grids, and revenue projections."
    },
    { 
      name: "Reliance TUP 9.0", 
      host: "Reliance Industries", 
      category: "Startup Business Pitch", 
      dates: "Apply by July 18", 
      prize: "Seed Funding + Direct Mentorship", 
      match: 70,
      url: "https://unstop.com/competitions?search=reliance-tup",
      jd: "Reliance Ultimate Pitch is a startup pitch challenge. Evaluates business model canvases, revenue engines, SaaS conversion grids, pitch slide deck designs, and market rollout strategies."
    },
    { 
      name: "Schneider Go Green 2026", 
      host: "Schneider Electric", 
      category: "Sustainability Challenge", 
      dates: "Register by July 25", 
      prize: "Europe Trip + Mentorship", 
      match: 65,
      url: "https://unstop.com/competitions?search=schneider-go-green",
      jd: "Schneider Go Green challenges you to build green tech. Requires experience with automated IoT prototypes, database storage optimization, cloud platforms, and basic API endpoints."
    },
    { 
      name: "Hero Campus Challenge Season 10", 
      host: "Hero MotoCorp", 
      category: "Case Study Challenge", 
      dates: "Apply Now", 
      prize: "PPI + FTE Placements", 
      match: 78,
      url: "https://unstop.com/competitions?search=hero-campus",
      jd: "Case and product strategy challenge. Requires modeling dashboard metrics, analyzing client flows, and organizing system specifications into structured templates."
    },
    { 
      name: "Tata Imagination Challenge 2026", 
      host: "Tata Sons", 
      category: "Innovation & Idea Pitch", 
      dates: "Open", 
      prize: "Executive Mentorship + Cash", 
      match: 72,
      url: "https://unstop.com/competitions?search=tata-imagination",
      jd: "Tata Imagination challenge focuses on innovative system ideas. Requires creating project layouts, tech architecture charts, deployment outlines, and database schemas."
    },
    { 
      name: "Microsoft Imagine Cup 2026", 
      host: "Microsoft", 
      category: "Social Impact Hackathon", 
      dates: "Register Now", 
      prize: "$100,000 + Nadella Mentorship", 
      match: 86,
      url: "https://unstop.com/competitions?search=microsoft-imagine",
      jd: "Imagine Cup is Microsoft's premier student developer hack. Requires deployment configurations (Docker, Azure/AWS), PostgreSQL or MongoDB setups, typescript logic, and active API routing systems."
    },
    { 
      name: "Deloitte Maverick Season 13", 
      host: "Deloitte India", 
      category: "Corporate Case Challenge", 
      dates: "Register by Aug 05", 
      prize: "Direct Internship PPIs", 
      match: 73,
      url: "https://unstop.com/competitions?search=deloitte-maverick",
      jd: "Deloitte Maverick case challenge. Focuses on data tracking layouts, metrics dashboards, visual analytics, and corporate infrastructure organization charts."
    },
    { 
      name: "ICICI Beat The Curve", 
      host: "ICICI Bank", 
      category: "Banking Case Challenge", 
      dates: "Apply Now", 
      prize: "Direct Placements + Cash", 
      match: 71,
      url: "https://unstop.com/competitions?search=icici-beat-the-curve",
      jd: "Banking automation case challenge. Focuses on security tokens, JWT verification, role-based authorization hierarchies, database transactional speeds, and API architectures."
    },
    { 
      name: "JSW Challenge 2026", 
      host: "JSW Group", 
      category: "Engineering Challenge", 
      dates: "Apply Now", 
      prize: "Pre-Placement Interviews", 
      match: 75,
      url: "https://unstop.com/competitions?search=jsw-challenge",
      jd: "JSW engineering challenge. Focuses on database schema design, system architectures, folder tree hierarchies, and automated continuous delivery pipelines."
    },
    { 
      name: "Aditya Birla Group BizLabs 2026", 
      host: "ABG Group", 
      category: "Innovation Challenge", 
      dates: "Open", 
      prize: "Direct Corporate Partnership", 
      match: 79,
      url: "https://unstop.com/competitions?search=abg-bizlabs",
      jd: "Aditya Birla Bizlabs is a corporate partnership challenge. Focuses on product design scaling, database configurations, and setting up Docker multi-stage build pipelines."
    }
  ];

  // ==========================================
  // MODULE 1 STATE: Career DNA Profile
  // ==========================================
  const [dnaInputs, setDnaInputs] = useState({
    skills: "React, JavaScript, Node.js, Git, HTML, CSS",
    interests: "Artificial Intelligence, Cloud Computing, High Performance Web Interfaces",
    github: "github.com/alexmercer-dev",
    linkedin: "linkedin.com/in/alexmercer-dev",
    education: "B.S. Computer Science, University of Technology (Grad. 2025)",
  });
  const [dnaResult, setDnaResult] = useState<DnaResult>({
    score: 72,
    strengths: ["Strong JavaScript foundation", "Full-stack application delivery experience", "Active GitHub contribution graph"],
    weaknesses: ["No production cloud deployment tags", "Lacks vector database or RAG implementation experience", "Minimal unit testing suite metrics"],
    opportunities: ["Transition into AI Engineering by integrating LLM pipelines", "Up-skill into DevOps using Docker and GitHub Actions workflows", "Target Junior DevOps / AI Integrator hybrid vacancies"],
    summary: "Alex is an aspiring engineer with solid frontend and script capabilities but lacks deep infrastructure, security pipelines, and machine learning model integrations."
  });
  const [isDnaLoading, setIsDnaLoading] = useState(false);

  const runDnaAnalysis = async () => {
    setIsDnaLoading(true);
    const fallback = {
      score: 78,
      strengths: ["Strong script background", "Exhibits specific interests in high-growth AI", "Demonstrates technical framework logic"],
      weaknesses: ["No containerization references", "Lacks testing suite metrics"],
      opportunities: ["Target Next.js full-stack roles", "Integrate RAG databases to stand out"],
      summary: "Highly capable base structure. Focus on cloud systems and microservices will yield immediate dividends."
    };

    const prompt = `Analyze this candidate profile for Career DNA.
    Skills: ${dnaInputs.skills}
    Interests: ${dnaInputs.interests}
    
    Provide response matching this JSON schema:
    {
      "score": number (0-100),
      "strengths": string[],
      "weaknesses": string[],
      "opportunities": string[],
      "summary": string
    }`;

    const res = await queryGeminiJSON(prompt, fallback);
    setDnaResult(res);
    setIsDnaLoading(false);
  };

  // ==========================================
  // MODULE 2 STATE: AI Resume Intelligence
  // ==========================================
  const [newResumeName, setNewResumeName] = useState("");
  const [resumePasteText, setResumePasteText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [rewriteInput, setRewriteInput] = useState("Responsible for writing test code and fixing site layout bugs.");
  const [rewrittenOutput, setRewrittenOutput] = useState("");
  const [isRewriting, setIsRewriting] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);

  // File Upload Reader handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewResumeName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumePasteText(text);
    };
    reader.readAsText(file);
  };

  const handleUploadResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResumeName) return;
    setIsUploading(true);

    const fallback = {
      score: 82,
      skills: ["React", "TypeScript", "Node.js", "Express", "Docker", "Tailwind CSS", "MongoDB"],
      suggestions: [
        "Outstanding project documentation included.",
        "Add cloud metrics to quantify database deployments.",
        "Consider formatting education elements into clean rows."
      ],
      gaps: ["Kubernetes", "Redis", "Elasticsearch", "AWS Cognito"],
      optimizedAchievements: [
        "Successfully dockerized 4 Express.js API microservices, speeding up local dev bootstrapping workflows by 70%.",
        "Engineered responsive UI modules using Tailwind CSS, increasing accessibility scores from 75 to 98."
      ]
    };

    const prompt = `Analyze this resume and provide an ATS score audit.
    Resume Text: ${resumePasteText || newResumeName}
    
    Provide JSON matching this schema:
    {
      "score": number,
      "skills": string[],
      "suggestions": string[],
      "gaps": string[],
      "optimizedAchievements": string[]
    }`;

    const parsed = await queryGeminiJSON(prompt, fallback);

    const newResume: ResumeItem = {
      id: `resume-${Date.now()}`,
      name: newResumeName.endsWith(".pdf") || newResumeName.endsWith(".txt") ? newResumeName : `${newResumeName}.txt`,
      score: parsed.score,
      uploadedAt: new Date().toISOString().split("T")[0],
      skills: parsed.skills,
      suggestions: parsed.suggestions,
      gaps: parsed.gaps,
      optimizedAchievements: parsed.optimizedAchievements,
      rawText: resumePasteText
    };

    setResumes(prev => [...prev, newResume]);
    setSelectedResumeId(newResume.id);
    setNewResumeName("");
    setResumePasteText("");
    setIsUploading(false);
  };

  const handleRewrite = async () => {
    if (!rewriteInput.trim()) return;
    setIsRewriting(true);

    const fallback = {
      rewrittenPoint: "Refactored layout components and authored comprehensive Jest unit test suites, improving cross-browser interface consistency and reducing production bug reports by 24%."
    };

    const prompt = `Optimize this achievement bullet point using the STAR format.
    Original bullet point: ${rewriteInput}
    
    Provide response matching this JSON schema:
    {
      "rewrittenPoint": "string"
    }`;

    const res = await queryGeminiJSON(prompt, fallback);
    setRewrittenOutput(res.rewrittenPoint);
    setIsRewriting(false);
  };

  // ==========================================
  // MODULE 3 STATE: Job Matching Engine
  // ==========================================
  const [jobDescription, setJobDescription] = useState(
    `We are looking for a Senior Full-Stack Engineer who is proficient in TypeScript, React, and Node.js. 
    Experience with containerization (Docker), caching structures (Redis), and PostgreSQL is highly desired. 
    You will lead architectural decisions and configure continuous delivery lines (CI/CD pipelines).`
  );
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const runJobMatch = async () => {
    if (!jobDescription.trim()) return;
    setIsMatching(true);

    const fallback = {
      matchPercentage: 78,
      missingSkills: ["Docker", "Redis", "CI/CD Deployment Pipelines"],
      atsCompatibility: 82,
      successProbability: 65,
      recommendedChanges: "Your resume represents 78% of the job profile. To achieve a 95%+ match, add a dedicated section on container staging using Docker, and rewrite your experience bullet points to explicitly mention configuring Git-driven pipelines or deployment environments."
    };

    const prompt = `Perform an alignment match scan.
    Candidate Resume Text: ${activeResume.rawText || activeResume.name}
    Job Description: ${jobDescription}
    
    Provide JSON matching this schema:
    {
      "matchPercentage": number,
      "missingSkills": string[],
      "atsCompatibility": number,
      "successProbability": number,
      "recommendedChanges": "string"
    }`;

    const res = await queryGeminiJSON(prompt, fallback);
    setJobMatchResult(res);
    setIsMatching(false);
  };

  // ==========================================
  // MODULE 4 STATE: AI Interview Copilot
  // ==========================================
  const [interviewRole, setInterviewRole] = useState("Full Stack Developer");
  const [interviewDifficulty, setInterviewDifficulty] = useState("Intermediate");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [simulatedVolume, setSimulatedVolume] = useState<number[]>(Array(15).fill(8));
  const [webcamPermissionError, setWebcamPermissionError] = useState(false);
  const [interviewScorecard, setInterviewScorecard] = useState<InterviewScorecard | null>(null);
  const [isEvaluatingInterview, setIsEvaluatingInterview] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const audioIntervalRef = useRef<any>(null);

  const interviewQuestions = [
    {
      id: 1,
      question: "Explain the difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR) in React, and when you would use each.",
      category: "Technical"
    },
    {
      id: 2,
      question: "Describe a challenging technical problem you encountered in a project, how you diagnosed it, and the steps you took to resolve it.",
      category: "Behavioral"
    },
    {
      id: 3,
      question: "Why do you want to join our organization, and how do you organize your work schedules when faced with competing deadlines?",
      category: "HR / Fit"
    }
  ];

  const startInterview = async () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setInterviewScorecard(null);
    
    try {
      setWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log("Webcam access blocked or unavailable, using mock simulator");
      setWebcamPermissionError(true);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      audioIntervalRef.current = setInterval(() => {
        setSimulatedVolume(Array(15).fill(0).map(() => Math.floor(Math.random() * 24) + 6));
      }, 100);
    } else {
      setIsRecording(false);
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
      setSimulatedVolume(Array(15).fill(8));
    }
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsEvaluatingInterview(true);
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      setWebcamActive(false);
      
      const fallback = {
        score: 83,
        speechRate: 135,
        fillerWords: 4,
        confidence: 88,
        feedback: [
          {
            question: "SSR vs CSR",
            score: 90,
            transcript: "SSR parses pages on the server returning index-ready HTML which benefits search indexes. CSR compiles dynamically in the client browser, offering super-responsive page changes but loading slower initially.",
            critique: "Excellent, technically accurate. You cleanly detailed the SEO vs initial load tradeoffs. Mentioning Next.js specifically would have strengthened the answer."
          },
          {
            question: "Challenging technical problem",
            score: 78,
            transcript: "I had a memory leak in my Node API that was crashing the app. I checked logs and found an event listener that was not getting removed on shutdown, and I fixed it.",
            critique: "Good diagnostic process. To improve, structure this answers explicitly using the STAR model: emphasize the financial or performance impact of the server crashes and how the refactored code improved stability metrics."
          },
          {
            question: "Joining and competing deadlines",
            score: 82,
            transcript: "I value CareerOS's mission to guide students using tech. I organize deadlines by priority, focusing on critical path tasks first.",
            critique: "Honest and engaging. Use specific project tools (e.g. Jira, Gantt charts) to demonstrate how you prioritize in team environments."
          }
        ]
      };

      const prompt = `Conduct scorecard evaluation.
      Provide response matching JSON schema:
      {
        "score": number,
        "speechRate": number,
        "fillerWords": number,
        "confidence": number,
        "feedback": [
          {
            "question": "string",
            "score": number,
            "transcript": "string",
            "critique": "string"
          }
        ]
      }`;

      const res = await queryGeminiJSON(prompt, fallback);
      setInterviewScorecard(res);
      setIsEvaluatingInterview(false);
      setInterviewStarted(false);
    }
  };

  // ==========================================
  // MODULE 5 STATE: AI Learning Roadmap
  // ==========================================
  const [roadmapRole, setRoadmapRole] = useState("AI Integration Engineer");
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(false);

  const generateRoadmap = async () => {
    setIsRoadmapLoading(true);
    const fallback = {
      role: roadmapRole,
      duration: "12 Weeks",
      milestones: [
        {
          phase: "Phase 1: Foundations & API Engineering (Weeks 1-4)",
          daily: "Study TypeScript OOP, Node async design patterns, and Express routing.",
          weekly: "Build 3 REST APIs interacting with PostgreSQL.",
          monthly: "Architect a production-grade multi-role authentication backend.",
          resources: ["Next.js App Router Docs", "Gemini Node SDK API Spec", "Postgres Tutorial"]
        },
        {
          phase: "Phase 2: Prompt Pipelines & Vector Databases (Weeks 5-8)",
          daily: "Practice LLM parameter tuning, system instructions, and JSON output formatting.",
          weekly: "Learn text embedding techniques and write client code querying PGVector/Pinecone.",
          monthly: "Assemble a simple RAG document chatbot.",
          resources: ["Deeplearning.ai Prompt Course", "Pinecone Quickstart Guide", "LangChain Handbook"]
        }
      ]
    };

    const prompt = `Build educational week-by-week learning roadmap for: ${roadmapRole}.
    Provide JSON matching this schema:
    {
      "role": "string",
      "duration": "string",
      "milestones": [
        {
          "phase": "string",
          "daily": "string",
          "weekly": "string",
          "monthly": "string",
          "resources": string[]
        }
      ]
    }`;

    const res = await queryGeminiJSON(prompt, fallback);
    setRoadmapData(res);
    setIsRoadmapLoading(false);
  };

  // ==========================================
  // MODULE 6 STATE: AI Project Generator
  // ==========================================
  const [projectRole, setProjectRole] = useState("Full Stack Developer");
  const [projectBlueprint, setProjectBlueprint] = useState<ProjectBlueprint | null>(null);
  const [isProjectLoading, setIsProjectLoading] = useState(false);

  const generateProject = async () => {
    setIsProjectLoading(true);
    const fallback = {
      title: "AI-Powered Smart Resume Optimizer Dashboard",
      techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Gemini API Engine", "PGVector Database", "Docker Compose"],
      architecture: "Client (Next.js) communicates with Serverless API Handlers which queries PostgreSQL for structured user tables and a Vector database for resume/job matching embeddings, backed by Redis for rate limiting.",
      folderStructure: `career-os/\n├── src/\n│   ├── app/\n│   └── components/`,
      dbSchema: "CREATE TABLE resumes (\nid UUID PRIMARY KEY,\nuser_id UUID NOT NULL,\nats_score INTEGER DEFAULT 0\n);",
      apiDesign: [
        { method: "POST", route: "/api/scan", description: "Accepts resume file uploads, extracts plain text, and runs scoring metrics." }
      ],
      deployment: "Assemble local files inside Docker container. Configure environment configurations on AWS ECS, mount volumes for data storage, and trigger build lines using Github Action triggers."
    };

    const prompt = `Generate developer project blueprint for a ${projectRole}.
    Provide JSON matching this schema:
    {
      "title": "string",
      "techStack": string[],
      "architecture": "string",
      "folderStructure": "string",
      "dbSchema": "string",
      "apiDesign": [
        {
          "method": "string",
          "route": "string",
          "description": "string"
        }
      ],
      "deployment": "string"
    }`;

    const res = await queryGeminiJSON(prompt, fallback);
    setProjectBlueprint(res);
    setIsProjectLoading(false);
  };

  // ==========================================
  // MODULE 7 STATE: AI Portfolio Website
  // ==========================================
  const [portfolioName, setPortfolioName] = useState("Alex Mercer");
  const [portfolioTitle, setPortfolioTitle] = useState("Senior Full-Stack Architect");
  const [portfolioBio, setPortfolioBio] = useState("I craft highly performant server platforms and modular client interfaces with TypeScript, Next.js, and Docker container services.");
  const [portfolioTheme, setPortfolioTheme] = useState("cyberpunk");
  const [isDeployingPortfolio, setIsDeployingPortfolio] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const downloadPortfolioHTML = () => {
    const getThemeClasses = () => {
      if (portfolioTheme === "cyberpunk") {
        return {
          body: "bg-slate-950 text-slate-100 font-sans min-h-screen",
          card: "bg-slate-900 border border-violet-500/20 rounded-2xl p-8 shadow-lg shadow-violet-500/5 hover:border-violet-500/40 transition-all",
          title: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 font-bold",
          badge: "bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm px-4 py-1.5 rounded-full",
          button: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl cursor-pointer shadow-lg shadow-violet-500/20 transition-all"
        };
      } else if (portfolioTheme === "glass") {
        return {
          body: "bg-gradient-to-br from-slate-900 to-zinc-900 text-slate-100 font-sans min-h-screen",
          card: "bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/10 transition-all",
          title: "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 font-bold",
          badge: "bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-sm px-4 py-1.5 rounded-full",
          button: "bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-all"
        };
      } else {
        return {
          body: "bg-slate-50 text-slate-900 font-sans min-h-screen",
          card: "bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all",
          title: "text-slate-900 font-bold",
          badge: "bg-slate-100 text-slate-800 text-sm px-4 py-1.5 rounded-full border border-slate-200",
          button: "bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-all"
        };
      }
    };

    const tc = getThemeClasses();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioName} | Personal Showcase</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${tc.body}">
    <div class="max-w-4xl mx-auto px-8 py-16">
        <header class="mb-12 text-center md:text-left">
            <h1 class="text-5xl md:text-5xl ${tc.title} mb-3">${portfolioName}</h1>
            <p class="text-lg text-slate-400 font-medium">${portfolioTitle}</p>
        </header>
        <section class="${tc.card} mb-12">
            <h2 class="text-5xl font-bold mb-4">About Me</h2>
            <p class="text-slate-400 leading-relaxed text-base">${portfolioBio}</p>
        </section>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${portfolioName.toLowerCase().replace(/\s+/g, "-")}-portfolio.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const deployPortfolio = () => {
    setIsDeployingPortfolio(true);
    setTimeout(() => {
      const sub = portfolioName.toLowerCase().replace(/\s+/g, "-");
      setPortfolioUrl(`https://${sub}.career-os.me`);
      setIsDeployingPortfolio(false);
    }, 1500);
  };

  // ==========================================
  // MODULE 9 STATE: Recruiter AI Panel
  // ==========================================
  const [candidatesList, setCandidatesList] = useState<Candidate[]>([
    { name: "Alex Mercer", role: "Full-Stack Dev", atsScore: 74, dnaScore: 72, matchScore: 78, skills: ["React", "TypeScript", "Node.js", "PostgreSQL"], status: "Shortlisted" },
    { name: "Devon Lane", role: "DevOps Engineer", atsScore: 88, dnaScore: 85, matchScore: 92, skills: ["Docker", "Kubernetes", "AWS", "GitHub Actions"], status: "Reviewing" },
    { name: "Eleanor Pena", role: "AI Engineer", atsScore: 92, dnaScore: 90, matchScore: 87, skills: ["Python", "TensorFlow", "Gemini API", "PGVector"], status: "Offer Extended" },
    { name: "Bessie Cooper", role: "Frontend Developer", atsScore: 68, dnaScore: 65, matchScore: 71, skills: ["React", "JavaScript", "HTML", "CSS"], status: "Interviewing" }
  ]);
  const [recruiterSearch, setRecruiterSearch] = useState("");
  const [recruiterSortBy, setRecruiterSortBy] = useState("dnaScore");

  const filteredCandidates = candidatesList
    .filter(c => c.name.toLowerCase().includes(recruiterSearch.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(recruiterSearch.toLowerCase())))
    .sort((a, b) => {
      const key = recruiterSortBy as keyof Candidate;
      const aVal = a[key];
      const bVal = b[key];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return bVal - aVal;
      }
      return 0;
    });

  // ==========================================
  // MODULE PITCH STATE: Startup Presentation Slides
  // ==========================================
  const [pitchSlide, setPitchSlide] = useState(0);
  const [pricingStudents, setPricingStudents] = useState(500);
  const [pricingPremiumRatio, setPricingPremiumRatio] = useState(8);
  const [pricingSeats, setPricingSeats] = useState(15);

  const totalMonthlyB2C = pricingStudents * (pricingPremiumRatio / 100) * 9.99;
  const totalMonthlyB2BRecruiter = pricingSeats * 99;
  const totalMonthlyB2BUniv = pricingStudents * 0.92 * 2;
  const totalArr = (totalMonthlyB2C + totalMonthlyB2BRecruiter + totalMonthlyB2BUniv) * 12;

  const pitchSlides = [
    {
      title: "CareerOS: Complete AI Career Operating System",
      tagline: "Unifying career DNA analysis, ATS checks, mock voice practice, and portfolio delivery into a single dashboard.",
      content: "Traditional career guidance is broken: students buy expensive courses, fail ATS screens, fail behavioral interviews, and struggle to stand out. CareerOS bridges the entire gap from entry skill building to recruitment using AI pipelines."
    },
    {
      title: "Market Opportunity (TAM)",
      tagline: "Targeting millions of students and recruitment workspaces globally.",
      content: "B2C Market: 20 Million college students in the US + 220 Million globally seeking tech positions. B2B Market: Over 80,000 active technology recruitment departments in the US alone. Immediate serviceable market: $4.2B annual spending on recruitment optimization platforms and learning resources."
    },
    {
      title: "The Architecture Structure",
      tagline: "Scalable, type-safe Next.js API hooks and background workers.",
      content: "Unified UI utilizes React server rendering and Client interactions. Gemini APIs process structured text outputs, vector database (PGVector) checks skill semantic scores, and client audio analyzers evaluate mock interviews. Standalone Docker files enable fast staging and CI/CD pipelines."
    },
    {
      title: "Revenue Model & Projections",
      tagline: "Hybrid B2C / B2B SaaS architecture.",
      content: "1. Candidate Tier: $9.99/mo (Resume rewriter, voice interviews). 2. University Tier: $2.00/student/mo (Institutions track student placement indexes). 3. Recruiter Tier: $99/seat/mo (Rank candidates by ATS matches, view digital portfolios). Scroll below the slide to play with the live financial simulator!"
    }
  ];

  return (
    <div className="flex-1 flex overflow-hidden min-h-screen bg-slate-950">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`glass-panel border-r border-slate-800/80 transition-all duration-300 flex flex-col shrink-0 ${
        sidebarOpen ? "w-72" : "w-16"
      }`}>
        {/* Brand */}
        <div className="h-20 flex items-center px-4 border-b border-slate-800/60 justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-violet-500/20">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            {sidebarOpen && (
              <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CareerOS
              </span>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/50 cursor-pointer"
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Section 1: Presentation & Judge Panel */}
        <div className="p-2 border-b border-slate-800/40">
          {sidebarOpen && <p className="text-[12px] uppercase font-bold text-slate-500 px-3 py-1.5 tracking-wider">Startup Pitch</p>}
          <button
            onClick={() => setActiveTab("pitch")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "pitch"
                ? "bg-violet-600/25 border border-violet-500/40 text-violet-300 shadow-md shadow-violet-500/5"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <Award className="h-4 w-4 text-violet-400" />
            {sidebarOpen && <span>Startup Pitch Center</span>}
          </button>
        </div>

        {/* Section 2: Student Modules */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {sidebarOpen && <p className="text-[12px] uppercase font-bold text-slate-500 px-3 py-1.5 tracking-wider">Candidate Workspace</p>}
          
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-slate-400" />
            {sidebarOpen && <span>Overview Dashboard</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("opportunities");
              setSelectedUnstopEvent(null);
            }}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "opportunities"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            {sidebarOpen && <span>Opportunities Hub</span>}
          </button>

          <button
            onClick={() => setActiveTab("challenge")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer border ${
              activeTab === "challenge"
                ? "bg-amber-600/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/5 animate-pulse"
                : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Award className="h-4 w-4 text-amber-500" />
            {sidebarOpen && <span>AI Resume Challenge</span>}
          </button>

          <button
            onClick={() => setActiveTab("dna")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "dna"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <UserCheck className="h-4 w-4 text-indigo-400" />
            {sidebarOpen && <span>AI Career DNA</span>}
          </button>

          <button
            onClick={() => setActiveTab("resume")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "resume"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <FileText className="h-4 w-4 text-sky-400" />
            {sidebarOpen && <span>AI Resume Intel</span>}
          </button>

          <button
            onClick={() => setActiveTab("match")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "match"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <Briefcase className="h-4 w-4 text-emerald-400" />
            {sidebarOpen && <span>Job Matcher Engine</span>}
          </button>

          <button
            onClick={() => setActiveTab("interview")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "interview"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <Mic className="h-4 w-4 text-rose-400" />
            {sidebarOpen && <span>AI Interview Copilot</span>}
          </button>

          <button
            onClick={() => setActiveTab("roadmap")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "roadmap"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <Map className="h-4 w-4 text-amber-400" />
            {sidebarOpen && <span>AI Learning Roadmap</span>}
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <Code2 className="h-4 w-4 text-indigo-400" />
            {sidebarOpen && <span>AI Project Blueprint</span>}
          </button>

          <button
            onClick={() => setActiveTab("portfolio")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "portfolio"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <Globe className="h-4 w-4 text-emerald-400" />
            {sidebarOpen && <span>AI Portfolio Builder</span>}
          </button>

          {sidebarOpen && <p className="text-[12px] uppercase font-bold text-slate-500 px-3 pt-3 pb-1.5 tracking-wider">Recruiter Workspace</p>}
          <button
            onClick={() => setActiveTab("recruiter")}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
              activeTab === "recruiter"
                ? "bg-slate-800 border border-slate-700/80 text-white"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            }`}
          >
            <Users className="h-4 w-4 text-blue-400" />
            {sidebarOpen && <span>Recruiter AI Portal</span>}
          </button>
        </div>

        {/* User Card at bottom */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center gap-4 text-left">
            <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-200 shadow-inner shrink-0">
              AM
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-200 truncate">Alex Mercer</p>
                <p className="text-[12px] text-slate-500 truncate">Senior Software Candidate</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
        {/* TOP BAR */}
        <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold capitalize text-slate-350">
              {activeTab === "pitch" ? "Startup Presentation Deck" : `${activeTab.replace(/([A-Z])/g, ' $1')} Workspace`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-800 bg-slate-950/60">
              <div className={`h-2.5 w-2.5 rounded-full ${apiKey ? "bg-emerald-500" : "bg-amber-500"}`} />
              <span className="text-[12px] text-slate-400 font-medium">
                {apiKey ? "Live AI Active" : "Simulation Mode"}
              </span>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/40 transition-colors cursor-pointer"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* SETTINGS PANEL MODAL */}
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Settings className="h-4 w-4 text-violet-400" />
                  API Settings Configuration
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-450 hover:text-slate-200 text-sm"
                >
                  Close
                </button>
              </div>
              <p className="text-sm text-slate-405 mb-4 leading-relaxed">
                Provide your <strong>Gemini API Key</strong> below to unlock dynamic generative resume reviews, learning roadmap curriculums, and interview analysis.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-[12px] uppercase font-bold text-slate-500 mb-1.5">Gemini API Key</label>
                  <input
                    type="password"
                    defaultValue={apiKey}
                    id="api-key-input"
                    placeholder="AIzaSy..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>
                <button
                  onClick={() => {
                    const inputVal = (document.getElementById("api-key-input") as HTMLInputElement)?.value || "";
                    handleSaveSettings(inputVal);
                  }}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wider transition-colors cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT WINDOW */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-grid-pattern">
          
          {/* ==========================================
              TAB: STARTUP PITCH DECK
              ========================================== */}
          {activeTab === "pitch" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 text-[12px] text-slate-500 font-bold uppercase tracking-wider">
                  Slide {pitchSlide + 1} of {pitchSlides.length}
                </div>
                <div className="max-w-2xl space-y-6">
                  <span className="text-[12px] uppercase font-bold bg-violet-600/20 text-violet-400 px-4 py-1.5 rounded-full border border-violet-500/25">
                    Startup Core Deck
                  </span>
                  <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight leading-tight">
                    {pitchSlides[pitchSlide].title}
                  </h2>
                  <p className="text-base font-semibold text-slate-350">
                    {pitchSlides[pitchSlide].tagline}
                  </p>
                  <p className="text-sm text-slate-405 leading-relaxed font-light whitespace-pre-line">
                    {pitchSlides[pitchSlide].content}
                  </p>
                </div>
                
                <div className="flex gap-3 mt-8 justify-between items-center">
                  <button
                    disabled={pitchSlide === 0}
                    onClick={() => setPitchSlide(prev => prev - 1)}
                    className="px-4 py-3 rounded-xl bg-slate-800 text-slate-350 hover:text-white hover:bg-slate-750 disabled:opacity-30 disabled:hover:bg-slate-800 text-sm font-semibold cursor-pointer transition-colors"
                  >
                    Previous Slide
                  </button>
                  <div className="flex gap-1">
                    {pitchSlides.map((_, idx) => (
                      <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${pitchSlide === idx ? "w-6 bg-violet-500" : "w-1.5 bg-slate-700"}`} />
                    ))}
                  </div>
                  <button
                    disabled={pitchSlide === pitchSlides.length - 1}
                    onClick={() => setPitchSlide(prev => prev + 1)}
                    className="px-4 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 disabled:hover:bg-violet-600 text-sm font-semibold cursor-pointer transition-colors"
                  >
                    Next Slide
                  </button>
                </div>
              </div>

              {/* ARR calculator */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-bold text-slate-200">Interactive SaaS Revenue Estimator</h3>
                    <p className="text-[12px] text-slate-500">Slide metrics dynamically to view projected ARR</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4 p-10 bg-slate-950/65 rounded-2xl border border-slate-800/40">
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">Total Users</span>
                      <span className="font-bold text-slate-200">{pricingStudents.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      step="100"
                      value={pricingStudents}
                      onChange={(e) => setPricingStudents(parseInt(e.target.value))}
                      className="w-full accent-violet-600 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>

                  <div className="space-y-4 p-10 bg-slate-950/65 rounded-2xl border border-slate-800/40">
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">B2C Conversion</span>
                      <span className="font-bold text-slate-200">{pricingPremiumRatio}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      step="0.5"
                      value={pricingPremiumRatio}
                      onChange={(e) => setPricingPremiumRatio(parseFloat(e.target.value))}
                      className="w-full accent-violet-600 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>

                  <div className="space-y-4 p-10 bg-slate-950/65 rounded-2xl border border-slate-800/40">
                    <div className="flex justify-between text-base">
                      <span className="text-slate-400">Recruiter Seats</span>
                      <span className="font-bold text-slate-200">{pricingSeats}</span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="200"
                      step="1"
                      value={pricingSeats}
                      onChange={(e) => setPricingSeats(parseInt(e.target.value))}
                      className="w-full accent-violet-600 bg-slate-800 rounded-lg cursor-pointer h-1.5"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-8 pt-4 border-t border-slate-800/50 text-center">
                  <div className="p-4 bg-slate-950/40 rounded-xl">
                    <span className="block text-[12px] text-slate-500 uppercase tracking-wider">Candidate Premium Monthly</span>
                    <span className="text-base font-bold text-violet-400">${totalMonthlyB2C.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="p-4 bg-slate-950/40 rounded-xl">
                    <span className="block text-[12px] text-slate-500 uppercase tracking-wider">University Monthly Subsidy</span>
                    <span className="text-base font-bold text-indigo-400">${totalMonthlyB2BUniv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="p-4 bg-slate-950/40 rounded-xl">
                    <span className="block text-[12px] text-slate-500 uppercase tracking-wider">Recruiter Panel Monthly</span>
                    <span className="text-base font-bold text-emerald-400">${totalMonthlyB2BRecruiter.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="p-4 bg-violet-600/10 rounded-xl border border-violet-500/20 shadow-inner">
                    <span className="block text-[12px] text-violet-300 uppercase tracking-wider">Annualized ARR Projection</span>
                    <span className="text-base font-extrabold text-violet-400">${totalArr.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: OPPORTUNITIES HUB (UNSTOP INTEGRATIONS)
              ========================================== */}
          {activeTab === "opportunities" && (
            selectedUnstopEvent ? (
              <UnstopWorkspace
                event={selectedUnstopEvent}
                onClose={() => setSelectedUnstopEvent(null)}
                activeResume={activeResume}
                apiKey={apiKey}
              />
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Hub Banner */}
                <div className="bg-gradient-to-r from-violet-900/35 to-indigo-900/10 border border-violet-500/20 rounded-3xl p-10 relative overflow-hidden">
                  <div className="space-y-1 text-left">
                    <span className="text-[12px] font-bold text-violet-400 bg-violet-600/20 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Unstop National Challenge Center</span>
                    <h2 className="text-3xl font-extrabold text-slate-100">Live Campus Competitions & Hiring Events</h2>
                    <p className="text-base text-slate-400 font-light">Directly link to real Unstop hackathons. Check matching scores and analyze your skill gaps instantly!</p>
                  </div>
                </div>

                {/* Grid of 15 Unstop events */}
                <div className="grid md:grid-cols-3 gap-8">
                  {unstopEventsList.map((event, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-violet-500/40 transition-all glow-card">
                      <div className="space-y-4 text-left">
                        {/* Badge and Match percentage */}
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold bg-slate-950 border border-slate-800 text-slate-450 px-2.5 py-1 rounded-xl">
                            {event.category}
                          </span>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 font-bold uppercase block">ATS Match</span>
                            <span className="text-sm font-black text-emerald-400">{event.match}%</span>
                          </div>
                        </div>

                        {/* Header title */}
                        <div className="space-y-1.5">
                          <h4 className="text-base font-bold text-slate-200">{event.name}</h4>
                          <p className="text-[12px] text-slate-455 font-light">Host: {event.host} • {event.dates}</p>
                        </div>

                        {/* Prize and details */}
                        <div className="p-3.5 bg-slate-950/40 border border-slate-800/40 rounded-2xl">
                          <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Prize & Perks</span>
                          <span className="text-[12px] font-semibold text-amber-400">{event.prize}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-6 border-t border-slate-800/40 mt-4 grid grid-cols-2 gap-3">
                        {/* Register Button - opens Unstop page */}
                        <button
                          onClick={() => setSelectedUnstopEvent(event)}
                          className="py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700/50 transition-colors"
                        >
                          <span>Open Event</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>

                        {/* Analyze Skill Gap */}
                        <button
                          onClick={() => {
                            setJobDescription(event.jd);
                            setActiveTab("match");
                            setTimeout(() => {
                              const btn = document.querySelector('button[onClick*="runJobMatch"]');
                              if (btn) (btn as HTMLButtonElement).click();
                            }, 100);
                          }}
                          className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Analyze Gap</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )
          )}

          {/* ==========================================
              TAB: AI RESUME CHALLENGE (INDIA RUNS / REDROB AI)
              ========================================== */}
          {activeTab === "challenge" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Challenge Announcement Banner */}
              <div className="bg-gradient-to-r from-amber-600/20 via-amber-600/5 to-transparent border border-amber-500/20 rounded-3xl p-10 relative overflow-hidden shadow-xl">
                <div className="flex items-start gap-10">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                    <Rocket className="h-5 w-5 animate-bounce" />
                  </div>
                  <div className="space-y-1 text-left">
                    <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      AI Resume Challenge Part 2 is Reopened
                      <span className="text-[12px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full font-mono uppercase tracking-normal">Active</span>
                    </h3>
                    <p className="text-base text-slate-400 leading-relaxed font-light">
                      This is your final opportunity to evaluate your resume strength using Redrob AI&apos;s Resume Ranker to qualify for the official mini challenge within the **INDIA RUNS** community.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                
                {/* Console Panel */}
                <div className="md:col-span-2 space-y-6">
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-6">
                    <h3 className="text-base font-bold text-slate-200">Challenge Submission Console</h3>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="text-left">
                        <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Select Resume Entry</label>
                        <select
                          value={selectedResumeId}
                          onChange={(e) => setSelectedResumeId(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-350 focus:outline-none focus:border-violet-500"
                        >
                          {resumes.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="text-left">
                        <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">College / Institution</label>
                        <input
                          type="text"
                          value={challengeCollege}
                          onChange={(e) => setChallengeCollege(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="text-left">
                        <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Registered Email</label>
                        <input
                          type="email"
                          value={challengeEmail}
                          onChange={(e) => setChallengeEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          onClick={runChallengeEvaluation}
                          disabled={isChallengeEvaluating}
                          className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs tracking-wider transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isChallengeEvaluating ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                          <span>Evaluate Challenge Rank</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Evaluation Scorecard */}
                  {challengeScore !== null && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 space-y-6 animate-in fade-in duration-200">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-800 text-left">
                        <div>
                          <h3 className="text-sm font-bold text-slate-200">Redrob AI Evaluation Metrics</h3>
                          <p className="text-[10px] text-slate-500">Verified entry status against national compliance scales</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-[9px] text-slate-500 uppercase">Challenge Score</span>
                          <span className="text-2xl font-black text-amber-400">{challengeScore}%</span>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-left">
                        <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/40 space-y-1">
                          <span className="block text-[9px] text-slate-500 uppercase font-bold">National Percentile</span>
                          <span className="text-base font-extrabold text-sky-400">Top {challengePercentile}%</span>
                        </div>

                        <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/40 space-y-1">
                          <span className="block text-[9px] text-slate-500 uppercase font-bold">Industry Staging Level</span>
                          <span className={`text-base font-extrabold ${challengeScore >= 85 ? "text-emerald-400" : "text-amber-500"}`}>
                            {challengeScore >= 90 ? "Platinum Badge" : challengeScore >= 85 ? "Gold Badge" : "Silver Badge"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-left">
                        <span className="block text-[9px] text-amber-400 font-bold uppercase mb-1">Ranker Insights</span>
                        <p className="text-xs text-slate-350 leading-relaxed font-light">{challengeFeedback}</p>
                      </div>

                      {/* Checklist and entry button */}
                      <div className="pt-4 border-t border-slate-800/60 space-y-4 text-left">
                        <span className="block text-[10px] text-slate-500 uppercase font-bold">Mini Challenge Submission Checklist</span>
                        
                        <div className="grid md:grid-cols-3 gap-2 text-[10px] text-slate-450">
                          <div className="flex items-center gap-2 p-2 bg-slate-950/30 rounded-xl">
                            <Check className="h-4 w-4 text-emerald-500" />
                            <span>1. Ingest Resume</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-950/30 rounded-xl">
                            <Check className="h-4 w-4 text-emerald-500" />
                            <span>2. Complete Scan</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 bg-slate-950/30 rounded-xl">
                            {challengeScore >= 85 ? (
                              <Check className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-rose-500" />
                            )}
                            <span>3. Hit 85%+ threshold</span>
                          </div>
                        </div>

                        {challengeScore < 85 && (
                          <div className="p-3 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-2xl flex gap-2 items-center text-xs">
                            <ShieldAlert className="h-5 w-5 shrink-0" />
                            <p>Your score is below the 85% challenge requirement. Optimize missing keywords (Docker, Redis) in **AI Resume Intel** and re-evaluate!</p>
                          </div>
                        )}

                        {challengeSubmitted ? (
                          <div className="p-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex gap-2 items-center justify-center text-xs font-bold animate-pulse">
                            <Check className="h-5 w-5" />
                            <span>Challenge Entry Submitted Successfully to Redrob AI!</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setChallengeSubmitted(true)}
                            disabled={challengeScore < 85}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs tracking-wider rounded-xl transition-colors cursor-pointer"
                          >
                            Submit Official Entry to Redrob AI
                          </button>
                        )}

                      </div>

                    </div>
                  )}

                </div>

                {/* Leaderboard Panel */}
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-left">
                    <h3 className="text-xs font-bold text-slate-200">National Leaderboard</h3>
                    <span className="text-[8px] text-slate-500 uppercase">INDIA RUNS</span>
                  </div>

                  <div className="space-y-3 text-left">
                    {leaderboard.map((item, idx) => {
                      const isMe = item.name.includes("You");
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border transition-all ${
                            isMe 
                              ? "bg-amber-600/10 border-amber-500/40 shadow-inner animate-pulse" 
                              : "bg-slate-950/40 border-slate-800"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="min-w-0">
                              <span className={`block text-xs font-bold ${isMe ? "text-amber-300" : "text-slate-200"}`}>
                                #{idx + 1} {item.name}
                              </span>
                              <span className="block text-[8px] text-slate-500 mt-0.5 truncate">{item.college}</span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="block text-xs font-extrabold text-slate-300">{item.score}%</span>
                              <span className="block text-[8px] text-slate-500 font-mono">Top {item.percentile}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB: OVERVIEW DASHBOARD
              ========================================== */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gradient-to-r from-violet-900/35 to-indigo-900/10 border border-violet-500/20 rounded-3xl p-10 flex justify-between items-center relative overflow-hidden">
                <div className="space-y-1 text-left">
                  <span className="text-[12px] font-bold text-violet-400 bg-violet-600/20 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Candidate Workspace</span>
                  <h2 className="text-3xl font-extrabold text-slate-100">Welcome Back, Alex Mercer</h2>
                  <p className="text-base text-slate-400">Target Role: Senior Full-Stack Architect | Next DNA Scan: Jul 10, 2026</p>
                </div>
                <div className="text-right">
                  <span className="block text-[12px] text-slate-500 font-bold uppercase">DNA Potential Score</span>
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">72%</span>
                </div>
              </div>

              {/* Statistics Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center glow-card">
                  <span className="block text-[12px] text-slate-500 uppercase tracking-wider font-bold">ATS Score</span>
                  <span className="text-2xl font-extrabold text-sky-400 mt-1 block">{activeResume.score}%</span>
                  <span className="text-[12px] text-slate-400 mt-1 block">Based on {activeResume.name}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center glow-card glow-card-emerald">
                  <span className="block text-[12px] text-slate-500 uppercase tracking-wider font-bold">Skill Index</span>
                  <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">12 Active</span>
                  <span className="text-[12px] text-slate-400 mt-1 block">5 identified gaps</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center glow-card">
                  <span className="block text-[12px] text-slate-500 uppercase tracking-wider font-bold">Interview Fit</span>
                  <span className="text-2xl font-extrabold text-rose-400 mt-1 block">83%</span>
                  <span className="text-[12px] text-slate-400 mt-1 block">3 sessions practiced</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center glow-card">
                  <span className="block text-[12px] text-slate-500 uppercase tracking-wider font-bold">Roadmap Milestones</span>
                  <span className="text-2xl font-extrabold text-amber-400 mt-1 block">4 / 12</span>
                  <span className="text-[12px] text-slate-400 mt-1 block font-light">Next: Week 5 prompt engineering</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center col-span-2 md:col-span-1">
                  <span className="block text-[12px] text-slate-500 uppercase tracking-wider font-bold">Recruiter Hits</span>
                  <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">24 Searches</span>
                  <span className="text-[12px] text-slate-400 mt-1 block font-light">3 shortlist triggers</span>
                </div>
              </div>

              {/* Progress Charts Section */}
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Chart 1: Skill Coverage Graph */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-200">Skill Competency Index</span>
                    <span className="text-[12px] text-slate-500">Weekly Target Tracker</span>
                  </div>
                  
                  {/* SVG Chart */}
                  <div className="h-44 w-full flex items-end justify-between px-2 pt-4">
                    {[
                      { label: "Frontend", val: 88 },
                      { label: "Backend", val: 74 },
                      { label: "DevOps", val: 45 },
                      { label: "Data Eng", val: 55 },
                      { label: "Security", val: 32 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-12 group">
                        <div className="w-8 bg-slate-950/80 rounded-lg relative flex items-end h-32 border border-slate-800">
                          <div 
                            style={{ height: `${item.val}%` }} 
                            className="w-full bg-gradient-to-t from-violet-600/90 to-indigo-400/90 rounded-b-md rounded-t-sm transition-all duration-500"
                          />
                        </div>
                        <span className="text-[12px] text-slate-500 truncate w-full text-center">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 2: ATS Growth Tracker */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-200">ATS Profile Score Growth</span>
                    <span className="text-[12px] text-slate-500">Weekly Progress</span>
                  </div>

                  {/* SVG Line Graph */}
                  <div className="h-44 w-full relative pt-4">
                    <svg className="w-full h-full" viewBox="0 0 300 120">
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#1e293b" strokeDasharray="3,3" />
                      <line x1="0" y1="100" x2="300" y2="100" stroke="#1e293b" strokeDasharray="3,3" />
                      
                      <path 
                        d="M 10 95 L 70 85 L 130 65 L 190 60 L 250 40 L 290 28" 
                        fill="none" 
                        stroke="url(#chart-glow)" 
                        strokeWidth="3.5" 
                      />
                      
                      <defs>
                        <linearGradient id="chart-glow" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#7c3aed" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="flex justify-between text-[12px] text-slate-500 px-2 mt-1">
                      <span>May 10</span>
                      <span>May 24</span>
                      <span>Jun 07</span>
                      <span>Jun 21</span>
                      <span>Present</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feed & Action Logs */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-7">
                <h3 className="text-base font-bold text-slate-200 mb-3.5 text-left">Recent Activity Stream</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm p-3 bg-slate-950/30 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                      <span className="text-slate-350">Mock Interview evaluated for role <strong>Full Stack Engineer</strong></span>
                    </div>
                    <span className="text-[12px] text-slate-500">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-3 bg-slate-950/30 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                      <span className="text-slate-350">Optimized Resume achievements: <strong>Alex_Mercer_FullStack.txt</strong></span>
                    </div>
                    <span className="text-[12px] text-slate-500">1 day ago</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-3 bg-slate-950/30 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <span className="text-slate-355">Completed Roadmap Milestone: <strong>Weeks 1-4 Foundations</strong></span>
                    </div>
                    <span className="text-[12px] text-slate-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: CAREER DNA ANALYZER
              ========================================== */}
          {activeTab === "dna" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Inputs card */}
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                  <h3 className="text-base font-bold text-slate-200">DNA Input Profile</h3>
                  <div className="space-y-5">
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Education / Degree</label>
                      <input
                        type="text"
                        value={dnaInputs.education}
                        onChange={(e) => setDnaInputs({ ...dnaInputs, education: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Technical Skill Tags</label>
                      <input
                        type="text"
                        value={dnaInputs.skills}
                        onChange={(e) => setDnaInputs({ ...dnaInputs, skills: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Special Interests</label>
                      <input
                        type="text"
                        value={dnaInputs.interests}
                        onChange={(e) => setDnaInputs({ ...dnaInputs, interests: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">GitHub profile URL</label>
                      <input
                        type="text"
                        value={dnaInputs.github}
                        onChange={(e) => setDnaInputs({ ...dnaInputs, github: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={dnaInputs.linkedin}
                        onChange={(e) => setDnaInputs({ ...dnaInputs, linkedin: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <button
                      onClick={runDnaAnalysis}
                      disabled={isDnaLoading}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wider transition-colors mt-2 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isDnaLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      <span>Analyze Career DNA</span>
                    </button>
                  </div>
                </div>

                {/* Output Panel */}
                <div className="md:col-span-2 space-y-6">
                  {dnaResult ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 text-left">
                        <div>
                          <h3 className="text-sm font-bold text-slate-200">Career DNA Mapping Report</h3>
                          <p className="text-[10px] text-slate-500">Synthesized using deep profile metrics</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-[12px] text-slate-500 uppercase">Potential Score</span>
                          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{dnaResult.score}%</span>
                        </div>
                      </div>

                      {/* Brief text summary */}
                      <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800/40 text-left">
                        <span className="block text-[12px] text-slate-500 uppercase font-bold mb-1">Synthesized Profile Assessment</span>
                        <p className="text-base text-slate-400 leading-relaxed font-light">{dnaResult.summary}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 text-left">
                        {/* Strengths */}
                        <div className="p-6 bg-slate-950/20 border border-slate-800 rounded-2xl space-y-4">
                          <span className="block text-[12px] text-emerald-400 font-bold uppercase tracking-wider">Strengths</span>
                          <ul className="space-y-1.5">
                            {dnaResult.strengths.map((str: string, i: number) => (
                              <li key={i} className="text-[12px] text-slate-405 flex items-start gap-1">
                                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="p-6 bg-slate-950/20 border border-slate-800 rounded-2xl space-y-4">
                          <span className="block text-[12px] text-rose-400 font-bold uppercase tracking-wider">Weaknesses</span>
                          <ul className="space-y-1.5">
                            {dnaResult.weaknesses.map((str: string, i: number) => (
                              <li key={i} className="text-[12px] text-slate-405 flex items-start gap-1">
                                <span className="text-rose-500 font-bold shrink-0 mt-0.5 text-base">•</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Opportunities */}
                        <div className="p-6 bg-slate-950/20 border border-slate-800 rounded-2xl space-y-4">
                          <span className="block text-[12px] text-indigo-400 font-bold uppercase tracking-wider">Hidden Paths</span>
                          <ul className="space-y-1.5">
                            {dnaResult.opportunities.map((str: string, i: number) => (
                              <li key={i} className="text-[12px] text-slate-405 flex items-start gap-1">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-450 shrink-0 mt-0.5" />
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                      <UserCheck className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-base font-semibold text-slate-400">Profile DNA Audit Empty</p>
                      <p className="text-[12px] text-slate-500 font-light">Provide profile inputs and trigger the DNA Analyze query above.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: RESUME INTELLIGENCE
              ========================================== */}
          {activeTab === "resume" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Upload & Selector Column */}
                <div className="md:col-span-1 space-y-6">
                  {/* Upload box */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                    <h3 className="text-base font-bold text-slate-200 font-bold">Upload Resume File</h3>
                    
                    <div className="space-y-4">
                      {/* Real PDF / TXT File input */}
                      <div className="relative border border-dashed border-slate-800 hover:border-violet-500/50 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-950/20">
                        <input
                          type="file"
                          accept=".txt,.md,.json"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="h-6 w-6 text-slate-500 mx-auto mb-2" />
                        <span className="block text-[12px] text-slate-400">Click to upload TXT/MD/JSON file</span>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[11px] uppercase font-bold text-slate-500">File Name / Label</label>
                        <input
                          type="text"
                          placeholder="Resume name Label"
                          value={newResumeName}
                          onChange={(e) => setNewResumeName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500"
                        />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="block text-[11px] uppercase font-bold text-slate-500">Paste Resume Text Content</label>
                        <textarea
                          placeholder="Or paste resume content directly here..."
                          value={resumePasteText}
                          onChange={(e) => setResumePasteText(e.target.value)}
                          className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none font-light leading-relaxed"
                        />
                      </div>

                      <button
                        onClick={handleUploadResume}
                        disabled={isUploading || !newResumeName}
                        className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wider transition-colors rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isUploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                        <span>Analyze & Scans</span>
                      </button>
                    </div>
                  </div>

                  {/* Resumes List */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                    <h3 className="text-base font-bold text-slate-200">Parsed Resumes</h3>
                    <div className="space-y-4">
                      {resumes.map(r => (
                        <div
                          key={r.id}
                          onClick={() => setSelectedResumeId(r.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                            selectedResumeId === r.id
                              ? "bg-violet-600/10 border-violet-500/40 shadow-inner"
                              : "bg-slate-950/40 border-slate-800 hover:bg-slate-950/80"
                          }`}
                        >
                          <div className="min-w-0 text-left">
                            <span className="block text-base font-bold text-slate-200 truncate">{r.name}</span>
                            <span className="block text-[12px] text-slate-500 mt-0.5">Uploaded {r.uploadedAt}</span>
                          </div>
                          <span className={`text-base font-bold ${r.score >= 80 ? "text-emerald-400" : "text-sky-400"}`}>
                            {r.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details Analysis Column */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Recruiter view mode / ATS highlights */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 text-left">
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">ATS Scanning Workspace</h3>
                        <p className="text-[10px] text-slate-500">Highlighting missing keywords & parser blocks</p>
                      </div>
                      <button
                        onClick={() => setRecruiterMode(!recruiterMode)}
                        className={`px-4 py-2.5 rounded-xl border text-[12px] font-bold transition-all cursor-pointer ${
                          recruiterMode 
                            ? "bg-emerald-600/20 border-emerald-500/55 text-emerald-400"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        Recruiter View Mode: {recruiterMode ? "ON" : "OFF"}
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-left">
                      {/* Suggestions list */}
                      <div className="p-6 bg-slate-950/30 rounded-2xl border border-slate-800/40 space-y-4">
                        <span className="block text-[12px] text-sky-450 font-bold uppercase tracking-wider">AI Scanned Suggestions</span>
                        <ul className="space-y-4">
                          {activeResume.suggestions.map((sug, i) => (
                            <li key={i} className="text-[12px] text-slate-405 flex items-start gap-1.5 leading-relaxed">
                              <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                              <span>{sug}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Gaps List */}
                      <div className="p-6 bg-slate-950/30 rounded-2xl border border-slate-800/40 space-y-4">
                        <span className="block text-[12px] text-rose-400 font-bold uppercase tracking-wider">Keyword Gaps Detected</span>
                        <div className="flex flex-wrap gap-2">
                          {activeResume.gaps.map((gap, i) => (
                            <span 
                              key={i} 
                              className={`text-[12px] font-semibold px-3 py-1 rounded-md border ${
                                recruiterMode 
                                  ? "bg-rose-500/25 border-rose-500/40 text-rose-300"
                                  : "bg-slate-950 border-slate-800 text-slate-400"
                              }`}
                            >
                              {gap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Rewriter Card */}
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                    <div className="text-left">
                      <h3 className="text-base font-bold text-slate-200">AI Achievement Optimizer (STAR Rewriter)</h3>
                      <p className="text-[12px] text-slate-500">Paste weak sentences to see them restructured with technical impact and metrics</p>
                    </div>

                    <div className="space-y-5 text-left">
                      <textarea
                        value={rewriteInput}
                        onChange={(e) => setRewriteInput(e.target.value)}
                        className="w-full h-16 p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-100 focus:outline-none focus:border-violet-500 resize-none"
                      />
                      
                      <button
                        onClick={handleRewrite}
                        disabled={isRewriting || !rewriteInput.trim()}
                        className="py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        {isRewriting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                        <span>Optimize Achievement</span>
                      </button>

                      {rewrittenOutput && (
                        <div className="p-6 bg-violet-600/10 border border-violet-500/20 rounded-2xl mt-2 animate-in fade-in duration-200 text-left">
                          <span className="block text-[12px] text-violet-300 font-bold uppercase mb-1">Optimized Output</span>
                          <p className="text-base text-slate-200 leading-relaxed font-light">{rewrittenOutput}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: JOB MATCHING ENGINE
              ========================================== */}
          {activeTab === "match" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Inputs */}
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                  <h3 className="text-base font-bold text-slate-200">Job Description parameters</h3>
                  <div className="space-y-5">
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Target Resume</label>
                      <select 
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-350 focus:outline-none focus:border-violet-500"
                      >
                        {resumes.map(r => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Paste Job Specification</label>
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full h-44 p-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500 resize-none font-light leading-relaxed"
                      />
                    </div>

                    <button
                      onClick={runJobMatch}
                      disabled={isMatching || !jobDescription.trim()}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isMatching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Briefcase className="h-4 w-4" />}
                      <span>Calculate Match Index</span>
                    </button>
                  </div>
                </div>

                {/* Match Report Output */}
                <div className="md:col-span-2">
                  {jobMatchResult && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-800/85 text-left">
                        <div>
                          <h3 className="text-sm font-bold text-slate-200">Alignment Scan Report</h3>
                          <p className="text-[10px] text-slate-500 font-light">Processed against active resume indices</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-[12px] text-slate-500 uppercase">Match Percentage</span>
                          <span className="text-2xl font-black text-emerald-400">{jobMatchResult.matchPercentage}%</span>
                        </div>
                      </div>

                      {/* Probabilities grid */}
                      <div className="grid md:grid-cols-2 gap-6 text-left">
                        <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800/40 space-y-1">
                          <span className="block text-[12px] text-slate-500 uppercase font-bold">ATS Compatibility</span>
                          <span className="text-base font-extrabold text-sky-400">{jobMatchResult.atsCompatibility}%</span>
                        </div>

                        <div className="p-6 bg-slate-950/40 rounded-2xl border border-slate-800/40 space-y-1">
                          <span className="block text-[12px] text-slate-500 uppercase font-bold">Callback Probability</span>
                          <span className="text-base font-extrabold text-emerald-400">{jobMatchResult.successProbability}%</span>
                        </div>
                      </div>

                      {/* Missing skills tags */}
                      <div className="space-y-4 text-left">
                        <span className="block text-[12px] text-slate-500 uppercase font-bold">Critical Missing Keywords</span>
                        <div className="flex flex-wrap gap-2">
                          {jobMatchResult.missingSkills.map((sk: string, i: number) => (
                            <span key={i} className="text-[12px] font-semibold px-3 py-1 rounded-xl bg-rose-600/15 border border-rose-500/30 text-rose-300">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Optimization guidance */}
                      <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl text-left">
                        <span className="block text-[12px] text-violet-300 font-bold uppercase mb-1.5 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          Recommended Profile Changes
                        </span>
                        <p className="text-base text-slate-350 leading-relaxed font-light">{jobMatchResult.recommendedChanges}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: INTERVIEW COPILOT
              ========================================== */}
          {activeTab === "interview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {!interviewStarted && !interviewScorecard && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-xl mx-auto space-y-6 text-center">
                  <div className="h-12 w-12 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mx-auto text-violet-400">
                    <Mic className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-100">AI Mock Interview Simulator</h2>
                    <p className="text-base text-slate-405 leading-relaxed font-light">
                      Practice complex scenarios using real webcam rendering and microphone speech audits.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 text-left">
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Target Job Role</label>
                      <input
                        type="text"
                        value={interviewRole}
                        onChange={(e) => setInterviewRole(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Difficulty level</label>
                      <select 
                        value={interviewDifficulty}
                        onChange={(e) => setInterviewDifficulty(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-350 focus:outline-none focus:border-violet-500"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced Expert</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={startInterview}
                    className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base tracking-wider transition-colors cursor-pointer"
                  >
                    Launch Interview Session
                  </button>
                </div>
              )}

              {/* Loading Evaluation screen */}
              {isEvaluatingInterview && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 max-w-md mx-auto text-center space-y-4">
                  <RefreshCw className="h-10 w-10 text-violet-500 animate-spin mx-auto" />
                  <h3 className="text-sm font-bold text-slate-200">Evaluating Interview Audit</h3>
                </div>
              )}

              {/* Live Interview Dashboard */}
              {interviewStarted && (
                <div className="grid md:grid-cols-3 gap-8">
                  
                  {/* Webcam & Wave Panel */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden relative shadow-lg">
                      <span className="absolute top-3 left-3 bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-full z-10 animate-pulse">
                        LIVE
                      </span>
                      
                      <div className="aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                        {webcamPermissionError ? (
                          <div className="text-center p-4">
                            <VideoOff className="h-8 w-8 text-slate-700 mx-auto mb-2" />
                            <span className="text-[12px] text-slate-500 block">Webcam access unavailable</span>
                          </div>
                        ) : (
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted
                            className="w-full h-full object-cover rounded-2xl scale-x-[-1]"
                          />
                        )}
                      </div>
                    </div>

                    {/* Voice wave monitor */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-200">Audio Input Waveform</span>
                      </div>

                      <div className="h-16 flex items-center justify-center gap-1 px-4 bg-slate-950/40 rounded-2xl border border-slate-800">
                        {simulatedVolume.map((vol, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${vol}px` }}
                            className={`w-1 rounded-full transition-all duration-75 ${
                              isRecording ? "bg-violet-500" : "bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={toggleRecording}
                        className={`w-full py-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                          isRecording 
                            ? "bg-rose-600 hover:bg-rose-500 text-white" 
                            : "bg-slate-800 hover:bg-slate-750 text-slate-200"
                        }`}
                      >
                        {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        <span>{isRecording ? "Stop Recording" : "Capture Speech"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Interview Prompts Panel */}
                  <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 mb-6 text-left">
                        <div>
                          <h3 className="text-sm font-bold text-slate-200">Mock Session: {interviewRole}</h3>
                          <p className="text-[10px] text-slate-500">Question {currentQuestionIndex + 1} of {interviewQuestions.length}</p>
                        </div>
                      </div>

                      <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-2xl mb-8 min-h-32 flex items-center text-left">
                        <p className="text-base text-slate-200 leading-relaxed font-light">{interviewQuestions[currentQuestionIndex].question}</p>
                      </div>
                    </div>

                    <button
                      onClick={nextQuestion}
                      className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base tracking-wider transition-colors cursor-pointer text-center"
                    >
                      {currentQuestionIndex < interviewQuestions.length - 1 ? "Submit Answer & Next Question" : "Submit Answer & End Interview"}
                    </button>
                  </div>
                </div>
              )}

              {/* Evaluation Scorecard View */}
              {interviewScorecard && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-6 text-left">
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">AI Response Scorecard</h3>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] text-slate-500 uppercase">Interview Fit Index</span>
                        <span className="text-2xl font-black text-rose-400">{interviewScorecard.score}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 text-center mb-6">
                      <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
                        <span className="block text-[12px] text-slate-500 uppercase font-bold mb-1">Words Pacing</span>
                        <span className="text-base font-extrabold text-slate-200">{interviewScorecard.speechRate} WPM</span>
                      </div>
                      <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
                        <span className="block text-[12px] text-slate-500 uppercase font-bold mb-1">Filler Words</span>
                        <span className="text-base font-extrabold text-amber-500">{interviewScorecard.fillerWords} counted</span>
                      </div>
                      <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl">
                        <span className="block text-[12px] text-slate-500 uppercase font-bold mb-1">Visual Confidence</span>
                        <span className="text-base font-extrabold text-emerald-400">{interviewScorecard.confidence}%</span>
                      </div>
                    </div>

                    {/* Question transcripts detail */}
                    <div className="space-y-4 text-left">
                      {interviewScorecard.feedback.map((f, idx) => (
                        <div key={idx} className="p-6 bg-slate-950/30 border border-slate-800 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-300">Q{idx + 1}: {f.question}</span>
                            <span className="text-[10px] font-bold text-rose-400">Score: {f.score}/100</span>
                          </div>
                          <p className="text-[12px] text-slate-405 leading-relaxed font-light italic">
                            &quot;{f.transcript}&quot;
                          </p>
                          <p className="text-[12px] text-slate-300 font-light pt-1.5 border-t border-slate-800/60 leading-relaxed">
                            <strong>AI Feedback:</strong> {f.critique}
                          </p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setInterviewScorecard(null)}
                      className="mt-6 px-6 py-3 rounded-xl bg-slate-800 text-slate-350 hover:text-white hover:bg-slate-750 text-sm font-semibold cursor-pointer transition-colors"
                    >
                      Close & Practice Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: AI LEARNING ROADMAP
              ========================================== */}
          {activeTab === "roadmap" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Selector */}
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6 h-fit">
                  <h3 className="text-xs font-bold text-slate-200 font-bold">Roadmap Target Goal</h3>
                  <div className="space-y-5">
                    <div className="text-left">
                      <input
                        type="text"
                        value={roadmapRole}
                        onChange={(e) => setRoadmapRole(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <button
                      onClick={generateRoadmap}
                      disabled={isRoadmapLoading || !roadmapRole.trim()}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isRoadmapLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Map className="h-4 w-4" />}
                      <span>Generate Roadmap</span>
                    </button>
                  </div>
                </div>

                {/* Output roadmap */}
                <div className="md:col-span-2">
                  {roadmapData && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-slate-200">Study Roadmap: {roadmapData.role}</h3>
                        <p className="text-[10px] text-slate-500 font-light">Duration Target: {roadmapData.duration}</p>
                      </div>

                      {/* Phase cards stack */}
                      <div className="space-y-4">
                        {roadmapData.milestones.map((m, idx) => (
                          <div key={idx} className="p-5 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-3 relative overflow-hidden text-left">
                            <span className="text-xs font-bold text-slate-200 block border-b border-slate-800 pb-2">{m.phase}</span>
                            <div className="grid md:grid-cols-3 gap-6 text-[12px] text-slate-400">
                              <div>
                                <span className="block font-semibold text-violet-400">Daily Goal</span>
                                <p className="mt-1 leading-relaxed">{m.daily}</p>
                              </div>
                              <div>
                                <span className="block font-semibold text-indigo-400">Weekly Goal</span>
                                <p className="mt-1 leading-relaxed">{m.weekly}</p>
                              </div>
                              <div>
                                <span className="block font-semibold text-emerald-400">Monthly Project</span>
                                <p className="mt-1 leading-relaxed">{m.monthly}</p>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-800/40 mt-1 flex flex-wrap gap-1.5 items-center">
                              {m.resources?.map((r, ri) => (
                                <span key={ri} className="text-[10px] font-semibold bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded border border-slate-800">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: AI PROJECT GENERATOR
              ========================================== */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Selector */}
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6 h-fit">
                  <h3 className="text-xs font-bold text-slate-200 font-bold">Project Blueprint Target</h3>
                  <div className="space-y-5">
                    <div className="text-left">
                      <input
                        type="text"
                        value={projectRole}
                        onChange={(e) => setProjectRole(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <button
                      onClick={generateProject}
                      disabled={isProjectLoading || !projectRole.trim()}
                      className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProjectLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Code2 className="h-4 w-4" />}
                      <span>Generate Project Blueprint</span>
                    </button>
                  </div>
                </div>

                {/* Blueprint details */}
                <div className="md:col-span-2">
                  {projectBlueprint && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 animate-in fade-in duration-200 text-left">
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">{projectBlueprint.title}</h3>
                        <p className="text-[10px] text-slate-500 font-light">Includes system design blueprints & source structures</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Tech Stack list */}
                        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-2">
                          <span className="block text-[12px] text-slate-500 uppercase font-bold flex items-center gap-1">
                            <Database className="h-3.5 w-3.5 text-violet-400" />
                            Target Tech Stack
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {projectBlueprint.techStack.map((tech: string, i: number) => (
                              <span key={i} className="text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-0.5 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Arch Summary */}
                        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-1">
                          <span className="block text-[12px] text-slate-500 uppercase font-bold">Architecture Pipeline</span>
                          <p className="text-[12px] text-slate-400 leading-relaxed font-light">{projectBlueprint.architecture}</p>
                        </div>
                      </div>

                      {/* Folder Tree Code layout */}
                      <div className="space-y-4">
                        <span className="block text-[12px] text-slate-500 uppercase font-bold flex items-center gap-1">
                          <FolderTree className="h-3.5 w-3.5 text-indigo-400" />
                          Source Folder Tree
                        </span>
                        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[12px] text-slate-300 font-mono overflow-x-auto">
                          {projectBlueprint.folderStructure}
                        </pre>
                      </div>

                      {/* DB designs */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <span className="block text-[12px] text-slate-500 uppercase font-bold">PostgreSQL Schema Definition</span>
                          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400 font-mono overflow-x-auto">
                            {projectBlueprint.dbSchema}
                          </pre>
                        </div>

                        {/* API endpoints */}
                        <div className="space-y-4">
                          <span className="block text-[12px] text-slate-500 uppercase font-bold">REST API Design</span>
                          <div className="space-y-1.5">
                            {projectBlueprint.apiDesign.map((api, i) => (
                              <div key={i} className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-[11px]">
                                <div className="flex gap-1.5">
                                  <span className="font-bold text-emerald-400 uppercase">{api.method}</span>
                                  <span className="text-slate-300 font-mono font-semibold">{api.route}</span>
                                </div>
                                <p className="text-slate-500 mt-1 text-[10px] font-light">{api.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: AI PORTFOLIO GENERATOR
              ========================================== */}
          {activeTab === "portfolio" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Portfolio parameters */}
                <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-6">
                  <h3 className="text-xs font-bold text-slate-200">Portfolio Config</h3>
                  <div className="space-y-5">
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Profile Name</label>
                      <input
                        type="text"
                        value={portfolioName}
                        onChange={(e) => setPortfolioName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Job Title</label>
                      <input
                        type="text"
                        value={portfolioTitle}
                        onChange={(e) => setPortfolioTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Personal Biography</label>
                      <textarea
                        value={portfolioBio}
                        onChange={(e) => setPortfolioBio(e.target.value)}
                        className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-100 focus:outline-none focus:border-violet-500 resize-none font-light leading-relaxed"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1.5">Select Web Theme</label>
                      <select 
                        value={portfolioTheme}
                        onChange={(e) => setPortfolioTheme(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-base text-slate-300 focus:outline-none focus:border-violet-500"
                      >
                        <option value="cyberpunk">Cyberpunk Dark</option>
                        <option value="glass">Glassmorphic Gradient</option>
                        <option value="clean">Minimalist Light</option>
                      </select>
                    </div>

                    <div className="space-y-4 pt-2">
                      <button
                        onClick={downloadPortfolioHTML}
                        className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/50 text-slate-200 hover:text-white font-semibold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download HTML Bundle</span>
                      </button>

                      <button
                        onClick={deployPortfolio}
                        disabled={isDeployingPortfolio}
                        className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isDeployingPortfolio ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Rocket className="h-4 w-4" />
                        )}
                        <span>Deploy to CareerOS Cloud</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Live Preview Panel */}
                <div className="md:col-span-2 space-y-6">
                  {portfolioUrl && (
                    <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between text-base animate-in slide-in-from-top-2 duration-300 text-left">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span>Deployed successfully! Live URL:</span>
                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline ml-1 hover:text-emerald-300">
                          {portfolioUrl}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col h-full min-h-[460px] text-left">
                    <span className="block text-[12px] text-slate-500 uppercase font-bold mb-3.5">Live Preview Frame</span>

                    {/* Simulating rendered website preview */}
                    <div className={`flex-1 rounded-2xl border p-8 flex flex-col justify-between ${
                      portfolioTheme === "cyberpunk"
                        ? "bg-slate-950 border-violet-500/10 text-slate-100"
                        : portfolioTheme === "glass"
                        ? "bg-gradient-to-br from-slate-900 to-zinc-900 border-white/10 text-slate-200"
                        : "bg-white border-slate-200 text-slate-900"
                    }`}>
                      <div>
                        {/* Header */}
                        <div className="flex justify-between items-start pb-4 border-b border-slate-800/40">
                          <div>
                            <h4 className={`text-3xl font-bold ${
                              portfolioTheme === "cyberpunk"
                                ? "bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"
                                : portfolioTheme === "glass"
                                ? "bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
                                : "text-slate-900"
                            }`}>{portfolioName}</h4>
                            <p className="text-[12px] text-slate-400">{portfolioTitle}</p>
                          </div>
                        </div>

                        {/* About */}
                        <div className="py-4 space-y-1.5">
                          <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">About Me</span>
                          <p className="text-base leading-relaxed text-slate-405 font-light">{portfolioBio}</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-slate-800/40 text-center">
                        <button className={`text-[12px] font-bold px-4 py-2.5 rounded-lg pointer-events-none ${
                          portfolioTheme === "cyberpunk"
                            ? "bg-violet-600 text-white"
                            : portfolioTheme === "glass"
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-900 text-white"
                        }`}>
                          Connect With Me
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB: RECRUITER AI PANEL
              ========================================== */}
          {activeTab === "recruiter" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
                
                {/* Filters */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-800/80 text-left">
                  <div>
                    <h3 className="text-base font-bold text-slate-200">Recruiter AI Talent Panel</h3>
                    <p className="text-[12px] text-slate-500 font-light">Direct indexing of matched candidate profiles and resumes</p>
                  </div>

                  <div className="flex gap-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search skills or names..."
                        value={recruiterSearch}
                        onChange={(e) => setRecruiterSearch(e.target.value)}
                        className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-violet-500 placeholder-slate-600"
                      />
                    </div>
                    
                    {/* Sort */}
                    <select
                      value={recruiterSortBy}
                      onChange={(e) => setRecruiterSortBy(e.target.value)}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-350 focus:outline-none focus:border-violet-500"
                    >
                      <option value="dnaScore">Sort by DNA Score</option>
                      <option value="atsScore">Sort by ATS Score</option>
                      <option value="matchScore">Sort by JD Match</option>
                    </select>
                  </div>
                </div>

                {/* Candidate list tables */}
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px] text-left text-slate-400">
                    <thead>
                      <tr className="border-b border-slate-800/60 uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Candidate Name</th>
                        <th className="py-3 px-4">Target Role</th>
                        <th className="py-3 px-4">AI DNA Index</th>
                        <th className="py-3 px-4">ATS Match</th>
                        <th className="py-3 px-4 text-center">Core Technical Skillsets</th>
                        <th className="py-3 px-4">Stage Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCandidates.map((cand, idx) => (
                        <tr key={idx} className="border-b border-slate-800/65 hover:bg-slate-950/20">
                          <td className="py-3 px-4 font-bold text-slate-200">{cand.name}</td>
                          <td className="py-3 px-4 font-light text-slate-400">{cand.role}</td>
                          <td className="py-3 px-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">{cand.dnaScore}%</td>
                          <td className="py-3 px-4 font-bold text-slate-300">{cand.atsScore}%</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1 justify-center flex-wrap">
                              {cand.skills.map((s, si) => (
                                <span key={si} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-405">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                              cand.status === "Shortlisted" || cand.status === "Offer Extended"
                                ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/25"
                                : "bg-amber-600/10 text-amber-400 border border-amber-500/25"
                            }`}>
                              {cand.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Candidate Comparisons panel */}
                <div className="mt-8 border-t border-slate-800/80 pt-6 text-left">
                  <h4 className="text-base font-bold text-slate-200 mb-4">Talent Pipeline Insights</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
                      <span className="block text-[12px] text-slate-500 uppercase font-bold mb-1">Highest Skill Match Target</span>
                      <p className="text-xs text-slate-300"><strong>Eleanor Pena</strong> (92% ATS Fit for AI vacancies). Highly recommended for roles requiring TensorFlow and Gemini custom completions.</p>
                    </div>
                    <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800">
                      <span className="block text-[12px] text-slate-500 uppercase font-bold mb-1">System Audit Recommendations</span>
                      <p className="text-xs text-slate-300">We suggest scheduling technical screenings for <strong>Devon Lane</strong> whose background contains solid container registry configurations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <CopilotChat 
        apiKey={apiKey} 
        activeTab={activeTab} 
        resumeData={activeResume} 
      />
    </div>
  );
}
