import { useEffect, useState } from "react";
import api from "../../../api";

function RemindersNoShowPage() {
  const [hours, setHours] = useState(24);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [appointmentsRes, notificationsRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/notifications")
      ]);
      setAppointments(appointmentsRes.data);
      setNotifications(notificationsRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function generateReminders(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/notifications/appointment-reminders/generate", { hours });
      setSuccess(`Generated ${response.data.generated} reminders.`);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function markNoShow(appointmentId) {
    setError("");
    setSuccess("");
    try {
      await api.post(`/appointments/${appointmentId}/mark-no-show`, {
        notes: "Marked as no-show via reminder workflow"
      });
      setSuccess("Appointment marked as no-show.");
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Notifications, Reminders & No-Show</h2>
        <p className="mt-1 text-slate-600">Generate reminders and track no-show appointments.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form className="flex flex-wrap items-end gap-3" onSubmit={generateReminders}>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-slate-700">Reminder Window (hours)</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              type="number"
              min="1"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
            />
          </label>
          <button className="h-10 rounded-lg bg-blue-700 px-4 text-white hover:bg-blue-800" type="submit">
            Generate Appointment Reminders
          </button>
        </form>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {success ? <p className="mt-2 text-sm text-emerald-700">{success}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Appointments</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Time</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Patient</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Status</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 30).map((appt) => (
                <tr key={appt.id}>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleString() : "-"}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {appt.Patient ? `${appt.Patient.mrn} - ${appt.Patient.firstName} ${appt.Patient.lastName}` : "-"}
                  </td>
                  <td className="border-b border-slate-100 px-3 py-2">{appt.status}</td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {appt.status !== "NoShow" ? (
                      <button
                        type="button"
                        onClick={() => markNoShow(appt.id)}
                        className="rounded-lg bg-amber-600 px-2 py-1 text-xs text-white hover:bg-amber-700"
                      >
                        Mark No-Show
                      </button>
                    ) : (
                      <span className="text-xs text-amber-700">No-show</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Recent Notifications</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Type</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Title</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Status</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {notifications.slice(0, 30).map((n) => (
                <tr key={n.id}>
                  <td className="border-b border-slate-100 px-3 py-2">{n.type}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{n.title}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{n.status}</td>
                  <td className="border-b border-slate-100 px-3 py-2">
                    {n.sentAt ? new Date(n.sentAt).toLocaleString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default RemindersNoShowPage;

