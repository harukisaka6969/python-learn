import type { Chapter } from "./types";

export const ch08: Chapter = {
  id: "ch08",
  no: 8,
  title: "総合演習",
  tag: "実務",
  summary: "擬似的な「汚い売上CSV」を、読み込みから納品可能なCSV文字列まで、これまで学んだ全ての操作を通しで使って仕上げます。",
  checklist: [
    "汚いCSVをio.StringIO経由で読み込める",
    "trim・表記ゆれ・型直し・欠損処理でデータを掃除できる",
    "エリア別月次で売上を集計し、効率指標（利益率など）を付与できる",
    "上位抽出を行い、納品用CSV文字列として書き出せる",
  ],
  lessons: [
    {
      id: "l0801",
      title: "キャップストーン — 汚い売上CSVを納品物に仕上げる",
      goal: "複数店舗・欠損・表記ゆれを含む擬似CSVを、読み込み→掃除→集計→指標付与→上位抽出→CSV書き出しまで一気通貫で処理できるようになる",
      bodyMd: `ここまでの8章分の道具（\`io.StringIO\`、\`str.strip\`/\`replace\`、\`astype\`、\`fillna\`、\`groupby().agg()\`、\`np.where\`、\`sort_values\`、\`to_csv()\`）を総動員し、**フリーランス案件でよくある「汚いCSVを渡されて、整形済みの集計CSVを納品する」**という一連の流れを最後まで実行します。

下のセルを順番に実行してください。前のセルの \`df\` は後のセルでもそのまま使えます（このノート全体で共有されているカーネルの仕組みです）。各ステップの後に \`df\` や \`summary\` を確認しながら進めると、途中で何が起きているか把握しやすくなります。

> NOTE: 実務のデータクレンジングは「一発で完璧」を狙わず、**1つ直す→確認→次を直す**の繰り返しです。このキャップストーンもその順番で組んであります。`,
      cells: [
        {
          label: "STEP1: 汚いCSVを読み込む",
          code: `import io
import pandas as pd
import numpy as np

raw_csv = """store,area,month,sales_text,cost
梅田店, 北,2026-01,"1,200,000円",900000
 難波 ,南,2026-01,"1,500,000円",1100000
天王寺店,南,2026-01,,780000
梅田,北,2026-02,"1,350,000円",950000
難波店,南,2026-02,"1,420,000円",1050000
天王寺,南,2026-02,"980,000円",720000"""

df = pd.read_csv(io.StringIO(raw_csv))
df`,
          usesPandas: true,
        },
        {
          label: "STEP2: 表記ゆれ・空白・型を掃除する",
          code: `df["store"] = df["store"].str.strip().replace({
    "梅田": "梅田店", "難波": "難波店", "天王寺": "天王寺店",
})
df["area"] = df["area"].str.strip()

df["sales"] = (
    df["sales_text"]
    .str.replace(",", "", regex=False)
    .str.replace("円", "", regex=False)
    .astype(float)
)
df["sales"] = df["sales"].fillna(df.groupby("store")["sales"].transform("mean"))

df`,
          usesPandas: true,
        },
        {
          label: "STEP3: 効率指標（利益・利益率）を付与する",
          code: `df["profit"] = df["sales"] - df["cost"]
df["profit_rate"] = df["profit"] / df["sales"]
df["grade"] = np.where(df["profit_rate"] >= 0.28, "優良", "通常")
df`,
          usesPandas: true,
        },
        {
          label: "STEP4: エリア別月次集計→上位抽出",
          code: `summary = (
    df.groupby(["area", "month"])
    .agg(total_sales=("sales", "sum"), total_profit=("profit", "sum"))
    .reset_index()
)
summary["profit_rate"] = summary["total_profit"] / summary["total_sales"]

top = summary.sort_values("total_profit", ascending=False)
top`,
          usesPandas: true,
        },
        {
          label: "STEP5: 納品用CSVとしてプレビューする",
          code: `deliverable = top.round({"profit_rate": 3})
csv_output = deliverable.to_csv(index=False)
print(csv_output)`,
          usesPandas: true,
        },
      ],
      sqlBridge: "この一連の流れは、SQLで書けば `TRIM`+`REPLACE`によるクレンジング → `GROUP BY area, month` → `CASE WHEN`による指標付与 → `ORDER BY total_profit DESC` を、pandasのメソッドチェーンで実現したものです。",
      exercise: {
        title: "総仕上げ：優良店舗だけの納品CSVを作る",
        prompt: "STEP4の `summary` から、`total_sales` が120万円以上の行だけを抽出し、`total_profit` が大きい順に並べ替えて、`index=False` のCSV文字列として `print()` してください（`summary`はSTEP4のセルを先に実行しておく必要があります）。",
        starter: `filtered = summary  # ここを書き換える（絞り込み→並べ替え）

csv_text = ""  # ここを書き換える（to_csvで文字列化）
print(csv_text)`,
        expected: "total_salesが120万円以上の行だけが、total_profitの降順でCSV形式に表示される",
        solution: `filtered = summary[summary["total_sales"] >= 1_200_000].sort_values("total_profit", ascending=False)

csv_text = filtered.to_csv(index=False)
print(csv_text)`,
      },
    },
  ],
};
