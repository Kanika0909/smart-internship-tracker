import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import CalendarPage from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <Router>

      {/* 🔔 Toast */}
      <Toaster position="top-right" />

      <Routes>

        {/* ✅ PUBLIC ROUTES (NO SIDEBAR) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ PROTECTED ROUTES (WITH SIDEBAR) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <PrivateRoute>
              <Layout>
                <Applications />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Layout>
                <CalendarPage />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Layout>
                <Analytics />
              </Layout>
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;