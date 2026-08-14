import { createElement, Fragment, type ReactNode } from "react";

/**
 * レッスン本文（bodyMd）用の最小Markdownレンダラ。
 * 外部MarkdownライブラリやdangerouslySetInnerHTMLは使わず、React要素を直接組み立てる
 * （コンテンツは自作の静的データのみだが、攻撃面を増やさないための方針）。
 * 対応記法: 段落 / `### ` 見出し / `- ` 箇条書き / `` `code` `` / `**bold**` / `> NOTE:` `> WARN:` 注記。
 */
export function renderBody(md: string): ReactNode[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let key = 0;
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ").trim();
    if (text) blocks.push(createElement("p", { key: key++ }, ...renderInline(text)));
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      createElement(
        "ul",
        { key: key++ },
        list.map((item, i) => createElement("li", { key: i }, ...renderInline(item)))
      )
    );
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push(createElement("h3", { key: key++ }, ...renderInline(line.slice(4))));
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }

    if (line.startsWith("> NOTE:")) {
      flushParagraph();
      flushList();
      blocks.push(createElement("p", { key: key++, className: "lesson-note" }, ...renderInline(line.slice(7).trim())));
      continue;
    }

    if (line.startsWith("> WARN:")) {
      flushParagraph();
      flushList();
      blocks.push(createElement("p", { key: key++, className: "lesson-warn" }, ...renderInline(line.slice(7).trim())));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

/** 1行分のインライン記法（`code`と**bold**）をReactノード配列に変換する。 */
function renderInline(text: string): ReactNode[] {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter((t) => t !== "");
  return tokens.map((token, i) => {
    if (token.startsWith("`") && token.endsWith("`")) {
      return createElement("code", { key: i }, token.slice(1, -1));
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return createElement("strong", { key: i }, token.slice(2, -2));
    }
    return createElement(Fragment, { key: i }, token);
  });
}
