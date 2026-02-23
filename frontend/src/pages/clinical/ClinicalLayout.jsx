import { Link, useLocation } from "react-router-dom";
import { buildSections } from "../shared/navigation";

const clinicalSections = [
  {
    title: "Patient Care",
    keys: [
      "patients",
      "appointments",
      "visits",
      "encounters",
      "assessment-notes",
      "progress-notes",
      "visit-verifications",
      "patient-monitoring-records"
    ]
  },
  {
    title: "Diagnostics",
    keys: [
      "lab-workflow",
      "lab-orders",
      "lab-results",
      "radiology-orders",
      "electronic-lab-notebook-entries"
    ]
  },
  {
    title: "Inpatient & Theatre",
    keys: ["admissions", "patient-transfers", "discharge-summaries", "theatre-workflow", "surgeries", "emergency-cases"]
  },
  {
    title: "Collaboration",
    keys: ["physician-portal", "chat-messaging", "telemedicine-sessions", "referrals"]
  }
];

function ClinicalLayout({ modules, user, onLogout, children }) {
  const location = useLocation();
  const sections = buildSections(modules, clinicalSections);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-teal-50 md:grid-cols-[290px_1fr]">
      <aside className="bg-teal-900 p-5 text-teal-50 md:min-h-screen">
        <h1 className="text-2xl font-semibold">Clinical Workspace</h1>
        <p className="mt-1 text-sm text-teal-100">{user.fullName}</p>
        <p className="text-xs uppercase tracking-wide text-teal-200">{user.role}</p>
        <nav className="mt-5 space-y-4">
          <Link
            to="/"
            className={`block rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/" ? "bg-teal-700" : "hover:bg-teal-800"
            }`}
          >
            Clinical Home
          </Link>
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-200">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.modules.map((module) => (
                  <Link
                    key={module.key}
                    to={`/${module.key}`}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      location.pathname === `/${module.key}` ? "bg-teal-700" : "hover:bg-teal-800"
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
            className="mt-3 w-full rounded-lg border border-teal-600 px-3 py-2 text-left text-sm hover:bg-teal-800"
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

export default ClinicalLayout;
