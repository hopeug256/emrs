import { useEffect, useState } from "react";
import api from "../api";

function RevenueAnalyticsPage() {
  const [days, setDays] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [historical, setHistorical] = useState(null);
  const [pricingInput, setPricingInput] = useState({ serviceCatalogId: "", servicePackageId: "", quantity: 1 });
  const [pricingPreview, setPricingPreview] = useState(null);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAll(requestedDays = days) {
    setLoading(true);
    setError("");
    try {
      const [analyticsRes, historicalRes, serviceRes, packageRes] = await Promise.all([
        api.get("/reports/analytics"),
        api.get(`/reports/historical?days=${requestedDays}`),
        api.get("/service-catalog"),
        api.get("/service-packages")
      ]);
      setAnalytics(analyticsRes.data);
      setHistorical(historicalRes.data);
      setServices(serviceRes.data);
      setPackages(packageRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handlePreview(e) {
    e.preventDefault();
    setError("");
    setPricingPreview(null);
    try {
      const payload = { quantity: Number(pricingInput.quantity || 1) };
      if (pricingInput.serviceCatalogId) payload.serviceCatalogId = pricingInput.serviceCatalogId;
      if (pricingInput.servicePackageId) payload.servicePackageId = pricingInput.servicePackageId;
      const { data } = await api.post("/billing/price-preview", payload);
      setPricingPreview(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  const metrics = [
    ["Total Billed", analytics?.revenue?.totalBilled],
    ["Total Collected", analytics?.revenue?.totalCollected],
    ["Collection Rate (%)", analytics?.revenue?.collectionRate],
    ["Claimed", analytics?.claims?.totalClaimed],
    ["Claim Approval (%)", analytics?.claims?.claimApprovalRate],
    ["No-Show Count", analytics?.operations?.appointmentNoShowCount],
    ["Attendance Rate (%)", analytics?.workforce?.attendanceRate],
    ["Avg Performance", analytics?.workforce?.avgPerformanceScore]
  ];

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Billing, Revenue Cycle & Analytics</h2>
        <p className="mt-1 text-slate-600">Financial KPIs, historical trends, and dynamic pricing preview.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Historical Window (days)</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              type="number"
              min="7"
              max="365"
              value={days}
              onChange={(e) => setDays(Number(e.target.value || 30))}
            />
          </label>
          <button
            type="button"
            className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800"
            onClick={() => loadAll(days)}
          >
            Refresh Analytics
          </button>
        </div>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">KPI Snapshot</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{value ?? 0}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Dynamic Pricing Preview</h3>
        <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={handlePreview}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Service</span>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={pricingInput.serviceCatalogId}
              onChange={(e) => setPricingInput((prev) => ({ ...prev, serviceCatalogId: e.target.value, servicePackageId: "" }))}
            >
              <option value="">Select service</option>
              {services.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.serviceCode} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Package</span>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={pricingInput.servicePackageId}
              onChange={(e) => setPricingInput((prev) => ({ ...prev, servicePackageId: e.target.value, serviceCatalogId: "" }))}
            >
              <option value="">Select package</option>
              {packages.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.packageCode} - {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Quantity</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              type="number"
              min="1"
              value={pricingInput.quantity}
              onChange={(e) => setPricingInput((prev) => ({ ...prev, quantity: e.target.value }))}
            />
          </label>
          <button className="h-10 self-end rounded-lg bg-emerald-700 px-3 text-white hover:bg-emerald-800" type="submit">
            Preview Price
          </button>
        </form>
        {pricingPreview ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            Base: {pricingPreview.baseAmount} | Final: {pricingPreview.finalAmount} | Rules: {pricingPreview.adjustments.length}
          </div>
        ) : null}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Historical Trend (Appointments)</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Day</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Count</th>
              </tr>
            </thead>
            <tbody>
              {(historical?.appointmentsByDay || []).slice(-20).map((row) => (
                <tr key={row.day}>
                  <td className="border-b border-slate-100 px-3 py-2">{row.day}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default RevenueAnalyticsPage;
