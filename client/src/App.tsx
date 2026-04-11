import { useState, useEffect } from "react";
import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import UploadPage from "./pages/UploadPage";
import ResultPage from "./pages/ResultPage";
import AuthGatePage from "./pages/AuthGatePage";
import HistoryPage from "./pages/HistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import { supabase } from "./lib/supabase";

function isOAuthCallback() {
  const hash = window.location.hash;
  return hash.includes("access_token=") || hash.includes("error_description=");
}

if (!window.location.hash && !isOAuthCallback()) {
  window.location.hash = "#/";
}

export default function App() {
  const [ready, setReady] = useState(!isOAuthCallback());

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        const pendingId = localStorage.getItem("pendingAnalysisId");
        if (pendingId && session) {
          localStorage.removeItem("pendingAnalysisId");
          try {
            await fetch("/api/auth/link", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                analysisId: parseInt(pendingId),
                accessToken: session.access_token,
              }),
            });
          } catch (e) {
            console.error("Failed to link user:", e);
          }
          window.location.hash = "#/result/" + pendingId;
        }
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0D1520] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#253044] border-t-[#C8102E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={UploadPage} />
        <Route path="/auth/:id" component={AuthGatePage} />
        <Route path="/result/:id" component={ResultPage} />
        <Route path="/history" component={HistoryPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}
