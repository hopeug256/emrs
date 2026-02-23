import { Link } from "react-router-dom";

const patientCards = [
  { key: "patient-portal", title: "My Health Summary", subtitle: "Visits, medications, and labs" },
  {
    key: "prescription-renewal-requests",
    title: "Request Renewal",
    subtitle: "Ask for prescription renewal"
  },
  {
    key: "prescription-cancellation-requests",
    title: "Cancel Prescription",
    subtitle: "Submit cancellation requests"
  },
  { key: "care-summary-exchanges", title: "Care Summaries", subtitle: "Exchange and track records" }
];

function PatientDashboard({ modules }) {
  const allowed = new Set(modules.map((module) => module.key));

  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-cyan-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">My Self-Service Home</h2>
        <p className="mt-1 text-sm text-slate-600">
          Use this portal to access your health records and submit requests.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {patientCards
          .filter((card) => allowed.has(card.key))
          .map((card) => (
            <Link
              key={card.key}
              to={`/${card.key}`}
              className="rounded-xl border border-cyan-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <h3 className="text-lg font-medium text-slate-900">{card.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{card.subtitle}</p>
            </Link>
          ))}
      </section>
    </div>
  );
}

export default PatientDashboard;
