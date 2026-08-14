import { useNavigate } from "react-router-dom";
import type { Chapter } from "../content/types";
import { useProgress } from "../progress/ProgressProvider";
import { chapterStats } from "../progress/stats";

/**
 * 右端の進捗ドット。現在の章のレッスンをドットで並べ、完了済みは塗りつぶし、
 * 現在地はリング表示にする。クリックでそのレッスンへ移動する。
 * 仕様書はIntersectionObserverでのスクロール追従を想定しているが、実装はレッスン単位の
 * ルーティング（/lesson/:id）を採用しているため、現在地はルートのlesson idで判定する。
 */
export default function ProgressRail({ chapter, currentLessonId }: { chapter: Chapter; currentLessonId: string }) {
  const { isDone } = useProgress();
  const navigate = useNavigate();
  const stats = chapterStats(chapter, isDone);

  return (
    <aside className="progress-rail" aria-label={`${chapter.title}の進捗`}>
      <span className="progress-rail__count">
        {stats.done}/{stats.total}
      </span>
      {chapter.lessons.map((lesson) => (
        <button
          key={lesson.id}
          type="button"
          className="progress-rail__dot"
          data-done={isDone(lesson.id)}
          data-active={lesson.id === currentLessonId}
          title={lesson.title}
          aria-label={lesson.title}
          aria-current={lesson.id === currentLessonId}
          onClick={() => navigate(`/lesson/${lesson.id}`)}
        />
      ))}
    </aside>
  );
}
