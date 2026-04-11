import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoachLogo } from "@/components/CoachLogo";
import { ReportSection } from "@/components/ReportSection";
import { formatMarkdown, parseSections } from "@/lib/utils";
import type { Analysis } from "@shared/schema";

export default function ResultPage() {
  const [, params] = useRoute("/result/:id");
  const [, navigate] = useLocation();
  const id = params?.id;

  const { data, isLoading } = useQuery<Analysis>({
    queryKey: ["/api/analyses", id],
    queryFn: () => fetch(`/api/analyses/${id}`).then((r) => r.json()),
    refetchInterval: (query) => {
      const d = query.state.data as Analysis | undefined;
      return d?.status === "analyzing" || d?.status === "pending" ? 3000 : false;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1520] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8102E] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0D1520] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-[#C8102E]" />
        <div className="text-white font-bold">Analysis not found</div>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Go back
        </Button>
      </div>
    );
  }

  const sections = data.report ? parseSections(data.report) : {};

  const statusColor: Record<string, string> = {
    pending: "#7A8FA8",
    analyzing: "#F5A623",
    complete: "#2A8C45",
    error: "#C8102E",
  };

  const statusIcon: Record<string, React.ReactNode> = {
    pending: <Loader2 className="w-4 h-4 animate-spin" />,
    analyzing: <Loader2 className="w-4 h-4 animate-spin" />,
    complete: <CheckCircle2 className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-[#0D1520]">
      {/* Header */}
      <header className="border-b border-[#253044] px-6 py-4 sticky top-0 bg-[#0D1520]/95 backdrop-blur-sm z-10">
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
              <div>
                <div
                  className="font-extrabold text-white text-base leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {data.playerName}
                </div>
                <div className="text-[#7A8FA8] text-xs">
                  {data.playerAge && `Age ${data.playerAge} · `}
                  {data.playerLevel &&
                    data.playerLevel.charAt(0).toUpperCase() +
                      data.playerLevel.slice(1)}
                </div>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-2"
            style={{ color: statusColor[data.status] || "#7A8FA8" }}
          >
            {statusIcon[data.status]}
            <span className="text-xs font-semibold uppercase tracking-wide capitalize">
              {data.status === "analyzing" ? "Analyzing..." : data.status}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Pending / Analyzing */}
        {(data.status === "pending" || data.status === "analyzing") && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-[#253044] border-t-[#C8102E] animate-spin" />
            </div>
            <div className="text-center">
              <div
                className="text-white font-bold text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                READING THE SWING
              </div>
              <div className="text-[#7A8FA8] text-sm mt-1">
                Breaking down every phase. This takes 30–60 seconds.
              </div>
            </div>
            <div className="flex gap-1 mt-2">
              {["Setup", "Load", "Launch", "Contact", "Extension"].map(
                (phase) => (
                  <div
                    key={phase}
                    className="text-xs px-2 py-1 rounded border border-[#253044] text-[#3D5068]"
                  >
                    {phase}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {data.status === "error" && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle className="w-12 h-12 text-[#C8102E]" />
            <div className="text-white font-bold text-lg">Analysis Failed</div>
            <div className="text-[#7A8FA8] text-sm">
              Something went wrong. Try uploading again.
            </div>
            <Button onClick={() => navigate("/")}>Try Again</Button>
          </div>
        )}

        {/* Complete */}
        {data.status === "complete" && data.report && (
          <div className="space-y-5">
            {/* Video + Question */}
            {(data.videoUrl || data.question) && (
              <div className="bg-[#141C26] border border-[#253044] rounded-xl p-5 flex flex-col sm:flex-row gap-4">
                {data.videoUrl && (
                  <div className="sm:w-64 shrink-0">
                    <video
                      src={data.videoUrl}
                      controls
                      className="w-full rounded-lg bg-black"
                      style={{ maxHeight: "160px" }}
                    />
                  </div>
                )}
                {data.question && (
                  <div className="flex-1">
                    <div className="text-[#7A8FA8] text-xs uppercase tracking-widest mb-1">
                      Their Question
                    </div>
                    <div className="text-[#CBD8E8] text-sm italic">
                      &ldquo;{data.question}&rdquo;
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Line */}
            {sections["THE BOTTOM LINE"] && (
              <div className="bg-gradient-to-br from-[#C8102E]/15 to-[#1A2436] border border-[#C8102E]/40 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-[#C8102E]/20">
                  <span className="text-lg">📋</span>
                  <h3
                    className="font-extrabold text-sm uppercase tracking-widest text-[#C8102E]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    The Bottom Line
                  </h3>
                </div>
                <div className="px-5 py-5">
                  <div
                    className="report-content text-[#CBD8E8]"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(sections["THE BOTTOM LINE"]),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Elite + Broken */}
            <div className="grid md:grid-cols-2 gap-5">
              {sections["WHAT'S ELITE — DO NOT TOUCH"] && (
                <ReportSection
                  title="What's Elite — Do Not Touch"
                  icon="★★★★★"
                  color="#F5C842"
                  content={sections["WHAT'S ELITE — DO NOT TOUCH"]}
                />
              )}
              {sections["WHAT'S BROKEN — FIX THIS OR FAIL"] && (
                <ReportSection
                  title="What's Broken — Fix This or Fail"
                  icon="⚠️"
                  color="#F5A623"
                  content={sections["WHAT'S BROKEN — FIX THIS OR FAIL"]}
                />
              )}
            </div>

            {/* Profile + Standing */}
            <div className="grid md:grid-cols-2 gap-5">
              {sections["SWING PROFILE"] && (
                <ReportSection
                  title="Swing Profile"
                  icon="📊"
                  color="#5591C7"
                  content={sections["SWING PROFILE"]}
                />
              )}
              {sections["WHERE THIS HITTER STANDS"] && (
                <ReportSection
                  title="Where This Hitter Stands"
                  icon="🎯"
                  color="#4F98A3"
                  content={sections["WHERE THIS HITTER STANDS"]}
                />
              )}
            </div>

            {/* Development Priorities */}
            {sections["DEVELOPMENT PRIORITIES"] && (
              <div className="bg-[#141C26] border border-[#253044] rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-[#1A2436]">
                  <span className="text-lg">🏋️</span>
                  <h3
                    className="font-extrabold text-sm uppercase tracking-widest text-[#CBD8E8]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Development Priorities
                  </h3>
                </div>
                <div className="px-5 py-4">
                  <div
                    className="report-content text-sm"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdown(
                        sections["DEVELOPMENT PRIORITIES"]
                      ),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Fallback: raw report */}
            {Object.keys(sections).length === 0 && (
              <div className="bg-[#141C26] border border-[#253044] rounded-xl p-6">
                <div
                  className="report-content"
                  dangerouslySetInnerHTML={{
                    __html: formatMarkdown(data.report),
                  }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
              >
                Analyze Another Swing
              </Button>
              <Button
                onClick={() => navigate("/history")}
                variant="ghost"
              >
                <Clock className="w-4 h-4 mr-2" />
                View All Reports
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
