# データエンジニアのためのPython実験ノート

ブラウザ内でPyodideを使い、環境構築なしで本物のPythonを実行しながら学ぶ、データエンジニア向けの対話型Python学習サイトです。全8章・約30レッスン（基礎文法→制御構文→データ構造→関数→pandas入門→pandasデータ整形→実務ワークフロー→総合演習）。

## セットアップ

```bash
npm install
npm run dev       # 開発サーバー
npm run build     # 本番ビルド（tsc -b && vite build）
npm run test      # Vitestでユニットテストを実行
npm run lint      # oxlintで静的解析
npm run preview   # ビルド成果物をローカルでプレビュー
```

Node 18以上が必要です。Pyodide本体はnpm依存ではなく `index.html` のCDN `<script>` タグ（`cdn.jsdelivr.net`）から読み込みます。初回起動はPyodide本体＋pandasの読み込みで10〜20秒ほどかかります。

## 技術スタック

Vite + React 19 + TypeScript / react-router-dom v6 / Pyodide v0.26.2（CDN） / CodeMirror 6 / React Context（Redux不使用） / プレーンCSS（Tailwind不使用） / 進捗はlocalStorageのみ（バックエンド・認証なし） / Vitest + React Testing Library。

## 既知の制約

- ファイルI/O・`input()` は使用不可（ブラウザ制約）。CSVは `io.StringIO` ＋コード内文字列で扱う。
- 進捗保存はデバイスローカルのみ（同期なし）。
- 初回起動が重い（Pyodide+pandasで10〜20秒）。
