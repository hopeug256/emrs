import { Link, useLocation } from "react-router-dom";
import { buildSections } from "../shared/navigation";

const receptionSections = [
  {
    title: "Front Desk",
    keys: ["patients", "appointments", "appointment-series", "booking-rules", "queue-tickets", "calendar-management"]
  },
  {
    title: "Billing Desk",
    keys: [
      "invoices",
      "payments",
      "service-catalog",
      "service-packages",
      "package-items",
      "charge-items",
      "pricing-rules",
      "payment-gateway",
      "payment-gateway-transactions",
      "client-accounts",
      "credit-control-events"
    ]
  },
  {
    title: "Patient Communication",
    keys: ["notifications", "reminders-no-show", "patient-portal", "referrals", "chat-messaging"]
  }
];

function ReceptionLayout({ modules, user, onLogout, children }) {
  const location = useLocation();
  const sections = buildSections(modules, receptionSections);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-amber-50 md:grid-cols-[290px_1fr]">
      <aside className="bg-amber-900 p-5 text-amber-50 md:min-h-screen">
        <h1 className="text-2xl font-semibold">Front Desk Workspace</h1>
        <p className="mt-1 text-sm text-amber-100">{user.fullName}</p>
        <p className="text-xs uppercase tracking-wide text-amber-200">{user.role}</p>
        <nav className="mt-5 space-y-4">
          <Link
            to="/"
            className={`block rounded-lg px-3 py-2 text-sm ${
              location.pathname === "/" ? "bg-amber-700" : "hover:bg-amber-800"
            }`}
          >
            Front Desk Home
          </Link>
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.modules.map((module) => (
                  <Link
                    key={module.key}
                    to={`/${module.key}`}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      location.pathname === `/${module.key}` ? "bg-amber-700" : "hover:bg-amber-800"
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
            className="mt-3 w-full rounded-lg border border-amber-600 px-3 py-2 text-left text-sm hover:bg-amber-800"
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

export default ReceptionLayout;
