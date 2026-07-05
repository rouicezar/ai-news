import { generateAiHotPublishDraft, parseAiHotDigest } from "../src/drafting/aiHotDigest";

const sampleDigest = `# AI HOT 每日简报 · 2026年07月06日

> 数据来源：aihot.virxact.com ｜ 时间窗：过去 24 小时 ｜ 共 2 条精选

---

## 行业动态

**1. 欧盟理事会通过快速通道强制推行「聊天管控」（Chat Control 2.0）**

欧盟理事会以书面程序快速通过新法规，强制对加密通信进行无差别扫描。

— Hacker News 热门 · 7月6日 00:23

[查看原文](https://example.com/chat-control)

---

## 技巧与观点

**2. Claude Design 反向工程提示词开源**

Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含系统提示词和技能。

— Hacker News 热门 · 7月5日 23:35

[查看原文](https://example.com/claude-design)

---

## 趋势判断

1. **AI Agent 工具链向类文件系统范式收敛**：检索、读取、搜索的文件系统隐喻正在成为 Agent 交互的重要范式。

## 深挖建议

- **Agent 工具范式**：对比不同 Agent 框架在工具调用上的设计差异。`;

const digest = parseAiHotDigest(sampleDigest);
const draft = generateAiHotPublishDraft(sampleDigest);
const items = digest.sections.flatMap((section) => section.items);

assert(items.length === 2, `expected 2 items, got ${items.length}`);
assert(digest.trends.length === 1, `expected 1 trend, got ${digest.trends.length}`);
assert(
  digest.deepDiveSuggestions.length === 1,
  `expected 1 deep dive, got ${digest.deepDiveSuggestions.length}`,
);
assert(draft.title.includes("2026年07月06日"), "draft title should include date");
assert(draft.body.includes("来源说明"), "draft body should include source notice section");
assert(draft.coverImage.url.length > 0, "draft should include a cover image");
assert(draft.coverImage.attribution.includes("来源"), "cover image should include attribution");

console.log("AI HOT digest parser verified");

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
