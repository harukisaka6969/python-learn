import { useState } from "react";
import type { Exercise as ExerciseData } from "../content/types";
import { renderBody } from "../utils/renderBody";
import CodeCell from "./CodeCell";

/** 課題ブロック：課題文＋雛形コード（実行可）＋完了トグル＋模範解答（初期は隠し）。 */
export default function Exercise({
  exercise,
  done,
  onToggleDone,
}: {
  exercise: ExerciseData;
  done: boolean;
  onToggleDone: () => void;
}) {
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="exercise">
      <h3 className="exercise__title">✏️ 課題: {exercise.title}</h3>
      <div>{renderBody(exercise.prompt)}</div>
      <CodeCell cell={{ code: exercise.starter, label: "ここに書いて実行してみてください" }} cellIndex={0} />
      {exercise.expected && <p className="exercise__expected">期待される結果: {exercise.expected}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
        <button className="btn btn--ghost" onClick={() => setShowSolution((v) => !v)}>
          {showSolution ? "解答を隠す" : "解答を見る"}
        </button>
        <button className="btn btn--primary" onClick={onToggleDone} aria-pressed={done}>
          {done ? "✓ このレッスンを完了にした" : "このレッスンを完了にする"}
        </button>
      </div>
      {showSolution && (
        <div className="exercise__solution">
          <pre>{exercise.solution}</pre>
        </div>
      )}
    </div>
  );
}
