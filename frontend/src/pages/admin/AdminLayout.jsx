import { Link, useLocation } from "react-router-dom";
import { buildSections } from "../shared/navigation";

const adminSections = [
  {
    title: "Administration",
    keys: ["users", "departments", "providers", "employees", "tenants", "locations", "provider-assignments"]
  },
  {
    title: "Finance",
    keys: [
      "accounting-management",
      "accounting-policy",
      "accounting-periods",
      "chart-accounts",
      "journal-entries",
      "journal-entry-lines",
      "budgets",
      "budget-lines",
      "invoices",
      "payments",
      "claims",
      "payors",
      "revenue-analytics"
    ]
  },
  {
    title: "Operations",
    keys: [
      "mis-reports",
      "uganda-hmis-compliance",
      "backup-schedules",
      "backup-logs",
      "mobile-access",
      "mobile-clients",
      "security-events"
    ]
  }
];

function AdminLayout({ modules, user, onLogout, children }) {
  const location = useLocation();
  const sections = buildSections(modules, adminSections);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-slate-100 md:grid-cols-[300px_1fr]">
      <aside className="bg-slate-900 p-5 text-slate-100 md:min-h-screen">
        <h1 className="text-2xl font-semibold">Admin Console</h1>
        <p className="mt-1 text-sm text-slate-300">{user.fullName}</p>
        <p className="text-xs uppercase tracking-wide text-slate-400">{user.role}</p>
        <nav className="mt-5 space-y-4">
          <Link
            to="/"
            className={`block rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/" ? "bg-slate-700" : "hover:bg-slate-800"
            }`}
          >
            Overview
          </Link>
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.modules.map((module) => (
                  <Link
                    key={module.key}
                    to={`/${module.key}`}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      location.pathname === `/${module.key}` ? "bg-slate-700" : "hover:bg-slate-800"
                    }`}
                  >
                    {module.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="mt-3 w-full rounded-lg border border-slate-600 px-3 py-2 text-left text-sm hover:bg-slate-800"
            onClick={onLogout}
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}

export default AdminLayout;
