import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ChickenRegister from "./ChickenRegister";
import ChickenProfile from "./ChickenProfile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/registry" />} />

        {/* Pages */}
        <Route path="/registry" element={<ChickenRegister />} />
        <Route path="/chicken/:id" element={<ChickenProfile />} />
      </Routes>
    </Router>
  );
}