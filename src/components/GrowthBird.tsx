import { useEffect, useRef, useState } from "react";
import { useProgress } from "../progress/ProgressProvider";
import { overallStats } from "../progress/stats";
import { birdStageFor, type BirdStage } from "../progress/birdStages";

const CELEBRATE_MS = 2200;
const BUBBLE_MS = 2200;

function randomLine(stage: BirdStage): string {
  return stage.lines[Math.floor(Math.random() * stage.lines.length)];
}

/**
 * 右下固定の鳥マスコット。全体の完了レッスン数に応じて成長し、
 * レッスンを完了するたび（完了数が増えるたび）に一瞬お祝いして、
 * その段階のセリフを💬で表示する。クリックするといつでもセリフを覗ける。
 * プロフィール切り替えによる完了数の変化はお祝い対象にしない。
 */
export default function GrowthBird() {
  const { isDone, profile } = useProgress();
  const { done, total, pct } = overallStats(isDone);
  const stage = birdStageFor(pct);

  const [celebrating, setCelebrating] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const prevDoneRef = useRef(done);
  const prevProfileRef = useRef(profile);
  const celebrateTimerRef = useRef<number | undefined>(undefined);
  const bubbleTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const profileChanged = prevProfileRef.current !== profile;
    const increased = !profileChanged && done > prevDoneRef.current;
    prevDoneRef.current = done;
    prevProfileRef.current = profile;

    if (increased) {
      setCelebrating(true);
      window.clearTimeout(celebrateTimerRef.current);
      celebrateTimerRef.current = window.setTimeout(() => setCelebrating(false), CELEBRATE_MS);

      window.clearTimeout(bubbleTimerRef.current);
      setBubble(randomLine(stage));
      bubbleTimerRef.current = window.setTimeout(() => setBubble(null), CELEBRATE_MS);
    }
    // 依存はdone/profileのみ。stageはdoneから導かれる値なので、ここで拾うのは常に最新の段階。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, profile]);

  useEffect(
    () => () => {
      window.clearTimeout(celebrateTimerRef.current);
      window.clearTimeout(bubbleTimerRef.current);
    },
    []
  );

  const peek = () => {
    if (celebrating) return;
    window.clearTimeout(bubbleTimerRef.current);
    setBubble(randomLine(stage));
    bubbleTimerRef.current = window.setTimeout(() => setBubble(null), BUBBLE_MS);
  };

  return (
    <button
      type="button"
      className={"growth-bird" + (celebrating ? " growth-bird--celebrate" : "")}
      onClick={peek}
      aria-label={`${stage.label}に話しかける`}
    >
      {celebrating && (
        <span className="growth-bird__burst" aria-hidden="true">
          ✨🎉✨
        </span>
      )}
      {bubble && (
        <span className="growth-bird__bubble" role="status">
          💬 {bubble}
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
    </button>
  );
}
