import { FOLDERS } from "../config/folders";
import FolderCard from "../components/FolderCard";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <h2 className="album-heading">Select an Album</h2>
      <div className="folder-grid">
        {FOLDERS.map(folder => (
          <FolderCard key={folder.route} folder={folder} />
        ))}
      </div>
    </div>
  );
}
