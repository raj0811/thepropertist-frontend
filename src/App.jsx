import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropertyInfo from "./Components/PropertyInfo";
import About from "./Pages/About";

const ProtectedDashboard = () => {
  const location = useLocation();

  const token =
    localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/home"
        replace
        state={{
          openLogin: true,
          from: location.pathname,
        }}
      />
    );
  }

  return <Dashboard />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/home" replace />
        }
      />

      <Route
        path="/home"
        element={<Home />}
      />

      <Route
        path="/login"
        element={
          <Navigate
            to="/home"
            replace
            state={{ openLogin: true }}
          />
        }
      />

      <Route
        path="/dashboard"
        element={<ProtectedDashboard />}
      />

      <Route
        path="*"
        element={
          <Navigate to="/home" replace />
        }
      />

      <Route
        path="/properties/:id"
        element={<PropertyInfo />}
      />

      <Route
        path="/about"
        element={<About />}
      />
    </Routes>


  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;