# Implementation Preparation

阶段：Implementation  
日期：2026-07-06

## 技术栈决策

选择：

- 前端框架：Vite + React + TypeScript
- 样式：CSS variables + 普通 CSS
- 图标：lucide-react
- 数据层：typed repository interface + mock repository
- 后续生产数据层：Supabase Postgres 或兼容 Postgres 的 API adapter

理由：

- 当前阶段目标是建立项目骨架、tokens 和基础组件，不需要先绑定后端供应商。
- React + TypeScript 能快速表达组件系统和页面状态。
- Vite 保持骨架轻量，方便后续迁移到 SSR/Next.js 或接入真实 API。
- typed repository 先把数据契约固定下来，后续替换 Supabase adapter 不影响组件层。

## 数据层边界

组件只依赖 `contentRepository` 暴露的方法，不直接读取 mock 数据。

第一版 repository 方法：

- `getHomeContent`
- `getArticles`
- `getArticleBySlug`
- `getUserProfile`

后续接真实后端时，保留类型定义，替换 `mockContentRepository` 为 API/Supabase 实现。

## 当前实现范围

已建立：

- 应用骨架。
- 设计 tokens。
- 基础页面布局。
- Article 数据模型。
- mock 数据层。
- Header、ArticleListItem、TutorialCard、MetricButton、Badge 等基础组件。
- 真实页面路由。
- Auth shell：登录、注册、退出、受保护页面跳转、未登录互动引导。
- 首页、新闻列表、技巧列表、热榜、收藏、文章详情、用户主页、投稿页。
- 写稿台：通过来源名称、原文链接、来源标题、发布时间、写作角度和来源资料生成新闻稿草稿。
- 新闻稿生成器：输出标题、摘要、正文、标签、来源声明和发布前合规检查。

未实现：

- 真实数据库。
- 投稿审核表单。
- 持久化点赞/收藏/关注。
- 真实认证后端。
- 真实审核动作。
- 服务端 URL 抓取器。

## 新闻源写稿能力边界

当前第一版能力在前端本地完成，不向外部站点发起抓取请求。原因：

- 浏览器端直接抓取外部新闻站通常会被 CORS、登录墙、反爬和版权策略限制。
- 站点需求明确要求转载内容保留来源并避免全文搬运，因此第一版要求作者粘贴来源正文或关键资料。
- 后续应在服务端实现 `sourceFetcher` adapter，负责抓取、抽取正文、记录来源快照和版权状态，再把结构化 source payload 传给当前 draft generator。

当前输入：

- 来源名称
- 原文链接
- 来源标题
- 原文发布时间
- 本站写作角度
- 来源正文或关键资料

当前输出：

- 新闻标题
- 摘要
- 正文草稿
- 推断标签
- 来源声明
- 发布前检查：来源可追溯、素材足够、避免全文搬运、保留核验提示

## 下一步

1. 实现服务端 `sourceFetcher` adapter：URL 抓取、正文抽取、来源快照、失败分类。
2. 将写稿台草稿一键送入投稿表单。
3. 实现投稿表单和审核队列。
4. 选定 Supabase/Postgres schema。
5. 实现点赞、收藏、关注的持久化状态更新。
6. 增加组件和页面测试。
