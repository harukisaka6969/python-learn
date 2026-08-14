import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type KernelStatus = "booting" | "ready" | "error";

export interface RunResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  /** 最後の式の戻り値のrepr。DataFrame/Seriesの場合はnull（htmlを使う）。 */
  value: string | null;
  /** 最後の式の戻り値がDataFrame/Seriesだった場合の to_html() 出力。 */
  html: string | null;
  /** 実行中に例外が発生した場合の生トレースバック文字列。 */
  error: string | null;
}

export interface PyodideContextValue {
  status: KernelStatus;
  errorMessage: string | null;
  /** コードを実行する。usesPandasがtrue、またはコード中にpandasの使用が見えたら初回のみ自動でpandasを読み込む。 */
  runCell: (code: string, usesPandas?: boolean) => Promise<RunResult>;
}

export const PyodideContext = createContext<PyodideContextValue | null>(null);

// Pyodideの型はCDN経由で読み込むため、このアプリで使う範囲だけ最小限に定義する。
interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { set: (name: string, value: unknown) => void };
  loadPackage: (pkg: string | string[]) => Promise<void>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

declare global {
  interface Window {
    loadPyodide?: (opts?: Record<string, unknown>) => Promise<PyodideInterface>;
  }
}

/** 全セッションで単一のPythonカーネルを共有する（前のセルで定義した変数を次のセルで使えるようにするため）。
 * ユーザーの入力コードをそのまま評価するのではなく、__run_cell を通すことで、
 * 「最後の式の戻り値がDataFrame/Seriesなら to_html() で返す」という分類をPython側で一度に行う
 * （JS↔Python間で複雑なオブジェクトをやり取りしなくて済むように、戻り値はJSON文字列に統一する）。 */
const BOOT_SCRIPT = `
import ast, json

def __to_html_if_frame(value):
    try:
        import pandas as pd
    except ImportError:
        return None
    if isinstance(value, (pd.DataFrame, pd.Series)):
        return value.to_html()
    return None

def __run_cell(src):
    tree = ast.parse(src, mode="exec")
    value = None
    if tree.body and isinstance(tree.body[-1], ast.Expr):
        last = tree.body.pop()
        exec(compile(tree, "<cell>", "exec"), globals())
        value = eval(compile(ast.Expression(last.value), "<cell>", "eval"), globals())
    else:
        exec(compile(tree, "<cell>", "exec"), globals())
    html = __to_html_if_frame(value) if value is not None else None
    value_repr = None
    if value is not None and html is None:
        try:
            value_repr = repr(value)
        except Exception:
            value_repr = "<repr failed>"
    return json.dumps({"value": value_repr, "html": html})
`.trim();

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";

export function PyodideProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<KernelStatus>("booting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const pandasLoadedRef = useRef(false);
  const outBufRef = useRef<string[]>([]);
  const errBufRef = useRef<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (typeof window.loadPyodide !== "function") {
          throw new Error(
            "Pyodideの読み込みスクリプトが見つかりません。cdn.jsdelivr.net がネットワークでブロックされていないか確認してください。"
          );
        }
        const pyodide = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
        pyodide.setStdout({ batched: (s) => outBufRef.current.push(s) });
        pyodide.setStderr({ batched: (s) => errBufRef.current.push(s) });
        await pyodide.runPythonAsync(BOOT_SCRIPT);
        if (cancelled) return;
        pyodideRef.current = pyodide;
        setStatus("ready");
      } catch (e) {
        if (cancelled) return;
        setErrorMessage(e instanceof Error ? e.message : String(e));
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runCell = useMemo(
    () =>
      async (code: string, usesPandas?: boolean): Promise<RunResult> => {
        const pyodide = pyodideRef.current;
        if (!pyodide) {
          return { ok: false, stdout: "", stderr: "", value: null, html: null, error: "カーネルがまだ準備できていません。少し待ってから実行してください。" };
        }
        if ((usesPandas || /\bimport pandas\b|\bpd\./.test(code)) && !pandasLoadedRef.current) {
          await pyodide.loadPackage("pandas");
          pandasLoadedRef.current = true;
        }
        outBufRef.current = [];
        errBufRef.current = [];
        try {
          pyodide.globals.set("__cell_src", code);
          const raw = await pyodide.runPythonAsync("__run_cell(__cell_src)");
          const parsed = JSON.parse(String(raw)) as { value: string | null; html: string | null };
          return {
            ok: true,
            stdout: outBufRef.current.join(""),
            stderr: errBufRef.current.join(""),
            value: parsed.value,
            html: parsed.html,
            error: null,
          };
        } catch (e) {
          return {
            ok: false,
            stdout: outBufRef.current.join(""),
            stderr: errBufRef.current.join(""),
            value: null,
            html: null,
            error: e instanceof Error ? e.message : String(e),
          };
        }
      },
    []
  );

  const value = useMemo<PyodideContextValue>(() => ({ status, errorMessage, runCell }), [status, errorMessage, runCell]);

  return <PyodideContext.Provider value={value}>{children}</PyodideContext.Provider>;
}
