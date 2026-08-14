export interface BirdStage {
  emoji: string;
  label: string;
  minPct: number;
  /** この段階で鳥が喜んでいるときに言いそうなセリフ（ランダムに1つ表示）。 */
  lines: string[];
}

/** 全体進捗率（%）に応じた鳥の成長段階。閾値以上のうち最も進んだ段階を採用する。 */
export const BIRD_STAGES: BirdStage[] = [
  {
    emoji: "🥚",
    label: "たまご",
    minPct: 0,
    lines: ["まだ何も見えないけど、なかはワクワクしてるよ", "コツコツ、ここから始まるよ", "殻の中で準備中…"],
  },
  {
    emoji: "🐣",
    label: "うまれたて",
    minPct: 10,
    lines: ["わあ、生まれた！世界が広いね", "はじめの一歩、気持ちいい！", "ピヨッ、よろしくね"],
  },
  {
    emoji: "🐤",
    label: "ひよこ",
    minPct: 30,
    lines: ["ピヨピヨ！少しずつ歩けるようになってきたよ", "毎日ちょっとずつ、楽しいね", "次はどんなレッスンかな？"],
  },
  {
    emoji: "🐥",
    label: "はねが生えてきた",
    minPct: 55,
    lines: ["はねがむずむずする、そろそろ飛べるかも", "力がついてきた感じがする！", "もう半分以上きたね、すごい！"],
  },
  {
    emoji: "🐦",
    label: "わかどり",
    minPct: 75,
    lines: ["風を切って飛べる！最高の気分", "この調子でどんどん学ぼう！", "遠くまで見えるようになったよ"],
  },
  {
    emoji: "🦅",
    label: "堂々たる鳥",
    minPct: 95,
    lines: ["見晴らしがいいなあ、ここまで来たんだね", "堂々とした気分、誇らしいよ", "ゴールはもうすぐそこ！"],
  },
  {
    emoji: "🦚",
    label: "満開の羽根",
    minPct: 100,
    lines: ["羽根が満開だ！全部やりきったね、おめでとう！", "最高の景色をありがとう！", "きみの努力、ぜんぶこの羽根に詰まってるよ"],
  },
];

export function birdStageFor(pct: number): BirdStage {
  let stage = BIRD_STAGES[0];
  for (const s of BIRD_STAGES) {
    if (pct >= s.minPct) stage = s;
  }
  return stage;
}
