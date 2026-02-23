import { useEffect, useState } from "react";
import api from "../api";

function MisReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadOverview() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/reports/overview");
      setData(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  const cards = [
    ["Total Patients", data?.totalPatients],
    ["Total Appointments", data?.totalAppointments],
    ["Pending Invoices", data?.pendingInvoices],
    ["Lab Orders", data?.totalLabOrders],
    ["Radiology Orders", data?.totalRadiologyOrders],
    ["Active Admissions", data?.activeAdmissions],
    ["Waiting Queue", data?.waitingQueue],
    ["Scheduled Surgeries", data?.scheduledSurgeries]
  ];

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">MIS Reports</h2>
        <p className="mt-1 text-slate-600">Real-time operational snapshot for hospital leadership.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Overview</h3>
          <button
            type="button"
            onClick={loadOverview}
            className="rounded-lg bg-blue-700 px-3 py-2 text-sm text-white hover:bg-blue-800"
          >
            Refresh
          </button>
        </div>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        {data ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{value ?? 0}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default MisReportsPage;
