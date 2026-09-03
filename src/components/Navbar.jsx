import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/")}>
        <div className="nav-logo">JN</div>
        <div>
          <div className="nav-title">JNV <span>Memories</span></div>
          <div className="nav-subtitle">Nainital · Batch Archive</div>
        </div>
      </div>
    </nav>
  );
}
