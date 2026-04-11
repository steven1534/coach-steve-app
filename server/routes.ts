import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import {
  createAnalysis,
  getAnalysis,
  getAllAnalyses,
  updateAnalysisStatus,
  linkUserToAnalysis,
} from "./storage.js";
import { analyzeSwing } from "./analyze.js";

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

const router = Router();

router.post("/api/analyze", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Video file is required" });
    }
    const { playerName, playerAge, playerLevel, question } = req.body;
    if (!playerName?.trim()) {
      return res.status(400).json({ error: "Player name is required" });
    }

    const videoUrl = `/uploads/${req.file.filename}`;
    const analysis = createAnalysis({
      playerName: playerName.trim(),
      playerAge: playerAge || "",
      playerLevel: playerLevel || "",
      question: question || "",
      videoUrl,
    });

    res.json({ id: analysis.id });

    // Run analysis in background
    updateAnalysisStatus(analysis.id, "analyzing");
    try {
      const report = await analyzeSwing(
        req.file.path,
        playerName,
        playerAge || "",
        playerLevel || "",
        question || ""
      );
      updateAnalysisStatus(analysis.id, "complete", report);
    } catch (err: any) {
      console.error("Analysis failed:", err.message);
      updateAnalysisStatus(analysis.id, "error");
    }
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});

router.post("/api/auth/link", async (req, res) => {
  try {
    const { analysisId, accessToken } = req.body;
    if (!analysisId || !accessToken) {
      return res.status(400).json({ error: "Missing analysisId or accessToken" });
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const email = user.email || "";
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email;

    linkUserToAnalysis(analysisId, email, name);
    res.json({ success: true, email, name });
  } catch (err: any) {
    console.error("Auth link error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

router.get("/api/analyses", (_req, res) => {
  const analyses = getAllAnalyses();
  res.json(analyses);
});

router.get("/api/analyses/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
  const analysis = getAnalysis(id);
  if (!analysis) return res.status(404).json({ error: "Not found" });
  res.json(analysis);
});

export default router;
