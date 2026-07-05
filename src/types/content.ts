export type ArticleSection = "news" | "tips";

export type SourceType = "original" | "repost_summary" | "curated";

export type ArticleStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "rejected"
  | "archived";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  role: "user" | "trusted_author" | "editor" | "admin";
  followersCount: number;
  articlesCount: number;
  totalLikesCount: number;
  totalBookmarksCount: number;
}

export interface TipMetadata {
  toolName: string;
  toolUrl: string;
  difficulty: Difficulty;
  estimatedReadingMinutes: number;
  useCase: string;
  platforms: string[];
  coreSteps: string[];
}

export interface ArticleMetrics {
  likesCount: number;
  bookmarksCount: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  section: ArticleSection;
  status: ArticleStatus;
  author: User;
  sourceType: SourceType;
  sourceName?: string;
  sourceUrl?: string;
  originalPublishedAt?: string;
  publishedAt: string;
  tags: string[];
  metrics: ArticleMetrics;
  viewerHasLiked: boolean;
  viewerHasBookmarked: boolean;
  tipMetadata?: TipMetadata;
}

export interface HomeContent {
  leadStory: Article;
  latestNews: Article[];
  popularTips: Article[];
  trending: Article[];
  tags: string[];
}
