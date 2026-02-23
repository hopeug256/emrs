import { Link } from "react-router-dom";

const quickLinks = [
  { key: "users", label: "User Administration" },
  { key: "accounting-management", label: "Accounting Control" },
  { key: "budgets", label: "Budget Planning" },
  { key: "mis-reports", label: "MIS Reports" },
  { key: "uganda-hmis-compliance", label: "HMIS Compliance" },
  { key: "backup-schedules", label: "Backup Policies" }
];

function AdminDashboard({ modules }) {
  const moduleByKey = new Map(modules.map((module) => [module.key, module]));

  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Administration Overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Governance, finance controls, platform configuration, and compliance operations.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks
          .filter((item) => moduleByKey.has(item.key))
          .map((item) => (
            <Link
              key={item.key}
              to={`/${item.key}`}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <p className="text-sm text-slate-500">Quick Access</p>
              <h3 className="mt-1 text-lg font-medium text-slate-900">{item.label}</h3>
            </Link>
          ))}
      </section>
    </div>
  );
}

export default AdminDashboard;
