import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { NotifProvider } from "./contexts/NotifContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "./components/ToastContainer";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { TasksPage } from "./pages/TasksPage";
import { MilestonesPage } from "./pages/MilestonesPage";
import { MilestoneDetailPage } from "./pages/MilestoneDetailPage";
import { ProfilePage } from "./pages/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotifProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/tasks" replace />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/milestones" element={<MilestonesPage />} />
                <Route path="/milestones/:id" element={<MilestoneDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route path="*" element={<Navigate to="/tasks" replace />} />
            </Routes>

            <ToastContainer />
          </BrowserRouter>
        </NotifProvider>
      </SocketProvider>
    </AuthProvider>
  );
}