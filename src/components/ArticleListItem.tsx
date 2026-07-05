import { Bookmark, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Article } from "../types/content";
import { ArticleMeta } from "./ArticleMeta";
import { MetricButton } from "./ui/MetricButton";

interface ArticleListItemProps {
  article: Article;
  onRequireAuth: (action: string) => void;
}

export function ArticleListItem({ article, onRequireAuth }: ArticleListItemProps) {
  return (
    <article className="article-list-item">
      <Link className="article-title-button" to={`/articles/${article.slug}`}>
        <h3>{article.title}</h3>
      </Link>
      <p>{article.summary}</p>
      <ArticleMeta article={article} />
      <div className="article-row-footer">
        <div className="tag-list" aria-label="文章标签">
          {article.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
        <div className="metric-group">
          <MetricButton
            icon={Heart}
            label="点赞"
            count={article.metrics.likesCount}
            selected={article.viewerHasLiked}
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
