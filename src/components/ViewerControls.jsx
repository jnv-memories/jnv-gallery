import "./ViewerControls.css";

export default function ViewerControls({
  onNext,
  onPrev,
  onClose,
  downloadLink
}) {
  return (
    <>
      {/* Side nav arrows — hidden when handler is null */}
      {onPrev && (
        <button className="viewer-arrow viewer-arrow--prev" onClick={onPrev} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}
      {onNext && (
        <button className="viewer-arrow viewer-arrow--next" onClick={onNext} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Bottom toolbar */}
      <div className="viewer-controls">
        <a
          className="viewer-btn"
          href={downloadLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Download"
          title="Download"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Download</span>
        </a>

        <button className="viewer-btn viewer-btn--close" onClick={onClose} aria-label="Close" title="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          <span>Close</span>
        </button>
      </div>
    </>
  );
}
