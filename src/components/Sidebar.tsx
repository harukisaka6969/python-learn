import { NavLink } from "react-router-dom";
import { CHAPTERS } from "../content/index";
import { useProgress } from "../progress/ProgressProvider";
import { chapterStats, overallStats } from "../progress/stats";
import ProgressBar from "./ProgressBar";

/** 章＞レッスンのツリー目次。全体・章ごとの進捗バーと、完了レッスンに✓、現在地をハイライトする。モバイルはドロワー。 */
export default function Sidebar({ open, onNavigate }: { open: boolean; onNavigate?: () => void }) {
  const { isDone } = useProgress();
  const overall = overallStats(isDone);

  return (
    <nav className="sidebar" data-open={open} aria-label="目次">
      <div className="sidebar-overall">
        <div className="sidebar-overall__label">
          <span>全体の進捗</span>
          <span>
            {overall.done}/{overall.total}
          </span>
        </div>
        <ProgressBar done={overall.done} total={overall.total} size="sm" />
      </div>
      {CHAPTERS.map((chapter) => {
        const stats = chapterStats(chapter, isDone);
        return (
          <div className="sidebar-chapter" key={chapter.id}>
            <div className="sidebar-chapter__head">
              <span className="sidebar-chapter__no">第{chapter.no}章</span>
              <span className="sidebar-chapter__title">{chapter.title}</span>
              <span className="sidebar-chapter__count">
                {stats.done}/{stats.total}
              </span>
            </div>
            <ProgressBar done={stats.done} total={stats.total} size="sm" />
            <ul className="sidebar-lesson-list">
              {chapter.lessons.map((lesson) => (
                <li className="sidebar-lesson" key={lesson.id}>
                  <NavLink to={`/lesson/${lesson.id}`} className="sidebar-lesson__link" onClick={onNavigate} end>
                    <span className="sidebar-lesson__check">{isDone(lesson.id) ? "✓" : ""}</span>
                    {lesson.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
