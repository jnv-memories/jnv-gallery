import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FOLDERS } from "../config/folders";
import { fetchFolderFiles } from "../services/driveApi";
import ViewerControls from "../components/ViewerControls";
import "./PersonSearch.css";
import "../pages/Viewer.css";

// folder_route -> { apiKey, id }
const FOLDER_KEY_MAP = Object.fromEntries(
  FOLDERS.map(f => [f.route, { apiKey: f.apiKey, id: f.id }])
);

// Cache fetched folder files so we don't re-fetch same folder
const folderCache = {};

export default function PersonSearch() {
  const navigate = useNavigate();

  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState(null);

  // Lightbox state
  // photoList = flat array of all photos for the selected person
  // lightboxIndex = current index in that list
  const [photoList, setPhotoList] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed

  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // Load index once
  useEffect(() => {
    fetch("/search-index.json")
      .then(r => {
        if (!r.ok) throw new Error("Index not found. Run export_search_index.py first.");
        return r.json();
      })
      .then(data => { setIndex(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e) {
      if (e.key === "ArrowRight") setLightboxIndex(i => Math.min(i + 1, photoList.length - 1));
      if (e.key === "ArrowLeft")  setLightboxIndex(i => Math.max(i - 1, 0));
      if (e.key === "Escape")     setLightboxIndex(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, photoList.length]);

  // Autocomplete
  useEffect(() => {
    if (!index || !query.trim()) { setSuggestions([]); return; }
    const q = query.toLowerCase();
    const matches = Object.entries(index.people)
      .filter(([key, val]) =>
        key.includes(q) || val.aliases?.some(a => a.toLowerCase().includes(q))
      )
      .slice(0, 8)
      .map(([key, val]) => ({ key, ...val }));
    setSuggestions(matches);
    setShowSuggestions(true);
  }, [query, index]);

  function selectPerson(person) {
    setSelected(person);
    setQuery(person.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    // Build flat photo list for lightbox navigation
    setPhotoList(person.photos);
    setLightboxIndex(null);
    inputRef.current?.blur();
  }

  function clearSearch() {
    setQuery(""); setSelected(null); setSuggestions([]);
    setShowSuggestions(false); setPhotoList([]); setLightboxIndex(null);
    inputRef.current?.focus();
  }

  function openLightbox(photo) {
    const idx = photoList.findIndex(p => p.file_id === photo.file_id);
    setLightboxIndex(idx >= 0 ? idx : 0);
  }

  // Group photos by folder
  const photosByFolder = selected
    ? selected.photos.reduce((acc, p) => {
        const key = p.folder_route;
        if (!acc[key]) acc[key] = { name: p.folder_name, route: p.folder_route, photos: [] };
        acc[key].photos.push(p);
        return acc;
      }, {})
    : {};

  const totalPhotos = selected?.photos?.length ?? 0;
  const totalFolders = Object.keys(photosByFolder).length;

  // Current lightbox photo
  const lbPhoto = lightboxIndex !== null ? photoList[lightboxIndex] : null;

  return (
    <div className="person-search">
      {/* ===== Lightbox ===== */}
      {lbPhoto && (
        <LightboxModal
          photo={lbPhoto}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => Math.max(i - 1, 0))}
          onNext={() => setLightboxIndex(i => Math.min(i + 1, photoList.length - 1))}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < photoList.length - 1}
          navigate={navigate}
        />
      )}

      {/* ===== Header ===== */}
      <div className="ps-header">
        <h1>Find <span>a Person</span></h1>
        <p>Search by name to find all photos of someone across every album</p>
      </div>

      {/* ===== Search box ===== */}
      <div className="ps-search-wrap" ref={wrapRef}>
        <div className="ps-search-box">
          <svg className="ps-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="ps-input"
            placeholder={loading ? "Loading index…" : "Type a name…"}
            value={query}
            disabled={loading || !!error}
            onChange={e => { setQuery(e.target.value); setSelected(null); }}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button className="ps-clear" onClick={clearSearch} aria-label="Clear">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="ps-suggestions" role="listbox">
            {suggestions.map(person => (
              <li
                key={person.key}
                className="ps-suggestion"
                role="option"
                onMouseDown={e => { e.preventDefault(); selectPerson(person); }}
              >
                <div className="ps-suggestion-avatar">
                  {person.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="ps-suggestion-name">{person.display_name}</div>
                  <div className="ps-suggestion-count">{person.photos.length} photo{person.photos.length !== 1 ? "s" : ""}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <div className="ps-error"><p>⚠ {error}</p></div>}
      {loading && <div className="ps-loading">Loading search index…</div>}

      {index && !selected && !query && (
        <div className="ps-stats">
          <span>{index.total_people} people indexed</span>
          <span>·</span>
          <span>Updated {new Date(index.generated_at).toLocaleDateString()}</span>
        </div>
      )}

      {/* ===== Results ===== */}
      {selected && (
        <div className="ps-results">
          <div className="ps-results-header">
            <div className="ps-person-pill">
              <div className="ps-person-avatar">
                {selected.display_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="ps-person-name">{selected.display_name}</div>
                <div className="ps-person-meta">
                  {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""} across {totalFolders} album{totalFolders !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {Object.values(photosByFolder).map(folder => (
            <div key={folder.route} className="ps-folder-group">
              <div className="ps-folder-heading">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5A1 1 0 0011.121 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                <span>{folder.name}</span>
                <span className="ps-folder-count">{folder.photos.length}</span>
                <button className="ps-folder-open" onClick={() => navigate(`/albums/${folder.route}`)}>
                  Open album →
                </button>
              </div>

              <div className="ps-photo-grid">
                {folder.photos.map(photo => (
                  <div
                    key={photo.file_id}
                    className="ps-photo-card"
                    onClick={() => openLightbox(photo)}
                    title={photo.file_name}
                  >
                    <div className="ps-photo-thumb">
                      <PhotoThumb fileId={photo.file_id} folderRoute={photo.folder_route} />
                    </div>
                    <div className="ps-photo-name">{photo.file_name}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Lightbox modal ───────────────────────────────────────────────────────────
function LightboxModal({ photo, onClose, onPrev, onNext, hasPrev, hasNext, navigate }) {
  const [fileSrc, setFileSrc] = useState(null);
  const [mime, setMime] = useState(null);

  // Fetch the actual file info to get hi-res thumbnail and mimeType
  useEffect(() => {
    if (!photo) return;
    setFileSrc(null);
    setMime(null);

    const folderInfo = FOLDER_KEY_MAP[photo.folder_route];
    if (!folderInfo) return;

    const resolve = (files) => {
      const file = files.find(f => f.id === photo.file_id);
      if (!file) return;
      setMime(file.mimeType);
      if (file.mimeType?.startsWith("image/") && file.thumbnailLink) {
        setFileSrc(file.thumbnailLink.replace(/=s\d+$/, "=s1600"));
      }
    };

    if (folderCache[photo.folder_route]) {
      resolve(folderCache[photo.folder_route]);
    } else {
      fetchFolderFiles(folderInfo.id, folderInfo.apiKey).then(files => {
        folderCache[photo.folder_route] = files;
        resolve(files);
      }).catch(() => {});
    }
  }, [photo]);

  const isImage = mime?.startsWith("image/") || (!mime && fileSrc);
  const isVideo = mime?.startsWith("video/");

  return (
    <div className="viewer-overlay" onClick={onClose}>
      <div
        className={`viewer-content ${isImage ? "image-mode" : ""}`}
        onClick={e => e.stopPropagation()}
      >
        {isImage && fileSrc ? (
          <img src={fileSrc} alt={photo.file_name} className="viewer-image" />
        ) : isVideo ? (
          <iframe
            src={`https://drive.google.com/file/d/${photo.file_id}/preview`}
            allowFullScreen
            title={photo.file_name}
          />
        ) : (
          // Still loading — show spinner
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
            width: "min(95vw, 400px)", height: "300px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Loading…
          </div>
        )}

        <div className="viewer-filename">{photo.file_name}</div>

        <ViewerControls
          onPrev={hasPrev ? onPrev : null}
          onNext={hasNext ? onNext : null}
          onClose={onClose}
          downloadLink={`https://drive.google.com/uc?id=${photo.file_id}&export=download`}
        />
      </div>
    </div>
  );
}

// ─── Thumbnail card ───────────────────────────────────────────────────────────
function PhotoThumb({ fileId, folderRoute }) {
  const [src, setSrc] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!fileId || !folderRoute) return;
    const folderInfo = FOLDER_KEY_MAP[folderRoute];
    if (!folderInfo) return;

    const resolve = (files) => {
      const file = files.find(f => f.id === fileId);
      if (file?.thumbnailLink) setSrc(file.thumbnailLink);
    };

    if (folderCache[folderRoute]) {
      resolve(folderCache[folderRoute]);
      return;
    }

    fetchFolderFiles(folderInfo.id, folderInfo.apiKey)
      .then(files => { folderCache[folderRoute] = files; resolve(files); })
      .catch(() => {});
  }, [fileId, folderRoute]);

  if (!src) {
    return (
      <div className="ps-thumb-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={`ps-thumb-img ${loaded ? "ps-thumb-img--loaded" : ""}`}
      onLoad={() => setLoaded(true)}
      loading="lazy"
    />
  );
}
