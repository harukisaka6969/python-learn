import { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProgressRail from "./components/ProgressRail";
import Home from "./components/Home";
import LessonView from "./components/LessonView";
import { findLessonEntry } from "./content/index";
import { usePyodide } from "./pyodide/usePyodide";

function CurrentLessonRail() {
  const location = useLocation();
  const match = /^\/lesson\/(.+)$/.exec(location.pathname);
  if (!match) return null;
  const entry = findLessonEntry(match[1]);
  if (!entry) return null;
  return <ProgressRail chapter={entry.chapter} currentLessonId={entry.lesson.id} />;
}

export default function App() {
  const { status, errorMessage } = usePyodide();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "error") {
    return (
      <>
        <Header />
        <div className="boot-screen">
          <div className="boot-screen__title">⚠️ Pythonカーネルを起動できませんでした</div>
          <p className="boot-screen__detail">
            {errorMessage ?? "不明なエラーが発生しました。"}
            <br />
            ネットワークが <code>cdn.jsdelivr.net</code> への接続をブロックしていないか確認し、ページを再読み込みしてください。
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="app-shell">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <main className="main-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lesson/:lessonId" element={<LessonView />} />
          </Routes>
        </main>
        <CurrentLessonRail />
      </div>
    </>
  );
}
