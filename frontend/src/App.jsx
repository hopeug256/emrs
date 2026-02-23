import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ResourcePage from "./pages/shared/ResourcePage";
import Login from "./pages/shared/Login";
import Forbidden from "./pages/shared/Forbidden";
import ChangePassword from "./pages/shared/ChangePassword";
import FormBuilderPage from "./pages/shared/FormBuilderPage";
import FormSubmissionsPage from "./pages/shared/FormSubmissionsPage";
import TheatreWorkflowPage from "./pages/clinical/pages/TheatreWorkflowPage";
import MisReportsPage from "./pages/admin/pages/MisReportsPage";
import PatientPortalPage from "./pages/patient/pages/PatientPortalPage";
import PhysicianPortalPage from "./pages/clinical/pages/PhysicianPortalPage";
import RemindersNoShowPage from "./pages/reception/pages/RemindersNoShowPage";
import LabWorkflowPage from "./pages/clinical/pages/LabWorkflowPage";
import RevenueAnalyticsPage from "./pages/shared/RevenueAnalyticsPage";
import CalendarManagementPage from "./pages/reception/pages/CalendarManagementPage";
import MobileAccessPage from "./pages/admin/pages/MobileAccessPage";
import UgandaHmisCompliancePage from "./pages/admin/pages/UgandaHmisCompliancePage";
import WaitingTimeAnalyticsPage from "./pages/clinical/pages/WaitingTimeAnalyticsPage";
import ChatMessagingPage from "./pages/clinical/pages/ChatMessagingPage";
import PaymentGatewayPage from "./pages/reception/pages/PaymentGatewayPage";
import AeKpiDashboardPage from "./pages/clinical/pages/AeKpiDashboardPage";
import AccountingManagementPage from "./pages/admin/pages/AccountingManagementPage";
import { moduleConfigs } from "./modules";
import { canCreateInModule, canViewModule } from "./authz";
import api, { clearAuthTokens, getAccessToken, getRefreshToken } from "./api";
import { getRoleUi } from "./pages/roleUi";

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
  const roleUi = useMemo(() => (user ? getRoleUi(user.role) : null), [user]);

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

  const RoleLayout = roleUi.Layout;
  const RoleDashboard = roleUi.Dashboard;

  function renderModulePage(config) {
    if (!canViewModule(user.role, config.key)) return <Forbidden />;
    if (config.key === "form-builder") return <FormBuilderPage />;
    if (config.key === "form-submissions") return <FormSubmissionsPage />;
    if (config.key === "theatre-workflow") return <TheatreWorkflowPage />;
    if (config.key === "mis-reports") return <MisReportsPage />;
    if (config.key === "patient-portal") return <PatientPortalPage user={user} />;
    if (config.key === "physician-portal") return <PhysicianPortalPage />;
    if (config.key === "reminders-no-show") return <RemindersNoShowPage />;
    if (config.key === "lab-workflow") return <LabWorkflowPage />;
    if (config.key === "revenue-analytics") return <RevenueAnalyticsPage />;
    if (config.key === "calendar-management") return <CalendarManagementPage />;
    if (config.key === "mobile-access") return <MobileAccessPage />;
    if (config.key === "uganda-hmis-compliance") return <UgandaHmisCompliancePage />;
    if (config.key === "waiting-time-analytics") return <WaitingTimeAnalyticsPage />;
    if (config.key === "chat-messaging") return <ChatMessagingPage />;
    if (config.key === "payment-gateway") return <PaymentGatewayPage />;
    if (config.key === "ae-kpi-dashboard") return <AeKpiDashboardPage />;
    if (config.key === "accounting-management") return <AccountingManagementPage />;

    return (
      <ResourcePage
        config={config}
        canCreate={canCreateInModule(user.role, config.key)}
      />
    );
  }

  return (
    <RoleLayout modules={accessibleModules} user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<RoleDashboard modules={accessibleModules} user={user} />} />
        {moduleConfigs.map((config) => (
          <Route key={config.key} path={`/${config.key}`} element={renderModulePage(config)} />
        ))}
        <Route path="/change-password" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RoleLayout>
  );
}

export default App;
