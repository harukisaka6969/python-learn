import { Link } from "react-router-dom";
import { CHAPTERS, firstLessonId } from "../content/index";

/** トップページ：ヒーロー＋章一覧カード。最初のレッスンへの導線を用意する。 */
export default function Home() {
  const firstId = firstLessonId();

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
      <div className="hero__chapters">
        {CHAPTERS.map((chapter) => {
          const first = chapter.lessons[0];
          return (
            <Link className="hero-chapter-card" to={`/lesson/${first.id}`} key={chapter.id}>
              <div className="hero-chapter-card__no">第{chapter.no}章</div>
              <div className="hero-chapter-card__title">{chapter.title}</div>
              <p className="hero-chapter-card__summary">{chapter.summary}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
