import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  }

  return (
    <nav className="navbar">
      {/* Logo only — no text */}
      <div className="nav-logo" onClick={() => navigate("/")} title="Home">
        <svg viewBox="0 0 36 36" fill="none" aria-label="JNV Home">
          {/* Camera lens shape */}
          <rect width="36" height="36" rx="9" fill="#2563eb"/>
          <circle cx="18" cy="19" r="7" stroke="#fff" strokeWidth="2.2" fill="none"/>
          <circle cx="18" cy="19" r="3" fill="#93c5fd"/>
          <rect x="11" y="9" width="6" height="3.5" rx="1.5" fill="#fff" opacity="0.9"/>
          <rect x="25" y="10" width="3" height="3" rx="1" fill="#fff" opacity="0.6"/>
        </svg>
      </div>

      {/* Search bar */}
      <div className="nav-search">
        <svg className="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="search"
          className="nav-search-input"
          placeholder="Search albums…"
          value={query}
          onChange={handleSearch}
          aria-label="Search albums"
        />
        {query && (
          <button
            className="nav-search-clear"
            onClick={() => { setQuery(""); onSearch?.(""); }}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Home button */}
      <button className="nav-home-btn" onClick={() => navigate("/")} title="Home" aria-label="Go to home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
          <polyline points="9 21 9 12 15 12 15 21"/>
        </svg>
      </button>
    </nav>
  );
}
