import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Albums from "./pages/Albums";
import Folder from "./pages/Folder";
import Viewer from "./pages/Viewer";
import PersonSearch from "./pages/PersonSearch";

export default function Router({ searchQuery }) {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/albums" element={<Albums searchQuery={searchQuery} />} />
      <Route path="/search" element={<PersonSearch />} />

      <Route path="/albums/:folderSlug" element={<Folder />}>
        <Route path=":fileId" element={<Viewer />} />
      </Route>
    </Routes>
  );
}
