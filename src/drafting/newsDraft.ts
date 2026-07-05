export interface NewsSourceInput {
  sourceName: string;
  sourceUrl: string;
  sourceTitle: string;
  originalPublishedAt: string;
  sourceText: string;
  angle: string;
}

export interface DraftCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export interface GeneratedNewsDraft {
  title: string;
  summary: string;
  body: string;
  tags: string[];
  sourceNotice: string;
  checks: DraftCheck[];
  missingFields: string[];
}

const sentenceBreak = /(?<=[。！？.!?])\s+/;

export function generateNewsDraft(input: NewsSourceInput): GeneratedNewsDraft {
  const normalizedText = normalizeSourceText(input.sourceText);
  const sentences = splitSentences(normalizedText);
  const keySentences = sentences.slice(0, 5);
  const missingFields = getMissingFields(input);
  const title = buildTitle(input, keySentences);
  const summary = buildSummary(input, keySentences);
  const tags = inferTags(`${input.sourceTitle} ${input.angle} ${normalizedText}`);
  const body = buildBody(input, keySentences, tags);
  const sourceNotice = buildSourceNotice(input);

  return {
    title,
    summary,
    body,
    tags,
    sourceNotice,
    checks: buildChecks(input, normalizedText, body),
    missingFields,
  };
}

function normalizeSourceText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string) {
  return text
    .split(sentenceBreak)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function getMissingFields(input: NewsSourceInput) {
  const missing: string[] = [];

  if (!input.sourceName.trim()) {
    missing.push("来源名称");
  }

  if (!input.sourceUrl.trim()) {
    missing.push("来源 URL");
  }

  if (!input.sourceTitle.trim()) {
    missing.push("来源标题");
  }

  if (!input.sourceText.trim()) {
    missing.push("来源正文或资料");
  }

  return missing;
}

function buildTitle(input: NewsSourceInput, keySentences: string[]) {
  const titleBase = input.sourceTitle.trim() || keySentences[0] || "AI 行业出现新动态";
  const angle = input.angle.trim();

  if (!angle) {
    return titleBase.length > 42 ? `${titleBase.slice(0, 42)}...` : titleBase;
  }

  return `${angle}：${titleBase}`.slice(0, 64);
}

function buildSummary(input: NewsSourceInput, keySentences: string[]) {
  const angle = input.angle.trim();
  const firstFact = keySentences[0] ?? "该信息源披露了一项新的 AI 行业动态。";
  const secondFact = keySentences[1] ?? "本站将其整理为摘要稿，保留原文出处以便读者复查。";

  if (angle) {
    return `${angle}。${firstFact}`.slice(0, 150);
  }

  return `${firstFact}${secondFact}`.slice(0, 150);
}

function buildBody(input: NewsSourceInput, keySentences: string[], tags: string[]) {
  const sourceName = input.sourceName.trim() || "原始信息源";
  const originalDate = input.originalPublishedAt.trim();
  const angle = input.angle.trim() || "这条消息的重点在于它可能改变相关产品和开发者的工作节奏";
  const factParagraph = keySentences.slice(0, 2).join("");
  const contextParagraph = keySentences.slice(2, 4).join("");
  const implicationParagraph = keySentences[4] ?? inferImplication(tags);

  return [
    `${sourceName}${originalDate ? ` 在 ${originalDate}` : ""} 披露，${factParagraph || "AI 领域出现一项值得关注的新进展。"}`,
    `从产品和行业影响看，${angle}。${contextParagraph || "目前仍需要继续观察该进展在实际产品、开发者生态和合规流程中的落地情况。"}`,
    `对读者来说，短期内最值得关注的是：第一，相关能力是否会进入主流产品；第二，开发者是否能获得稳定接口；第三，企业使用时是否需要额外的安全、版权或合规评估。${implicationParagraph}`,
    "本文为本站基于公开信息源整理的新闻稿草稿，不替代原文。涉及具体数据、引述和发布时间，请以原文为准。",
  ].join("\n\n");
}

function inferImplication(tags: string[]) {
  if (tags.includes("政策")) {
    return "政策类消息还需要关注后续执行细则和不同地区的落地差异。";
  }

  if (tags.includes("开发者工具")) {
    return "开发者工具类消息还需要关注 API 稳定性、定价和文档成熟度。";
  }

  if (tags.includes("模型")) {
    return "模型类消息还需要关注真实评测、成本、上下文限制和安全边界。";
  }

  return "后续仍需要用更多来源交叉验证其长期影响。";
}

function buildSourceNotice(input: NewsSourceInput) {
  const sourceName = input.sourceName.trim() || "未填写来源";
  const sourceUrl = input.sourceUrl.trim() || "未填写原文链接";

  return `来源：${sourceName}｜原文：${sourceUrl}｜内容类型：编译整理`;
}

function buildChecks(input: NewsSourceInput, sourceText: string, body: string): DraftCheck[] {
  const hasSource = Boolean(input.sourceName.trim() && input.sourceUrl.trim());
  const hasEnoughMaterial = sourceText.length >= 240;
  const avoidsFullCopy = body.length < sourceText.length * 0.75 || sourceText.length < 240;
  const hasAttribution = body.includes("公开信息源") || body.includes("原文为准");

  return [
    {
      label: "来源可追溯",
      passed: hasSource,
      detail: hasSource ? "已包含来源名称和原文链接。" : "需要填写来源名称和原文链接。",
    },
    {
      label: "素材足够",
      passed: hasEnoughMaterial,
      detail: hasEnoughMaterial ? "来源资料足够生成初稿。" : "来源资料偏短，建议补充原文关键段落或公告正文。",
    },
    {
      label: "避免全文搬运",
      passed: avoidsFullCopy,
      detail: avoidsFullCopy ? "草稿长度未接近原文全文复制。" : "草稿过长，可能接近搬运，需要压缩和改写。",
    },
    {
      label: "保留核验提示",
      passed: hasAttribution,
      detail: hasAttribution ? "草稿提醒读者以原文为准。" : "需要补充原文核验提示。",
    },
  ];
}

function inferTags(text: string) {
  const tagRules: Array<[string, RegExp]> = [
    ["模型", /model|模型|大模型|LLM|GPT|Claude|Gemini/i],
    ["Agent", /agent|智能体|代理/i],
    ["开发者工具", /API|SDK|runtime|开发者|代码|工具调用/i],
    ["政策", /policy|regulation|监管|政策|合规|欧盟|法案/i],
    ["融资", /funding|融资|估值|投资|轮/i],
    ["产品", /product|产品|发布|上线|更新/i],
    ["多模态", /multimodal|多模态|视频|图像|语音/i],
  ];

  const tags = tagRules
    .filter(([, pattern]) => pattern.test(text))
    .map(([tag]) => tag)
    .slice(0, 4);

  return tags.length > 0 ? tags : ["AI 新闻"];
}
