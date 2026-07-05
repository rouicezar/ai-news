import type { SourceType } from "../../types/content";

const sourceLabels: Record<SourceType, string> = {
  original: "原创",
  repost_summary: "转载摘要",
  curated: "编译整理",
};

interface BadgeProps {
  tone?: "neutral" | "accent" | "success" | "warning" | "error";
  children: React.ReactNode;
}

export function Badge({ tone = "neutral", children }: BadgeProps) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function SourceTypeBadge({ sourceType }: { sourceType: SourceType }) {
  const tone = sourceType === "original" ? "success" : "accent";

  return <Badge tone={tone}>{sourceLabels[sourceType]}</Badge>;
}
