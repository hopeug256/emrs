import { useEffect, useMemo, useState } from "react";
import api from "../api";

function getDisplayValue(record, key) {
  if (record[key] !== undefined && record[key] !== null) return record[key];
  const guess = key.replace("Id", "");
  if (record[guess]?.name) return record[guess].name;
  if (record[guess]?.mrn) return record[guess].mrn;
  if (record[guess]?.providerCode) return record[guess].providerCode;
  if (record[guess]?.id) return record[guess].id.slice(0, 8);
  return "";
}

function ResourcePage({ config, canCreate }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [relationOptions, setRelationOptions] = useState({});
  const [loading, setLoading] = useState(false);

  const relationFields = useMemo(
    () => config.fields.filter((field) => field.type === "relation"),
    [config.fields]
  );

  async function fetchRows() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/${config.key}`);
      setRows(data);
    } catch (err) {
      if (err?.response?.status === 403) {
        setError("Your role cannot access this module.");
      } else {
        setError(err?.response?.data?.message || err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchRelations() {
    const entries = await Promise.all(
      relationFields.map(async (field) => {
        const { data } = await api.get(`/${field.relation}`);
        return [field.name, data];
      })
    );
    setRelationOptions(Object.fromEntries(entries));
  }

  useEffect(() => {
    fetchRows();
  }, [config.key]);

  useEffect(() => {
    if (!relationFields.length) return;
    fetchRelations().catch((err) => {
      setError(err?.response?.data?.message || err.message);
    });
  }, [config.key]);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post(`/${config.key}`, form);
      setForm({});
      await fetchRows();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field.name]: value }));
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">{config.title}</h2>
        <p className="mt-1 text-slate-600">List and create {config.title.toLowerCase()} records.</p>
      </header>

      {canCreate ? (
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Create {config.title.slice(0, -1)}</h3>
          <form className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" onSubmit={onSubmit}>
            {config.fields.map((field) => (
              <label key={field.name} className="flex flex-col gap-1.5 text-sm">
                <span className="text-slate-700">{field.label}</span>
                {field.type === "select" ? (
                  <select
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  >
                    <option value="">Select</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "relation" ? (
                  <select
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  >
                    <option value="">Select</option>
                    {(relationOptions[field.name] || []).map((option) => (
                      <option key={option.id} value={option.id}>
                        {option[field.display] || option.id}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                    type={field.type || "text"}
                    required={field.required}
                    value={form[field.name] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                )}
              </label>
            ))}
            <button
              className="h-10 self-end rounded-lg bg-blue-700 px-3 text-white transition hover:bg-blue-800"
              type="submit"
            >
              Create
            </button>
          </form>
          {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        </section>
      ) : null}

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">{config.title} List</h3>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        {!canCreate && error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                {config.columns.map((column) => (
                  <th key={column} className="border-b border-slate-200 px-3 py-2 text-left font-semibold text-slate-700">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row) => (
                  <tr key={row.id}>
                    {config.columns.map((column) => (
                      <td key={column} className="border-b border-slate-100 px-3 py-2 text-slate-700">
                        {String(getDisplayValue(row, column) || "-")}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={config.columns.length}>
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ResourcePage;
