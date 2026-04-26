import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-farm-light">
      
      {/* Sidebar */}
      <div className="w-64 bg-farm-brown text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <Dashboard />
        </div>
      </div>

    </div>
  );
}

export default App;