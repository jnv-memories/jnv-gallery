import { useNavigate } from "react-router-dom";
import "./FolderCard.css";

export default function FolderCard({ folder }) {
  const navigate = useNavigate();

  return (
    <div
      className="folder-card"
      onClick={() => navigate(`/${folder.route}`)}
    >
      <div className="folder-name">{folder.name}</div>
    </div>
  );
}
