import { cleanError } from "../utils/cleanError";

/** Pythonの生トレースバックから最終行と日本語ヒントを抽出して表示する。 */
export default function ErrorHint({ raw }: { raw: string }) {
  const { lastLine, hint } = cleanError(raw);
  return (
    <div className="error-hint" role="alert">
      <div className="output-line--err">
        <strong>{lastLine}</strong>
      </div>
      <div>💡 {hint}</div>
    </div>
  );
}
