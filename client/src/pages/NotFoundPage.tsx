import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-[#0D1520] flex flex-col items-center justify-center gap-4 text-center px-6">
      <div
        className="text-6xl font-black text-[#C8102E]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        404
      </div>
      <div
        className="text-white font-bold text-xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        PAGE NOT FOUND
      </div>
      <div className="text-[#7A8FA8] text-sm">
        That page doesn't exist. Let's get you back in the box.
      </div>
      <Button onClick={() => navigate("/")} className="mt-2">
        Back to Analyzer
      </Button>
    </div>
  );
}
