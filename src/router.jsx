import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Folder from "./pages/Folder";
import Viewer from "./pages/Viewer";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/:folderSlug" element={<Folder />}>
        <Route path=":fileId" element={<Viewer />} />
      </Route>
    </Routes>
  );
}
