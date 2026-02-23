import { useEffect, useMemo, useState } from "react";
import api from "../../../api";

function PatientPortalPage({ user }) {
  const [patientId, setPatientId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    if (!data) return null;
    return [
      ["Appointments", data.appointments?.length || 0],
      ["Prescriptions", data.prescriptions?.length || 0],
      ["Lab Orders", data.labOrders?.length || 0],
      ["Radiology Orders", data.radiologyOrders?.length || 0],
      ["Invoices", data.invoices?.length || 0],
      ["Telemedicine Sessions", data.telemedicineSessions?.length || 0],
      ["Documents", data.documents?.length || 0]
    ];
  }, [data]);

  const isPatientUser = user?.role === "patient";

  async function loadPortal(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const query = isPatientUser
        ? "/portal/patient-summary"
        : `/portal/patient-summary?patientId=${encodeURIComponent(patientId)}`;
      const response = await api.get(query);
      setData(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isPatientUser) {
      loadPortal();
    }
  }, [isPatientUser]);

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Patient Portal</h2>
        <p className="mt-1 text-slate-600">View consolidated patient-facing clinical and billing data.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {isPatientUser ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Showing your own health portal data.</p>
            <button
              className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
              type="button"
              onClick={() => loadPortal()}
            >
              Refresh
            </button>
          </div>
        ) : (
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={loadPortal}>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              placeholder="Patient ID"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800" type="submit">
              Load Portal
            </button>
          </form>
        )}
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </section>

      {data ? (
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            {data.patient?.mrn} - {data.patient?.firstName} {data.patient?.lastName}
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default PatientPortalPage;

