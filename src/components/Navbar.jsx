import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-title" onClick={() => navigate("/")}>
        <h2>JNV</h2>
      </div>
    </nav>
  );
}
