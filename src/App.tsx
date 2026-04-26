import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="flex min-h-screen bg-[#f5f3ef]">
      
      {/* Sidebar */}
      <div className="w-64 bg-farm-brown text-white shadow-lg">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="max-w-7xl mx-auto">
          <Dashboard />
        </div>
      </div>

    </div>
  );
}

export default App;