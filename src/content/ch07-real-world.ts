import type { Chapter } from "./types";

export const ch07: Chapter = {
  id: "ch07",
  no: 7,
  title: "実務ワークフロー",
  tag: "実務",
  summary: "汚いデータの掃除、日付の月次集計、複数テーブルをまたぐパイプライン、結果の書き出しまで、実案件の一連の流れを通しで練習します。",
  checklist: [
    "空白trim・表記ゆれ統一・型直しという一連のクレンジングができる",
    "日付列から月次ロールアップ集計ができる",
    "read→clean→merge→groupbyを一気通貫のパイプラインとして書ける",
    "to_csv()の中身を文字列として確認できる（ダウンロード不可環境での代替）",
  ],
  lessons: [
    {
      id: "l0701",
      title: "汚いデータの掃除 — trim・表記ゆれ・型直し",
      goal: "文字列の前後空白除去・表記ゆれの統一・数値型への変換という、実データ特有の下ごしらえができるようになる",
      bodyMd: `実務のCSVは、想像以上に汚れています。よくある3点セットです。

- **前後の空白**：\`" 梅田店 "\` のように混入 → \`df["col"].str.strip()\`
- **表記ゆれ**：\`"梅田"\`と\`"梅田店"\`が別物として扱われる → \`.replace({旧: 新})\` や \`.str.replace()\`で統一
- **型崩れ**：数値のはずが \`"1,200円"\` のような文字列 → \`.str.replace()\`で不要文字を除いてから \`.astype(int)\`

これらを1つずつ順番に、\`df["col"] = ...\` で列を上書きしながら直していくのが基本の流れです。`,
      cells: [
        {
          label: "空白除去・表記ゆれ統一・型直し",
          code: `import pandas as pd

df = pd.DataFrame({
    "store": [" 梅田店", "難波", "天王寺店 ", "梅田"],
    "sales_text": ["1,200円", "980円", "1,500円", "800円"],
})

df["store"] = df["store"].str.strip()  # 前後空白除去
df["store"] = df["store"].replace({"梅田": "梅田店", "難波": "難波店", "天王寺店": "天王寺店"})  # 表記ゆれ統一
df["sales"] = df["sales_text"].str.replace(",", "").str.replace("円", "").astype(int)  # 型直し

df`,
          usesPandas: true,
        },
      ],
      exercise: {
        title: "商品名の表記ゆれと価格の型を直す",
        prompt: "`name` 列の前後の空白を取り、`price_text` から \"円\" とカンマを除いて整数の `price` 列を作ってください。",
        starter: `import pandas as pd

df = pd.DataFrame({
    "name": [" コーヒー豆", "紅茶 ", "抹茶"],
    "price_text": ["480円", "320円", "1,200円"],
})

# ここで df["name"] と df["price"] を整える

df`,
        expected: "nameの前後空白が消え、priceが480/320/1200のint列になる",
        solution: `import pandas as pd

df = pd.DataFrame({
    "name": [" コーヒー豆", "紅茶 ", "抹茶"],
    "price_text": ["480円", "320円", "1,200円"],
})

df["name"] = df["name"].str.strip()
df["price"] = df["price_text"].str.replace(",", "").str.replace("円", "").astype(int)

df`,
      },
    },
    {
      id: "l0702",
      title: "日付の集計 — 月次ロールアップ",
      goal: "日付列をdatetime型に変換し、年月単位に丸めて月次集計（ロールアップ）ができるようになる",
      bodyMd: `日付を集計単位にまとめる基本の流れです。

1. \`pd.to_datetime(df["col"])\` — 文字列の日付列を \`datetime\` 型に変換
2. \`df["col"].dt.to_period("M")\` または \`.dt.strftime("%Y-%m")\` — 年月だけの単位に丸める
3. \`groupby()\` で月ごとに集計

これはBIツールの「日付テーブルで月粒度にドリルダウンして集計する」操作をpandasで再現したものです。`,
      cells: [
        {
          label: "日付をdatetime化して月次集計",
          code: `import pandas as pd

df = pd.DataFrame({
    "order_date": ["2026-01-05", "2026-01-20", "2026-02-03", "2026-02-15", "2026-03-01"],
    "amount": [3000, 4500, 2800, 5200, 3900],
})

df["order_date"] = pd.to_datetime(df["order_date"])
df["month"] = df["order_date"].dt.strftime("%Y-%m")

monthly = df.groupby("month").agg(total=("amount", "sum"), orders=("amount", "count"))
monthly`,
          usesPandas: true,
        },
      ],
      sqlBridge: "`dt.strftime(\"%Y-%m\")` + `groupby` は、SQLの `GROUP BY DATE_TRUNC('month', order_date)` に相当します。",
      exercise: {
        title: "店舗別・月別の売上をロールアップする",
        prompt: "`order_date` をdatetime化して月キー列 `month` を作り、`store` と `month` の2つでgroupbyして `amount` の合計 `total` を集計してください。",
        starter: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "梅田", "難波", "難波"],
    "order_date": ["2026-01-10", "2026-02-14", "2026-01-22", "2026-02-05"],
    "amount": [40000, 55000, 62000, 48000],
})

monthly = df  # ここを書き換える
monthly`,
        expected: "(店舗, 月)の組ごとにtotalが集計される（4行）",
        solution: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "梅田", "難波", "難波"],
    "order_date": ["2026-01-10", "2026-02-14", "2026-01-22", "2026-02-05"],
    "amount": [40000, 55000, 62000, 48000],
})

df["order_date"] = pd.to_datetime(df["order_date"])
df["month"] = df["order_date"].dt.strftime("%Y-%m")

monthly = df.groupby(["store", "month"]).agg(total=("amount", "sum"))
monthly`,
      },
    },
    {
      id: "l0703",
      title: "複数テーブルの統合パイプライン",
      goal: "merge→計算列→groupbyという一連の処理を、1つのつながったパイプラインとして書けるようになる",
      bodyMd: `実務では「注文テーブル」「店舗マスタ」「商品マスタ」のように**複数の表に分かれたデータ**を1つの分析用テーブルに統合してから集計します。流れは常にこの順番です。

1. **read** — 各データを読み込む（このノートでは文字列CSVやその場のDataFrame）
2. **merge** — キーで結合し、1つの表にする
3. **計算列** — 必要な派生列（利益・単価など）を作る
4. **groupby** — 見たい粒度で集計する

各ステップの結果を一旦別の変数（\`df\`, \`merged\`, \`summary\`など）に入れておくと、途中経過を確認しながら進められます。`,
      cells: [
        {
          label: "merge→計算列→groupbyの一気通貫パイプライン",
          code: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4],
    "store_id": [10, 10, 20, 20],
    "product_code": ["A001", "A002", "A001", "A002"],
    "qty": [3, 2, 5, 1],
})
stores = pd.DataFrame({"store_id": [10, 20], "store_name": ["梅田", "難波"]})
products = pd.DataFrame({"product_code": ["A001", "A002"], "unit_price": [480, 320]})

merged = orders.merge(stores, on="store_id").merge(products, on="product_code")
merged["amount"] = merged["qty"] * merged["unit_price"]

summary = merged.groupby("store_name").agg(total_amount=("amount", "sum"), total_qty=("qty", "sum"))
summary`,
          usesPandas: true,
        },
      ],
      exercise: {
        title: "店舗×商品カテゴリの売上パイプライン",
        prompt: "`orders`・`stores`・`products` を結合し、`amount = qty * unit_price` を計算した上で、`category` ごとの `amount` 合計を `summary` に入れてください。",
        starter: `import pandas as pd

orders = pd.DataFrame({
    "store_id": [1, 1, 2],
    "product_code": ["P1", "P2", "P1"],
    "qty": [2, 1, 4],
})
stores = pd.DataFrame({"store_id": [1, 2], "store_name": ["梅田", "難波"]})
products = pd.DataFrame({"product_code": ["P1", "P2"], "category": ["飲料", "雑貨"], "unit_price": [500, 1000]})

summary = None  # ここを書き換える（merge→計算列→groupby）
summary`,
        expected: "飲料: (2+4)*500=3000、雑貨: 1*1000=1000",
        solution: `import pandas as pd

orders = pd.DataFrame({
    "store_id": [1, 1, 2],
    "product_code": ["P1", "P2", "P1"],
    "qty": [2, 1, 4],
})
stores = pd.DataFrame({"store_id": [1, 2], "store_name": ["梅田", "難波"]})
products = pd.DataFrame({"product_code": ["P1", "P2"], "category": ["飲料", "雑貨"], "unit_price": [500, 1000]})

merged = orders.merge(stores, on="store_id").merge(products, on="product_code")
merged["amount"] = merged["qty"] * merged["unit_price"]

summary = merged.groupby("category").agg(amount=("amount", "sum"))
summary`,
      },
    },
    {
      id: "l0704",
      title: "結果の書き出し — to_csv()の中身をプレビューする",
      goal: "to_csv()でDataFrameをCSV文字列に変換し、ダウンロードできない環境でも中身を画面上で確認できるようになる",
      bodyMd: `通常はここで \`df.to_csv("output.csv")\` としてファイル保存しますが、このノートはブラウザ内で完結しているため**ローカルへのファイル書き出しはできません**。代わりに \`df.to_csv(index=False)\`（引数無しで呼ぶとCSV文字列が返る）で、書き出されるはずの中身を文字列として確認し、\`print()\` でプレビューします。

これは「実際に取引先に納品するCSVがどう見えるか」を確認する感覚に近く、\`index=False\` を付けないと行番号まで列として出力されてしまう点に注意してください。`,
      cells: [
        {
          label: "CSV文字列としてプレビューする",
          code: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波"],
    "total_amount": [1740000, 1830000],
})

csv_preview = df.to_csv(index=False)
print(csv_preview)`,
          usesPandas: true,
        },
      ],
      exercise: {
        title: "集計結果をCSVとして書き出しプレビューする",
        prompt: "`summary` を `index=False` で `to_csv()` し、`csv_text` に文字列として入れて `print()` してください。",
        starter: `import pandas as pd

summary = pd.DataFrame({
    "category": ["飲料", "雑貨"],
    "amount": [3000, 1000],
})

csv_text = ""  # ここを書き換える
print(csv_text)`,
        expected: "category,amount のヘッダーと2行のデータがCSV形式で表示される",
        solution: `import pandas as pd

summary = pd.DataFrame({
    "category": ["飲料", "雑貨"],
    "amount": [3000, 1000],
})

csv_text = summary.to_csv(index=False)
print(csv_text)`,
      },
    },
  ],
};
