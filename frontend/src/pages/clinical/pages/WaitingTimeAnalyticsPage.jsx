import { useEffect, useState } from "react";
import api from "../../../api";

function WaitingTimeAnalyticsPage() {
  const [from, setFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [waiting, setWaiting] = useState(null);
  const [monitoring, setMonitoring] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [waitingRes, monitoringRes] = await Promise.all([
        api.get(`/operations/waiting-time-analytics?from=${from}&to=${to}`),
        api.get("/operations/patient-monitoring-summary")
      ]);
      setWaiting(waitingRes.data);
      setMonitoring(monitoringRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Waiting Time & Monitoring Analytics</h2>
        <p className="mt-1 text-slate-600">Operational analytics for queue performance and patient monitoring alerts.</p>
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

      <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Avg Wait (minutes)</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{waiting?.avgWaitMinutes ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">No-Shows</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{waiting?.noShows ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Critical Monitoring</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{monitoring?.critical ?? 0}</p>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Wait By Service Point</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Service Point</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Tickets</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Avg Wait (mins)</th>
              </tr>
            </thead>
            <tbody>
              {(waiting?.byServicePoint || []).map((row) => (
                <tr key={row.servicePoint}>
                  <td className="border-b border-slate-100 px-3 py-2">{row.servicePoint}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.count}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.avgWaitMinutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default WaitingTimeAnalyticsPage;

