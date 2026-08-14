import type { Chapter } from "./types";

export const ch01: Chapter = {
  id: "ch01",
  no: 1,
  title: "基礎文法",
  tag: "基礎",
  summary: "print・変数・型・文字列整形・数値演算という、以降すべての土台になる最小限の語彙を身につけます。",
  checklist: [
    "print()で画面に出力できる",
    "変数に値を入れて、型（int/float/str/bool）を意識できる",
    "f-stringで数値を整形して文字列に埋め込める",
    "整数除算・剰余・round()の挙動を説明できる",
    "Noneと比較演算子・真偽値の関係を理解している",
  ],
  lessons: [
    {
      id: "l0101",
      title: "最初の一行 — printと式",
      goal: "画面に文字を表示し、Pythonが「式」を評価するとはどういうことかを体感する",
      bodyMd: `画面に何かを表示するには \`print()\` 関数を使います。SQLでいう \`SELECT 'Hello'\` のように、まずは動かして結果を目で見るところから始めましょう。

このノートでは、セルの**最後の行が式（値を返すもの）**の場合、\`print()\` を書かなくても自動で結果が表示されます（Jupyter Notebookと同じ挙動です）。これは「実験ノート」として気軽に値を覗けるようにするための仕組みです。

> NOTE: 逆に、最後の行が \`print(...)\` や代入文（\`x = 1\` のように「=」で終わる行）の場合は、その行自体は値を返さないので自動表示はされません。`,
      cells: [
        { label: "print()で表示する", code: `print("Hello, pandas!")` },
        { label: "式は自動で表示される（printなしでもOK）", code: `1 + 1` },
      ],
      exercise: {
        title: "自己紹介を表示する",
        prompt: "`print()` を使って、あなたの名前を含む1行のメッセージを表示してください（例: `\"データエンジニアのハルキです\"`）。",
        starter: `print("ここを書き換えてください")`,
        expected: "print()で1行のメッセージが出力される",
        solution: `print("データエンジニアのハルキです")`,
      },
    },
    {
      id: "l0102",
      title: "変数とデータ型",
      goal: "変数に値を入れて、int・float・str・boolという基本の型を`type()`で確認できるようになる",
      bodyMd: `変数は \`変数名 = 値\` の形で作ります。SQLの列と違い、Pythonの変数は**どんな型の値でも自由に入れ替えられます**（再代入のたびに型が変わってもエラーにはなりません）。

代表的な基本型は次の4つです。

- \`int\` — 整数（例: \`42\`）
- \`float\` — 小数（例: \`3.14\`）
- \`str\` — 文字列（例: \`"tokyo"\`）
- \`bool\` — 真偽値（\`True\` / \`False\`）

今その値が何型なのかは \`type()\` で確認できます。データ処理の実務では「思っていた型と違う」がバグの大半の原因になるので、迷ったら \`type()\` で確認する癖をつけましょう。`,
      cells: [
        { label: "変数を作って型を見る", code: `row_count = 128\nprice = 980.5\ncity = "Osaka"\nis_active = True\n\nprint(row_count, type(row_count))\nprint(price, type(price))\nprint(city, type(city))\nprint(is_active, type(is_active))` },
      ],
      sqlBridge: "SQLの `INTEGER` / `NUMERIC` / `VARCHAR` / `BOOLEAN` が、それぞれ `int` / `float` / `str` / `bool` にだいたい対応します。ただしPythonは列の型を事前に宣言しません（実行時に決まる動的型付け）。",
      exercise: {
        title: "4つの変数を作る",
        prompt: "`order_id`（int）、`unit_price`（float）、`product_name`（str）、`in_stock`（bool）という4つの変数を作り、それぞれ `print(変数, type(変数))` で確認してください。",
        starter: `order_id = 1001
unit_price = 0.0  # ここを書き換える
product_name = ""  # ここを書き換える
in_stock = False  # ここを書き換える

print(order_id, type(order_id))
print(unit_price, type(unit_price))
print(product_name, type(product_name))
print(in_stock, type(in_stock))`,
        expected: "4行、それぞれ値とint/float/str/boolが表示される",
        solution: `order_id = 1001
unit_price = 480.0
product_name = "コーヒー豆"
in_stock = True

print(order_id, type(order_id))
print(unit_price, type(unit_price))
print(product_name, type(product_name))
print(in_stock, type(in_stock))`,
      },
    },
    {
      id: "l0103",
      title: "文字列を組み立てる — f-stringと整形",
      goal: "f-stringを使って変数を文字列に埋め込み、数値の桁区切り・小数桁・パーセント表示を整形できるようになる",
      bodyMd: `文字列の前に \`f\` を付けると、\`{変数}\` の形でその中に値を埋め込めます（f-string）。レポートやログメッセージを組み立てるときの基本です。

さらに \`{}\` の中で \`:\` の後に書式を指定すると、数値の見た目を整えられます。実務でよく使うのはこの3つです。

- \`{value:,}\` — 3桁区切りのカンマを入れる（例: \`1234567\` → \`1,234,567\`）
- \`{value:.2f}\` — 小数点以下2桁に丸める（例: \`3.14159\` → \`3.14\`）
- \`{value:.1%}\` — 割合を%表示にする（例: \`0.256\` → \`25.6%\`）`,
      cells: [
        {
          label: "f-stringで埋め込み・整形する",
          code: `sales = 1234567
avg_price = 480.456
growth_rate = 0.0823

print(f"今月の売上は {sales:,} 円")
print(f"平均単価は {avg_price:.2f} 円")
print(f"前月比 {growth_rate:.1%}")`,
        },
      ],
      exercise: {
        title: "月次レポートの1行を作る",
        prompt: "店舗名 `store = \"梅田店\"`、売上 `sales = 3456789`、成長率 `growth = -0.034` を使って、`「梅田店の売上は 3,456,789 円（前月比 -3.4%）」`のような1行のレポート文をf-stringで作り、`print()`してください。",
        starter: `store = "梅田店"
sales = 3456789
growth = -0.034

print("ここを書き換えてください")`,
        expected: "店舗名・カンマ区切りの売上・%表示の成長率を含む1行が表示される",
        solution: `store = "梅田店"
sales = 3456789
growth = -0.034

print(f"{store}の売上は {sales:,} 円（前月比 {growth:.1%}）")`,
      },
    },
    {
      id: "l0104",
      title: "数値演算と丸め",
      goal: "整数除算・剰余・round()の挙動を理解し、浮動小数点数の誤差という「罠」を知る",
      bodyMd: `Pythonの主な数値演算子です。

- \`+\` \`-\` \`*\` \`/\` — 四則演算（\`/\` は常にfloatを返します）
- \`//\` — **整数除算**（商の小数点以下を切り捨てる。例: \`7 // 2\` → \`3\`）
- \`%\` — **剰余**（余りを求める。例: \`7 % 2\` → \`1\`）
- \`round(x, n)\` — 小数第n位に丸める

\`//\` と \`%\` は「レコード数をページ単位に分割する」「N件ごとにグループ分けする」といった実務で頻出します。

> WARN: 浮動小数点数（float）は2進数で表現される都合上、\`0.1 + 0.2\` が \`0.3\` ちょうどにならない、という誤差が起こります。金額計算など厳密さが必要な場面では、丸め誤差が起こり得ることを常に意識してください（本格的な会計処理では \`Decimal\` 型を使いますが、この講座では扱いません）。`,
      cells: [
        { label: "整数除算と剰余", code: `total_rows = 1000
page_size = 30

full_pages = total_rows // page_size\nremainder = total_rows % page_size\nprint(f"満杯のページ数: {full_pages}、余り: {remainder}件")` },
        { label: "浮動小数点の誤差を見てみる", code: `print(0.1 + 0.2)\nprint(round(0.1 + 0.2, 2))` },
      ],
      exercise: {
        title: "在庫をケース単位で数える",
        prompt: "在庫数 `stock = 275` 個を、1ケース `case_size = 24` 個としてケース詰めします。「何ケース作れるか」と「端数が何個余るか」を計算し、f-stringで `「275個は24個入りで11ケース、端数7個」`のように表示してください。",
        starter: `stock = 275
case_size = 24

cases = 0  # ここを書き換える
leftover = 0  # ここを書き換える
print(f"{stock}個は{case_size}個入りで{cases}ケース、端数{leftover}個")`,
        expected: "11ケース、端数7個 と表示される",
        solution: `stock = 275
case_size = 24

cases = stock // case_size
leftover = stock % case_size
print(f"{stock}個は{case_size}個入りで{cases}ケース、端数{leftover}個")`,
      },
    },
    {
      id: "l0105",
      title: "Noneと真偽値、比較演算子",
      goal: "None（値が無いこと）と比較演算子の関係、Pythonにおける「真偽として扱われる値」を理解する",
      bodyMd: `\`None\` は「値が存在しない」ことを表す特別な値です。SQLの \`NULL\` に近い概念ですが、Pythonでは \`None\` かどうかを調べるときは \`==\` ではなく \`is None\` を使うのが慣習です（理由はこの講座の範囲を超えるので、まずは「\`is None\` を使う」とだけ覚えてください）。

比較演算子は \`==\`（等しい）、\`!=\`（等しくない）、\`<\` \`>\` \`<=\` \`>=\` があり、結果は必ず \`bool\`（\`True\`/\`False\`）になります。

> NOTE: \`if\` 文などの条件として値を直接書くと、\`0\`・\`0.0\`・\`""\`（空文字列）・\`None\`・空のリストなどは \`False\` 扱いになり、それ以外は \`True\` 扱いになります。これを「truthy / falsy」と呼びます。次章の条件分岐で活用します。`,
      cells: [
        { label: "Noneと比較", code: `price = None
print(price is None)
print(price == 5)  # Noneと数値の比較はエラーにならずFalseになる` },
        { label: "truthy / falsy を覗く", code: `values = [0, 1, "", "a", None, [], [1, 2]]
for v in values:
    print(v, "->", bool(v))` },
      ],
      sqlBridge: "SQLの `IS NULL` / `IS NOT NULL` が、Pythonの `is None` / `is not None` に対応します。SQLでは `NULL = NULL` は`NULL`（未知）になりますが、Pythonの `None == None` は素直に`True`です。この違いは頭の片隅に置いておいてください。",
      exercise: {
        title: "欠損値っぽい入力をふるいにかける",
        prompt: "変数 `customer_email` に `None` が入っている場合と、実際のメールアドレス文字列が入っている場合を想定します。`is None` を使って「メールアドレスが登録されているか」を `bool` として `has_email` に入れ、表示してください。",
        starter: `customer_email = None  # ここをNoneや文字列に変えて試してみてください

has_email = False  # ここを書き換える
print(f"メールアドレス登録済み: {has_email}")`,
        expected: "Noneのときは False、文字列のときは True",
        solution: `customer_email = None

has_email = customer_email is not None
print(f"メールアドレス登録済み: {has_email}")`,
      },
    },
  ],
};
