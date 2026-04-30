import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registry" element={<ChickenRegistry />} />
        <Route path="/chicken/:id" element={<ChickenProfile />} />

        {/* Fallback (optional but recommended) */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}