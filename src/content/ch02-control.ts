import type { Chapter } from "./types";

export const ch02: Chapter = {
  id: "ch02",
  no: 2,
  title: "制御構文",
  tag: "制御",
  summary: "条件分岐・繰り返し・例外処理という、データを1行ずつ判定・加工していくための基本操作を身につけます。",
  checklist: [
    "if/elif/elseで条件分岐を書ける（インデントのルールを理解している）",
    "forループでリストの各要素を処理し、enumerate/累積集計ができる",
    "whileとbreak/continueで、無限ループを避けつつ条件付き繰り返しが書ける",
    "try/exceptで、壊れたデータ行があっても処理全体を止めずにスキップできる",
  ],
  lessons: [
    {
      id: "l0201",
      title: "条件分岐 — if / elif / else",
      goal: "if/elif/elseで条件に応じて処理を分岐でき、Pythonのインデントによるブロック表現を理解する",
      bodyMd: `Pythonには \`{}\` や \`BEGIN...END\` がありません。**インデント（字下げ）そのものがブロックの範囲**を表します。同じ深さのインデントは同じブロックとみなされ、崩れると \`IndentationError\` になります。

条件分岐の基本形は \`if 条件1:\` の次の行を1段インデントして処理を書き、必要なら \`elif 条件2:\`・\`else:\` を続けます（下のサンプルセルで実際の形を確認してください）。

\`elif\` はSQLの \`CASE WHEN ... WHEN ... ELSE ... END\` に近い発想で、上から順に条件を評価し、最初に \`True\` になったブロックだけが実行されます。

> NOTE: インデントは半角スペース4つに統一するのが慣習です（このノートのエディタも4スペースでTabが入ります）。タブとスペースを混在させると崩れやすいので避けましょう。`,
      cells: [
        {
          label: "在庫レベルを3段階に分類する",
          code: `stock = 12

if stock == 0:
    level = "欠品"
elif stock < 20:
    level = "少なめ"
else:
    level = "十分"

print(f"在庫 {stock} 個 → {level}")`,
        },
      ],
      sqlBridge: "SQLの `CASE WHEN stock = 0 THEN '欠品' WHEN stock < 20 THEN '少なめ' ELSE '十分' END` が、この`if/elif/else`にそのまま対応します。",
      exercise: {
        title: "売上を3段階のランクに分ける",
        prompt: "売上 `sales` が `100000` 以上なら `\"A\"`、`50000` 以上なら `\"B\"`、それ未満なら `\"C\"` を `rank` に入れ、表示してください。",
        starter: `sales = 72000

rank = ""  # ここを書き換える
print(f"売上 {sales} → ランク {rank}")`,
        expected: "売上72000のとき「ランク B」と表示される",
        solution: `sales = 72000

if sales >= 100000:
    rank = "A"
elif sales >= 50000:
    rank = "B"
else:
    rank = "C"

print(f"売上 {sales} → ランク {rank}")`,
      },
    },
    {
      id: "l0202",
      title: "forループ — 全行を処理する",
      goal: "forループでリストの各要素を1件ずつ処理し、enumerateとインデックス、累積集計の書き方を身につける",
      bodyMd: `\`for 変数 in イテラブル:\` は、リストなどの要素を先頭から1つずつ取り出して処理します。SQLに「行ごとのループ」という概念はありませんが、集計前の1件1件の下ごしらえをイメージすると分かりやすいです。

添字（何番目か）も同時に欲しいときは \`enumerate()\` を使います。既定では0始まりですが、\`enumerate(xs, start=1)\` のように開始番号を指定できます。

累積集計（合計・最大値など）は、ループの前に「初期値の変数」を用意し、ループの中で更新していくのが基本パターンです。`,
      cells: [
        { label: "リストを順に処理する", code: `orders = [1200, 4300, 800, 2600]

total = 0
for amount in orders:
    total += amount

print(f"合計: {total}円")` },
        {
          label: "enumerateで番号付きループ",
          code: `products = ["コーヒー豆", "紅茶", "抹茶"]

for i, name in enumerate(products, start=1):
    print(f"{i}. {name}")`,
        },
      ],
      exercise: {
        title: "最高売上の店舗を見つける",
        prompt: "`stores` と `sales` は同じ順番で対応しています。forループ（`enumerate`推奨）で最も売上が高い店舗名を `best_store` に、その売上を `best_sales` に入れてください。",
        starter: `stores = ["梅田店", "難波店", "天王寺店"]
sales = [820000, 950000, 710000]

best_store = ""
best_sales = 0
# ここにループを書く

print(f"最高売上店舗: {best_store}（{best_sales}円）")`,
        expected: "最高売上店舗: 難波店（950000円）",
        solution: `stores = ["梅田店", "難波店", "天王寺店"]
sales = [820000, 950000, 710000]

best_store = ""
best_sales = 0
for i, store in enumerate(stores):
    if sales[i] > best_sales:
        best_sales = sales[i]
        best_store = store

print(f"最高売上店舗: {best_store}（{best_sales}円）")`,
      },
    },
    {
      id: "l0203",
      title: "whileと break / continue",
      goal: "while文の条件付き繰り返しと、break（打ち切り）・continue（スキップ）を安全に使えるようになる",
      bodyMd: `\`while 条件:\` は、条件が \`True\` である限りブロックを繰り返します。**条件が永遠に \`True\` のままだと無限ループになる**ため、ループ内で条件に関わる変数を必ず更新することが重要です。

- \`break\` — ループを即座に抜ける
- \`continue\` — 今回の回だけスキップして次の繰り返しに進む

実務では「forでリストを回しつつ、特定条件でスキップ（continue）・特定条件で打ち切り（break）」という組み合わせが頻出します。`,
      cells: [
        { label: "whileで条件付き繰り返し", code: `remaining = 100
step = 0

while remaining > 0:
    remaining -= 35
    step += 1

print(f"{step}回で在庫がなくなった（残り{remaining}）")` },
        {
          label: "breakとcontinueの使い分け",
          code: `readings = [12, -1, 8, 15, -1, 3, 999]

for r in readings:
    if r == -1:
        continue  # 欠損値はスキップして次へ
    if r == 999:
        break  # 999はセンサー異常のサイン。ここで打ち切る
    print("正常値:", r)`,
        },
      ],
      exercise: {
        title: "しきい値を超えたら打ち切る累積",
        prompt: "`amounts` を先頭から順に足していき、累計が `limit`（3000）を**超える直前**で止めてください。止まった時点の `total` と、何件加算したか（`count`）を表示してください。",
        starter: `amounts = [800, 950, 700, 600, 1200]
limit = 3000

total = 0
count = 0
# ここにforとbreakを使ったループを書く

print(f"合計 {total}円（{count}件）")`,
        expected: "800+950+700=2450までは足せるが、+600で3050となりlimitを超えるため合計2450・3件で止まる",
        solution: `amounts = [800, 950, 700, 600, 1200]
limit = 3000

total = 0
count = 0
for a in amounts:
    if total + a > limit:
        break
    total += a
    count += 1

print(f"合計 {total}円（{count}件）")`,
      },
    },
    {
      id: "l0204",
      title: "例外処理 — try / except",
      goal: "try/exceptで想定外のエラーを捕まえ、壊れたデータ行があっても処理全体を止めずにスキップできるようになる",
      bodyMd: `実データには、数値のはずが文字列になっている・キーが無い、といった「壊れた行」がつきものです。何も対策しないとそこでプログラム全体が止まってしまいます。\`try/except\` で「エラーが起きても処理を継続する」書き方を覚えましょう。基本形は \`try:\` の中に危険な処理を書き、続けて \`except 例外の型 as e:\` の中にエラー時の処理を書きます（下のサンプルセルで実際の形を確認してください）。

代表的な例外は \`ValueError\`（型変換の失敗など）、\`KeyError\`（辞書に無いキー）、\`ZeroDivisionError\`（ゼロ除算）です。**例外の型を指定せず \`except:\` とだけ書くのは避けましょう**（本当に想定外のバグまで握りつぶしてしまうため）。`,
      cells: [
        {
          label: "壊れた行をスキップしながら合計する",
          code: `raw_values = ["120", "340", "N/A", "560", ""]

total = 0
skipped = 0
for v in raw_values:
    try:
        total += int(v)
    except ValueError:
        skipped += 1

print(f"合計: {total}（スキップ: {skipped}件）")`,
        },
      ],
      sqlBridge: "SQLでの `TRY_CAST` やETLツールの「エラー行を別テーブルに退避」に相当する考え方です。Pythonでは`try/except`で明示的にハンドリングします。",
      exercise: {
        title: "ゼロ除算を避けて平均を計算する",
        prompt: "`total` を `count` で割って平均を出しますが、`count` が `0` の場合は `ZeroDivisionError` になります。`try/except` を使い、その場合は `average` に `0` を入れてください。",
        starter: `total = 4500
count = 0

average = None  # ここを書き換える
print(f"平均: {average}")`,
        expected: "count=0のとき ZeroDivisionErrorを捕まえて 平均: 0 と表示される",
        solution: `total = 4500
count = 0

try:
    average = total / count
except ZeroDivisionError:
    average = 0

print(f"平均: {average}")`,
      },
    },
  ],
};
