import { useEffect, useState } from "react";
import api from "../../../api";

function AeKpiDashboardPage() {
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/operations/ae-kpis?from=${from}&to=${to}`);
      setData(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cards = [
    ["Total Cases", data?.totalCases ?? 0],
    ["Door-To-Triage (mins)", data?.avgDoorToTriageMinutes ?? 0],
    ["Door-To-Provider (mins)", data?.avgDoorToProviderMinutes ?? 0],
    ["Disposition Time (mins)", data?.avgDispositionMinutes ?? 0]
  ];

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">A&E KPI Dashboard</h2>
        <p className="mt-1 text-slate-600">Tracks emergency throughput times from arrival to disposition.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">From</span>
            <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">To</span>
            <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button type="button" className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800" onClick={load}>
            Refresh
          </button>
        </div>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Recent Cases</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Case</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Arrival</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Triaged</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Provider Seen</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Disposition</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Triage</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentCases || []).map((row) => (
                <tr key={row.caseNumber}>
                  <td className="border-b border-slate-100 px-3 py-2">{row.caseNumber}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.arrivalAt ? new Date(row.arrivalAt).toLocaleString() : "-"}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.triagedAt ? new Date(row.triagedAt).toLocaleString() : "-"}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.providerSeenAt ? new Date(row.providerSeenAt).toLocaleString() : "-"}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.dispositionAt ? new Date(row.dispositionAt).toLocaleString() : "-"}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.triageLevel}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AeKpiDashboardPage;

