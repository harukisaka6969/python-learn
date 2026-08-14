import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "python-learn:progress";

interface ProgressContextValue {
  completedIds: Set<string>;
  isDone: (lessonId: string) => boolean;
  toggle: (lessonId: string) => void;
  markDone: (lessonId: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadFromStorage(): Set<string> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

/** レッスン完了フラグをlocalStorageに保存するだけのシンプルな進捗管理（サーバー保存はしない）。 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => loadFromStorage());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedIds)));
    } catch {
      // localStorageが使えない環境（プライベートモード等）では進捗保存を諦める。
    }
  }, [completedIds]);

  const toggle = useCallback((lessonId: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  }, []);

  const markDone = useCallback((lessonId: string) => {
    setCompletedIds((prev) => (prev.has(lessonId) ? prev : new Set(prev).add(lessonId)));
  }, []);

  const isDone = useCallback((lessonId: string) => completedIds.has(lessonId), [completedIds]);

  const value = useMemo<ProgressContextValue>(
    () => ({ completedIds, isDone, toggle, markDone }),
    [completedIds, isDone, toggle, markDone]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
