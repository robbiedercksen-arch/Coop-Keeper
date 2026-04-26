import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Dashboard />
      </div>

    </div>
  );
}

export default App;