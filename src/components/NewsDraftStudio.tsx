import { useMemo, useState } from "react";
import { CheckCircle2, Clipboard, ExternalLink, Wand2, XCircle } from "lucide-react";
import { generateNewsDraft, type NewsSourceInput } from "../drafting/newsDraft";

const initialInput: NewsSourceInput = {
  sourceName: "Frontier Lab Blog",
  sourceUrl: "https://example.com/frontier-runtime",
  sourceTitle: "Frontier Lab introduces multimodal agent runtime",
  originalPublishedAt: "2026-07-05",
  angle: "多模态 Agent 运行时正在从演示走向可复用基础设施",
  sourceText:
    "Frontier Lab introduced a multimodal agent runtime for long-running browser, vision, and code tasks. The company said the runtime keeps task state, tool calls, and visual context in a shared execution layer. It is designed to reduce repeated reasoning when agents recover from interruptions. The first release focuses on developer workflows, document analysis, and QA automation. The company also said enterprise users can inspect tool traces and replay failed steps before approving production deployment.",
};

export function NewsDraftStudio() {
  const [input, setInput] = useState<NewsSourceInput>(initialInput);
  const [hasGenerated, setHasGenerated] = useState(true);
  const draft = useMemo(() => generateNewsDraft(input), [input]);

  const updateField = (field: keyof NewsSourceInput, value: string) => {
    setInput((current) => ({ ...current, [field]: value }));
  };

  const copyDraft = async () => {
    await navigator.clipboard.writeText(
      `# ${draft.title}\n\n${draft.summary}\n\n${draft.body}\n\n${draft.sourceNotice}`,
    );
  };

  return (
    <div className="container draft-page">
      <section className="page-heading">
        <p className="eyebrow">Source to newsroom draft</p>
        <h1>通过一个新闻源写出新闻稿</h1>
        <p>
          输入来源名称、原文链接和来源资料，系统生成带来源声明、摘要、正文和合规检查的新闻稿草稿。
        </p>
      </section>

      <div className="draft-workbench">
        <form
          className="source-form"
          onSubmit={(event) => {
            event.preventDefault();
            setHasGenerated(true);
          }}
        >
          <div className="section-title">
            <h2>信息源</h2>
            <span className="muted">MVP 先支持粘贴资料</span>
          </div>
          <label>
            来源名称
            <input
              value={input.sourceName}
              onChange={(event) => updateField("sourceName", event.target.value)}
              placeholder="例如 OpenAI Blog / The Verge / 官方公告"
            />
          </label>
          <label>
            原文链接
            <input
              type="url"
              value={input.sourceUrl}
              onChange={(event) => updateField("sourceUrl", event.target.value)}
              placeholder="https://..."
            />
          </label>
          <label>
            来源标题
            <input
              value={input.sourceTitle}
              onChange={(event) => updateField("sourceTitle", event.target.value)}
              placeholder="原文标题"
            />
          </label>
          <label>
            原文发布时间
            <input
              value={input.originalPublishedAt}
              onChange={(event) => updateField("originalPublishedAt", event.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </label>
          <label>
            本站写作角度
            <input
              value={input.angle}
              onChange={(event) => updateField("angle", event.target.value)}
              placeholder="这条新闻对本站读者的意义"
            />
          </label>
          <label>
            来源正文或关键资料
            <textarea
              value={input.sourceText}
              onChange={(event) => updateField("sourceText", event.target.value)}
              placeholder="粘贴公告、新闻原文关键段落、发布说明或多来源事实摘录。"
            />
          </label>
          {draft.missingFields.length > 0 ? (
            <p className="form-error">缺少字段：{draft.missingFields.join("、")}</p>
          ) : null}
          <button className="primary-button" type="submit">
            <Wand2 aria-hidden="true" size={16} />
            生成新闻稿
          </button>
        </form>

        <section className="draft-output" aria-live="polite">
          <div className="section-title">
            <h2>新闻稿草稿</h2>
            <button className="secondary-button" type="button" onClick={copyDraft}>
              <Clipboard aria-hidden="true" size={16} />
              复制
            </button>
          </div>
          {hasGenerated ? (
            <>
              <article className="generated-draft">
                <div className="tag-list">
                  {draft.tags.map((tag) => (
                    <span className="tag-chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <h2>{draft.title}</h2>
                <p className="draft-summary">{draft.summary}</p>
                {draft.body.split("\n\n").map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <a className="external-source" href={input.sourceUrl} target="_blank" rel="noreferrer">
                  {draft.sourceNotice}
                  <ExternalLink aria-hidden="true" size={15} />
                </a>
              </article>
              <div className="draft-checks">
                <h3>发布前检查</h3>
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
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
}
