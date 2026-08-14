export interface BirdStage {
  emoji: string;
  label: string;
  minPct: number;
}

/** 全体進捗率（%）に応じた鳥の成長段階。閾値以上のうち最も進んだ段階を採用する。 */
export const BIRD_STAGES: BirdStage[] = [
  { emoji: "🥚", label: "たまご", minPct: 0 },
  { emoji: "🐣", label: "うまれたて", minPct: 10 },
  { emoji: "🐤", label: "ひよこ", minPct: 30 },
  { emoji: "🐥", label: "はねが生えてきた", minPct: 55 },
  { emoji: "🐦", label: "わかどり", minPct: 75 },
  { emoji: "🦅", label: "堂々たる鳥", minPct: 95 },
  { emoji: "🦚", label: "満開の羽根", minPct: 100 },
];

export function birdStageFor(pct: number): BirdStage {
  let stage = BIRD_STAGES[0];
  for (const s of BIRD_STAGES) {
    if (pct >= s.minPct) stage = s;
  }
  return stage;
}
