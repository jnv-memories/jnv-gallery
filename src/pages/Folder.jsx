import { useEffect, useState } from "react";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { FOLDERS } from "../config/folders";
import { fetchFolderFiles } from "../services/driveApi";
import MediaGrid from "../components/MediaGrid";
import "./Folder.css";

export default function Folder() {
  const { folderSlug } = useParams();
  const navigate = useNavigate();
  const folder = FOLDERS.find(f => f.route === folderSlug);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchFolderFiles(folder.id, folder.apiKey)
      .then(setFiles)
      .finally(() => setLoading(false));
  }, [folder]);

  return (
    <div className="folder-page">
      <button className="folder-back" onClick={() => navigate("/albums")}>
        ← All Albums
      </button>

      <h2 className="album-heading">{folder.name}</h2>

      {loading ? (
        <div className="folder-loading">Loading photos</div>
      ) : (
        <MediaGrid files={files} folder={folder} />
      )}

      <Outlet context={{ files, folder }} />
    </div>
  );
}
