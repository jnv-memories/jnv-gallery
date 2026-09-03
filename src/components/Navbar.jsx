import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val);
  }

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="nav-logo" onClick={() => navigate("/")} title="Home">
        <span>JN</span>
      </div>

      {/* Center: Nav links */}
      <div className="nav-links">
        <button
          className={`nav-link ${location.pathname === "/" ? "nav-link--active" : ""}`}
          onClick={() => navigate("/")}
        >
          Home
        </button>
        <button
          className={`nav-link ${isActive("/albums") ? "nav-link--active" : ""}`}
          onClick={() => navigate("/albums")}
        >
          Albums
        </button>
        <button
          className={`nav-link ${location.pathname === "/search" ? "nav-link--active" : ""}`}
          onClick={() => navigate("/search")}
        >
          People
        </button>
      </div>

      {/* Right: Search */}
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
    </nav>
  );
}
