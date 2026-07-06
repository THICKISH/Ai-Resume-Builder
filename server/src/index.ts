import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "careeros-super-secure-secret-token";

// Middleware
app.use(cors());
app.use(express.json());

// Mock DB objects
const mockUsers = [
  { id: "u-1", email: "alex@example.com", name: "Alex Mercer", role: "candidate" },
  { id: "u-2", email: "recruiter@example.com", name: "Devon Recruiter", role: "recruiter" }
];

// Helper Interfaces
interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// ----------------------------------------------------
// SECURITY MIDDLEWARE
// ----------------------------------------------------
const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or malformed Authorization header." });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token." });
  }
};

const requireRole = (allowedRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: "Access denied. Insufficient permissions." });
      return;
    }
    next();
  };
};

// ----------------------------------------------------
// ROUTES
// ----------------------------------------------------

// 1. Healthcheck & Auth Mock
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy", services: { postgres: "connected", mongodb: "connected", redis: "connected" } });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    res.status(400).json({ error: "User not found." });
    return;
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token, user });
});

// 2. Module 1: AI Career DNA Analyzer
app.post("/api/dna/analyze", authenticateJWT, async (req: CustomRequest, res: Response) => {
  const { githubUrl, linkedinUrl, skills, interests } = req.body;
  
  // Here we would typically initialize GoogleGenAI with process.env.GEMINI_API_KEY
  // and run a Gemini Pro model content generation.
  // We simulate the output shape:
  res.json({
    success: true,
    score: 82,
    strengths: [
      "Demonstrates high compliance with modern script environments",
      "Robust project listings including database configuration metrics"
    ],
    weaknesses: [
      "Missing orchestration certifications",
      "Lacks integration logs of messaging queues (RabbitMQ/Kafka)"
    ],
    opportunities: [
      "Integrate Redis caches in candidate repos to qualify for Senior openings",
      "Build a simple RAG application to showcase AI intelligence mastery"
    ],
    summary: "Solid development profile exhibiting good script logic. Up-skilling in message buses and caching will yield highest ROI."
  });
});

// 3. Module 2: AI Resume Intelligence Scanner
app.post("/api/resume/scan", authenticateJWT, (req: CustomRequest, res: Response) => {
  // In production, parse Multer file buffer and extract text
  res.json({
    ats_score: 76,
    suggestions: [
      "Add explicit metrics to experience blocks (e.g. percentages, headcounts).",
      "Provide technical keywords reflecting AWS/cloud infrastructure configuration."
    ],
    gaps: ["Docker Compose", "Redis Caching", "CI/CD Staging Pipelines"],
    optimizedAchievements: [
      "Refactored data synchronization routines, accelerating load rates by 28%.",
      "Designed clean API gateways utilizing tokenized JWT authentication systems."
    ]
  });
});

// 4. Module 3: Job Matching Engine
app.post("/api/jobs/match", authenticateJWT, (req: CustomRequest, res: Response) => {
  const { resumeText, jobDescription } = req.body;
  res.json({
    matchPercentage: 81,
    missingSkills: ["Docker", "Redis", "Elasticsearch"],
    atsCompatibility: 88,
    successProbability: 74,
    recommendedChanges: "Integrate dockerized setup specifications in your project logs to boost matching index levels to 95%+."
  });
});

// 5. Module 4: AI Interview Copilot
app.post("/api/interview/evaluate", authenticateJWT, (req: CustomRequest, res: Response) => {
  const { transcript, category } = req.body;
  res.json({
    score: 84,
    confidenceRating: "High",
    speechRateWpm: 132,
    fillerWordsCount: 3,
    feedback: "Response is structured cleanly. Highlighting measurable business outcomes will make this answer perfect."
  });
});

// 6. Module 5: AI Learning Roadmap
app.post("/api/roadmap/generate", authenticateJWT, (req: CustomRequest, res: Response) => {
  const { targetRole } = req.body;
  res.json({
    roadmap: {
      role: targetRole,
      duration: "3 Months",
      milestones: [
        { phase: "Month 1", daily: "Practice syntax patterns", weekly: "Build CLI tools", monthly: "Design database schemas" },
        { phase: "Month 2", daily: "Study caching APIs", weekly: "Implement Redis hooks", monthly: "Build fully integrated servers" }
      ]
    }
  });
});

// 7. Module 6: AI Project Generator
app.post("/api/projects/generate", authenticateJWT, (req: CustomRequest, res: Response) => {
  const { role } = req.body;
  res.json({
    project: {
      title: `AI-Powered ${role} Pipeline`,
      techStack: ["Next.js", "TypeScript", "PostgreSQL", "Gemini API"],
      architecture: "Client renders interactive tables. API server fetches context from Postgres and feeds optimizations using Gemini models.",
      folderStructure: "src/\n├── app/\n│   └── api/\n└── components/",
      dbSchema: "CREATE TABLE profiles (id UUID PRIMARY KEY, bio TEXT, score INTEGER);",
      apiEndpoints: [{ method: "POST", route: "/api/optimize" }]
    }
  });
});

// 8. Module 9: Recruiter Dashboard
app.get("/api/recruiter/candidates", authenticateJWT, requireRole(["recruiter", "admin"]), (req: CustomRequest, res: Response) => {
  res.json([
    { name: "Alex Mercer", score: 82, matchPercentage: 81, status: "Shortlisted" },
    { name: "Morgan Vance", score: 74, matchPercentage: 70, status: "Under Review" }
  ]);
});

// Start Server
app.listen(PORT, () => {
  console.log(`[CareerOS API] Running on http://localhost:${PORT}`);
});
