import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /★★★★★ (.+)/g,
      '<div class="flex items-center gap-2 mb-2"><span class="text-yellow-400 text-base">★★★★★</span><span class="font-bold text-white" style="font-family:var(--font-display);font-size:1.05rem;letter-spacing:0.04em;text-transform:uppercase">$1</span></div>'
    )
    .replace(
      /⚠️ (.+)/g,
      '<div class="flex items-center gap-2 mb-2"><span class="text-orange-400 text-base">⚠️</span><span class="font-bold text-white" style="font-family:var(--font-display);font-size:1.05rem;letter-spacing:0.04em;text-transform:uppercase">$1</span></div>'
    )
    .replace(
      /🟢 \*\*(.+?)\*\*/g,
      '<div class="flex items-start gap-2 mb-2"><span>🟢</span><span class="font-bold text-green-400">$1</span></div>'
    )
    .replace(
      /🔴 \*\*(.+?)\*\*/g,
      '<div class="flex items-start gap-2 mb-2"><span>🔴</span><span class="font-bold text-red-400">$1</span></div>'
    )
    .replace(
      /🔵 \*\*(.+?)\*\*/g,
      '<div class="flex items-start gap-2 mb-2"><span>🔵</span><span class="font-bold text-blue-400">$1</span></div>'
    )
    .replace(/^- (.+)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, "</p><p class='mb-3'>")
    .replace(/\n/g, "<br/>");
}

export function parseSections(
  report: string
): Record<string, string> {
  const sections: Record<string, string> = {};
  const regex = /## ([^\n]+)\n([\s\S]*?)(?=## |\s*$)/g;
  let match;
  while ((match = regex.exec(report)) !== null) {
    sections[match[1].trim()] = match[2].trim();
  }
  return sections;
}

export const LEVEL_LABELS: Record<string, string> = {
  rec: "Recreational",
  travel: "Travel Ball",
  hs: "High School",
  college: "College",
  pro: "Pro / Semi-Pro",
};
