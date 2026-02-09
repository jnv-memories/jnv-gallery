import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ViewerControls from "../components/ViewerControls";
import "./Viewer.css";

export default function Viewer() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { files } = useOutletContext();

  const index = files.findIndex(f => f.id === fileId);
  const file = files[index];

  if (!file) return null;

  const isImage = file.mimeType?.startsWith("image/");
  const imageSrc = isImage
    ? file.thumbnailLink?.replace(/=s\d+$/, "=s4800")
    : null;

  return (
    <div
      className="viewer-overlay"
      onClick={() => navigate("..", { replace: true })}
    >
      <div
        className={`viewer-content ${isImage ? "image-mode" : ""}`}
        onClick={e => e.stopPropagation()}
      >
        {isImage ? (
          <img
            src={imageSrc}
            alt={file.name}
            className="viewer-image"
          />
        ) : (
          <iframe
            src={`https://drive.google.com/file/d/${file.id}/preview`}
            allowFullScreen
            title={file.name}
          />
        )}

        <div className="viewer-filename">{file.name}</div>

        <ViewerControls
          onPrev={() =>
            index > 0 &&
            navigate(`../${files[index - 1].id}`, { replace: true })
          }
          onNext={() =>
            index < files.length - 1 &&
            navigate(`../${files[index + 1].id}`, { replace: true })
          }
          onClose={() => navigate("..", { replace: true })}
          downloadLink={`https://drive.google.com/uc?id=${file.id}&export=download`}
        />
      </div>
    </div>
  );
}
