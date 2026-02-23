import { useEffect, useState } from "react";
import api from "../../../api";

function PaymentGatewayPage() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    invoiceId: "",
    patientId: "",
    amount: "",
    gatewayName: "MTNMoMo",
    externalReference: ""
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function loadOptions() {
    try {
      const [invRes, patRes] = await Promise.all([api.get("/invoices"), api.get("/patients")]);
      setInvoices(invRes.data);
      setPatients(patRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  async function processPayment(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    try {
      const { data } = await api.post("/operations/payment-gateway/process", {
        ...form,
        amount: Number(form.amount)
      });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Payment Processing Gateway</h2>
        <p className="mt-1 text-slate-600">Capture bill payments through gateway flow and auto-post to payments.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form className="grid grid-cols-1 gap-3 md:grid-cols-3" onSubmit={processPayment}>
          <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.invoiceId} onChange={(e) => setForm((p) => ({ ...p, invoiceId: e.target.value }))} required>
            <option value="">Select Invoice</option>
            {invoices.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id.slice(0, 8)} - {item.amount}
              </option>
            ))}
          </select>
          <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.patientId} onChange={(e) => setForm((p) => ({ ...p, patientId: e.target.value }))} required>
            <option value="">Select Patient</option>
            {patients.map((item) => (
              <option key={item.id} value={item.id}>
                {item.mrn} - {item.firstName} {item.lastName}
              </option>
            ))}
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
          <select className="rounded-lg border border-slate-300 px-3 py-2" value={form.gatewayName} onChange={(e) => setForm((p) => ({ ...p, gatewayName: e.target.value }))}>
            {["Flutterwave", "MTNMoMo", "AirtelMoney", "Stripe", "Custom"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="External Reference" value={form.externalReference} onChange={(e) => setForm((p) => ({ ...p, externalReference: e.target.value }))} />
          <button className="h-10 rounded-lg bg-emerald-700 px-3 text-white hover:bg-emerald-800" type="submit">
            Process Payment
          </button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        {result ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <p>{result.message}</p>
            <p>Gateway Tx: {result.gatewayTransaction?.transactionNumber}</p>
            <p>Payment: {result.payment?.paymentNumber}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default PaymentGatewayPage;

