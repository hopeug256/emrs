import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import ResourcePage from "./pages/ResourcePage";
import Login from "./pages/Login";
import Forbidden from "./pages/Forbidden";
import ChangePassword from "./pages/ChangePassword";
import FormBuilderPage from "./pages/FormBuilderPage";
import FormSubmissionsPage from "./pages/FormSubmissionsPage";
import TheatreWorkflowPage from "./pages/TheatreWorkflowPage";
import MisReportsPage from "./pages/MisReportsPage";
import PatientPortalPage from "./pages/PatientPortalPage";
import PhysicianPortalPage from "./pages/PhysicianPortalPage";
import RemindersNoShowPage from "./pages/RemindersNoShowPage";
import LabWorkflowPage from "./pages/LabWorkflowPage";
import RevenueAnalyticsPage from "./pages/RevenueAnalyticsPage";
import CalendarManagementPage from "./pages/CalendarManagementPage";
import MobileAccessPage from "./pages/MobileAccessPage";
import UgandaHmisCompliancePage from "./pages/UgandaHmisCompliancePage";
import { moduleConfigs } from "./modules";
import { canCreateInModule, canViewModule } from "./authz";
import api, { clearAuthTokens, getAccessToken, getRefreshToken } from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrapAuth() {
      const token = getAccessToken();
      const refreshToken = getRefreshToken();
      if (!token && !refreshToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch (error) {
        clearAuthTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    function handleAuthLogout() {
      clearAuthTokens();
      setUser(null);
    }

    window.addEventListener("emrs:auth-logout", handleAuthLogout);
    bootstrapAuth();
    return () => window.removeEventListener("emrs:auth-logout", handleAuthLogout);
  }, []);

  const accessibleModules = useMemo(() => {
    if (!user) return [];
    return moduleConfigs.filter((module) => canViewModule(user.role, module.key));
  }, [user]);

  async function handleLogout() {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      // Ignore logout API errors and clear local session anyway.
    }
    clearAuthTokens();
    setUser(null);
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-lg text-slate-700">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={setUser} />} />
      </Routes>
    );
  }

  if (user.mustChangePassword) {
    return (
      <Routes>
        <Route
          path="/change-password"
          element={
            <ChangePassword
              user={user}
              onPasswordChanged={setUser}
              onLogout={handleLogout}
            />
          }
        />
        <Route path="*" element={<Navigate to="/change-password" replace />} />
      </Routes>
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-50 md:grid-cols-[260px_1fr]">
      <NavBar modules={accessibleModules} user={user} onLogout={handleLogout} />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard modules={accessibleModules} />} />
          {moduleConfigs.map((config) => (
            <Route
              key={config.key}
              path={`/${config.key}`}
              element={
                canViewModule(user.role, config.key) ? (
                  config.key === "form-builder" ? (
                    <FormBuilderPage />
                  ) : config.key === "form-submissions" ? (
                    <FormSubmissionsPage />
                  ) : config.key === "theatre-workflow" ? (
                    <TheatreWorkflowPage />
                  ) : config.key === "mis-reports" ? (
                    <MisReportsPage />
                  ) : config.key === "patient-portal" ? (
                    <PatientPortalPage user={user} />
                  ) : config.key === "physician-portal" ? (
                    <PhysicianPortalPage />
                  ) : config.key === "reminders-no-show" ? (
                    <RemindersNoShowPage />
                  ) : config.key === "lab-workflow" ? (
                    <LabWorkflowPage />
                  ) : config.key === "revenue-analytics" ? (
                    <RevenueAnalyticsPage />
                  ) : config.key === "calendar-management" ? (
                    <CalendarManagementPage />
                  ) : config.key === "mobile-access" ? (
                    <MobileAccessPage />
                  ) : config.key === "uganda-hmis-compliance" ? (
                    <UgandaHmisCompliancePage />
                  ) : (
                    <ResourcePage
                      config={config}
                      canCreate={canCreateInModule(user.role, config.key)}
                    />
                  )
                ) : (
                  <Forbidden />
                )
              }
            />
          ))}
          <Route path="/change-password" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
