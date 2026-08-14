import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Profile = "haruki" | "arisa";

export const PROFILES: { id: Profile; label: string }[] = [
  { id: "haruki", label: "遥希" },
  { id: "arisa", label: "アリサ" },
];

const PROFILE_STORAGE_KEY = "python-learn:profile";
const LEGACY_PROGRESS_KEY = "python-learn:progress";

function progressStorageKey(profile: Profile): string {
  return `python-learn:progress:${profile}`;
}

interface ProgressContextValue {
  completedIds: Set<string>;
  isDone: (lessonId: string) => boolean;
  toggle: (lessonId: string) => void;
  markDone: (lessonId: string) => void;
  profile: Profile;
  setProfile: (profile: Profile) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function parseIds(raw: string): Set<string> {
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr.filter((x): x is string => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function loadProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw === "arisa" ? "arisa" : "haruki";
  } catch {
    return "haruki";
  }
}

/** 指定プロフィールの進捗を読み込む。遥希は旧・プロフィール未対応時代のキーからも引き継ぐ。 */
function loadProgress(profile: Profile): Set<string> {
  try {
    const raw = window.localStorage.getItem(progressStorageKey(profile));
    if (raw) return parseIds(raw);
    if (profile === "haruki") {
      const legacy = window.localStorage.getItem(LEGACY_PROGRESS_KEY);
      if (legacy) return parseIds(legacy);
    }
    return new Set();
  } catch {
    return new Set();
  }
}

/** レッスン完了フラグをlocalStorageに保存するだけのシンプルな進捗管理（サーバー保存はしない）。プロフィール（遥希／アリサ）ごとに分けて保存する。 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(() => loadProfile());
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => loadProgress(profile));

  useEffect(() => {
    try {
      window.localStorage.setItem(progressStorageKey(profile), JSON.stringify(Array.from(completedIds)));
    } catch {
      // localStorageが使えない環境（プライベートモード等）では進捗保存を諦める。
    }
  }, [completedIds, profile]);

  const setProfile = useCallback((next: Profile) => {
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, next);
    } catch {
      // 保存できなくても、そのセッション中の切り替え自体は継続する。
    }
    setProfileState(next);
    setCompletedIds(loadProgress(next));
  }, []);

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
    () => ({ completedIds, isDone, toggle, markDone, profile, setProfile }),
    [completedIds, isDone, toggle, markDone, profile, setProfile]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
