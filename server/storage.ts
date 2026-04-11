import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import type { Analysis } from "../shared/schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "data", "coach-steve.db");

import fs from "fs";
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerName TEXT NOT NULL,
    playerAge TEXT DEFAULT '',
    playerLevel TEXT DEFAULT '',
    question TEXT DEFAULT '',
    videoUrl TEXT,
    status TEXT DEFAULT 'pending',
    report TEXT,
    createdAt TEXT DEFAULT (datetime('now'))
  )
`);

export function createAnalysis(data: {
  playerName: string;
  playerAge: string;
  playerLevel: string;
  question: string;
  videoUrl: string | null;
}): Analysis {
  const stmt = db.prepare(`
    INSERT INTO analyses (playerName, playerAge, playerLevel, question, videoUrl, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `);
  const result = stmt.run(
    data.playerName,
    data.playerAge,
    data.playerLevel,
    data.question,
    data.videoUrl
  );
  return getAnalysis(result.lastInsertRowid as number)!;
}

export function getAnalysis(id: number): Analysis | undefined {
  const stmt = db.prepare("SELECT * FROM analyses WHERE id = ?");
  return stmt.get(id) as Analysis | undefined;
}

export function getAllAnalyses(): Analysis[] {
  const stmt = db.prepare("SELECT * FROM analyses ORDER BY createdAt DESC");
  return stmt.all() as Analysis[];
}

export function updateAnalysisStatus(
  id: number,
  status: Analysis["status"],
  report?: string
): void {
  if (report !== undefined) {
    db.prepare("UPDATE analyses SET status = ?, report = ? WHERE id = ?").run(
      status,
      report,
      id
    );
  } else {
    db.prepare("UPDATE analyses SET status = ? WHERE id = ?").run(status, id);
  }
}
