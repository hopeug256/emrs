const adminOnlyModules = new Set([
  "users",
  "security-events",
  "mobile-clients",
  "mobile-access",
  "accounting-policy",
  "accounting-periods",
  "chart-accounts",
  "journal-entries",
  "journal-entry-lines",
  "budgets",
  "budget-lines",
  "accounting-management",
  "tenants",
  "backup-schedules",
  "backup-logs",
  "employees",
  "payroll-cycles",
  "payslips",
  "payors"
]);

const receptionistViewModules = new Set([
  "patients",
  "appointments",
  "appointment-series",
  "booking-rules",
  "queue-tickets",
  "invoices",
  "notifications",
  "reminders-no-show",
  "patient-portal",
  "insurance-policies",
  "insurance-providers",
  "referrals",
  "client-accounts",
  "credit-control-events",
  "payment-gateway-transactions",
  "payment-gateway",
  "chat-messaging",
  "waiting-time-analytics",
  "service-catalog",
  "pricing-rules",
  "service-packages",
  "package-items",
  "charge-items",
  "payments",
  "revenue-cycle-tasks",
  "barcode-labels",
  "print-jobs",
  "calendar-management"
]);

const patientModules = new Set([
  "patient-portal",
  "prescription-renewal-requests",
  "prescription-cancellation-requests",
  "care-summary-exchanges"
]);

const noCreateModules = new Set([
  "mis-reports",
  "patient-portal",
  "physician-portal",
  "theatre-workflow",
  "form-builder",
  "form-submissions",
  "reminders-no-show",
  "waiting-time-analytics",
  "ae-kpi-dashboard",
  "chat-messaging",
  "payment-gateway",
  "uganda-hmis-compliance",
  "revenue-analytics",
  "calendar-management",
  "accounting-management",
  "mobile-access"
]);

export function canViewModule(role, moduleKey) {
  if (role === "admin") return true;
  if (role === "patient") return patientModules.has(moduleKey);
  if (role === "receptionist") return receptionistViewModules.has(moduleKey);
  if (role === "doctor" || role === "nurse") {
    return !adminOnlyModules.has(moduleKey);
  }
  return false;
}

export function canCreateInModule(role, moduleKey) {
  if (noCreateModules.has(moduleKey)) return false;
  if (role === "admin") return true;
  if (role === "patient") return patientModules.has(moduleKey);
  if (role === "receptionist") {
    return new Set([
      "patients",
      "appointments",
      "appointment-series",
      "booking-rules",
      "queue-tickets",
      "invoices",
      "notifications",
      "insurance-policies",
      "insurance-providers",
      "referrals",
      "client-accounts",
      "credit-control-events",
      "payment-gateway-transactions",
      "service-catalog",
      "pricing-rules",
      "service-packages",
      "package-items",
      "charge-items",
      "payments",
      "revenue-cycle-tasks",
      "barcode-labels",
      "print-jobs"
    ]).has(moduleKey);
  }
  if (role === "doctor" || role === "nurse") {
    return !adminOnlyModules.has(moduleKey);
  }
  return false;
}
