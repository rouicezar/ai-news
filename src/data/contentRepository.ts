import { articles, users } from "./mockData";
import type { Article, ArticleSection, HomeContent, User } from "../types/content";

export interface ContentRepository {
  getHomeContent(): Promise<HomeContent>;
  getArticles(section?: ArticleSection): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getUserProfile(username: string): Promise<{ user: User; articles: Article[] } | undefined>;
}

const publishedArticles = () => articles.filter((article) => article.status === "published");

const hotScore = (article: Article) =>
  article.metrics.likesCount + article.metrics.bookmarksCount * 2;

export const mockContentRepository: ContentRepository = {
  async getHomeContent() {
    const published = publishedArticles();
    const trending = [...published].sort((a, b) => hotScore(b) - hotScore(a));
    const latestNews = published
      .filter((article) => article.section === "news")
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
    const popularTips = published
      .filter((article) => article.section === "tips")
      .sort((a, b) => hotScore(b) - hotScore(a));

    return {
      leadStory: latestNews[0] ?? trending[0],
      latestNews,
      popularTips,
      trending,
      tags: Array.from(new Set(published.flatMap((article) => article.tags))).slice(0, 10),
    };
  },

  async getArticles(section) {
    return publishedArticles()
      .filter((article) => (section ? article.section === section : true))
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  },

  async getArticleBySlug(slug) {
    return publishedArticles().find((article) => article.slug === slug);
  },

  async getUserProfile(username) {
    const user = users.find((item) => item.username === username);

    if (!user) {
      return undefined;
    }

    const userArticles = publishedArticles()
      .filter((article) => article.author.id === user.id)
      .sort((a, b) => {
        const scoreDelta =
          b.metrics.likesCount +
          b.metrics.bookmarksCount -
          (a.metrics.likesCount + a.metrics.bookmarksCount);

        if (scoreDelta !== 0) {
          return scoreDelta;
        }

        if (b.metrics.bookmarksCount !== a.metrics.bookmarksCount) {
          return b.metrics.bookmarksCount - a.metrics.bookmarksCount;
        }

        return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
      });

    return { user, articles: userArticles };
  },
};
