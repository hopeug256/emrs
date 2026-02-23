import { useEffect, useState } from "react";
import api from "../api";

function MobileAccessPage() {
  const [clients, setClients] = useState([]);
  const [sdkProbe, setSdkProbe] = useState(null);
  const [probeHeaders, setProbeHeaders] = useState({
    clientId: "",
    apiKey: "",
    sdkVersion: "1.0.0"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadClients() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/mobile-clients");
      setClients(data);
      if (data.length && !probeHeaders.clientId) {
        setProbeHeaders((prev) => ({
          ...prev,
          clientId: data[0].clientId,
          apiKey: data[0].apiKey,
          sdkVersion: data[0].minSdkVersion || "1.0.0"
        }));
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function probeSdkConfig(e) {
    e.preventDefault();
    setError("");
    setSdkProbe(null);
    try {
      const { data } = await api.get("/mobile/sdk-config", {
        headers: {
          "x-mobile-client-id": probeHeaders.clientId,
          "x-mobile-api-key": probeHeaders.apiKey,
          "x-mobile-sdk-version": probeHeaders.sdkVersion
        }
      });
      setSdkProbe(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Mobile Access</h2>
        <p className="mt-1 text-slate-600">Manage mobile clients and validate SDK/API hardening controls.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Registered Mobile Clients</h3>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Client ID</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Name</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Platform</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Min SDK</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-slate-100 px-3 py-2">{item.clientId}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.name}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.platform}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.minSdkVersion}</td>
                  <td className="border-b border-slate-100 px-3 py-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">SDK Hardening Probe</h3>
        <form className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4" onSubmit={probeSdkConfig}>
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Client ID"
            value={probeHeaders.clientId}
            onChange={(e) => setProbeHeaders((prev) => ({ ...prev, clientId: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="API Key"
            value={probeHeaders.apiKey}
            onChange={(e) => setProbeHeaders((prev) => ({ ...prev, apiKey: e.target.value }))}
            required
          />
          <input
            className="rounded-lg border border-slate-300 px-3 py-2"
            placeholder="SDK Version"
            value={probeHeaders.sdkVersion}
            onChange={(e) => setProbeHeaders((prev) => ({ ...prev, sdkVersion: e.target.value }))}
            required
          />
          <button className="h-10 rounded-lg bg-blue-700 px-3 text-white hover:bg-blue-800" type="submit">
            Validate SDK Config
          </button>
        </form>
        {sdkProbe ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            <p>
              Client: {sdkProbe.clientId} ({sdkProbe.platform}) | Min SDK: {sdkProbe.minSdkVersion}
            </p>
            <p className="mt-1">Features: {Object.keys(sdkProbe.features || {}).join(", ")}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default MobileAccessPage;
