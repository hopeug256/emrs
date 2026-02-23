import { useEffect, useState } from "react";
import api from "../api";

function toIsoDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

function CalendarManagementPage() {
  const [start, setStart] = useState(() => new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10));
  const [end, setEnd] = useState(() => new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10));
  const [timeline, setTimeline] = useState([]);
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    eventNumber: "",
    title: "",
    eventType: "General",
    startAt: "",
    endAt: "",
    status: "Scheduled",
    patientId: "",
    providerId: "",
    notes: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadTimeline() {
    setLoading(true);
    setError("");
    try {
      const [timelineRes, patientRes, providerRes] = await Promise.all([
        api.get(`/calendar/timeline?start=${start}&end=${end}`),
        api.get("/patients"),
        api.get("/providers")
      ]);
      setTimeline(timelineRes.data.items || []);
      setPatients(patientRes.data);
      setProviders(providerRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTimeline();
  }, []);

  async function createEvent(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/calendar-events", form);
      setForm({
        eventNumber: "",
        title: "",
        eventType: "General",
        startAt: "",
        endAt: "",
        status: "Scheduled",
        patientId: "",
        providerId: "",
        notes: ""
      });
      await loadTimeline();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Calendar Management</h2>
        <p className="mt-1 text-slate-600">Unified timeline for appointments, surgeries, telemedicine, and manual events.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Start</span>
            <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">End</span>
            <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </label>
          <button type="button" className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800" onClick={loadTimeline}>
            Load Timeline
          </button>
        </div>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Create Calendar Event</h3>
        <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={createEvent}>
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Event number" value={form.eventNumber} onChange={(e) => setForm((prev) => ({ ...prev, eventNumber: e.target.value }))} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
          <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.eventType} onChange={(e) => setForm((prev) => ({ ...prev, eventType: e.target.value }))}>
            {["Appointment", "Surgery", "Telemedicine", "General"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
            {["Scheduled", "Completed", "Cancelled"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2" type="datetime-local" value={toIsoDateTimeLocal(form.startAt)} onChange={(e) => setForm((prev) => ({ ...prev, startAt: e.target.value }))} required />
          <input className="rounded-lg border border-slate-300 px-3 py-2" type="datetime-local" value={toIsoDateTimeLocal(form.endAt)} onChange={(e) => setForm((prev) => ({ ...prev, endAt: e.target.value }))} />
          <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.patientId} onChange={(e) => setForm((prev) => ({ ...prev, patientId: e.target.value }))}>
            <option value="">Patient (optional)</option>
            {patients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.mrn} - {item.firstName} {item.lastName}
              </option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.providerId} onChange={(e) => setForm((prev) => ({ ...prev, providerId: e.target.value }))}>
            <option value="">Provider (optional)</option>
            {providers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.providerCode} - {item.firstName} {item.lastName}
              </option>
            ))}
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2 md:col-span-3" placeholder="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
          <button className="h-10 rounded-lg bg-emerald-700 px-3 text-white hover:bg-emerald-800" type="submit">
            Create Event
          </button>
        </form>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Source</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Type</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Title</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Start</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Status</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Patient</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Provider</th>
              </tr>
            </thead>
            <tbody>
              {timeline.slice(0, 200).map((item) => (
                <tr key={`${item.source}-${item.id}`}>
                  <td className="border-b border-slate-100 px-3 py-2">{item.source}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.type}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.title}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.startAt ? new Date(item.startAt).toLocaleString() : "-"}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.status}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.patient || "-"}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.provider || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CalendarManagementPage;
