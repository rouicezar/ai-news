import type { Article, User } from "../types/content";

export const users: User[] = [
  {
    id: "u_001",
    username: "lina-chen",
    displayName: "Lina Chen",
    bio: "长期追踪模型发布、AI 产品策略和开发者工具。",
    role: "trusted_author",
    followersCount: 1284,
    articlesCount: 36,
    totalLikesCount: 8420,
    totalBookmarksCount: 3912,
  },
  {
    id: "u_002",
    username: "toolsmith",
    displayName: "Toolsmith",
    bio: "把 AI 工具拆成可复用工作流。",
    role: "user",
    followersCount: 642,
    articlesCount: 18,
    totalLikesCount: 3140,
    totalBookmarksCount: 2819,
  },
];

const [lina, toolsmith] = users;

export const articles: Article[] = [
  {
    id: "a_001",
    slug: "frontier-lab-releases-multimodal-agent-runtime",
    title: "前沿实验室发布多模态 Agent Runtime，工具调用延迟降至秒级",
    summary:
      "新 runtime 把视觉理解、浏览器控制和代码执行放入同一调度层，重点改善长任务中断恢复。",
    body:
      "这次发布的重点不是单个模型能力，而是运行时层的组合能力。官方材料显示，新架构把任务状态、工具调用和视觉上下文统一记录，减少多步骤自动化中的重复推理。",
    section: "news",
    status: "published",
    author: lina,
    sourceType: "curated",
    sourceName: "Frontier Lab Blog",
    sourceUrl: "https://example.com/frontier-runtime",
    originalPublishedAt: "2026-07-05T12:00:00Z",
    publishedAt: "2026-07-06T00:40:00Z",
    tags: ["Agent", "多模态", "开发者工具"],
    metrics: {
      likesCount: 426,
      bookmarksCount: 318,
    },
    viewerHasLiked: false,
    viewerHasBookmarked: true,
  },
  {
    id: "a_002",
    slug: "eu-ai-compliance-sandbox-expands",
    title: "欧盟扩大 AI 合规沙盒范围，模型评测和数据治理被纳入重点",
    summary:
      "新试点把企业内部模型评估流程纳入监管沟通机制，降低中小团队合规试错成本。",
    body:
      "政策变化对 AI 产品团队的影响集中在上线前评估、数据来源记录和风险事件复盘。对跨境产品而言，合规沙盒会成为提前验证流程的入口。",
    section: "news",
    status: "published",
    author: lina,
    sourceType: "repost_summary",
    sourceName: "EU Digital Policy Desk",
    sourceUrl: "https://example.com/eu-ai-sandbox",
    originalPublishedAt: "2026-07-04T09:00:00Z",
    publishedAt: "2026-07-05T16:20:00Z",
    tags: ["政策", "合规", "模型评测"],
    metrics: {
      likesCount: 208,
      bookmarksCount: 221,
    },
    viewerHasLiked: false,
    viewerHasBookmarked: false,
  },
  {
    id: "a_003",
    slug: "build-a-research-brief-with-notebooklm-and-claude",
    title: "用 NotebookLM 和 Claude 做一份可追溯研究简报",
    summary:
      "适合每天追踪 AI 新闻的人：先用 NotebookLM 管来源，再用 Claude 做结构化判断。",
    body:
      "这个流程分三步：收集来源、生成事实卡、输出判断。关键是不要让模型直接写结论，而是先列证据，再压缩成可以复查的摘要。",
    section: "tips",
    status: "published",
    author: toolsmith,
    sourceType: "original",
    publishedAt: "2026-07-05T08:10:00Z",
    tags: ["NotebookLM", "Claude", "研究工作流"],
    metrics: {
      likesCount: 372,
      bookmarksCount: 504,
    },
    viewerHasLiked: true,
    viewerHasBookmarked: true,
    tipMetadata: {
      toolName: "NotebookLM + Claude",
      toolUrl: "https://notebooklm.google.com",
      difficulty: "intermediate",
      estimatedReadingMinutes: 9,
      useCase: "把多来源新闻整理成可追溯简报",
      platforms: ["Web"],
      coreSteps: ["导入来源", "提取事实卡", "生成判断摘要"],
    },
  },
  {
    id: "a_004",
    slug: "prompt-pattern-for-product-requirements-review",
    title: "PRD 审稿提示词：让 AI 先挑边界问题，再补验收标准",
    summary:
      "面向产品经理和独立开发者，用固定结构检查需求缺口、角色权限和测试标准。",
    body:
      "提示词的重点是让模型先做反例审查，而不是直接润色。输出分为需求缺口、风险、验收标准和需要用户确认的问题。",
    section: "tips",
    status: "published",
    author: toolsmith,
    sourceType: "original",
    publishedAt: "2026-07-03T18:00:00Z",
    tags: ["提示词", "产品", "需求审查"],
    metrics: {
      likesCount: 198,
      bookmarksCount: 342,
    },
    viewerHasLiked: false,
    viewerHasBookmarked: false,
    tipMetadata: {
      toolName: "ChatGPT / Claude",
      toolUrl: "https://chatgpt.com",
      difficulty: "beginner",
      estimatedReadingMinutes: 6,
      useCase: "检查产品需求文档是否能进入设计阶段",
      platforms: ["Web", "API"],
      coreSteps: ["粘贴 PRD", "要求模型找边界", "补验收标准"],
    },
  },
];
