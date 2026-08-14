import { Link } from "react-router-dom";
import { CHAPTERS, firstLessonId } from "../content/index";
import { PROFILES, useProgress } from "../progress/ProgressProvider";
import { chapterStats, overallStats } from "../progress/stats";
import ProgressBar from "./ProgressBar";

/** トップページ：ヒーロー＋全体進捗＋章一覧カード（各章の進捗つき）。最初のレッスンへの導線を用意する。 */
export default function Home() {
  const firstId = firstLessonId();
  const { isDone, profile } = useProgress();
  const overall = overallStats(isDone);
  const profileLabel = PROFILES.find((p) => p.id === profile)?.label ?? profile;

  return (
    <div className="hero">
      <div className="hero__eyebrow">Interactive Python Notebook</div>
      <h1 className="hero__title">読むだけでは身につかない。ここで動かす。</h1>
      <p className="hero__lead">
        環境構築なしでブラウザ内に本物のPythonを起動し、変数から実務レベルのpandasデータ処理までを、
        SQL・Power BI経験者向けの橋渡しつきで体系的に学びます。全8章・約30レッスン。
        {firstId && (
          <>
            {" "}
            <Link to={`/lesson/${firstId}`}>まずは第1章から始める →</Link>
          </>
        )}
      </p>

      <div className="hero__progress">
        <div className="hero__progress-label">
          <span>{profileLabel}の進捗</span>
          <span>
            {overall.done} / {overall.total} レッスン完了（{overall.pct}%）
          </span>
        </div>
        <ProgressBar done={overall.done} total={overall.total} />
      </div>

      <div className="hero__chapters">
        {CHAPTERS.map((chapter) => {
          const first = chapter.lessons[0];
          const stats = chapterStats(chapter, isDone);
          return (
            <Link className="hero-chapter-card" to={`/lesson/${first.id}`} key={chapter.id}>
              {stats.pct === 100 && <span className="hero-chapter-card__badge">✓ 完了</span>}
              <div className="hero-chapter-card__no">第{chapter.no}章</div>
              <div className="hero-chapter-card__title">{chapter.title}</div>
              <p className="hero-chapter-card__summary">{chapter.summary}</p>
              <div className="hero-chapter-card__progress">
                <ProgressBar done={stats.done} total={stats.total} size="sm" />
                <span className="hero-chapter-card__count">
                  {stats.done}/{stats.total}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
