import { useQuery } from "@tanstack/react-query";
import { useHashLocation } from "wouter/use-hash-location";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoachLogo } from "@/components/CoachLogo";
import { LEVEL_LABELS } from "@/lib/utils";
import type { Analysis } from "@shared/schema";

export default function HistoryPage() {
  const [, navigate] = useHashLocation();

  const { data: analyses = [], isLoading } = useQuery<Analysis[]>({
    queryKey: ["/api/analyses"],
    queryFn: () => fetch("/api/analyses").then((r) => r.json()),
  });

  const sorted = [...analyses].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });

  const statusMap: Record<
    string,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    complete: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "#2A8C45",
      label: "Complete",
    },
    analyzing: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      color: "#F5A623",
      label: "Analyzing...",
    },
    pending: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      color: "#7A8FA8",
      label: "Pending",
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: "#C8102E",
      label: "Error",
    },
  };

  return (
    <div className="min-h-screen bg-[#0D1520]">
      <header className="border-b border-[#253044] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="text-[#7A8FA8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <CoachLogo size={32} />
              <div
                className="font-extrabold text-white text-base"
                style={{ fontFamily: "var(--font-display)" }}
              >
                PAST REPORTS
              </div>
            </div>
          </div>
          <Button onClick={() => navigate("/")} className="text-sm font-bold">
            <Plus className="w-4 h-4 mr-1" />
            New Analysis
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#C8102E] animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-[#141C26] border border-[#253044] flex items-center justify-center text-2xl">
              ⚾
            </div>
            <div
              className="text-white font-bold text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No reports yet
            </div>
            <div className="text-[#7A8FA8] text-sm">
              Upload your first swing to get started
            </div>
            <Button onClick={() => navigate("/")} className="mt-2">
              Analyze a Swing
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-[#7A8FA8] text-sm mb-4">
              {sorted.length} report{sorted.length !== 1 ? "s" : ""}
            </div>
            {sorted.map((analysis) => {
              const status = statusMap[analysis.status] || statusMap.pending;
              const date = analysis.createdAt
                ? new Date(analysis.createdAt)
                : null;
              return (
                <button
                  key={analysis.id}
                  onClick={() => navigate(`/result/${analysis.id}`)}
                  className="w-full bg-[#141C26] border border-[#253044] rounded-xl p-5 flex items-center justify-between hover:border-[#3D5068] hover:bg-[#1A2436] transition-all group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-full bg-[#1A2436] border border-[#253044] flex items-center justify-center text-base font-black text-[#7A8FA8]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {analysis.playerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div
                        className="text-white font-bold text-base"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {analysis.playerName}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {analysis.playerAge && (
                          <span className="text-[#7A8FA8] text-xs">
                            Age {analysis.playerAge}
                          </span>
                        )}
                        {analysis.playerLevel && (
                          <>
                            <span className="text-[#3D5068] text-xs">·</span>
                            <span className="text-[#7A8FA8] text-xs">
                              {LEVEL_LABELS[analysis.playerLevel] ||
                                analysis.playerLevel}
                            </span>
                          </>
                        )}
                        {date && (
                          <>
                            <span className="text-[#3D5068] text-xs">·</span>
                            <span className="text-[#7A8FA8] text-xs">
                              {date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center gap-1.5"
                      style={{ color: status.color }}
                    >
                      {status.icon}
                      <span className="text-xs font-semibold uppercase tracking-wide hidden sm:inline">
                        {status.label}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#3D5068] group-hover:text-[#7A8FA8] transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
