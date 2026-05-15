import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SignupPage } from "./pages/SignupPage";
import { TasksPage } from "./pages/TasksPage";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") !== "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell darkMode={darkMode} setDarkMode={setDarkMode} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AppShell darkMode={darkMode} setDarkMode={setDarkMode} />}>
          <Route path="/projects" element={<ProjectsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
