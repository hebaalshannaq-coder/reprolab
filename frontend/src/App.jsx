import { Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import CreateBug from "./pages/CreateBug";
import BugDetails from "./pages/BugDetails";
import AdminPanel from "./pages/AdminPanel";

const App = () => {
  return (
    <>
      <Navbar />
      <Container className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id/bugs/new"
            element={
              <ProtectedRoute>
                <CreateBug />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bugs/:id"
            element={
              <ProtectedRoute>
                <BugDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;