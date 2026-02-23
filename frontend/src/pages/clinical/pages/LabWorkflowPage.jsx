import { useEffect, useMemo, useState } from "react";
import api from "../../../api";

function LabWorkflowPage() {
  const [orders, setOrders] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [workflow, setWorkflow] = useState(null);
  const [values, setValues] = useState({});
  const [verify, setVerify] = useState({ step: "Technical", decision: "Approved", remarks: "" });
  const [printTemplateId, setPrintTemplateId] = useState("");
  const [printPreview, setPrintPreview] = useState("");
  const [ingest, setIngest] = useState({ instrumentCode: "", analyteCode: "", valueText: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const analyteRows = useMemo(() => {
    if (!workflow) return [];
    const panelRows = workflow.LabPanel?.panelAnalytes || [];
    if (panelRows.length) {
      return panelRows
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        .map((item) => item.LabAnalyte)
        .filter(Boolean);
    }
    return (workflow.result?.values || []).map((v) => v.LabAnalyte).filter(Boolean);
  }, [workflow]);

  async function loadBootstrap() {
    const [ordersRes, templatesRes, instrumentsRes] = await Promise.all([
      api.get("/lab-orders"),
      api.get("/lab-report-templates"),
      api.get("/lab-instruments")
    ]);
    setOrders(ordersRes.data);
    setTemplates(templatesRes.data);
    setInstruments(instrumentsRes.data);
  }

  async function loadOrder(orderId) {
    if (!orderId) return;
    const response = await api.get(`/lab-workflow/orders/${orderId}`);
    setWorkflow(response.data);
    const seed = {};
    for (const v of response.data.result?.values || []) {
      seed[v.labAnalyteId] = v.valueText ?? "";
    }
    setValues(seed);
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    loadBootstrap()
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedOrderId) return;
    setLoading(true);
    setError("");
    loadOrder(selectedOrderId)
      .catch((err) => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [selectedOrderId]);

  async function initializeWorkflow() {
    if (!selectedOrderId) return;
    setError("");
    setSuccess("");
    try {
      const response = await api.post(`/lab-workflow/orders/${selectedOrderId}/initialize`);
      setWorkflow(response.data);
      setSuccess("Lab workflow initialized.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function saveResults(e) {
    e.preventDefault();
    if (!selectedOrderId) return;
    setError("");
    setSuccess("");
    try {
      const payloadValues = analyteRows.map((a) => ({
        labAnalyteId: a.id,
        valueText: values[a.id] || ""
      }));
      const response = await api.put(`/lab-workflow/orders/${selectedOrderId}/results`, {
        values: payloadValues
      });
      setWorkflow(response.data);
      setSuccess("Results saved and flagged.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function submitVerification(e) {
    e.preventDefault();
    if (!selectedOrderId) return;
    setError("");
    setSuccess("");
    try {
      const response = await api.post(`/lab-workflow/orders/${selectedOrderId}/verify`, verify);
      setWorkflow(response.data);
      setSuccess("Verification submitted.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function ingestInstrument(e) {
    e.preventDefault();
    if (!selectedOrderId) return;
    const selectedOrder = orders.find((o) => o.id === selectedOrderId);
    if (!selectedOrder) return;
    setError("");
    setSuccess("");
    try {
      const response = await api.post("/lab-workflow/instrument/ingest", {
        instrumentCode: ingest.instrumentCode,
        orderNumber: selectedOrder.orderNumber,
        values: [{ analyteCode: ingest.analyteCode, valueText: ingest.valueText }]
      });
      setWorkflow(response.data);
      setSuccess("Instrument payload ingested.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function renderPrintable() {
    if (!selectedOrderId) return;
    setError("");
    setSuccess("");
    try {
      const suffix = printTemplateId ? `?templateId=${encodeURIComponent(printTemplateId)}` : "";
      const response = await api.get(`/lab-workflow/orders/${selectedOrderId}/printable${suffix}`);
      setPrintPreview(response.data.renderedText || "");
      setSuccess("Printable report rendered.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Advanced Lab Workflow</h2>
        <p className="mt-1 text-slate-600">
          Structured panel/analyte results, auto-flagging, instrument ingest, verification chain, and printable reports.
        </p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
            value={selectedOrderId}
            onChange={(e) => setSelectedOrderId(e.target.value)}
          >
            <option value="">Select Lab Order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} | {o.status} | panel: {o.labPanelId ? "yes" : "no"}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-lg bg-blue-700 px-3 py-2 text-white hover:bg-blue-800"
            onClick={initializeWorkflow}
          >
            Initialize
          </button>
          <button
            type="button"
            className="rounded-lg bg-slate-700 px-3 py-2 text-white hover:bg-slate-800"
            onClick={() => selectedOrderId && loadOrder(selectedOrderId)}
          >
            Refresh
          </button>
        </div>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        {success ? <p className="mt-2 text-sm text-emerald-700">{success}</p> : null}
      </section>

      {workflow ? (
        <>
          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Analyte Results</h3>
            <form className="mt-3 space-y-2" onSubmit={saveResults}>
              {analyteRows.map((analyte) => {
                const existing = (workflow.result?.values || []).find((v) => v.labAnalyteId === analyte.id);
                return (
                  <div className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_1fr_auto]" key={analyte.id}>
                    <div>
                      <p className="font-medium text-slate-800">{analyte.name}</p>
                      <p className="text-xs text-slate-500">
                        Ref: {analyte.referenceMin ?? "-"} - {analyte.referenceMax ?? "-"} {analyte.unit || ""}
                      </p>
                    </div>
                    <input
                      className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                      value={values[analyte.id] || ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [analyte.id]: e.target.value }))}
                      placeholder="Value"
                    />
                    <div className="text-sm text-slate-700">
                      Flag:{" "}
                      <span className="font-semibold">
                        {existing?.flag || "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
              <button
                type="submit"
                className="h-10 rounded-lg bg-blue-700 px-4 text-white hover:bg-blue-800"
              >
                Save Results
              </button>
            </form>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Instrument Interface</h3>
            <form className="mt-3 grid gap-3 sm:grid-cols-3" onSubmit={ingestInstrument}>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                value={ingest.instrumentCode}
                onChange={(e) => setIngest((prev) => ({ ...prev, instrumentCode: e.target.value }))}
                required
              >
                <option value="">Instrument</option>
                {instruments.map((i) => (
                  <option key={i.id} value={i.instrumentCode}>
                    {i.instrumentCode} - {i.name}
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                placeholder="Analyte Code"
                value={ingest.analyteCode}
                onChange={(e) => setIngest((prev) => ({ ...prev, analyteCode: e.target.value }))}
                required
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                placeholder="Value"
                value={ingest.valueText}
                onChange={(e) => setIngest((prev) => ({ ...prev, valueText: e.target.value }))}
                required
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-slate-700 px-4 text-white hover:bg-slate-800 sm:col-span-3"
              >
                Ingest Instrument Result
              </button>
            </form>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Verification / Sign-off Chain</h3>
            <form className="mt-3 grid gap-3 sm:grid-cols-4" onSubmit={submitVerification}>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                value={verify.step}
                onChange={(e) => setVerify((prev) => ({ ...prev, step: e.target.value }))}
              >
                <option>Technical</option>
                <option>Pathologist</option>
                <option>Final</option>
              </select>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                value={verify.decision}
                onChange={(e) => setVerify((prev) => ({ ...prev, decision: e.target.value }))}
              >
                <option>Approved</option>
                <option>Rejected</option>
              </select>
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2 sm:col-span-2"
                placeholder="Remarks"
                value={verify.remarks}
                onChange={(e) => setVerify((prev) => ({ ...prev, remarks: e.target.value }))}
              />
              <button
                type="submit"
                className="h-10 rounded-lg bg-blue-700 px-4 text-white hover:bg-blue-800 sm:col-span-4"
              >
                Submit Verification
              </button>
            </form>
            <div className="mt-3 space-y-1 text-sm text-slate-700">
              {(workflow.result?.verifications || []).map((v) => (
                <p key={v.id}>
                  {v.step}: {v.decision} by {v.verifiedBy?.username || "user"} at{" "}
                  {new Date(v.decidedAt).toLocaleString()}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Printable Report</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                value={printTemplateId}
                onChange={(e) => setPrintTemplateId(e.target.value)}
              >
                <option value="">Auto (latest active template)</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.code} - {t.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="rounded-lg bg-slate-700 px-3 py-2 text-white hover:bg-slate-800"
                onClick={renderPrintable}
              >
                Render Report
              </button>
            </div>
            {printPreview ? (
              <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                {printPreview}
              </pre>
            ) : null}
          </section>
        </>
      ) : null}
    </div>
  );
}

export default LabWorkflowPage;

