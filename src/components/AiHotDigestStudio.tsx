import { useMemo, useState } from "react";
import { CheckCircle2, Clipboard, FileText, XCircle } from "lucide-react";
import { generateAiHotPublishDraft, parseAiHotDigest } from "../drafting/aiHotDigest";

const sampleDigest = `# AI HOT 每日简报 · 2026年07月06日

> 数据来源：aihot.virxact.com ｜ 时间窗：过去 24 小时 ｜ 共 4 条精选

---

## 模型发布/更新

_本期无模型发布/更新类精选条目。_

---

## 产品发布/更新

_本期无产品发布/更新类精选条目。_

---

## 行业动态

**1. 欧盟理事会通过快速通道强制推行「聊天管控」（Chat Control 2.0）**

欧盟理事会以书面程序快速通过新法规，强制对加密通信进行无差别扫描，以填补过渡性规定 4 月到期后的法律漏洞。批评者指责该做法试图绕过民主监督，草案将在夏季休会前以紧急程序提交议会表决。理事会称扫描限于必要范围，数据须在检测后 12 个月内不可撤销删除。

— Hacker News 热门 · 7月6日 00:23

[查看原文](https://www.heise.de/en/news/Chat-Control-1-0-EU-Council-forces-messenger-scans-via-fast-track-11353659.html)

---

## 论文研究

_本期无论文研究类精选条目。_

---

## 技巧与观点

**2. 一位父亲为自闭症儿子开发沟通应用，意外找到产品市场匹配**

一位父亲为非语言自闭症儿子开发沟通应用，在言语治疗室展示时打动所有在场的母亲和治疗师。该应用专为语言理解困难的儿童设计，与面向身体障碍成人的传统 AAC 设备不同，故事在 HN 引发广泛共鸣。

— Hacker News 热门 · 7月6日 01:43

[查看原文](https://extelligence.substack.com/p/i-accidentally-started-a-small-business)

**3. Anthropic Claude Design 反向工程提示词开源**

Claude Design 的反向工程系统提示词在 GitHub 以 MIT 许可证开源，包含 20 章提示词和 14 项技能，覆盖内容纪律、美学、无障碍（WCAG、语义 HTML、键盘导航）、交互状态、系统思维等。近期针对 Fable 5 / Opus 4.7+ 系列校准，新增自主决策条款。

— Hacker News 热门 · 7月5日 23:35

[查看原文](https://github.com/Trystan-SA/claude-design-system-prompt)

**4. LlamaIndex 发布 legal-kb：基于 Index v2 的智能体检索参考应用**

LlamaIndex 发布法律文档知识库参考应用 legal-kb，采用 Retrieval Harness 模式，赋予 Agent 四个文件系统风格工具（retrieve、findFiles、readFile、grepFile），底层基于 Vercel AI SDK 6 的 ToolLoopAgent，支持 OpenAI / Anthropic 模型。

— MarkTechPost · 7月5日 15:50

[查看原文](https://www.marktechpost.com/2026/07/05/llamaindex-legal-kb-agentic-retrieval-over-index-v2-with-retrieve-find-read-and-grep-tools)

---

## 趋势判断

1. **AI Agent 工具链向"类文件系统"范式收敛**：LlamaIndex 的 legal-kb 和 Claude Design 的提示词体系都在强化 Agent 的自主决策与工具使用能力，"检索→读取→搜索"的文件系统隐喻正在成为 Agent 交互的标准范式。

2. **AI 治理进入硬监管阶段**：欧盟 Chat Control 2.0 的快速通道推进标志着 AI 和加密通信的监管从讨论转向强制落地，对全球科技公司尤其是端到端加密产品（WhatsApp、Signal、iMessage 等）构成直接威胁。

3. **AI 辅助无障碍领域出现自下而上的创新**：个人开发者（非大厂）在 AI 赋能下能够快速构建高价值的无障碍产品，并意外验证 PMF，提示垂直场景 + AI 的组合仍存在大量未被大公司覆盖的机会。

## 深挖建议

- **Chat Control 2.0**：关注欧洲议会夏季休会前的表决结果，以及 Signal / WhatsApp / Proton 等加密通信服务商的应对策略和技术方案。
- **Agent 工具范式**：对比 OpenAI Codex、Anthropic Claude Code、LlamaIndex 在 Agent 工具调用上的设计差异，判断哪种范式（函数调用 vs 文件系统 vs 混合）将主导下半年 Agent 框架演进。
- **AI + 无障碍**：调研 AI 在自闭症、语言障碍、视障等特殊需求领域的应用案例和创业机会，该赛道技术门槛适中但社会价值极高。`;

export function AiHotDigestStudio() {
  const [digestMarkdown, setDigestMarkdown] = useState(sampleDigest);
  const digest = useMemo(() => parseAiHotDigest(digestMarkdown), [digestMarkdown]);
  const draft = useMemo(() => generateAiHotPublishDraft(digestMarkdown), [digestMarkdown]);

  const copyDraft = async () => {
    await navigator.clipboard.writeText(
      `# ${draft.title}\n\n${draft.summary}\n\n${draft.body}\n\n${draft.sourceNotice}`,
    );
  };

  return (
    <div className="container digest-page">
      <section className="page-heading">
        <p className="eyebrow">AI HOT to publish draft</p>
        <h1>每日简报转稿</h1>
        <p>
          粘贴 AI HOT 邮件，系统会解析条目、栏目、趋势判断和深挖建议，生成可发布的每日观察稿。
        </p>
      </section>

      <div className="digest-workbench">
        <form className="digest-input">
          <div className="section-title">
            <h2>AI HOT 邮件</h2>
            <span className="muted">{digest.dateLabel || "未识别日期"}</span>
          </div>
          <label>
            邮件 Markdown
            <textarea
              value={digestMarkdown}
              onChange={(event) => setDigestMarkdown(event.target.value)}
              spellCheck={false}
            />
          </label>
          <div className="digest-stats" aria-label="解析结果">
            <span>{digest.dataSource}</span>
            <span>{digest.timeWindow}</span>
            <span>{digest.sections.flatMap((section) => section.items).length} 条已解析</span>
          </div>
        </form>

        <section className="digest-output" aria-live="polite">
          <div className="section-title">
            <h2>发布稿</h2>
            <button className="secondary-button" type="button" onClick={copyDraft}>
              <Clipboard aria-hidden="true" size={16} />
              复制
            </button>
          </div>
          <article className="generated-draft">
            <div className="tag-list">
              <span className="tag-chip">每日简报</span>
              <span className="tag-chip">AI HOT</span>
              <span className="tag-chip">{digest.dateLabel || "今日"}</span>
            </div>
            <h2>{draft.title}</h2>
            <p className="draft-summary">{draft.summary}</p>
            {draft.body.split("\n\n").map((paragraph) =>
              paragraph.startsWith("## ") ? (
                <h3 key={paragraph}>{paragraph.replace(/^##\s+/, "")}</h3>
              ) : paragraph.startsWith("### ") ? (
                <h4 key={paragraph}>{paragraph.replace(/^###\s+/, "")}</h4>
              ) : (
                <p key={paragraph}>{paragraph}</p>
              ),
            )}
          </article>

          <div className="draft-checks">
            <h3>解析检查</h3>
            {draft.checks.map((check) => (
              <div className="draft-check" key={check.label}>
                {check.passed ? (
                  <CheckCircle2 aria-hidden="true" size={18} />
                ) : (
                  <XCircle aria-hidden="true" size={18} />
                )}
                <div>
                  <strong>{check.label}</strong>
                  <p>{check.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="digest-structure" aria-label="栏目结构">
            <h3>
              <FileText aria-hidden="true" size={16} />
              栏目结构
            </h3>
            {digest.sections.map((section) => (
              <div key={section.name}>
                <strong>{section.name}</strong>
                <span>{section.isEmpty ? "无精选" : `${section.items.length} 条`}</span>
              </div>
            ))}
          </aside>
        </section>
      </div>
    </div>
  );
}
