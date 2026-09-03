import { FOLDERS } from "../config/folders";
import FolderCard from "../components/FolderCard";
import "./Home.css";

export default function Albums({ searchQuery = "" }) {
  const filtered = searchQuery.trim()
    ? FOLDERS.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FOLDERS;

  return (
    <div className="home">
      <div className="home-hero">
        <h1>All <span>Albums</span></h1>
        <p>
          {searchQuery
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${searchQuery}"`
            : `${FOLDERS.length} albums in the archive`}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="folder-grid">
          {filtered.map(folder => (
            <FolderCard key={folder.route} folder={folder} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No albums match "<strong>{searchQuery}</strong>"</p>
        </div>
      )}
    </div>
  );
}
