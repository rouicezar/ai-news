import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Bookmark, ExternalLink, Heart, UserPlus } from "lucide-react";
import { useAuth } from "./auth/AuthContext";
import { ArticleListItem } from "./components/ArticleListItem";
import { ArticleMeta } from "./components/ArticleMeta";
import { GlobalHeader } from "./components/GlobalHeader";
import { TutorialCard } from "./components/TutorialCard";
import { Badge } from "./components/ui/Badge";
import { MetricButton } from "./components/ui/MetricButton";
import { mockContentRepository } from "./data/contentRepository";
import type { Article, HomeContent, User } from "./types/content";

function App() {
  const { currentUser, logout } = useAuth();
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    void mockContentRepository.getHomeContent().then(setHomeContent);
    void mockContentRepository.getArticles().then(setArticles);
  }, []);

  const requireAuth = (action: string) => {
    if (!currentUser) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: `${action}需要先登录。`,
        },
      });
      return;
    }

    setToast(`${action}已记录。本阶段为本地状态演示，下一步会接入持久化。`);
    window.setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="app-shell">
      <GlobalHeader currentUser={currentUser} onLogout={logout} />
      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              homeContent ? (
                <HomeView content={homeContent} onRequireAuth={requireAuth} />
              ) : (
                <LoadingState />
              )
            }
          />
          <Route
            path="/news"
            element={
              <ListingView
                title="全球 AI 新闻"
                eyebrow="News"
                articles={articles.filter((article) => article.section === "news")}
                onRequireAuth={requireAuth}
              />
            }
          />
          <Route
            path="/tips"
            element={
              <ListingView
                title="AI 工具技巧"
                eyebrow="Methods"
                mode="tips"
                articles={articles.filter((article) => article.section === "tips")}
                onRequireAuth={requireAuth}
              />
            }
          />
          <Route
            path="/hot"
            element={
              <ListingView
                title="全站热榜"
                eyebrow="Trending"
                articles={[...articles].sort(hotSort)}
                onRequireAuth={requireAuth}
              />
            }
          />
          <Route
            path="/me/bookmarks"
            element={
              <RequireAuth>
                <ListingView
                  title="我的收藏"
                  eyebrow="Saved"
                  articles={articles.filter((article) => article.viewerHasBookmarked)}
                  onRequireAuth={requireAuth}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/articles/:slug"
            element={<ArticleRoute articles={articles} onRequireAuth={requireAuth} />}
          />
          <Route path="/u/:username" element={<ProfileRoute articles={articles} />} />
          <Route
            path="/submit"
            element={
              <RequireAuth>
                <SubmitPreview />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

const hotSort = (a: Article, b: Article) =>
  b.metrics.likesCount +
  b.metrics.bookmarksCount * 2 -
  (a.metrics.likesCount + a.metrics.bookmarksCount * 2);

function LoadingState() {
  return (
    <div className="container page-heading">
      <p className="eyebrow">Loading</p>
      <h1>正在加载内容</h1>
    </div>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "这个页面需要先登录。",
        }}
      />
    );
  }

  return children;
}

interface HomeViewProps {
  content: HomeContent;
  onRequireAuth: (action: string) => void;
}

function HomeView({ content, onRequireAuth }: HomeViewProps) {
  return (
    <div className="container page-grid">
      <section className="lead-story" aria-labelledby="lead-story-title">
        <div className="eyebrow">今日重点</div>
        <Link className="lead-story__button" to={`/articles/${content.leadStory.slug}`}>
          <h1 id="lead-story-title">{content.leadStory.title}</h1>
          <p>{content.leadStory.summary}</p>
        </Link>
        <ArticleMeta article={content.leadStory} />
        <div className="article-row-footer">
          <div className="tag-list">
            {content.leadStory.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
          <div className="metric-group">
            <MetricButton
              icon={Heart}
              label="点赞"
              count={content.leadStory.metrics.likesCount}
              onClick={() => onRequireAuth("点赞")}
            />
            <MetricButton
              icon={Bookmark}
              label="收藏"
              count={content.leadStory.metrics.bookmarksCount}
              selected={content.leadStory.viewerHasBookmarked}
              onClick={() => onRequireAuth("收藏")}
            />
          </div>
        </div>
      </section>

      <aside className="side-panel" aria-label="热榜和标签">
        <div className="section-title">
          <h2>全站热榜</h2>
          <span className="muted">7 天</span>
        </div>
        <ol className="trending-list">
          {content.trending.slice(0, 4).map((article, index) => (
            <li key={article.id}>
              <Link to={`/articles/${article.slug}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {article.title}
              </Link>
            </li>
          ))}
        </ol>
        <div className="tag-cloud" aria-label="热门标签">
          {content.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      </aside>

      <section className="content-column">
        <div className="section-title">
          <h2>最新 AI 新闻</h2>
          <Link className="text-button" to="/news">
            查看全部
          </Link>
        </div>
        {content.latestNews.map((article) => (
          <ArticleListItem
            key={article.id}
            article={article}
            onRequireAuth={onRequireAuth}
          />
        ))}
      </section>

      <section className="tips-column">
        <div className="section-title">
          <h2>热门工具技巧</h2>
          <Link className="text-button" to="/tips">
            查看全部
          </Link>
        </div>
        <div className="tutorial-grid">
          {content.popularTips.map((article) => (
            <TutorialCard
              key={article.id}
              article={article}
              onRequireAuth={onRequireAuth}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ListingView({
  title,
  eyebrow,
  mode = "list",
  articles,
  onRequireAuth,
}: {
  title: string;
  eyebrow: string;
  mode?: "list" | "tips";
  articles: Article[];
  onRequireAuth: (action: string) => void;
}) {
  return (
    <div className="container listing-layout">
      <aside className="filter-panel" aria-label="筛选">
        <h2>筛选</h2>
        <button className="filter-chip filter-chip--active" type="button">
          全部
        </button>
        <button className="filter-chip" type="button">
          最近 24 小时
        </button>
        <button className="filter-chip" type="button">
          原创
        </button>
        <button className="filter-chip" type="button">
          编译整理
        </button>
      </aside>
      <section>
        <div className="page-heading">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>按需求文档保留来源、作者、时间、点赞和收藏状态。</p>
        </div>
        <div className={mode === "tips" ? "tutorial-grid" : "stack"}>
          {articles.map((article) =>
            article.section === "tips" && mode === "tips" ? (
              <TutorialCard
                key={article.id}
                article={article}
                onRequireAuth={onRequireAuth}
              />
            ) : (
              <ArticleListItem
                key={article.id}
                article={article}
                onRequireAuth={onRequireAuth}
              />
            ),
          )}
        </div>
      </section>
    </div>
  );
}

function ArticleRoute({
  articles,
  onRequireAuth,
}: {
  articles: Article[];
  onRequireAuth: (action: string) => void;
}) {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return (
      <div className="container page-heading">
        <p className="eyebrow">Not found</p>
        <h1>没有找到这篇文章</h1>
        <Link className="secondary-button" to="/">
          返回首页
        </Link>
      </div>
    );
  }

  return <ArticleDetail article={article} onRequireAuth={onRequireAuth} />;
}

function ArticleDetail({
  article,
  onRequireAuth,
}: {
  article: Article;
  onRequireAuth: (action: string) => void;
}) {
  return (
    <div className="container detail-layout">
      <article className="article-detail">
        <Badge tone={article.sourceType === "original" ? "success" : "accent"}>
          {article.sourceType === "original" ? "原创" : "来源可追溯"}
        </Badge>
        <h1>{article.title}</h1>
        <p className="article-summary">{article.summary}</p>
        <ArticleMeta article={article} />
        <div className="detail-actions">
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
        <p>{article.body}</p>
        {article.tipMetadata ? (
          <section className="method-block" aria-labelledby="method-title">
            <h2 id="method-title">核心步骤</h2>
            <ol>
              {article.tipMetadata.coreSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        ) : null}
      </article>
      <aside className="detail-aside">
        <section>
          <h2>作者</h2>
          <p>{article.author.displayName}</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => onRequireAuth("关注作者")}
          >
            <UserPlus aria-hidden="true" size={16} />
            关注作者
          </button>
        </section>
        {article.sourceUrl ? (
          <section>
            <h2>原文出处</h2>
            <a className="external-source" href={article.sourceUrl} target="_blank" rel="noreferrer">
              {article.sourceName}
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          </section>
        ) : null}
        <section>
          <h2>标签</h2>
          <div className="tag-list">
            {article.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function ProfileRoute({ articles }: { articles: Article[] }) {
  const { username } = useParams();
  const user = articles.find((article) => article.author.username === username)?.author;

  if (!user) {
    return (
      <div className="container page-heading">
        <p className="eyebrow">User</p>
        <h1>没有找到这个用户</h1>
      </div>
    );
  }

  return <ProfilePreview user={user} articles={articles} />;
}

function ProfilePreview({ user, articles }: { user: User; articles: Article[] }) {
  const userArticles = articles
    .filter((article) => article.author.id === user.id)
    .sort(
      (a, b) =>
        b.metrics.likesCount +
        b.metrics.bookmarksCount -
        (a.metrics.likesCount + a.metrics.bookmarksCount),
    );

  return (
    <div className="container profile-page">
      <section className="profile-header">
        <div className="avatar" aria-hidden="true">
          {user.displayName.slice(0, 1)}
        </div>
        <div>
          <h1>{user.displayName}</h1>
          <p>{user.bio}</p>
        </div>
        <button className="secondary-button" type="button">
          <UserPlus aria-hidden="true" size={16} />
          关注
        </button>
      </section>
      <dl className="stats-grid">
        <div>
          <dt>被关注</dt>
          <dd>{user.followersCount}</dd>
        </div>
        <div>
          <dt>文章</dt>
          <dd>{user.articlesCount}</dd>
        </div>
        <div>
          <dt>获赞</dt>
          <dd>{user.totalLikesCount}</dd>
        </div>
        <div>
          <dt>被收藏</dt>
          <dd>{user.totalBookmarksCount}</dd>
        </div>
      </dl>
      <div className="stack">
        {userArticles.map((article) => (
          <ArticleListItem
            key={article.id}
            article={article}
            onRequireAuth={() => undefined}
          />
        ))}
      </div>
    </div>
  );
}

function SubmitPreview() {
  return (
    <div className="container submit-preview">
      <div className="page-heading">
        <p className="eyebrow">投稿审核流</p>
        <h1>提交 AI 新闻或工具技巧</h1>
        <p>本阶段先搭建表单结构。真实保存、审核和版权确认会在下一轮实现。</p>
      </div>
      <form className="submission-form">
        <label>
          板块
          <select defaultValue="news">
            <option value="news">全球 AI 新闻</option>
            <option value="tips">AI 工具技巧</option>
          </select>
        </label>
        <label>
          内容类型
          <select defaultValue="curated">
            <option value="original">原创</option>
            <option value="repost_summary">转载摘要</option>
            <option value="curated">编译整理</option>
          </select>
        </label>
        <label>
          标题
          <input placeholder="请输入标题" />
        </label>
        <label>
          摘要
          <textarea placeholder="用 1-2 句话说明内容价值" />
        </label>
        <label>
          来源名称
          <input placeholder="非原创内容必填" />
        </label>
        <label>
          原文链接
          <input type="url" placeholder="https://example.com/original" />
        </label>
        <button className="primary-button" type="button" disabled title="请先填写标题、摘要和来源">
          提交审核
        </button>
      </form>
    </div>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { from?: string; message?: string } | null;
  const [email, setEmail] = useState("reader@example.com");
  const [password, setPassword] = useState("demo-password");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate(state?.from ?? "/", { replace: true });
    } catch (errorValue) {
      setError(errorValue instanceof Error ? errorValue.message : "登录失败。");
    }
  };

  return (
    <AuthLayout
      title="登录"
      intro={state?.message ?? "登录后可以点赞、收藏、关注作者和投稿。"}
      footer={
        <>
          没有账号？ <Link to="/register">注册</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button" type="submit">
          登录
        </button>
      </form>
    </AuthLayout>
  );
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("new-reader");
  const [email, setEmail] = useState("new-reader@example.com");
  const [password, setPassword] = useState("demo-password");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await register(username, email, password);
      navigate("/", { replace: true });
    } catch (errorValue) {
      setError(errorValue instanceof Error ? errorValue.message : "注册失败。");
    }
  };

  return (
    <AuthLayout
      title="创建账号"
      intro="注册后可以收藏教程、关注作者，并提交文章进入审核。"
      footer={
        <>
          已有账号？ <Link to="/login">登录</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={submit}>
        <label>
          用户名
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            pattern="[a-zA-Z0-9_-]+"
            required
          />
          <span>只允许字母、数字、短横线和下划线。</span>
        </label>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button className="primary-button" type="submit">
          注册
        </button>
      </form>
    </AuthLayout>
  );
}

function AuthLayout({
  title,
  intro,
  footer,
  children,
}: {
  title: string;
  intro: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <p className="eyebrow">Account</p>
        <h1 id="auth-title">{title}</h1>
        <p>{intro}</p>
        {children}
        <p className="auth-footer">{footer}</p>
      </section>
    </div>
  );
}

export default App;
