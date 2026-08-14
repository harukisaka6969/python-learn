import type { Chapter, Lesson } from "./types";
import { ch01 } from "./ch01-basics";
import { ch02 } from "./ch02-control";
import { ch03 } from "./ch03-data-structures";
import { ch04 } from "./ch04-functions-modules";
import { ch05 } from "./ch05-pandas-intro";
import { ch06 } from "./ch06-pandas-wrangling";
import { ch07 } from "./ch07-real-world";
import { ch08 } from "./ch08-capstone";

export const CHAPTERS: Chapter[] = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08];

export interface FlatLessonEntry {
  chapter: Chapter;
  lesson: Lesson;
  indexInChapter: number;
  isLastInChapter: boolean;
  flatIndex: number;
}

/** 全レッスンを章をまたいで1本の順序付き配列に平坦化する（前後レッスンへの移動・進捗レール用）。 */
export const FLAT_LESSONS: FlatLessonEntry[] = CHAPTERS.flatMap((chapter) =>
  chapter.lessons.map((lesson, indexInChapter) => ({
    chapter,
    lesson,
    indexInChapter,
    isLastInChapter: indexInChapter === chapter.lessons.length - 1,
    flatIndex: -1, // 後で振り直す
  }))
).map((entry, flatIndex) => ({ ...entry, flatIndex }));

const LESSON_LOOKUP = new Map<string, FlatLessonEntry>(FLAT_LESSONS.map((e) => [e.lesson.id, e]));

export function findLessonEntry(lessonId: string): FlatLessonEntry | undefined {
  return LESSON_LOOKUP.get(lessonId);
}

export function firstLessonId(): string | undefined {
  return FLAT_LESSONS[0]?.lesson.id;
}
