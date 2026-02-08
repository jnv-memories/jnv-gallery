import { useEffect, useState } from "react";
import { useParams, Outlet } from "react-router-dom";
import { FOLDERS } from "../config/folders";
import { fetchFolderFiles } from "../services/driveApi";
import MediaGrid from "../components/MediaGrid";
import "./Folder.css";

export default function Folder() {
  const { folderSlug } = useParams();
  const folder = FOLDERS.find(f => f.route === folderSlug);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFolderFiles(folder.id, folder.apiKey).then(setFiles);
  }, [folder]);

  return (
    <div className="folder-page">
      <h2>{folder.name}</h2>

      {/* thumbnails stay mounted */}
      <MediaGrid files={files} folder={folder} />

      {/* viewer overlays here */}
      <Outlet context={{ files, folder }} />
    </div>
  );
}
