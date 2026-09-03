import { BrowserRouter, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Router from "./router";

function AppInner() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  function handleSearch(q) {
    setSearchQuery(q);
    // Auto-navigate to albums page when searching from other pages
    if (q && location.pathname !== "/albums") {
      navigate("/albums");
    }
  }

  return (
    <div className="app-layout">
      <Navbar onSearch={handleSearch} />
      <main className="app-content">
        <Router searchQuery={searchQuery} />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
