import type { Chapter } from "./types";

export const ch04: Chapter = {
  id: "ch04",
  no: 4,
  title: "関数とモジュール",
  tag: "関数",
  summary: "処理を関数として再利用できる形にまとめ、標準ライブラリ（datetime・json）を使って日付とJSONを扱えるようになります。",
  checklist: [
    "defで関数を定義し、returnで値を返せる（デフォルト引数も使える）",
    "*args/**kwargsと、キーワード引数呼び出しの違いを理解している",
    "importとfrom ... importでモジュールを取り込める",
    "datetimeで日付を扱い、jsonでPython値とJSON文字列を相互変換できる",
  ],
  lessons: [
    {
      id: "l0401",
      title: "関数定義 — def / return / デフォルト引数",
      goal: "defで関数を定義し、returnで値を返し、デフォルト引数を持つ関数を書けるようになる",
      bodyMd: `同じ処理を何度も書くのではなく、\`def 関数名(引数):\` として**再利用できる部品**にまとめます。\`return\` で呼び出し元に値を返します（\`return\`が無ければ \`None\` を返します）。

引数には既定値を持たせられます（デフォルト引数）。呼び出し側で省略すればその既定値が使われます。`,
      cells: [
        {
          label: "税込み価格を計算する関数",
          code: `def with_tax(price, rate=0.1):
    return round(price * (1 + rate))

print(with_tax(1000))       # 既定の10%
print(with_tax(1000, 0.08)) # 軽減税率8%を指定`,
        },
      ],
      exercise: {
        title: "割引後価格を計算する関数",
        prompt: "`discounted(price, rate=0.2)` という関数を定義し、`price` から `rate` 割引した金額（四捨五入した整数）を返すようにしてください。`rate` を省略すると20%引きになります。",
        starter: `def discounted(price, rate=0.2):
    return 0  # ここを書き換える

print(discounted(1000))
print(discounted(1000, 0.5))`,
        expected: "800 と 500 が表示される",
        solution: `def discounted(price, rate=0.2):
    return round(price * (1 - rate))

print(discounted(1000))
print(discounted(1000, 0.5))`,
      },
    },
    {
      id: "l0402",
      title: "*args / **kwargs、キーワード引数",
      goal: "可変長の位置引数(*args)とキーワード引数(**kwargs)の意味を理解し、キーワード引数呼び出しを使えるようになる",
      bodyMd: `関数呼び出しは \`関数名(値1, 値2)\`（位置引数）だけでなく、\`関数名(名前=値)\`（キーワード引数）でも書けます。引数が多い関数はキーワード引数で呼ぶと読みやすくなります。

- \`*args\` — 「いくつでも受け取れる位置引数」をタプルとしてまとめる
- \`**kwargs\` — 「いくつでも受け取れるキーワード引数」を辞書としてまとめる

集計関数などで「引数の数が事前に決まらない」場合に使います。`,
      cells: [
        {
          label: "キーワード引数で呼び出す",
          code: `def make_order(customer, amount, note="なし"):
    return f"{customer}様 / {amount}円 / 備考: {note}"

print(make_order(customer="田中", amount=4800, note="即日発送"))
print(make_order("佐藤", 2100))`,
        },
        {
          label: "*argsで可変長の合計を取る",
          code: `def total(*args):
    return sum(args)

print(total(100, 200, 300))
print(total(50))`,
        },
      ],
      exercise: {
        title: "**kwargsで注文情報をまとめる関数",
        prompt: "`summarize(**kwargs)` を定義し、渡されたキーワード引数を `\"key=value\"` 形式にして `, `で連結した1つの文字列として返してください（順序は問いません。`\", \".join(...)`が使えます）。",
        starter: `def summarize(**kwargs):
    return ""  # ここを書き換える

print(summarize(customer="田中", amount=4800))`,
        expected: "customer=田中, amount=4800 のような1行の文字列（順序は問わない）",
        solution: `def summarize(**kwargs):
    return ", ".join(f"{k}={v}" for k, v in kwargs.items())

print(summarize(customer="田中", amount=4800))`,
      },
    },
    {
      id: "l0403",
      title: "モジュールのimport",
      goal: "import / from ... import の違いを理解し、標準ライブラリのモジュールを取り込んで使えるようになる",
      bodyMd: `Pythonの機能の多くは「モジュール」として分割されており、使う前に \`import\` で取り込む必要があります。

- \`import math\` → \`math.sqrt(16)\` のようにモジュール名越しに使う
- \`from math import sqrt\` → \`sqrt(16)\` のように直接使える（名前がぶつかる可能性に注意）
- \`import pandas as pd\` のように \`as\` で別名を付けるのが実務では一般的（\`pd\`・\`np\`は業界の慣習）

このノートでよく使う標準ライブラリは \`math\`（数学）、\`statistics\`（統計）、\`datetime\`（日付）、\`json\`（JSON）、\`io\`（文字列をファイルのように扱う）です。`,
      cells: [
        {
          label: "importの2つの書き方",
          code: `import math
from statistics import mean

print(math.sqrt(16))
print(mean([80, 90, 70, 100]))`,
        },
      ],
      exercise: {
        title: "標準偏差を求める",
        prompt: "`statistics` モジュールから `stdev` をインポートし、`scores` の標準偏差を `sd` に入れて、小数点以下2桁で表示してください。",
        starter: `scores = [72, 88, 91, 65, 79]

# ここでimportする

sd = 0  # ここを書き換える
print(f"標準偏差: {sd:.2f}")`,
        expected: "標準偏差: 10.70 前後の値が表示される",
        solution: `from statistics import stdev

scores = [72, 88, 91, 65, 79]

sd = stdev(scores)
print(f"標準偏差: {sd:.2f}")`,
      },
    },
    {
      id: "l0404",
      title: "datetimeとjson — 日付処理・JSONパース",
      goal: "datetimeで日付の作成・書式化・差分計算ができ、jsonでPython値とJSON文字列を相互変換できるようになる",
      bodyMd: `実務データには日付とJSONが頻出します。

\`datetime\` モジュールの \`date\`/\`datetime\` クラスで日付を扱い、\`.strftime("%Y-%m")\` のような書式指定で「年月だけ」のような文字列に変換できます（月次集計の第一歩）。2つの日付の引き算で \`timedelta\`（経過日数）が得られます。

\`json\` モジュールは、Python値とJSON文字列を相互変換します。
- \`json.dumps(python値)\` → JSON文字列
- \`json.loads(JSON文字列)\` → Python値（辞書・リストなど）

APIレスポンスやログファイルはJSON形式で来ることが多く、\`json.loads\` で辞書に変換してから中身を読みます。`,
      cells: [
        {
          label: "日付の作成・書式化・差分",
          code: `from datetime import date

order_date = date(2026, 3, 14)
today = date(2026, 8, 14)

print(order_date.strftime("%Y-%m"))  # 月次集計のキーによく使う
print((today - order_date).days, "日経過")`,
        },
        {
          label: "JSON文字列とPython値の相互変換",
          code: `import json

raw = '{"order_id": 1001, "amount": 4800, "items": ["coffee", "tea"]}'
data = json.loads(raw)
print(data["amount"], type(data))

back_to_json = json.dumps({"status": "ok", "count": 3})
print(back_to_json, type(back_to_json))`,
        },
      ],
      sqlBridge: "`strftime(\"%Y-%m\")` はSQLの `DATE_TRUNC('month', 日付)` や `FORMAT(日付, 'yyyy-MM')` に相当する、月次集計キーの作り方です。",
      exercise: {
        title: "JSONログから月別キーを作る",
        prompt: "`raw` はJSON文字列です。`json.loads` でパースし、`\"date\"`キー（`\"2026-05-20\"`形式）を `date.fromisoformat()` で日付に変換して、`\"%Y-%m\"` 形式の月キーを `month_key` に入れてください。",
        starter: `import json
from datetime import date

raw = '{"date": "2026-05-20", "amount": 3200}'

month_key = ""  # ここを書き換える
print(month_key)`,
        expected: "2026-05",
        solution: `import json
from datetime import date

raw = '{"date": "2026-05-20", "amount": 3200}'

data = json.loads(raw)
d = date.fromisoformat(data["date"])
month_key = d.strftime("%Y-%m")
print(month_key)`,
      },
    },
  ],
};
