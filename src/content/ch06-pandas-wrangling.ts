import type { Chapter } from "./types";

export const ch06: Chapter = {
  id: "ch06",
  no: 6,
  title: "pandasデータ整形",
  tag: "pandas",
  summary: "絞り込み・計算列の追加・groupby集計・並べ替えと重複除去・結合・縦横変換という、実務データ整形の主要操作を一通り身につけます。",
  checklist: [
    "isin/between/query()で条件フィルタができる",
    "apply()/map()やnp.whereで計算列・条件分岐列を作れる",
    "groupby().agg()でSQLのGROUP BYに相当する集計ができる",
    "sort_values/drop_duplicates/rankで並べ替えと重複処理ができる",
    "merge()でSQLのJOINに相当する表の結合ができる",
    "pivot_table/meltで縦横変換ができる",
  ],
  lessons: [
    {
      id: "l0601",
      title: "絞る — isin, between, query()",
      goal: "isin・between・query()を使って、複数条件のフィルタを読みやすく書けるようになる",
      bodyMd: `前章の \`loc[条件]\` に加えて、複数値・範囲指定に便利な書き方があります。

- \`df["col"].isin([値1, 値2])\` — 複数値のいずれかに一致（SQLの \`IN\`）
- \`df["col"].between(下限, 上限)\` — 範囲内（SQLの \`BETWEEN\`）
- \`df.query("条件式")\` — 条件を文字列で書ける（列名同士の比較などが読みやすい）

条件は \`&\`（かつ）・\`|\`（または）で組み合わせます。**各条件をカッコで囲む**のを忘れないでください（優先順位の都合で必須です）。`,
      cells: [
        {
          label: "isin / between / query",
          code: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺", "京橋", "堺"],
    "area": ["北", "南", "南", "北", "南"],
    "sales": [820000, 950000, 710000, 630000, 480000],
})

print(df[df["area"].isin(["北", "南"])].shape[0], "件")
print(df[df["sales"].between(600000, 900000)])
print(df.query("area == '南' and sales > 500000"))`,
          usesPandas: true,
        },
      ],
      sqlBridge: "`isin` は `IN (...)`、`between` は `BETWEEN ... AND ...`、`query()` はWHERE句をそのまま文字列で書くイメージです。",
      exercise: {
        title: "北エリアで50万円以上の店舗を絞る",
        prompt: "`&`を使った条件（`loc`または通常のブールインデックス）で、`area`が\"北\"かつ`sales`が500000以上の行を `result` に入れてください。",
        starter: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺", "京橋", "堺"],
    "area": ["北", "南", "南", "北", "南"],
    "sales": [820000, 950000, 710000, 430000, 480000],
})

result = df  # ここを書き換える
result`,
        expected: "梅田と京橋のうちsalesが500000以上の行（梅田のみ）",
        solution: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺", "京橋", "堺"],
    "area": ["北", "南", "南", "北", "南"],
    "sales": [820000, 950000, 710000, 430000, 480000],
})

result = df[(df["area"] == "北") & (df["sales"] >= 500000)]
result`,
      },
    },
    {
      id: "l0602",
      title: "作る — 計算列、apply(), map(), np.whereの分岐",
      goal: "既存列から計算列を作り、apply/mapで変換し、np.whereで条件分岐する列を作れるようになる",
      bodyMd: `新しい列は \`df["新列"] = 式\` で作れます。列同士の四則演算はそのまま行ベクトルとして計算されます（forループ不要）。

- \`df["col"].apply(関数)\` — 各値に関数を適用（複雑なロジック向け）
- \`df["col"].map(辞書)\` — 値を辞書で置換（コード→ラベルの変換など）
- \`np.where(条件, 真の場合の値, 偽の場合の値)\` — 列全体に対する if/else（forより高速）`,
      cells: [
        {
          label: "計算列とmap/apply",
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺"],
    "area_code": ["N", "S", "S"],
    "sales": [820000, 950000, 710000],
    "cost": [600000, 720000, 550000],
})

df["profit"] = df["sales"] - df["cost"]  # 列同士の計算
df["area"] = df["area_code"].map({"N": "北", "S": "南"})  # コード→ラベル
df["level"] = np.where(df["profit"] >= 200000, "好調", "通常")  # 条件分岐列
df`,
          usesPandas: true,
        },
      ],
      sqlBridge: "計算列の追加はSQLの `SELECT *, sales - cost AS profit`、`np.where` はSQLの `CASE WHEN` 、`map`はJOINで対応表を引く操作の簡易版に相当します。",
      exercise: {
        title: "利益率列と評価列を作る",
        prompt: "`profit_rate = profit / sales` を計算し、`np.where` で `profit_rate` が0.2以上なら\"優良\"、それ未満なら\"改善余地あり\"を `grade` 列に入れてください。",
        starter: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺"],
    "sales": [820000, 950000, 710000],
    "profit": [220000, 150000, 180000],
})

df["profit_rate"] = 0  # ここを書き換える
df["grade"] = ""  # ここを書き換える
df`,
        expected: "梅田: 優良（0.268）、難波・天王寺: 改善余地あり",
        solution: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺"],
    "sales": [820000, 950000, 710000],
    "profit": [220000, 150000, 180000],
})

df["profit_rate"] = df["profit"] / df["sales"]
df["grade"] = np.where(df["profit_rate"] >= 0.2, "優良", "改善余地あり")
df`,
      },
    },
    {
      id: "l0603",
      title: "まとめる — groupby().agg()",
      goal: "groupby().agg()でグループごとの集計ができ、SQLのGROUP BYとの対応を理解する",
      bodyMd: `\`df.groupby("列").agg(...)\` は、指定した列でグループ化し、グループごとに集計します。SQLの \`GROUP BY\` そのものです。\`df.groupby("area")["sales"].sum()\` のように書けばエリアごとの売上合計が1行で求まり、\`agg()\` に \`新しい列名=("対象列", "集計関数")\` の形でキーワード引数を渡すと、複数の集計を分かりやすい列名で一度に計算できます（下のサンプルセルを参照）。`,
      cells: [
        {
          label: "groupby().agg()でエリア別集計",
          code: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺", "京橋", "堺"],
    "area": ["北", "南", "南", "北", "南"],
    "sales": [820000, 950000, 710000, 630000, 480000],
})

summary = df.groupby("area").agg(
    total_sales=("sales", "sum"),
    avg_sales=("sales", "mean"),
    store_count=("store", "count"),
)
summary`,
          usesPandas: true,
        },
      ],
      sqlBridge: `\`df.groupby("area").agg(total=("sales","sum"))\` は、\`SELECT area, SUM(sales) AS total FROM df GROUP BY area\` に対応します。複数の集計列も同時に指定できるのがagg()の強みです。`,
      exercise: {
        title: "商品カテゴリ別の売上集計",
        prompt: "`category` ごとに `sales` の合計を `total`、件数を `count` として `summary` に集計してください（`agg()`を使用）。",
        starter: `import pandas as pd

df = pd.DataFrame({
    "product": ["コーヒー豆", "紅茶", "マグカップ", "急須", "抹茶"],
    "category": ["飲料", "飲料", "雑貨", "雑貨", "飲料"],
    "sales": [48000, 32000, 15000, 22000, 98000],
})

summary = df  # ここを書き換える
summary`,
        expected: "飲料: total=178000,count=3 / 雑貨: total=37000,count=2",
        solution: `import pandas as pd

df = pd.DataFrame({
    "product": ["コーヒー豆", "紅茶", "マグカップ", "急須", "抹茶"],
    "category": ["飲料", "飲料", "雑貨", "雑貨", "飲料"],
    "sales": [48000, 32000, 15000, 22000, 98000],
})

summary = df.groupby("category").agg(
    total=("sales", "sum"),
    count=("sales", "count"),
)
summary`,
      },
    },
    {
      id: "l0604",
      title: "並べ替えと重複 — sort_values, drop_duplicates, rank",
      goal: "sort_valuesでの並べ替え、drop_duplicatesでの重複除去、rankでの順位付けができるようになる",
      bodyMd: `- \`df.sort_values("col", ascending=False)\` — 列の値で並べ替え（降順は\`ascending=False\`）。複数列は \`["col1", "col2"]\`
- \`df.drop_duplicates(subset=["col"])\` — 指定列の値が重複する行を除去（既定では最初の行を残す）
- \`df["col"].rank(ascending=False)\` — 順位を計算（同率は既定で平均順位になる点に注意）`,
      cells: [
        {
          label: "並べ替え・重複除去・順位",
          code: `import pandas as pd

df = pd.DataFrame({
    "customer": ["田中", "佐藤", "田中", "鈴木"],
    "amount": [4800, 3200, 5600, 2100],
})

print(df.sort_values("amount", ascending=False))
print(df.drop_duplicates(subset=["customer"]))  # 田中の最初の行だけ残る
df["rank"] = df["amount"].rank(ascending=False)
df`,
          usesPandas: true,
        },
      ],
      sqlBridge: "`sort_values` は `ORDER BY`、`drop_duplicates` は `DISTINCT` やウィンドウ関数での重複排除、`rank()` はSQLの `RANK() OVER (ORDER BY ...)` に対応します。",
      exercise: {
        title: "顧客ごとの最新注文だけを残す",
        prompt: "`orders` を `order_date` の新しい順に並べ替えてから、`customer` ごとに最初の行（＝最新の注文）だけを `latest` に残してください。",
        starter: `import pandas as pd

orders = pd.DataFrame({
    "customer": ["田中", "佐藤", "田中", "佐藤"],
    "order_date": ["2026-01-10", "2026-02-05", "2026-06-20", "2026-03-01"],
    "amount": [3000, 4000, 5000, 2000],
})

latest = orders  # ここを書き換える
latest`,
        expected: "田中: 2026-06-20の行、佐藤: 2026-03-01の行のみ残る",
        solution: `import pandas as pd

orders = pd.DataFrame({
    "customer": ["田中", "佐藤", "田中", "佐藤"],
    "order_date": ["2026-01-10", "2026-02-05", "2026-06-20", "2026-03-01"],
    "amount": [3000, 4000, 5000, 2000],
})

latest = orders.sort_values("order_date", ascending=False).drop_duplicates(subset=["customer"])
latest`,
      },
    },
    {
      id: "l0605",
      title: "表を結合する — merge()",
      goal: "merge()でinner/left/outer結合ができ、SQLのJOINとの対応を理解する",
      bodyMd: `複数の表を共通のキーでつなげるのが \`merge()\` です。SQLのJOINにそのまま対応します。

| pandas | SQL | 意味 |
|---|---|---|
| \`how="inner"\`（既定） | \`INNER JOIN\` | 両方に一致がある行のみ |
| \`how="left"\` | \`LEFT JOIN\` | 左側は全件残し、一致が無ければNaN |
| \`how="outer"\` | \`FULL OUTER JOIN\` | どちらか一方にあれば残す |

\`pd.merge(left, right, on="キー列", how="left")\` の形で使います。キー名が違う場合は \`left_on\`/\`right_on\` を指定します。`,
      cells: [
        {
          label: "inner結合とleft結合の違い",
          code: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3],
    "product_code": ["A001", "A002", "A999"],  # A999はマスタに無い
    "qty": [2, 1, 3],
})
products = pd.DataFrame({
    "product_code": ["A001", "A002", "A003"],
    "name": ["コーヒー豆", "紅茶", "抹茶"],
})

print(pd.merge(orders, products, on="product_code", how="inner"))  # A999の行は消える
print(pd.merge(orders, products, on="product_code", how="left"))   # A999の行は残りnameがNaN`,
          usesPandas: true,
        },
      ],
      sqlBridge: `\`pd.merge(orders, products, on="product_code", how="left")\` は \`SELECT * FROM orders LEFT JOIN products ON orders.product_code = products.product_code\` に対応します。`,
      exercise: {
        title: "注文に店舗名を結合する",
        prompt: "`orders` と `stores` を `store_id` をキーに `how=\"left\"` で結合し、`merged` に入れてください（storesに無いstore_idがあっても行を消さないため）。",
        starter: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3],
    "store_id": [10, 20, 99],
    "amount": [4800, 3200, 1500],
})
stores = pd.DataFrame({
    "store_id": [10, 20, 30],
    "store_name": ["梅田", "難波", "天王寺"],
})

merged = orders  # ここを書き換える
merged`,
        expected: "3行とも残り、store_id=99の行だけstore_nameがNaNになる",
        solution: `import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3],
    "store_id": [10, 20, 99],
    "amount": [4800, 3200, 1500],
})
stores = pd.DataFrame({
    "store_id": [10, 20, 30],
    "store_name": ["梅田", "難波", "天王寺"],
})

merged = pd.merge(orders, stores, on="store_id", how="left")
merged`,
      },
    },
    {
      id: "l0606",
      title: "縦横変換 — pivot_table, melt",
      goal: "pivot_tableで縦持ちデータを横持ちに、meltで横持ちを縦持ちに変換できるようになる（Power BIのピボット/アンピボットに相当）",
      bodyMd: `- \`df.pivot_table(index="行にする列", columns="列にする列", values="集計する列", aggfunc="sum")\` — **縦持ち→横持ち**。Power BIの「ピボット」に相当
- \`pd.melt(df, id_vars=["残す列"], var_name="項目名の列名", value_name="値の列名")\` — **横持ち→縦持ち**。Power BIの「アンピボット」に相当

分析・可視化ツールに渡すときは縦持ち（1行1事実）が扱いやすく、人が読むレポートには横持ち（月が列に並ぶ表など）が向いています。`,
      cells: [
        {
          label: "pivot_tableで縦持ち→横持ち",
          code: `import pandas as pd

sales_long = pd.DataFrame({
    "store": ["梅田", "梅田", "難波", "難波"],
    "month": ["2026-01", "2026-02", "2026-01", "2026-02"],
    "sales": [820000, 900000, 950000, 880000],
})

wide = sales_long.pivot_table(index="store", columns="month", values="sales", aggfunc="sum")
wide`,
          usesPandas: true,
        },
        {
          label: "meltで横持ち→縦持ち",
          code: `long_again = wide.reset_index().melt(id_vars="store", var_name="month", value_name="sales")
long_again`,
          usesPandas: true,
        },
      ],
      sqlBridge: "`pivot_table` はSQLでは条件付きSUM（`SUM(CASE WHEN month='2026-01' THEN sales END)`）を列ごとに並べる操作に相当し、`melt` はその逆（UNPIVOT）です。",
      exercise: {
        title: "エリア×四半期の売上を横持ちにする",
        prompt: "`long_df` を `pivot_table` で `index=\"area\"`, `columns=\"quarter\"`, `values=\"sales\"`, `aggfunc=\"sum\"` として横持ちの `wide_df` に変換してください。",
        starter: `import pandas as pd

long_df = pd.DataFrame({
    "area": ["北", "北", "南", "南"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "sales": [1200000, 1350000, 1500000, 1420000],
})

wide_df = long_df  # ここを書き換える
wide_df`,
        expected: "行が北・南、列がQ1・Q2の2x2の表になる",
        solution: `import pandas as pd

long_df = pd.DataFrame({
    "area": ["北", "北", "南", "南"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "sales": [1200000, 1350000, 1500000, 1420000],
})

wide_df = long_df.pivot_table(index="area", columns="quarter", values="sales", aggfunc="sum")
wide_df`,
      },
    },
  ],
};
