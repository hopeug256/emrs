import { useEffect, useMemo, useState } from "react";
import api from "../../api";

function parseOptions(field) {
  if (!field.options) return [];
  try {
    const parsed = JSON.parse(field.options);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseSubmissionData(raw) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function FormSubmissionsPage() {
  const [templates, setTemplates] = useState([]);
  const [patients, setPatients] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [values, setValues] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );

  async function bootstrap() {
    setLoading(true);
    setError("");
    try {
      const [templateRes, patientRes, submissionRes] = await Promise.all([
        api.get("/form-templates"),
        api.get("/patients"),
        api.get("/form-submissions")
      ]);
      setTemplates(templateRes.data.filter((item) => item.status === "Published"));
      setPatients(patientRes.data);
      setSubmissions(submissionRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  function updateValue(field, value) {
    setValues((prev) => ({ ...prev, [field.key]: value }));
  }

  async function submitForm(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/form-submissions", {
        formTemplateId: selectedTemplateId,
        patientId: patientId || null,
        data: values
      });
      setValues({});
      await bootstrap();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Form Submissions</h2>
        <p className="mt-1 text-slate-600">Capture data using published form templates.</p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Submit Form</h3>
        <form className="mt-3 grid gap-3" onSubmit={submitForm}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                setValues({});
              }}
              required
            >
              <option value="">Select Template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            >
              <option value="">Optional Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.mrn} - {patient.firstName} {patient.lastName}
                </option>
              ))}
            </select>
          </div>

          {selectedTemplate ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(selectedTemplate.fields || [])
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((field) => (
                  <label className="flex flex-col gap-1.5 text-sm" key={field.id}>
                    <span className="text-slate-700">
                      {field.label}
                      {field.required ? " *" : ""}
                    </span>
                    {field.type === "textarea" ? (
                      <textarea
                        className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                        value={values[field.key] || ""}
                        required={field.required}
                        onChange={(e) => updateValue(field, e.target.value)}
                      />
                    ) : field.type === "select" ? (
                      <select
                        className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                        value={values[field.key] || ""}
                        required={field.required}
                        onChange={(e) => updateValue(field, e.target.value)}
                      >
                        <option value="">Select</option>
                        {parseOptions(field).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={Boolean(values[field.key])}
                        onChange={(e) => updateValue(field, e.target.checked)}
                      />
                    ) : (
                      <input
                        className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        value={values[field.key] || ""}
                        required={field.required}
                        onChange={(e) => updateValue(field, e.target.value)}
                      />
                    )}
                  </label>
                ))}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!selectedTemplateId}
            className="h-10 w-44 rounded-lg bg-blue-700 text-white transition hover:bg-blue-800 disabled:opacity-50"
          >
            Submit Form
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Recent Submissions</h3>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Template</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Patient</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Submitted By</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Submitted At</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Payload</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length ? (
                submissions.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {item.template?.name || "-"}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {item.Patient
                        ? `${item.Patient.mrn} - ${item.Patient.firstName} ${item.Patient.lastName}`
                        : "-"}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {item.submittedBy?.username || "-"}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      <pre className="max-w-xs whitespace-pre-wrap text-xs text-slate-600">
                        {JSON.stringify(parseSubmissionData(item.data), null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No submissions found.
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

export default FormSubmissionsPage;

