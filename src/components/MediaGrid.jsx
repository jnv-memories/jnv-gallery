import { useNavigate } from "react-router-dom";
import "./MediaGrid.css";

export default function MediaGrid({ files, folder }) {
  const navigate = useNavigate();

  return (
    <div className="media-grid">
      {files.map(file => (
        <div
          key={file.id}
          className="media-item"
          onClick={() =>
            navigate(`/${folder.route}/${file.id}`)
          }
        >
          <img
            src={file.thumbnailLink}
            alt={file.name}
            loading="lazy"
          />
          <div className="media-name" title={file.name}>
            {file.name}
          </div>
        </div>
      ))}
    </div>
  );
}
