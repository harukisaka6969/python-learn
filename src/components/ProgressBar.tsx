/** 完了数/合計数から塗り幅を出す、進捗の視覚表示用バー。 */
export default function ProgressBar({
  done,
  total,
  size = "md",
}: {
  done: number;
  total: number;
  size?: "sm" | "md";
}) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div
      className={`progress-bar progress-bar--${size}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      data-complete={pct === 100}
    >
      <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
