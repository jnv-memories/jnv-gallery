import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PersonSearch.css";

export default function PersonSearch() {
  const navigate = useNavigate();

  const [index, setIndex] = useState(null);       // full parsed index
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]); // name autocomplete
  const [selected, setSelected] = useState(null);      // chosen person object
  const inputRef = useRef(null);

  // Load the index once
  useEffect(() => {
    fetch("/search-index.json")
      .then(r => {
        if (!r.ok) throw new Error("Index not found. Run export_search_index.py first.");
        return r.json();
      })
      .then(data => { setIndex(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  // Autocomplete as user types
  useEffect(() => {
    if (!index || !query.trim()) {
      setSuggestions([]);
      return;
    }

    const q = query.toLowerCase();
    const matches = Object.entries(index.people)
      .filter(([key, val]) =>
        key.includes(q) ||
        val.aliases?.some(a => a.includes(q))
      )
      .slice(0, 8)
      .map(([key, val]) => ({ key, ...val }));

    setSuggestions(matches);
  }, [query, index]);

  function selectPerson(person) {
    setSelected(person);
    setQuery(person.display_name);
    setSuggestions([]);
    inputRef.current?.blur();
  }

  function clearSearch() {
    setQuery("");
    setSelected(null);
    setSuggestions([]);
    inputRef.current?.focus();
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

  return (
    <div className="person-search">
      {/* Header */}
      <div className="ps-header">
        <h1>Find <span>a Person</span></h1>
        <p>Search by name to find all photos of someone across every album</p>
      </div>

      {/* Search box */}
      <div className="ps-search-wrap">
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

        {/* Autocomplete dropdown */}
        {suggestions.length > 0 && (
          <ul className="ps-suggestions" role="listbox">
            {suggestions.map(person => (
              <li
                key={person.key}
                className="ps-suggestion"
                role="option"
                onClick={() => selectPerson(person)}
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

      {/* Error */}
      {error && (
        <div className="ps-error">
          <p>⚠ {error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <div className="ps-loading">Loading search index…</div>}

      {/* Index stats */}
      {index && !selected && !query && (
        <div className="ps-stats">
          <span>{index.total_people} people indexed</span>
          <span>·</span>
          <span>Updated {new Date(index.generated_at).toLocaleDateString()}</span>
        </div>
      )}

      {/* Results */}
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
                <button
                  className="ps-folder-open"
                  onClick={() => navigate(`/albums/${folder.route}`)}
                >
                  Open album →
                </button>
              </div>

              <div className="ps-photo-grid">
                {folder.photos.map(photo => (
                  <div
                    key={photo.file_id}
                    className="ps-photo-card"
                    onClick={() => navigate(`/albums/${folder.route}/${photo.file_id}`)}
                    title={photo.file_name}
                  >
                    <div className="ps-photo-thumb">
                      <PhotoThumb fileId={photo.file_id} folderRoute={folder.route} />
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

/**
 * Lazy thumbnail — navigates to the viewer on click.
 * We can't load thumbnails without an API key per-file, so we show
 * a placeholder with the filename and let user click through.
 * If you want thumbnails here, fetchFolderFiles the folder and match by id.
 */
function PhotoThumb({ fileId, folderRoute }) {
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
