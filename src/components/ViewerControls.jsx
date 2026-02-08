import "./ViewerControls.css";

export default function ViewerControls({
  onNext,
  onPrev,
  onClose,
  downloadLink
}) {
  return (
    <div className="viewer-controls">
      <button onClick={onPrev}>⟵</button>
      <a href={downloadLink} target="_blank" rel="noreferrer">
        ⬇
      </a>
      <button onClick={onNext}>⟶</button>
      <button onClick={onClose}>✕</button>
    </div>
  );
}
