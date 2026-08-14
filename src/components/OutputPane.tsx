import type { RunResult } from "../pyodide/PyodideProvider";
import ErrorHint from "./ErrorHint";

/** stdout/stderr/戻り値/DataFrameを種別ごとに色分けして表示する。空出力時はヒントを出す。 */
export default function OutputPane({ result }: { result: RunResult | null }) {
  if (!result) {
    return <div className="output-pane output-pane__empty">(まだ実行されていません — 「実行」を押してみてください)</div>;
  }

  const hasAnything = result.stdout || result.stderr || result.value || result.html || result.error;

  return (
    <div className="output-pane">
      {result.stdout && <div className="output-line--out">{result.stdout.replace(/\n$/, "")}</div>}
      {result.stderr && <div className="output-line--err">{result.stderr.replace(/\n$/, "")}</div>}
      {result.value && <div className="output-line--value">{result.value}</div>}
      {result.html && <div className="output-pane__table" dangerouslySetInnerHTML={{ __html: result.html }} />}
      {result.error && <ErrorHint raw={result.error} />}
      {!hasAnything && <div className="output-pane__empty">(出力なし — printで結果を表示してみて)</div>}
    </div>
  );
}
