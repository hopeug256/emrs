import { Link } from "react-router-dom";

function Dashboard({ modules }) {
  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">OpenMRS-Inspired Hospital Modules</h2>
        <p className="mt-1 text-slate-600">
          Manage patient lifecycle, encounters, medication, and billing.
        </p>
      </header>
      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <Link
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            to={`/${module.key}`}
            key={module.key}
          >
            <h3 className="font-medium">{module.title}</h3>
            <span className="text-sm text-blue-700">Open module</span>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default Dashboard;

