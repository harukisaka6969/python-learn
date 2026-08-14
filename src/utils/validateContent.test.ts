import { describe, expect, it } from "vitest";
import { validateContent } from "./validateContent";
import { CHAPTERS } from "../content/index";
import type { Chapter } from "../content/types";

describe("validateContent", () => {
  it("実際のカリキュラム全体が検証をパスする", () => {
    expect(validateContent(CHAPTERS)).toEqual([]);
  });

  it("章IDの重複を検出する", () => {
    const dup: Chapter[] = [
      { id: "chX", no: 1, title: "A", tag: "基礎", summary: "", checklist: [], lessons: [{ id: "l1", title: "t", goal: "g", bodyMd: "b", cells: [{ code: "1" }] }] },
      { id: "chX", no: 2, title: "B", tag: "基礎", summary: "", checklist: [], lessons: [{ id: "l2", title: "t", goal: "g", bodyMd: "b", cells: [{ code: "1" }] }] },
    ];
    expect(validateContent(dup).some((i) => i.message.includes("章IDが重複"))).toBe(true);
  });

  it("レッスンIDの重複を検出する", () => {
    const dup: Chapter[] = [
      {
        id: "ch1",
        no: 1,
        title: "A",
        tag: "基礎",
        summary: "",
        checklist: [],
        lessons: [
          { id: "lDup", title: "t1", goal: "g", bodyMd: "b", cells: [{ code: "1" }] },
          { id: "lDup", title: "t2", goal: "g", bodyMd: "b", cells: [{ code: "1" }] },
        ],
      },
    ];
    expect(validateContent(dup).some((i) => i.message.includes("レッスンIDが重複"))).toBe(true);
  });

  it("cellsが空のレッスンを検出する", () => {
    const empty: Chapter[] = [
      { id: "ch1", no: 1, title: "A", tag: "基礎", summary: "", checklist: [], lessons: [{ id: "l1", title: "t", goal: "g", bodyMd: "b", cells: [] }] },
    ];
    expect(validateContent(empty).some((i) => i.message.includes("実行サンプルがありません"))).toBe(true);
  });

  it("usesPandas:trueなのにpandasを使っていないセルを検出する", () => {
    const bad: Chapter[] = [
      {
        id: "ch1",
        no: 1,
        title: "A",
        tag: "基礎",
        summary: "",
        checklist: [],
        lessons: [{ id: "l1", title: "t", goal: "g", bodyMd: "b", cells: [{ code: "print(1)", usesPandas: true }] }],
      },
    ];
    expect(validateContent(bad).some((i) => i.message.includes("pandasの使用が見当たりません"))).toBe(true);
  });
});
