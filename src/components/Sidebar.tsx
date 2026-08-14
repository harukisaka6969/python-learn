import { NavLink } from "react-router-dom";
import { CHAPTERS } from "../content/index";
import { useProgress } from "../progress/ProgressProvider";

/** 章＞レッスンのツリー目次。完了レッスンに✓、現在地をハイライトする。モバイルはドロワー。 */
export default function Sidebar({ open, onNavigate }: { open: boolean; onNavigate?: () => void }) {
  const { isDone } = useProgress();

  return (
    <nav className="sidebar" data-open={open} aria-label="目次">
      {CHAPTERS.map((chapter) => (
        <div className="sidebar-chapter" key={chapter.id}>
          <div className="sidebar-chapter__head">
            <span className="sidebar-chapter__no">第{chapter.no}章</span>
            <span>{chapter.title}</span>
          </div>
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
      ))}
    </nav>
  );
}
