import { Link, Navigate, useParams } from "react-router-dom";
import { findLessonEntry, FLAT_LESSONS } from "../content/index";
import { renderBody } from "../utils/renderBody";
import { useProgress } from "../progress/ProgressProvider";
import CodeCell from "./CodeCell";
import Exercise from "./Exercise";

/** 1レッスンの描画：ゴール→本文→SQL対応→サンプルセル群→課題→前後ナビゲーション（＋章末はチェックリスト）。 */
export default function LessonView() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { isDone, toggle } = useProgress();

  const entry = lessonId ? findLessonEntry(lessonId) : undefined;
  if (!entry) {
    return <Navigate to="/" replace />;
  }

  const { chapter, lesson, flatIndex, isLastInChapter } = entry;
  const prev = flatIndex > 0 ? FLAT_LESSONS[flatIndex - 1] : undefined;
  const next = flatIndex < FLAT_LESSONS.length - 1 ? FLAT_LESSONS[flatIndex + 1] : undefined;

  return (
    <article className="lesson-view">
      <div className="lesson-crumb">
        第{chapter.no}章 {chapter.title}
      </div>
      <h1 className="lesson-title">{lesson.title}</h1>
      <p className="lesson-goal">🎯 {lesson.goal}</p>

      <div className="lesson-body">{renderBody(lesson.bodyMd)}</div>

      {lesson.sqlBridge && (
        <div className="sql-bridge">
          <div className="sql-bridge__label">SQLでいうと</div>
          <div className="lesson-body">{renderBody(lesson.sqlBridge)}</div>
        </div>
      )}

      {lesson.cells.map((cell, i) => (
        <CodeCell key={i} cell={cell} cellIndex={i} />
      ))}

      {lesson.exercise && (
        <Exercise exercise={lesson.exercise} done={isDone(lesson.id)} onToggleDone={() => toggle(lesson.id)} />
      )}

      {isLastInChapter && (
        <div className="chapter-checklist">
          <div className="chapter-checklist__title">✅ 第{chapter.no}章はここまでで出来るようになったこと</div>
          <ul>
            {chapter.checklist.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <nav className="lesson-nav">
        {prev ? (
          <Link className="lesson-nav__prev" to={`/lesson/${prev.lesson.id}`}>
            ← {prev.lesson.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="lesson-nav__next" to={`/lesson/${next.lesson.id}`}>
            {next.lesson.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
