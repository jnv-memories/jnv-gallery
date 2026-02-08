import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ViewerControls from "../components/ViewerControls";
import "./Viewer.css";

export default function Viewer() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const { files, folder } = useOutletContext();

  const index = files.findIndex(f => f.id === fileId);
  const file = files[index];

  if (!file) return null;

  return (
    <div className="viewer-overlay" onClick={() => navigate(-1)}>
      <div
        className="viewer-content"
        onClick={e => e.stopPropagation()}
      >
        <iframe
          src={`https://drive.google.com/file/d/${file.id}/preview`}
          allowFullScreen
          title={file.name}
        />

        <div className="viewer-filename">{file.name}</div>

        <ViewerControls
          onPrev={() =>
            index > 0 &&
            navigate(`../${files[index - 1].id}`)
          }
          onNext={() =>
            index < files.length - 1 &&
            navigate(`../${files[index + 1].id}`)
          }
          onClose={() => navigate(-1)}
          downloadLink={`https://drive.google.com/uc?id=${file.id}&export=download`}
        />
      </div>
    </div>
  );
}
