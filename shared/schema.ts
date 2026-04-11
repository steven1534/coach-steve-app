export interface Analysis {
  id: number;
  playerName: string;
  playerAge: string;
  playerLevel: string;
  question: string;
  videoUrl: string | null;
  status: "pending" | "analyzing" | "complete" | "error";
  report: string | null;
  userEmail: string | null;
  userName: string | null;
  createdAt: string;
}

export interface CreateAnalysisInput {
  playerName: string;
  playerAge?: string;
  playerLevel?: string;
  question?: string;
}
