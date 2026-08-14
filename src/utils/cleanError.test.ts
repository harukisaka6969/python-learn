import { describe, expect, it } from "vitest";
import { cleanError } from "./cleanError";

describe("cleanError", () => {
  it("NameErrorに日本語ヒントを付ける", () => {
    const result = cleanError("Traceback (most recent call last):\nNameError: name 'df' is not defined");
    expect(result.hint).toMatch(/前のセルを実行し忘れて/);
  });

  it("KeyErrorに日本語ヒントを付ける", () => {
    const result = cleanError("KeyError: 'sales'");
    expect(result.hint).toMatch(/キー・列が存在しません/);
  });

  it("ZeroDivisionErrorに日本語ヒントを付ける", () => {
    const result = cleanError("ZeroDivisionError: division by zero");
    expect(result.hint).toMatch(/0で割ろうとしています/);
  });

  it("未知のエラーには汎用ヒントを返す", () => {
    const result = cleanError("SomeWeirdError: mystery");
    expect(result.hint).toMatch(/エラーメッセージの最後の行を確認/);
  });

  it("最終行を正しく抽出する", () => {
    const result = cleanError("line1\nline2\nValueError: bad value");
    expect(result.lastLine).toBe("ValueError: bad value");
  });
});
