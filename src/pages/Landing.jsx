import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FOLDERS } from "../config/folders";
import { fetchFolderFiles } from "../services/driveApi";
import "./Landing.css";

// Pick a handful of folders for slideshow covers
const SLIDESHOW_FOLDERS = FOLDERS.slice(0, 8);

export default function Landing() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // Fetch one thumbnail from each slideshow folder
  useEffect(() => {
    let cancelled = false;

    Promise.allSettled(
      SLIDESHOW_FOLDERS.map(f =>
        fetchFolderFiles(f.id, f.apiKey).then(files => {
          const img = files.find(fi => fi.mimeType?.startsWith("image/") && fi.thumbnailLink);
          return img
            ? { src: img.thumbnailLink.replace(/=s\d+$/, "=s1600"), name: f.name, route: f.route }
            : null;
        })
      )
    ).then(results => {
      if (cancelled) return;
      const valid = results
        .filter(r => r.status === "fulfilled" && r.value)
        .map(r => r.value);
      setSlides(valid);
    });

    return () => { cancelled = true; };
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="landing">
      {/* ===== Hero ===== */}
      <section className="hero">
        {/* Slideshow background */}
        <div className="hero-slideshow">
          {slides.map((s, i) => (
            <img
              key={s.src}
              src={s.src}
              alt={s.name}
              className={`hero-slide ${i === current ? "hero-slide--active" : ""}`}
            />
          ))}
          <div className="hero-overlay" />
        </div>

        {/* Hero content */}
        <div className="hero-content">
          <div className="hero-badge">JNV Nainital · Batch 2018–25</div>
          <h1 className="hero-title">
            Our <span>Memories</span>,<br />Forever Preserved
          </h1>
          <p className="hero-sub">
            A digital archive of every moment — trips, events, classrooms, and friendships.
          </p>
          <div className="hero-actions">
            <button className="btn btn--primary" onClick={() => navigate("/albums")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Browse Albums
            </button>
            <a
              className="btn btn--ghost"
              href="mailto:jnv.memories.part02@gmail.com"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              Upload Photos
            </a>
          </div>
        </div>

        {/* Slideshow dots */}
        {slides.length > 1 && (
          <div className="hero-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ===== Stats strip ===== */}
      <section className="stats-strip">
        <div className="stat">
          <span className="stat-num">{FOLDERS.length}</span>
          <span className="stat-label">Albums</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">2018</span>
          <span className="stat-label">Batch Year</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">JNV</span>
          <span className="stat-label">Nainital</span>
        </div>
      </section>

      {/* ===== Recent albums preview ===== */}
      <section className="recent-section">
        <div className="section-header">
          <h2>Recent Albums</h2>
          <button className="view-all-btn" onClick={() => navigate("/albums")}>
            View all →
          </button>
        </div>
        <div className="recent-grid">
          {FOLDERS.slice(0, 6).map(folder => (
            <div
              key={folder.route}
              className="recent-card"
              onClick={() => navigate(`/albums/${folder.route}`)}
            >
              <div className="recent-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5A1 1 0 0011.121 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="recent-name">{folder.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Upload CTA ===== */}
      <section className="upload-cta">
        <div className="upload-cta-inner">
          <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <div>
            <h3>Have photos to share?</h3>
            <p>Send them to us and we'll add them to the archive.</p>
          </div>
          <a className="btn btn--primary" href="mailto:jnv.memories.part02@gmail.com">
            Send Photos
          </a>
        </div>
      </section>
    </div>
  );
}
