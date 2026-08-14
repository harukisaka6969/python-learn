export interface CleanedError {
  raw: string;
  lastLine: string;
  hint: string;
}

const HINTS: { pattern: RegExp; hint: string }[] = [
  { pattern: /SyntaxError/, hint: "文法エラーです。コロン（:）や括弧の閉じ忘れがないか確認してください。" },
  { pattern: /IndentationError/, hint: "インデント（字下げ）がずれています。スペースの数を揃えてください。" },
  { pattern: /NameError/, hint: "変数や関数が見つかりません。前のセルを実行し忘れていないか、スペルミスがないか確認してください。" },
  { pattern: /KeyError/, hint: "辞書やDataFrameに、その名前のキー・列が存在しません。" },
  { pattern: /TypeError/, hint: "データの型が合っていません（例: 文字列と数値を直接足そうとしていないか確認してください）。" },
  { pattern: /ModuleNotFoundError|ImportError/, hint: "モジュールが読み込まれていません。pandasを使うセルは自動読み込みが終わるまで少し待ってから再実行してください。" },
  { pattern: /ZeroDivisionError/, hint: "0で割ろうとしています。" },
  { pattern: /IndexError/, hint: "リストの範囲外の位置を指定しています。" },
  { pattern: /ValueError/, hint: "値の形式や範囲が正しくありません。" },
  { pattern: /AttributeError/, hint: "そのオブジェクトに、その名前のメソッド・属性はありません。スペルミスや型の勘違いがないか確認してください。" },
];

/** Pyodideが返す生のPythonトレースバック文字列から、最終行と日本語の一言ヒントを抽出する。 */
export function cleanError(raw: string): CleanedError {
  const lines = raw.trim().split("\n").filter(Boolean);
  const lastLine = lines[lines.length - 1] ?? raw.trim();
  const matched = HINTS.find((h) => h.pattern.test(lastLine) || h.pattern.test(raw));
  return {
    raw,
    lastLine,
    hint: matched?.hint ?? "エラーが発生しました。エラーメッセージの最後の行を確認してください。",
  };
}
