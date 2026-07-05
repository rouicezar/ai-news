import { ExternalLink } from "lucide-react";
import type { Article } from "../types/content";
import { SourceTypeBadge } from "./ui/Badge";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function ArticleMeta({ article }: { article: Article }) {
  const publishedAt = dateFormatter.format(new Date(article.publishedAt));

  return (
    <div className="article-meta">
      <SourceTypeBadge sourceType={article.sourceType} />
      {article.sourceType === "original" ? (
        <span>作者：{article.author.displayName}</span>
      ) : (
        <a
          className="source-link"
          href={article.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          来源：{article.sourceName}
          <ExternalLink aria-hidden="true" size={13} />
        </a>
      )}
      <span>{publishedAt}</span>
    </div>
  );
}
