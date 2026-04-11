import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import {
  Upload,
  CheckCircle2,
  Zap,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { CoachLogo } from "@/components/CoachLogo";
import { useToast } from "@/components/ui/toaster";
import { formatFileSize } from "@/lib/utils";

export default function UploadPage() {
  const [, navigate] = useHashLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState("");
  const [playerLevel, setPlayerLevel] = useState("");
  const [question, setQuestion] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped && dropped.type.startsWith("video/")) {
        setFile(dropped);
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload a video file.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      return toast({
        title: "No video",
        description: "Please upload a swing video.",
        variant: "destructive",
      });
    }
    if (!playerName.trim()) {
      return toast({
        title: "Missing name",
        description: "Enter the player's name.",
        variant: "destructive",
      });
    }

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("video", file);
      formData.append("playerName", playerName);
      formData.append("playerAge", playerAge);
      formData.append("playerLevel", playerLevel);
      formData.append("question", question);

      setProgress(30);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Upload failed");
      }

      const data = await res.json();
      setProgress(100);
      navigate(`/result/${data.id}`);
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1520] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#253044] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 text-[#7A8FA8] hover:text-white transition-colors text-sm"
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Past Reports</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-[#253044] bg-gradient-to-b from-[#111B2A] to-[#0D1520]">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#C8102E]/10 border border-[#C8102E]/30 rounded-full px-3 py-1 mb-4">
              <Zap className="w-3 h-3 text-[#C8102E]" />
              <span className="text-[#C8102E] text-xs font-semibold tracking-wider uppercase">
                D1 All-American Analysis
              </span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-black uppercase text-white mb-4 leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              UPLOAD YOUR
              <br />
              <span className="text-[#C8102E]">SWING.</span>
              <br />
              GET THE TRUTH.
            </h1>
            <p className="text-[#7A8FA8] text-base max-w-lg leading-relaxed">
              No participation trophies. No sugarcoating. Scout-level breakdown
              of exactly what's elite and exactly what's broken — from a former
              D1 All-American who's seen thousands of swings.
            </p>
          </div>
        </div>
      </div>

      {/* Main form */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
          {/* Left: Video upload */}
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className="text-white font-extrabold text-xl uppercase mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Swing Video
              </h2>
              <p className="text-[#7A8FA8] text-sm">
                MP4, MOV, or WebM &middot; Max 200MB
              </p>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 transition-all min-h-[260px] ${
                dragging
                  ? "border-[#C8102E] bg-[#C8102E]/5"
                  : file
                    ? "border-[#2A8C45] bg-[#2A8C45]/5"
                    : "border-[#253044] hover:border-[#3D5068] bg-[#141C26]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="text-center px-6">
                  <CheckCircle2 className="w-10 h-10 text-[#2A8C45] mx-auto mb-3" />
                  <div className="text-white font-semibold text-sm truncate max-w-[200px] mx-auto">
                    {file.name}
                  </div>
                  <div className="text-[#7A8FA8] text-xs mt-1">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="mt-3 text-[#7A8FA8] text-xs">
                    Click to replace
                  </div>
                </div>
              ) : (
                <div className="text-center px-6">
                  <Upload className="w-10 h-10 text-[#3D5068] mx-auto mb-3" />
                  <div className="text-white font-medium text-sm">
                    Drop your swing video here
                  </div>
                  <div className="text-[#7A8FA8] text-xs mt-1">
                    or click to browse
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Player info */}
          <div className="flex flex-col gap-5">
            <div>
              <h2
                className="text-white font-extrabold text-xl uppercase mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Player Info
              </h2>
              <p className="text-[#7A8FA8] text-sm">
                Helps calibrate the analysis to the right level
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="playerName">Player Name *</Label>
                <Input
                  id="playerName"
                  placeholder="e.g. Jake Martinez"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="playerAge">Age</Label>
                  <Input
                    id="playerAge"
                    placeholder="e.g. 14"
                    value={playerAge}
                    onChange={(e) => setPlayerAge(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Level</Label>
                  <Select
                    value={playerLevel}
                    onValueChange={setPlayerLevel}
                    placeholder="Select..."
                  >
                    <SelectItem value="rec">Recreational</SelectItem>
                    <SelectItem value="travel">Travel Ball</SelectItem>
                    <SelectItem value="hs">High School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="pro">Pro / Semi-Pro</SelectItem>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="question">
                  What are you trying to figure out?
                </Label>
                <Textarea
                  id="question"
                  placeholder="e.g. My son keeps popping up to the pull side. Is it his swing path or his timing?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="pt-2">
              {uploading ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7A8FA8]">
                      {progress < 80
                        ? "Uploading video..."
                        : "Analyzing swing..."}
                    </span>
                    <span className="text-white font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#253044] rounded-full h-2">
                    <div
                      className="bg-[#C8102E] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-[#C8102E] hover:bg-[#E8152F] text-white font-extrabold text-base uppercase tracking-wide py-6 rounded-xl transition-all"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Run the Analysis <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* What You Get section */}
        <div className="mt-16 border-t border-[#253044] pt-10">
          <h3
            className="text-white font-extrabold text-lg uppercase mb-6 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What You Get
          </h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: "★★★★★",
                title: "What's Elite",
                desc: "2–3 mechanics that are non-negotiable. If a coach tries to change these, walk away.",
              },
              {
                icon: "⚠️",
                title: "What's Broken",
                desc: "2–4 flaws that will get this hitter exposed. Named, phased, and explained.",
              },
              {
                icon: "🎯",
                title: "The Ceiling",
                desc: "Where this hitter stands right now and what they can become if the broken parts get fixed.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-[#141C26] border border-[#253044] rounded-xl p-5"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <div
                  className="text-white font-bold text-base mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </div>
                <div className="text-[#7A8FA8] text-sm leading-relaxed">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
