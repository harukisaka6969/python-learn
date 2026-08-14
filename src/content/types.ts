export type ChapterTag = "基礎" | "制御" | "構造" | "関数" | "pandas" | "実務";

export interface Chapter {
  id: string; // "ch01"
  no: number; // 1
  title: string; // "基礎文法"
  tag: ChapterTag;
  summary: string; // 章の狙い（1〜2文）
  checklist: string[]; // 章末「ここまでで出来るようになったこと」
  lessons: Lesson[];
}

export interface Lesson {
  id: string; // "l0103" のように章内で一意（ch01の3番目）
  title: string;
  goal: string; // このレッスンで「できるようになること」を1文で
  bodyMd: string; // 本文（軽量Markdown。renderBodyで描画）
  cells: CodeCell[]; // 実行して確かめるサンプル（1つ以上）
  exercise?: Exercise; // 手を動かす課題（原則1つ）
  sqlBridge?: string; // 「SQLでいうと〜」対応。無ければ省略
}

export interface CodeCell {
  label?: string; // セル上部のラベル
  code: string; // 初期コード
  usesPandas?: boolean; // true なら実行前にpandas遅延ロード
}

export interface Exercise {
  title: string;
  prompt: string; // 課題文（Markdown可）
  starter: string; // 空欄入りの雛形コード
  expected?: string; // 期待出力の説明（"合計は174になるはず"等）
  solution: string; // 模範解答（初期は隠し、ボタンで開く）
}
