import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { CoachLogo } from "@/components/CoachLogo";
import { supabase } from "@/lib/supabase";
import type { Analysis } from "@shared/schema";

export default function AuthGatePage() {
  const [, params] = useRoute("/auth/:id");
  const [, navigate] = useLocation();
  const id = params?.id;
  const [signingIn, setSigningIn] = useState(false);
  const [checking, setChecking] = useState(true);

  const { data: analysis } = useQuery<Analysis>({
    queryKey: ["/api/analyses", id],
    queryFn: () => fetch(`/api/analyses/${id}`).then((r) => r.json()),
    refetchInterval: (query) => {
      const d = query.state.data as Analysis | undefined;
      return d?.status === "analyzing" || d?.status === "pending" ? 3000 : false;
    },
  });

  useEffect(() => {
    if (analysis?.userEmail) {
      navigate(`/result/${id}`);
    }
  }, [analysis, id, navigate]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session && id) {
        try {
          await fetch("/api/auth/link", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              analysisId: parseInt(id),
              accessToken: session.access_token,
            }),
          });
          navigate(`/result/${id}`);
          return;
        } catch {
          // Session expired or invalid, show sign-in
        }
      }
      setChecking(false);
    };
    checkSession();
  }, [id, navigate]);

  const handleSignIn = async () => {
    if (!id) return;
    setSigningIn(true);
    localStorage.setItem("pendingAnalysisId", id);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0D1520] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#C8102E] animate-spin" />
      </div>
    );
  }

  const isAnalyzing =
    analysis?.status === "pending" || analysis?.status === "analyzing";

  return (
    <div className="min-h-screen bg-[#0D1520] flex flex-col">
      <header className="border-b border-[#253044] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <CoachLogo />
          <div>
            <div
              className="font-extrabold text-white text-lg tracking-wide leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              COACH STEVE
            </div>
            <div className="text-[#7A8FA8] text-xs tracking-widest uppercase leading-none mt-0.5">
              Elite Swing Analyzer
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-8">
          {isAnalyzing && (
            <div className="space-y-4">
              <div className="relative mx-auto w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-[#253044] border-t-[#C8102E] animate-spin" />
              </div>
              <div>
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
              <div className="flex justify-center gap-1">
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

          {!isAnalyzing && (
            <div className="space-y-2">
              <Lock className="w-10 h-10 text-[#C8102E] mx-auto" />
              <h2
                className="text-white font-extrabold text-2xl uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your Report is Ready
              </h2>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[#7A8FA8] text-sm">
              {isAnalyzing
                ? "Sign in while we finish the analysis to unlock your report."
                : "Sign in with Google to view your swing analysis."}
            </p>

            <button
              onClick={handleSignIn}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-60"
            >
              {signingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              {signingIn ? "Redirecting..." : "Sign in with Google"}
            </button>
          </div>

          <p className="text-[#3D5068] text-xs">
            We only collect your name and email to deliver your report.
          </p>
        </div>
      </main>
    </div>
  );
}
