import { FOLDERS } from "../config/folders";
import FolderCard from "../components/FolderCard";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>JNV <span>Gallery</span></h1>
        <p>Browse albums from our Navodaya memories</p>
      </div>

      <p className="album-heading">All Albums · {FOLDERS.length}</p>

      <div className="folder-grid">
        {FOLDERS.map(folder => (
          <FolderCard key={folder.route} folder={folder} />
        ))}
      </div>
    </div>
  );
}
