import { useNavigate } from "react-router-dom";
import "./FolderCard.css";

export default function FolderCard({ folder }) {
  const navigate = useNavigate();

  return (
    <div
      className="folder-card"
      onClick={() => navigate(`/albums/${folder.route}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && navigate(`/albums/${folder.route}`)}
    >
      <div className="folder-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5A1 1 0 0011.121 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            fill="currentColor"
            opacity="0.15"
          />
          <path
            d="M3 7a2 2 0 012-2h3.586a1 1 0 01.707.293L10.414 6.5A1 1 0 0011.121 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="folder-name">{folder.name}</div>
    </div>
  );
}
