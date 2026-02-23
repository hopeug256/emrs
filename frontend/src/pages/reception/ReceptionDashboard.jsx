import { Link } from "react-router-dom";

const receptionCards = [
  { key: "appointments", title: "Today Appointments", subtitle: "Register and manage arrivals" },
  { key: "queue-tickets", title: "Queue Desk", subtitle: "Issue and track tokens" },
  { key: "invoices", title: "Invoice Counter", subtitle: "Create and manage patient bills" },
  { key: "payments", title: "Payments", subtitle: "Record cash/mobile card payments" },
  { key: "reminders-no-show", title: "Reminder Center", subtitle: "Automated reminders and no-shows" },
  { key: "payment-gateway", title: "Gateway Panel", subtitle: "Track online payment requests" }
];

function ReceptionDashboard({ modules }) {
  const allowed = new Set(modules.map((module) => module.key));

  return (
    <div className="space-y-5">
      <header className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Reception Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Registration, scheduling, queue flow, and billing counter controls.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {receptionCards
          .filter((card) => allowed.has(card.key))
          .map((card) => (
            <Link
              key={card.key}
              to={`/${card.key}`}
              className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <h3 className="text-lg font-medium text-slate-900">{card.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{card.subtitle}</p>
            </Link>
          ))}
      </section>
    </div>
  );
}

export default ReceptionDashboard;
