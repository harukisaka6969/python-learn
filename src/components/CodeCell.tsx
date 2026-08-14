import { useCallback, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { indentWithTab } from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import type { CodeCell as CodeCellData } from "../content/types";
import type { RunResult } from "../pyodide/PyodideProvider";
import { usePyodide } from "../pyodide/usePyodide";
import OutputPane from "./OutputPane";

/** ★中核コンポーネント：Pythonエディタ＋実行＋出力。カーネルは全セッションで単一共有のため、
 * 前のセルで定義した変数（例: df）をこのセルでも参照できる。 */
export default function CodeCell({ cell, cellIndex }: { cell: CodeCellData; cellIndex: number }) {
  const { status, runCell } = usePyodide();
  const [code, setCode] = useState(cell.code);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);

  const doRun = useCallback(() => {
    if (running || status !== "ready") return;
    setRunning(true);
    runCell(code, cell.usesPandas).then((r) => {
      setResult(r);
      setRunning(false);
    });
  }, [running, status, runCell, code, cell.usesPandas]);

  const reset = () => {
    setCode(cell.code);
    setResult(null);
  };

  const extensions = [
    python(),
    indentUnit.of("    "),
    Prec.highest(
      keymap.of([
        {
          key: "Mod-Enter",
          run: () => {
            doRun();
            return true;
          },
        },
        indentWithTab,
      ])
    ),
  ];

  return (
    <div className="code-cell">
      {cell.label && <div className="code-cell__label">{cell.label}</div>}
      <div className="code-cell__editor">
        <CodeMirror
          value={code}
          height="auto"
          basicSetup={{ lineNumbers: true, foldGutter: false }}
          extensions={extensions}
          onChange={(v) => setCode(v)}
          aria-label={`コードセル ${cellIndex + 1}`}
        />
      </div>
      <div className="code-cell__toolbar">
        <button className="btn btn--primary" onClick={doRun} disabled={running || status !== "ready"}>
          {running ? "実行中…" : "▶ 実行"}
        </button>
        <button className="btn btn--ghost" onClick={reset} disabled={running}>
          初期化
        </button>
        <span className="code-cell__hint">⌘/Ctrl + Enter で実行</span>
      </div>
      <OutputPane result={result} />
    </div>
  );
}
