import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { renderBody } from "./renderBody";

describe("renderBody", () => {
  it("段落を<p>として描画する", () => {
    const { container } = render(<>{renderBody("これは段落です。")}</>);
    expect(container.querySelector("p")?.textContent).toBe("これは段落です。");
  });

  it("### 見出しを<h3>として描画する", () => {
    const { container } = render(<>{renderBody("### 見出し")}</>);
    expect(container.querySelector("h3")?.textContent).toBe("見出し");
  });

  it("- 箇条書きを<ul><li>として描画する", () => {
    const { container } = render(<>{renderBody("- 一つ目\n- 二つ目")}</>);
    const items = container.querySelectorAll("li");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe("一つ目");
    expect(items[1].textContent).toBe("二つ目");
  });

  it("インラインコードを<code>として描画する", () => {
    const { container } = render(<>{renderBody("`print()`を使います")}</>);
    expect(container.querySelector("code")?.textContent).toBe("print()");
  });

  it("**強調**を<strong>として描画する", () => {
    const { container } = render(<>{renderBody("これは**重要**です")}</>);
    expect(container.querySelector("strong")?.textContent).toBe("重要");
  });

  it("> NOTE: をlesson-noteクラスの段落として描画する", () => {
    const { container } = render(<>{renderBody("> NOTE: これは注記です")}</>);
    const el = container.querySelector(".lesson-note");
    expect(el).not.toBeNull();
    expect(el?.textContent).toBe("これは注記です");
  });

  it("> WARN: をlesson-warnクラスの段落として描画する", () => {
    const { container } = render(<>{renderBody("> WARN: 気をつけて")}</>);
    const el = container.querySelector(".lesson-warn");
    expect(el).not.toBeNull();
    expect(el?.textContent).toBe("気をつけて");
  });

  it("空行区切りで複数の段落に分ける", () => {
    const { container } = render(<>{renderBody("一段落目\n\n二段落目")}</>);
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });
});
