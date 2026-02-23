import { useEffect, useState } from "react";
import api from "../../../api";

function UgandaHmisCompliancePage() {
  const [from, setFrom] = useState(() => new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);
  const [exportMeta, setExportMeta] = useState({ reportCodes: [], mappings: {} });
  const [exportConfig, setExportConfig] = useState({
    reportCode: "HMIS105",
    format: "csv",
    periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10),
    periodEnd: new Date().toISOString().slice(0, 10),
    facilityCode: "FAC-001",
    district: "Kampala"
  });
  const [error, setError] = useState("");
  const [exportStatus, setExportStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadDashboard() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/hmis/compliance/dashboard?from=${from}&to=${to}`);
      setData(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    api
      .get("/hmis/exports/meta")
      .then((response) => setExportMeta(response.data))
      .catch(() => {
        // Keep page functional even if export meta fails.
      });
  }, []);

  async function downloadExport(e) {
    e.preventDefault();
    setError("");
    setExportStatus("");
    try {
      const response = await api.get(`/hmis/exports/${exportConfig.reportCode}`, {
        params: {
          format: exportConfig.format,
          periodStart: exportConfig.periodStart,
          periodEnd: exportConfig.periodEnd,
          facilityCode: exportConfig.facilityCode,
          district: exportConfig.district
        },
        responseType: "blob"
      });
      const disposition = response.headers["content-disposition"] || "";
      const match = disposition.match(/filename="(.+)"/);
      const filename = match?.[1] || `${exportConfig.reportCode}.${exportConfig.format}`;
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      setExportStatus(`Downloaded ${filename}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  const cards = [
    ["HMIS Reports", data?.totals?.hmisReports ?? 0],
    ["Surveillance Cases", data?.totals?.surveillanceCases ?? 0],
    ["24h Notifiable Timeliness %", data?.totals?.notifiable24hTimelinessRate ?? 0]
  ];

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Uganda HMIS Compliance</h2>
        <p className="mt-1 text-slate-600">
          Tracks timeliness and completeness of HMIS/IDSR submissions against Uganda MoH workflow timelines.
        </p>
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
          <button type="button" onClick={loadDashboard} className="rounded-lg bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
            Refresh
          </button>
        </div>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </section>

      <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">HMIS Export Pack</h3>
        <p className="mt-1 text-sm text-slate-600">Generate period-based file exports (JSON, CSV, PDF) by HMIS form code.</p>
        <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6" onSubmit={downloadExport}>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Report Code</span>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={exportConfig.reportCode}
              onChange={(e) => setExportConfig((prev) => ({ ...prev, reportCode: e.target.value }))}
            >
              {(exportMeta.reportCodes || []).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Format</span>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={exportConfig.format}
              onChange={(e) => setExportConfig((prev) => ({ ...prev, format: e.target.value }))}
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Period Start</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              type="date"
              value={exportConfig.periodStart}
              onChange={(e) => setExportConfig((prev) => ({ ...prev, periodStart: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Period End</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              type="date"
              value={exportConfig.periodEnd}
              onChange={(e) => setExportConfig((prev) => ({ ...prev, periodEnd: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">Facility Code</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={exportConfig.facilityCode}
              onChange={(e) => setExportConfig((prev) => ({ ...prev, facilityCode: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-slate-700">District</span>
            <input
              className="rounded-lg border border-slate-300 px-3 py-2"
              value={exportConfig.district}
              onChange={(e) => setExportConfig((prev) => ({ ...prev, district: e.target.value }))}
            />
          </label>
          <button type="submit" className="h-10 rounded-lg bg-emerald-700 px-3 text-white hover:bg-emerald-800">
            Download Export
          </button>
        </form>
        {exportStatus ? <p className="mt-2 text-sm text-emerald-700">{exportStatus}</p> : null}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Exact Column Mapping</h3>
        <p className="mt-1 text-sm text-slate-600">
          Template: {exportMeta.templates?.[exportConfig.reportCode]?.formName || exportConfig.reportCode} -{" "}
          {exportMeta.templates?.[exportConfig.reportCode]?.title || "MoH form"}
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Key</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Label</th>
              </tr>
            </thead>
            <tbody>
              {(exportMeta.mappings?.[exportConfig.reportCode] || []).map((col) => (
                <tr key={col.key}>
                  <td className="border-b border-slate-100 px-3 py-2">{col.key}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{col.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">HMIS Report Timeliness by Form</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Form</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Total</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">On Time</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Late</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Pending</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Timeliness %</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Avg Completeness %</th>
              </tr>
            </thead>
            <tbody>
              {(data?.reportByCode || []).map((row) => (
                <tr key={row.key}>
                  <td className="border-b border-slate-100 px-3 py-2">{row.key}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.total}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.onTime}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.late}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.pending}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.timelinessRate}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{row.averageCompleteness}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default UgandaHmisCompliancePage;

