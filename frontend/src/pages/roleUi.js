import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ClinicalLayout from "./clinical/ClinicalLayout";
import ClinicalDashboard from "./clinical/ClinicalDashboard";
import ReceptionLayout from "./reception/ReceptionLayout";
import ReceptionDashboard from "./reception/ReceptionDashboard";
import PatientLayout from "./patient/PatientLayout";
import PatientDashboard from "./patient/PatientDashboard";

export function getRoleUi(role) {
  if (role === "admin") {
    return { Layout: AdminLayout, Dashboard: AdminDashboard };
  }

  if (role === "doctor" || role === "nurse") {
    return { Layout: ClinicalLayout, Dashboard: ClinicalDashboard };
  }

  if (role === "receptionist") {
    return { Layout: ReceptionLayout, Dashboard: ReceptionDashboard };
  }

  if (role === "patient") {
    return { Layout: PatientLayout, Dashboard: PatientDashboard };
  }

  return { Layout: ClinicalLayout, Dashboard: ClinicalDashboard };
}
