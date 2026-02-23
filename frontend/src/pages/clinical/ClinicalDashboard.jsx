import { Link } from "react-router-dom";

const cards = [
  { key: "patients", title: "Patient List", subtitle: "Search and open records" },
  { key: "appointments", title: "Appointments", subtitle: "Current and upcoming clinics" },
  { key: "lab-workflow", title: "Lab Workflow", subtitle: "Orders, results, verification" },
  { key: "emergency-cases", title: "A&E Board", subtitle: "Triage and disposition queue" },
  { key: "theatre-workflow", title: "Theatre Workflow", subtitle: "Pre-op, intra-op, post-op" },
  { key: "chat-messaging", title: "Clinical Chat", subtitle: "Team communication stream" }
];

function ClinicalDashboard({ modules }) {
  const allowed = new Set(modules.map((module) => module.key));

  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-teal-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Clinical Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Fast access to bedside workflows, diagnostics, and care-team collaboration.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards
          .filter((card) => allowed.has(card.key))
          .map((card) => (
            <Link
              key={card.key}
              to={`/${card.key}`}
              className="rounded-xl border border-teal-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <h3 className="text-lg font-medium text-slate-900">{card.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{card.subtitle}</p>
            </Link>
          ))}
      </section>
    </div>
  );
}

export default ClinicalDashboard;
