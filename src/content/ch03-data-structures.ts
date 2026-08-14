import type { Chapter } from "./types";

export const ch03: Chapter = {
  id: "ch03",
  no: 3,
  title: "データ構造",
  tag: "構造",
  summary: "リスト・辞書・タプル・setという、Pythonでデータを溜め込み・整理するための入れ物を使い分けられるようになります。",
  checklist: [
    "リストの生成・スライス・append/sortができる",
    "リスト内包表記でSELECT+WHERE的な変換ができる",
    "辞書でキーから値を引き、get()で安全にアクセスできる",
    "辞書内包表記とネストした構造（JSON的なデータ）を扱える",
    "タプルとsetの用途、set()による重複除去ができる",
  ],
  lessons: [
    {
      id: "l0301",
      title: "リスト — 生成・スライス・append/sort",
      goal: "リストを作り、要素の追加・並べ替え・部分的な取り出し（スライス）ができるようになる",
      bodyMd: `リスト \`[]\` は、順序付きで中身を変更できる（ミュータブルな）データの並びです。SQLのテーブルの「1列」や「1つのクエリ結果」に近いイメージです。

- \`xs.append(v)\` — 末尾に追加
- \`xs.sort()\` — その場で並べ替え（\`reverse=True\`で降順）。元を変えたくない場合は \`sorted(xs)\`
- \`xs[start:end]\` — スライス。\`start\`以上\`end\`未満を取り出す（\`xs[:3]\`は先頭3件、\`xs[-2:]\`は末尾2件）`,
      cells: [
        {
          label: "作る・足す・並べ替える",
          code: `sales = [820, 950, 710, 1200]
sales.append(430)
sales.sort(reverse=True)

print(sales)
print("上位3件:", sales[:3])`,
        },
      ],
      exercise: {
        title: "売上上位2件の合計",
        prompt: "`sales` を大きい順に並べ替え、上位2件の合計を `top2_total` に入れて表示してください（元のリストは並べ替えて構いません）。",
        starter: `sales = [340, 980, 560, 1200, 75]

top2_total = 0  # ここを書き換える
print(f"上位2件の合計: {top2_total}")`,
        expected: "上位2件の合計: 2180",
        solution: `sales = [340, 980, 560, 1200, 75]
sales.sort(reverse=True)

top2_total = sum(sales[:2])
print(f"上位2件の合計: {top2_total}")`,
      },
    },
    {
      id: "l0302",
      title: "リスト内包表記",
      goal: "`[式 for 変数 in リスト if 条件]` の形でリストを一行で変換・絞り込みできるようになる",
      bodyMd: `リスト内包表記は「forループで新しいリストを作る」処理を1行で書く構文です。基本形は \`[式 for 変数 in 元のリスト if 条件]\` のように、角カッコの中に「何を作るか（式）」「どこから（元のリスト）」「絞り込み条件（if、省略可）」を並べます。

これはSQLの \`SELECT 式 FROM 元のリスト WHERE 条件\` にとても近い発想です。実務でも「forループを書いてから内包表記に直す」流れで慣れると読みやすくなります。`,
      cells: [
        {
          label: "SELECTとWHEREに相当する変換",
          code: `prices = [480, 1200, 320, 980, 150]

# WHERE price >= 500 に相当
expensive = [p for p in prices if p >= 500]
print(expensive)

# SELECT price * 1.1（税込み化）に相当
with_tax = [round(p * 1.1) for p in prices]
print(with_tax)`,
        },
      ],
      sqlBridge: "`[式 for x in xs if 条件]` は `SELECT 式 FROM xs WHERE 条件` に対応します。forループより短く書けますが、複雑になりすぎたら通常のforループに戻すほうが読みやすいこともあります。",
      exercise: {
        title: "在庫切れ間近の商品名だけ抽出する",
        prompt: "`items`（辞書のリスト、各要素は`name`と`stock`キーを持つ）から、`stock`が10未満の商品名だけを内包表記で `low_stock_names` に集めてください。",
        starter: `items = [
    {"name": "コーヒー豆", "stock": 25},
    {"name": "紅茶", "stock": 5},
    {"name": "抹茶", "stock": 3},
    {"name": "ほうじ茶", "stock": 40},
]

low_stock_names = []  # ここを書き換える（内包表記で）
print(low_stock_names)`,
        expected: "['紅茶', '抹茶']",
        solution: `items = [
    {"name": "コーヒー豆", "stock": 25},
    {"name": "紅茶", "stock": 5},
    {"name": "抹茶", "stock": 3},
    {"name": "ほうじ茶", "stock": 40},
]

low_stock_names = [item["name"] for item in items if item["stock"] < 10]
print(low_stock_names)`,
      },
    },
    {
      id: "l0303",
      title: "辞書 — キーで引く、get()、レコード表現",
      goal: "辞書の作成とキーアクセス、get()による安全な取り出し、1レコードとしての辞書の使い方を理解する",
      bodyMd: `辞書 \`{}\` はキーと値のペアの集まりです。**テーブルの1行（1レコード）**をイメージするとつかみやすく、実務データはよく「辞書のリスト」（＝行の集まり）として表現されます。

- \`d["key"]\` — キーで値を取得。**キーが無いと\`KeyError\`で例外になる**
- \`d.get("key", 既定値)\` — キーが無ければ例外にならず既定値を返す（安全）
- \`d["key"] = 値\` — 追加・更新
- \`"key" in d\` — キーの存在確認`,
      cells: [
        {
          label: "1レコードとしての辞書",
          code: `order = {"order_id": 1001, "customer": "田中", "amount": 4800}

print(order["customer"])
print(order.get("discount", 0))  # 無いキーはgetで安全に既定値0を返す
order["status"] = "shipped"
print(order)`,
        },
      ],
      sqlBridge: "1つの辞書がテーブルの1行、キーが列名に対応します。`d.get(key, default)` はSQLの `COALESCE(列, 既定値)` に近い安全策です。",
      exercise: {
        title: "存在しないかもしれない列を安全に読む",
        prompt: "`record` に `\"email\"` キーがあるかどうか分からない前提で、`get()` を使って `email` を取り出し、無ければ `\"未登録\"` を使ってください。",
        starter: `record = {"name": "佐藤", "age": 34}

email = None  # ここを書き換える
print(f"{record['name']}さんのメール: {email}")`,
        expected: "佐藤さんのメール: 未登録",
        solution: `record = {"name": "佐藤", "age": 34}

email = record.get("email", "未登録")
print(f"{record['name']}さんのメール: {email}")`,
      },
    },
    {
      id: "l0304",
      title: "辞書内包表記とネスト",
      goal: "辞書内包表記でキー・値のペアを一括生成でき、辞書の中に辞書やリストが入るネスト構造（JSON的なデータ）を読めるようになる",
      bodyMd: `辞書にもリストと同じように内包表記があります。基本形は \`{キー式: 値式 for 変数 in 元のリスト}\` で、波カッコの中に「キー」と「値」をコロンで並べて書きます。

実務データ、特にAPIのレスポンスは「辞書の中にリスト、リストの中に辞書」という**ネスト構造**になっていることがほとんどです（JSON形式そのもの）。ネストは \`data["orders"][0]["amount"]\` のように、キーと添字を連ねて奥まで辿ります。`,
      cells: [
        {
          label: "辞書内包表記で商品名→価格の対応表を作る",
          code: `items = [("コーヒー豆", 480), ("紅茶", 320), ("抹茶", 980)]

price_map = {name: price for name, price in items}
print(price_map)
print(price_map["紅茶"])`,
        },
        {
          label: "ネストしたJSON的データを辿る",
          code: `shop = {
    "name": "梅田店",
    "orders": [
        {"id": 1, "amount": 4800},
        {"id": 2, "amount": 2100},
    ],
}

print(shop["name"])
print(shop["orders"][0]["amount"])
total = sum(o["amount"] for o in shop["orders"])
print("店舗合計:", total)`,
        },
      ],
      exercise: {
        title: "商品コード→在庫数の辞書を作る",
        prompt: "`records`（`code`と`stock`を持つ辞書のリスト）から、辞書内包表記で `code` をキー、`stock` を値とする `stock_map` を作ってください。",
        starter: `records = [
    {"code": "A001", "stock": 12},
    {"code": "A002", "stock": 0},
    {"code": "A003", "stock": 45},
]

stock_map = {}  # ここを書き換える（辞書内包表記で）
print(stock_map)`,
        expected: "{'A001': 12, 'A002': 0, 'A003': 45}",
        solution: `records = [
    {"code": "A001", "stock": 12},
    {"code": "A002", "stock": 0},
    {"code": "A003", "stock": 45},
]

stock_map = {r["code"]: r["stock"] for r in records}
print(stock_map)`,
      },
    },
    {
      id: "l0305",
      title: "タプルとset — 変更不可の組と重複除去",
      goal: "タプル（変更不可の組）とset（重複のない集合）の性質を理解し、set()による重複除去や集合演算ができる",
      bodyMd: `- **タプル** \`()\` — リストに似ていますが**作った後に中身を変更できません**（イミュータブル）。「緯度・経度の組」のような、意味的にひとまとまりで変わってほしくないデータに向きます。
- **set** \`{}\` — 順序を持たず、**重複を許さない**集合です。「一意な値の一覧」を作りたいときに最適で、\`set(xs)\` に渡すだけでリストの重複を除去できます。

setは \`&\`（積集合＝両方に共通）、\`|\`（和集合＝どちらかにある）、\`-\`（差集合＝片方だけ）も使え、SQLの \`INTERSECT\` / \`UNION\` / \`EXCEPT\` に対応します。`,
      cells: [
        {
          label: "タプルは変更不可",
          code: `location = (34.7024, 135.4959)  # (緯度, 経度)
lat, lon = location  # アンパック
print(f"緯度: {lat}, 経度: {lon}")`,
        },
        {
          label: "setで重複除去と集合演算",
          code: `visited_yesterday = {"梅田店", "難波店", "天王寺店"}
visited_today = {"難波店", "京橋店"}

print("両日訪問:", visited_yesterday & visited_today)
print("延べ訪問店舗:", visited_yesterday | visited_today)
print("昨日だけ:", visited_yesterday - visited_today)`,
        },
      ],
      sqlBridge: "set同士の `&` `|` `-` は、それぞれSQLの `INTERSECT` / `UNION` / `EXCEPT` に対応します。`set(xs)` はSQLの `SELECT DISTINCT` に近い操作です。",
      exercise: {
        title: "重複した顧客IDを一意化する",
        prompt: "`customer_ids`（重複あり）から重複を除いた一意な顧客数を `unique_count` に入れてください。",
        starter: `customer_ids = [101, 102, 101, 103, 102, 104, 101]

unique_count = 0  # ここを書き換える
print(f"一意な顧客数: {unique_count}")`,
        expected: "一意な顧客数: 4",
        solution: `customer_ids = [101, 102, 101, 103, 102, 104, 101]

unique_count = len(set(customer_ids))
print(f"一意な顧客数: {unique_count}")`,
      },
    },
  ],
};
