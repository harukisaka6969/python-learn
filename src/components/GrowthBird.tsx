import { useEffect, useRef, useState } from "react";
import { useProgress } from "../progress/ProgressProvider";
import { overallStats } from "../progress/stats";
import { birdStageFor } from "../progress/birdStages";

const CELEBRATE_MS = 2200;

/**
 * 右下固定の鳥マスコット。全体の完了レッスン数に応じて成長し、
 * レッスンを完了するたび（完了数が増えるたび）に一瞬お祝いする。
 * プロフィール切り替えによる完了数の変化はお祝い対象にしない。
 */
export default function GrowthBird() {
  const { isDone, profile } = useProgress();
  const { done, total, pct } = overallStats(isDone);
  const stage = birdStageFor(pct);

  const [celebrating, setCelebrating] = useState(false);
  const prevDoneRef = useRef(done);
  const prevProfileRef = useRef(profile);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const profileChanged = prevProfileRef.current !== profile;
    const increased = !profileChanged && done > prevDoneRef.current;
    prevDoneRef.current = done;
    prevProfileRef.current = profile;

    if (increased) {
      setCelebrating(true);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCelebrating(false), CELEBRATE_MS);
    }
  }, [done, profile]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  return (
    <div className={"growth-bird" + (celebrating ? " growth-bird--celebrate" : "")}>
      {celebrating && (
        <span className="growth-bird__burst" aria-hidden="true">
          ✨🎉✨
        </span>
      )}
      <span className="growth-bird__emoji" aria-hidden="true">
        {stage.emoji}
      </span>
      <span className="growth-bird__meta">
        <span className="growth-bird__label">{stage.label}</span>
        <span className="growth-bird__count">
          {done}/{total}
        </span>
      </span>
      {celebrating && (
        <span className="growth-bird__toast" role="status">
          よくできました！
        </span>
      )}
    </div>
  );
}
