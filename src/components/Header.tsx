import { Link } from "react-router-dom";
import { usePyodide } from "../pyodide/usePyodide";
import { PROFILES, useProgress } from "../progress/ProgressProvider";

const STATUS_LABEL: Record<string, string> = {
  booting: "起動中…",
  ready: "準備完了",
  error: "エラー",
};

/** プロフィール（遥希／アリサ）切り替え。進捗はプロフィールごとにlocalStorageで分けて保存される。 */
function ProfileSwitch() {
  const { profile, setProfile } = useProgress();

  return (
    <div className="profile-switch" role="group" aria-label="学習アカウント切り替え">
      {PROFILES.map((p) => (
        <button
          key={p.id}
          type="button"
          className="profile-switch__btn"
          aria-pressed={profile === p.id}
          onClick={() => setProfile(p.id)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

/** ヘッダー：サイト名リンク＋プロフィール切り替え＋Pyodideカーネル状態インジケータ。 */
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
      <ProfileSwitch />
      <div className="kernel-badge" data-state={status}>
        <span className="kernel-badge__dot" aria-hidden="true" />
        {STATUS_LABEL[status] ?? status}
      </div>
    </header>
  );
}
