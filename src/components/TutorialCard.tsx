import { Bookmark, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article, Difficulty } from "../types/content";
import { Badge } from "./ui/Badge";
import { MetricButton } from "./ui/MetricButton";

const difficultyLabels: Record<Difficulty, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

interface TutorialCardProps {
  article: Article;
  onRequireAuth: (action: string) => void;
}

export function TutorialCard({ article, onRequireAuth }: TutorialCardProps) {
  const metadata = article.tipMetadata;

  return (
    <article className="tutorial-card">
      <div className="tutorial-card__meta">
        <Badge tone="neutral">{metadata?.toolName ?? "AI 工具"}</Badge>
        {metadata ? <Badge tone="warning">{difficultyLabels[metadata.difficulty]}</Badge> : null}
      </div>
      <Link className="article-title-button" to={`/articles/${article.slug}`}>
        <h3>{article.title}</h3>
      </Link>
      <p>{article.summary}</p>
      {metadata ? (
        <dl className="tutorial-facts">
          <div>
            <dt>场景</dt>
            <dd>{metadata.useCase}</dd>
          </div>
          <div>
            <dt>阅读</dt>
            <dd>{metadata.estimatedReadingMinutes} 分钟</dd>
          </div>
        </dl>
      ) : null}
      <div className="article-row-footer">
        <span className="muted">{article.author.displayName}</span>
        <div className="metric-group">
          <MetricButton
            icon={Heart}
            label="点赞"
            count={article.metrics.likesCount}
            onClick={() => onRequireAuth("点赞")}
          />
          <MetricButton
            icon={Bookmark}
            label="收藏"
            count={article.metrics.bookmarksCount}
            selected={article.viewerHasBookmarked}
            onClick={() => onRequireAuth("收藏")}
          />
        </div>
      </div>
    </article>
  );
}
