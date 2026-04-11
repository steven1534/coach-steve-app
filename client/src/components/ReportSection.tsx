import { formatMarkdown } from "@/lib/utils";

interface ReportSectionProps {
  title: string;
  icon: string;
  color: string;
  content: string;
}

export function ReportSection({ title, icon, color, content }: ReportSectionProps) {
  return (
    <div
      className="border rounded-xl overflow-hidden"
      style={{ borderColor: color + "33" }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3"
        style={{ backgroundColor: color + "18" }}
      >
        <span className="text-lg">{icon}</span>
        <h3
          className="font-extrabold text-sm uppercase tracking-widest"
          style={{ color, fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">
        <div
          className="report-content text-sm"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
        />
      </div>
    </div>
  );
}
