import { Link } from "react-router-dom";
import { usePyodide } from "../pyodide/usePyodide";

const STATUS_LABEL: Record<string, string> = {
  booting: "起動中…",
  ready: "準備完了",
  error: "エラー",
};

/** ヘッダー：サイト名リンク＋Pyodideカーネル状態インジケータ。 */
export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { status } = usePyodide();

  return (
    <header className="app-header">
      <button className="app-header__menu-btn" onClick={onMenuClick} aria-label="目次を開く">
        ☰
      </button>
      <Link to="/" className="app-header__brand">
        <span className="app-header__title">実験ノート</span>
        <span className="app-header__subtitle">データエンジニアのためのPython</span>
      </Link>
      <div className="kernel-badge" data-state={status}>
        <span className="kernel-badge__dot" aria-hidden="true" />
        {STATUS_LABEL[status] ?? status}
      </div>
    </header>
  );
}
