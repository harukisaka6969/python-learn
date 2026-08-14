import type { Chapter } from "./types";

export const ch05: Chapter = {
  id: "ch05",
  no: 5,
  title: "pandas入門",
  tag: "pandas",
  summary: "ここからが本題です。DataFrameという「表」の作り方・見方・部分的な取り出し方、CSVの読み込み、型と欠損値の扱いを身につけます。",
  checklist: [
    "辞書からDataFrameを作り、shape/head/describeで概要を把握できる",
    "df[\"col\"]・loc・ilocで列と行を取り出せる",
    "io.StringIOを使ってコード内文字列のCSVをpd.read_csvで読み込める",
    "dtypes/astype()/isna()/dropna()/fillna()で型と欠損値を扱える",
  ],
  lessons: [
    {
      id: "l0501",
      title: "DataFrameという表 — 辞書から生成、shape/head/describe",
      goal: "辞書からDataFrameを作成し、shape・head・describeで表の概要をつかめるようになる",
      bodyMd: `\`pandas\` はPythonで**表形式データ（＝SQLのテーブル）**を扱うための定番ライブラリです。慣習として \`import pandas as pd\` で読み込みます。

表そのものは \`DataFrame\`、その1列は \`Series\` と呼びます。列名をキー、各列の値のリストを値とする辞書から \`pd.DataFrame(辞書)\` で作るのが最も基本的な作り方です。

- \`df.shape\` — (行数, 列数)
- \`df.head(n)\` — 先頭n行（既定5行）
- \`df.describe()\` — 数値列の件数・平均・標準偏差・最小最大などの要約統計

> NOTE: このノートのセルはPyodideカーネルを共有しているため、あるセルで作った\`df\`は後のセルでもそのまま使えます。`,
      cells: [
        {
          label: "辞書からDataFrameを作る",
          code: `import pandas as pd

data = {
    "store": ["梅田", "難波", "天王寺", "京橋"],
    "sales": [820000, 950000, 710000, 630000],
    "staff": [8, 10, 6, 5],
}
df = pd.DataFrame(data)
df`,
          usesPandas: true,
        },
        {
          label: "概要を見る",
          code: `print(df.shape)
print(df.head(2))
df.describe()`,
          usesPandas: true,
        },
      ],
      sqlBridge: "`pd.DataFrame` はSQLの1つのテーブルに相当し、`describe()` は `SELECT COUNT(*), AVG(col), MIN(col), MAX(col) ...` を一括で行うようなイメージです。",
      exercise: {
        title: "顧客データのDataFrameを作る",
        prompt: "`name`（顧客名）、`age`（年齢）、`spent`（累計購入額）の3列を持つDataFrame `customers` を、好きな3〜4件のデータで作成し、`describe()` を表示してください。",
        starter: `import pandas as pd

data = {
    "name": [],  # ここを書き換える
    "age": [],
    "spent": [],
}
customers = pd.DataFrame(data)
customers.describe()`,
        expected: "ageとspentの件数・平均・最小最大などの要約統計表が表示される",
        solution: `import pandas as pd

data = {
    "name": ["田中", "佐藤", "鈴木"],
    "age": [34, 28, 45],
    "spent": [12000, 8600, 25400],
}
customers = pd.DataFrame(data)
customers.describe()`,
      },
    },
    {
      id: "l0502",
      title: "列と行の取り出し — df[\"col\"], loc, iloc",
      goal: "列名・行ラベル・位置番号のそれぞれで、DataFrameから必要な部分を取り出せるようになる",
      bodyMd: `- \`df["col"]\` — 1列を取り出す（結果は \`Series\`）。複数列は \`df[["col1", "col2"]]\`
- \`df.loc[条件やラベル]\` — **ラベル・条件**で行を取り出す。実務で最頻出（例: \`df.loc[df["sales"] > 500]\`）
- \`df.iloc[番号]\` — **0始まりの位置番号**で行・列を取り出す（例: \`df.iloc[0]\` は先頭行、\`df.iloc[0, 1]\` は先頭行2列目）

迷ったら「条件で絞りたいなら\`loc\`、何番目かで取りたいなら\`iloc\`」と覚えてください。`,
      cells: [
        {
          label: "列の取り出し",
          code: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺"],
    "sales": [820000, 950000, 710000],
})

print(df["store"])
df[["store", "sales"]]`,
          usesPandas: true,
        },
        {
          label: "locとilocで行を取り出す",
          code: `print(df.loc[df["sales"] > 750000])  # 条件で絞る
print(df.iloc[0])   # 先頭行
print(df.iloc[0, 1]) # 先頭行の2列目（sales）`,
          usesPandas: true,
        },
      ],
      sqlBridge: "`df[\"col\"]` は `SELECT col FROM df`、`df.loc[条件]` は `SELECT * FROM df WHERE 条件` に対応します。`iloc`にSQLの直接対応物はなく、あくまでPython内での位置アクセスです。",
      exercise: {
        title: "売上70万円以上の店舗だけ取り出す",
        prompt: "`loc` を使って `sales` が700000以上の行だけを `top_stores` に入れてください。",
        starter: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺", "京橋"],
    "sales": [820000, 950000, 690000, 710000],
})

top_stores = df  # ここを書き換える
top_stores`,
        expected: "梅田・難波・京橋の3行（天王寺は690000なので除外）",
        solution: `import pandas as pd

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺", "京橋"],
    "sales": [820000, 950000, 690000, 710000],
})

top_stores = df.loc[df["sales"] >= 700000]
top_stores`,
      },
    },
    {
      id: "l0503",
      title: "CSVを読む — pd.read_csv(io.StringIO(...))",
      goal: "ブラウザ環境の制約（ローカルファイル読み込み不可）を踏まえ、コード内文字列のCSVをio.StringIO経由でpd.read_csvに渡せるようになる",
      bodyMd: `本来 \`pd.read_csv("file.csv")\` のようにファイルパスを渡しますが、**このノートはブラウザ内で動くPythonのため、ローカルファイルを直接読むことができません**。代わりに、CSVの中身をコード内の文字列として持ち、\`io.StringIO\` で「メモリ上の仮想ファイル」に変換してから \`pd.read_csv\` に渡します（\`df = pd.read_csv(io.StringIO(csv_text))\` の形。下のサンプルセルで実際の書き方を確認してください）。

これは学習用の割り切りですが、実務でもAPIレスポンスの文字列をその場でDataFrame化する場面（ファイルを介さない処理）で同じテクニックを使います。`,
      cells: [
        {
          label: "文字列CSVをDataFrameとして読み込む",
          code: `import io
import pandas as pd

csv_text = """store,sales,staff
梅田,820000,8
難波,950000,10
天王寺,710000,6"""

df = pd.read_csv(io.StringIO(csv_text))
df`,
          usesPandas: true,
        },
      ],
      exercise: {
        title: "商品マスタCSVを読み込む",
        prompt: "`csv_text` を `io.StringIO` 経由で `pd.read_csv` に渡し、DataFrame `products` を作って表示してください。",
        starter: `import io
import pandas as pd

csv_text = """code,name,price
A001,コーヒー豆,480
A002,紅茶,320
A003,抹茶,980"""

products = None  # ここを書き換える
products`,
        expected: "3行3列（code, name, price）のDataFrameが表示される",
        solution: `import io
import pandas as pd

csv_text = """code,name,price
A001,コーヒー豆,480
A002,紅茶,320
A003,抹茶,980"""

products = pd.read_csv(io.StringIO(csv_text))
products`,
      },
    },
    {
      id: "l0504",
      title: "型と欠損値 — dtypes, astype(), isna(), dropna(), fillna()",
      goal: "列の型を確認・変換し、欠損値（NaN）を検出・除外・補完できるようになる",
      bodyMd: `実データには欠損（値が無い状態、pandasでは \`NaN\`）や、型が期待と違う列（数値のはずが文字列）がつきものです。

- \`df.dtypes\` — 各列の型を確認
- \`df["col"].astype(int)\` — 型を変換（変換できない値があるとエラー）
- \`df.isna()\` — 各セルが欠損かどうかをTrue/Falseで返す。\`df["col"].isna().sum()\` で欠損件数
- \`df.dropna()\` — 欠損を含む行を削除
- \`df["col"].fillna(値)\` — 欠損を指定の値で埋める

「削除するか、埋めるか」は業務要件次第です。まず \`isna().sum()\` で全体像を把握してから判断しましょう。`,
      cells: [
        {
          label: "型の確認と欠損の検出",
          code: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "store": ["梅田", "難波", "天王寺", "京橋"],
    "sales": [820000, np.nan, 710000, 630000],
    "staff": ["8", "10", "6", "5"],
})

print(df.dtypes)
print(df.isna().sum())`,
          usesPandas: true,
        },
        {
          label: "型変換と欠損の補完",
          code: `df["staff"] = df["staff"].astype(int)
df["sales_filled"] = df["sales"].fillna(0)
print(df.dtypes)
df`,
          usesPandas: true,
        },
      ],
      sqlBridge: "`isna().sum()` はSQLの `SELECT COUNT(*) FROM t WHERE col IS NULL`、`fillna(0)` は `COALESCE(col, 0)`、`dropna()` は `WHERE col IS NOT NULL` に相当します。",
      exercise: {
        title: "欠損した価格を平均値で補完する",
        prompt: "`price` 列の欠損を、**欠損を除いた平均値**（`df[\"price\"].mean()`は自動的にNaNを無視します）で埋めて、`filled` 列に入れてください。",
        starter: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["コーヒー豆", "紅茶", "抹茶", "ほうじ茶"],
    "price": [480, np.nan, 980, 320],
})

df["filled"] = df["price"]  # ここを書き換える
df`,
        expected: "2番目の行のfilledに、480・980・320の平均である約593.3が入る",
        solution: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    "name": ["コーヒー豆", "紅茶", "抹茶", "ほうじ茶"],
    "price": [480, np.nan, 980, 320],
})

df["filled"] = df["price"].fillna(df["price"].mean())
df`,
      },
    },
  ],
};
