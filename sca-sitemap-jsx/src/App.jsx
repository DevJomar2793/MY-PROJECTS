import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Navbar />
      {/* We make the main wrapper a flex column so the footer is pushed to the bottom */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <div className="flex-1 p-8">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes inside this Route will share the Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
