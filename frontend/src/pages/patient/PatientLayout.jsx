import { Link, useLocation } from "react-router-dom";
import { buildSections } from "../shared/navigation";

const patientSections = [
  {
    title: "My Health",
    keys: [
      "patient-portal",
      "prescription-renewal-requests",
      "prescription-cancellation-requests",
      "care-summary-exchanges"
    ]
  }
];

function PatientLayout({ modules, user, onLogout, children }) {
  const location = useLocation();
  const sections = buildSections(modules, patientSections);

  return (
    <div className="min-h-screen bg-cyan-50">
      <header className="border-b border-cyan-200 bg-white px-4 py-3 shadow-sm sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Patient Portal</h1>
            <p className="text-sm text-slate-600">{user.fullName}</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
        <nav className="mt-3 flex flex-wrap gap-2">
          <Link
            to="/"
            className={`rounded-lg px-3 py-1.5 text-sm ${
              location.pathname === "/" ? "bg-cyan-700 text-white" : "bg-cyan-100 text-cyan-900 hover:bg-cyan-200"
            }`}
          >
            Home
          </Link>
          {sections.flatMap((section) =>
            section.modules.map((module) => (
              <Link
                key={module.key}
                to={`/${module.key}`}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  location.pathname === `/${module.key}`
                    ? "bg-cyan-700 text-white"
                    : "bg-cyan-100 text-cyan-900 hover:bg-cyan-200"
                }`}
              >
                {module.title}
              </Link>
            ))
          )}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6">{children}</main>
    </div>
  );
}

export default PatientLayout;
