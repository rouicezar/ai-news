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

未实现：

- 真实数据库。
- 投稿审核表单。
- 持久化点赞/收藏/关注。
- 真实认证后端。
- 真实审核动作。

## 下一步

1. 实现 Article 数据接口边界和真实 API adapter。
2. 实现投稿表单和审核队列。
3. 选定 Supabase/Postgres schema。
4. 实现点赞、收藏、关注的持久化状态更新。
5. 增加组件和页面测试。
