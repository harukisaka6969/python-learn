import type { Chapter } from "../content/types";
import { FLAT_LESSONS } from "../content/index";

export interface ProgressStats {
  done: number;
  total: number;
  pct: number;
}

function toStats(done: number, total: number): ProgressStats {
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function chapterStats(chapter: Chapter, isDone: (lessonId: string) => boolean): ProgressStats {
  const done = chapter.lessons.filter((lesson) => isDone(lesson.id)).length;
  return toStats(done, chapter.lessons.length);
}

export function overallStats(isDone: (lessonId: string) => boolean): ProgressStats {
  const done = FLAT_LESSONS.filter((entry) => isDone(entry.lesson.id)).length;
  return toStats(done, FLAT_LESSONS.length);
}
