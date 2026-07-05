export interface AiHotItem {
  index: number;
  category: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceTime: string;
  sourceUrl: string;
}

export interface AiHotSection {
  name: string;
  items: AiHotItem[];
  isEmpty: boolean;
}

export interface AiHotTrend {
  title: string;
  detail: string;
}

export interface AiHotDigest {
  title: string;
  dateLabel: string;
  dataSource: string;
  timeWindow: string;
  totalCount: number;
  sections: AiHotSection[];
  trends: AiHotTrend[];
  deepDiveSuggestions: AiHotTrend[];
}

export interface AiHotPublishDraft {
  title: string;
  summary: string;
  body: string;
  sourceNotice: string;
  checks: Array<{
    label: string;
    passed: boolean;
    detail: string;
  }>;
}

const EMPTY_SECTION_PATTERN = /本期无.+精选条目/;

export function parseAiHotDigest(markdown: string): AiHotDigest {
  const normalized = markdown.replace(/\r\n/g, "\n").trim();
  const titleLine = normalized.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "AI HOT 每日简报";
  const dateLabel = titleLine.match(/(\d{4}年\d{2}月\d{2}日)/)?.[1] ?? "";
  const metaLine = normalized.match(/^>\s*数据来源：(.+?)\s*｜\s*时间窗：(.+?)\s*｜\s*共\s*(\d+)\s*条精选/m);
  const sections = parseSections(normalized);

  return {
    title: titleLine,
    dateLabel,
    dataSource: metaLine?.[1]?.trim() ?? "AI HOT",
    timeWindow: metaLine?.[2]?.trim() ?? "过去 24 小时",
    totalCount: Number(metaLine?.[3] ?? getAllItems(sections).length),
    sections,
    trends: parseNumberedInsights(getSectionContent(normalized, "趋势判断")),
    deepDiveSuggestions: parseBulletInsights(getSectionContent(normalized, "深挖建议")),
  };
}

export function generateAiHotPublishDraft(markdown: string): AiHotPublishDraft {
  const digest = parseAiHotDigest(markdown);
  const items = getAllItems(digest.sections);
  const lead = items[0];
  const leadTitle = lead?.title ?? "今日 AI 行业动态";
  const activeCategories = digest.sections
    .filter((section) => section.items.length > 0)
    .map((section) => section.name);
  const title = `${digest.dateLabel || "今日"} AI 观察：${leadTitle}${items.length > 1 ? `等 ${items.length} 条动态` : ""}`;
  const summary = buildSummary(digest, items, activeCategories);
  const body = buildBody(digest, items, activeCategories);

  return {
    title,
    summary,
    body,
    sourceNotice: `来源：${digest.dataSource}｜时间窗：${digest.timeWindow}｜原始简报条目：${items.length} 条`,
    checks: buildChecks(digest, items),
  };
}

function parseSections(markdown: string): AiHotSection[] {
  const matches = Array.from(markdown.matchAll(/^##\s+(.+)$/gm));
  const contentSections: AiHotSection[] = [];

  matches.forEach((match, index) => {
    const name = match[1].trim();

    if (name === "趋势判断" || name === "深挖建议") {
      return;
    }

    const start = (match.index ?? 0) + match[0].length;
    const next = matches[index + 1]?.index ?? markdown.length;
    const content = markdown.slice(start, next).trim();
    const items = parseItems(content, name);

    contentSections.push({
      name,
      items,
      isEmpty: items.length === 0 && EMPTY_SECTION_PATTERN.test(content),
    });
  });

  return contentSections;
}

function parseItems(sectionContent: string, category: string): AiHotItem[] {
  const itemPattern =
    /\*\*(\d+)\.\s+(.+?)\*\*\s*\n\n([\s\S]*?)\n\n—\s*(.+?)\s*·\s*(.+?)\n\n\[查看原文\]\((.+?)\)/g;
  const items: AiHotItem[] = [];

  for (const match of sectionContent.matchAll(itemPattern)) {
    items.push({
      index: Number(match[1]),
      category,
      title: match[2].trim(),
      summary: normalizeParagraph(match[3]),
      sourceName: match[4].trim(),
      sourceTime: match[5].trim(),
      sourceUrl: match[6].trim(),
    });
  }

  return items;
}

function parseNumberedInsights(content: string): AiHotTrend[] {
  return Array.from(content.matchAll(/^\d+\.\s+\*\*(.+?)\*\*[：:]\s*(.+)$/gm)).map((match) => ({
    title: match[1].trim(),
    detail: match[2].trim(),
  }));
}

function parseBulletInsights(content: string): AiHotTrend[] {
  return Array.from(content.matchAll(/^-\s+\*\*(.+?)\*\*[：:]\s*(.+)$/gm)).map((match) => ({
    title: match[1].trim(),
    detail: match[2].trim(),
  }));
}

function getSectionContent(markdown: string, heading: string) {
  const pattern = new RegExp(`^##\\s+${escapeRegex(heading)}\\s*$`, "m");
  const match = markdown.match(pattern);

  if (!match || match.index === undefined) {
    return "";
  }

  const start = match.index + match[0].length;
  const nextMatch = markdown.slice(start).match(/^##\s+.+$/m);
  const end = nextMatch?.index === undefined ? markdown.length : start + nextMatch.index;

  return markdown.slice(start, end).trim();
}

function getAllItems(sections: AiHotSection[]) {
  return sections.flatMap((section) => section.items).sort((a, b) => a.index - b.index);
}

function buildSummary(digest: AiHotDigest, items: AiHotItem[], activeCategories: string[]) {
  const lead = items[0];
  const categoryText = activeCategories.length > 0 ? activeCategories.join("、") : "AI 行业";
  const trend = digest.trends[0];

  if (!lead) {
    return `${digest.dateLabel || "今日"} AI HOT 简报未筛选出具体条目，建议继续观察后续来源。`;
  }

  return `${digest.dateLabel || "今日"} AI HOT 共筛选 ${items.length} 条重点，集中在${categoryText}。最值得关注的是「${lead.title}」。${trend ? `趋势上，${trend.title}。` : ""}`;
}

function buildBody(digest: AiHotDigest, items: AiHotItem[], activeCategories: string[]) {
  const intro = [
    `${digest.dateLabel || "今日"}的 AI HOT 简报覆盖 ${digest.timeWindow}，来自 ${digest.dataSource}，共筛选 ${items.length} 条值得关注的信息。`,
    activeCategories.length > 0
      ? `本期重点集中在${activeCategories.join("、")}，其中既有监管变化，也有 Agent 工具链和垂直应用的新信号。`
      : "本期没有明显集中的高频板块，适合作为轻量观察样本。",
  ].join("");

  const itemBlocks = groupItemsByCategory(items)
    .map(([category, categoryItems]) => {
      const body = categoryItems
        .map(
          (item) =>
            `### ${item.index}. ${item.title}\n\n${item.summary}\n\n来源：${item.sourceName} · ${item.sourceTime}  \n原文：${item.sourceUrl}`,
        )
        .join("\n\n");

      return `## ${category}\n\n${body}`;
    })
    .join("\n\n");

  const trendBlock =
    digest.trends.length > 0
      ? `## 趋势判断\n\n${digest.trends
          .map((trend) => `- **${trend.title}**：${trend.detail}`)
          .join("\n")}`
      : "";
  const deepDiveBlock =
    digest.deepDiveSuggestions.length > 0
      ? `## 深挖建议\n\n${digest.deepDiveSuggestions
          .map((suggestion) => `- **${suggestion.title}**：${suggestion.detail}`)
          .join("\n")}`
      : "";
  const sourceBlock =
    "## 来源说明\n\n本文基于 AI HOT 每日简报整理，原文链接均指向第三方来源。本站稿件用于信息梳理和趋势观察，不替代原文事实核验。";

  return [intro, itemBlocks, trendBlock, deepDiveBlock, sourceBlock].filter(Boolean).join("\n\n");
}

function groupItemsByCategory(items: AiHotItem[]) {
  const grouped = new Map<string, AiHotItem[]>();

  items.forEach((item) => {
    grouped.set(item.category, [...(grouped.get(item.category) ?? []), item]);
  });

  return Array.from(grouped.entries());
}

function buildChecks(digest: AiHotDigest, items: AiHotItem[]) {
  const sourceLinksComplete = items.every((item) => Boolean(item.sourceUrl));
  const trendsParsed = digest.trends.length > 0;
  const deepDivesParsed = digest.deepDiveSuggestions.length > 0;

  return [
    {
      label: "条目解析",
      passed: items.length === digest.totalCount,
      detail:
        items.length === digest.totalCount
          ? `已解析 ${items.length} 条，和邮件声明一致。`
          : `已解析 ${items.length} 条，邮件声明为 ${digest.totalCount} 条，需要人工复查。`,
    },
    {
      label: "原文链接",
      passed: sourceLinksComplete,
      detail: sourceLinksComplete ? "每条内容都有原文链接。" : "存在缺少原文链接的条目。",
    },
    {
      label: "趋势判断",
      passed: trendsParsed,
      detail: trendsParsed ? `已解析 ${digest.trends.length} 条趋势判断。` : "未解析到趋势判断。",
    },
    {
      label: "深挖建议",
      passed: deepDivesParsed,
      detail: deepDivesParsed ? `已解析 ${digest.deepDiveSuggestions.length} 条深挖建议。` : "未解析到深挖建议。",
    },
  ];
}

function normalizeParagraph(value: string) {
  return value.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
