import { useEffect, useState } from "react";
import api from "../../api";

const FIELD_TYPES = ["text", "number", "date", "select", "textarea", "checkbox"];

function emptyField() {
  return {
    label: "",
    key: "",
    type: "text",
    required: false,
    options: ""
  };
}

function normalizeFields(fields) {
  return fields
    .filter((field) => field.label && field.key)
    .map((field, index) => ({
      label: field.label.trim(),
      key: field.key.trim(),
      type: field.type,
      required: Boolean(field.required),
      options:
        field.type === "select"
          ? field.options
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
      orderIndex: index
    }));
}

function FormBuilderPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Draft",
    fields: [emptyField()]
  });

  async function fetchTemplates() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/form-templates");
      setTemplates(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  function addField() {
    setForm((prev) => ({ ...prev, fields: [...prev.fields, emptyField()] }));
  }

  function removeField(index) {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  }

  function updateField(index, key, value) {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field, i) =>
        i === index ? { ...field, [key]: value } : field
      )
    }));
  }

  async function submitTemplate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.post("/form-templates", {
        name: form.name,
        description: form.description,
        status: form.status,
        fields: normalizeFields(form.fields)
      });
      setForm({
        name: "",
        description: "",
        status: "Draft",
        fields: [emptyField()]
      });
      await fetchTemplates();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function publishTemplate(id) {
    setError("");
    try {
      await api.post(`/form-templates/${id}/publish`);
      await fetchTemplates();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Form Builder</h2>
        <p className="mt-1 text-slate-600">
          Create dynamic clinical forms similar to OpenMRS Form Builder.
        </p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Create Form Template</h3>
        <form className="mt-3 grid gap-3" onSubmit={submitTemplate}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              placeholder="Template Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <input
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <select
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 font-medium text-slate-800">Fields</p>
            <div className="space-y-2">
              {form.fields.map((field, index) => (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-6" key={`field-${index}`}>
                  <input
                    className="rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none ring-blue-400 focus:ring-2"
                    placeholder="Label"
                    value={field.label}
                    onChange={(e) => updateField(index, "label", e.target.value)}
                  />
                  <input
                    className="rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none ring-blue-400 focus:ring-2"
                    placeholder="Key (e.g. bloodPressure)"
                    value={field.key}
                    onChange={(e) => updateField(index, "key", e.target.value)}
                  />
                  <select
                    className="rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none ring-blue-400 focus:ring-2"
                    value={field.type}
                    onChange={(e) => updateField(index, "type", e.target.value)}
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-lg border border-slate-300 px-2 py-2 text-sm outline-none ring-blue-400 focus:ring-2"
                    placeholder="Options (a,b,c) for select"
                    value={field.options}
                    onChange={(e) => updateField(index, "options", e.target.value)}
                    disabled={field.type !== "select"}
                  />
                  <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(index, "required", e.target.checked)}
                    />
                    Required
                  </label>
                  <button
                    className="rounded-lg bg-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-300"
                    onClick={() => removeField(index)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-3 rounded-lg bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-800"
              onClick={addField}
            >
              Add Field
            </button>
          </div>

          <button
            className="h-10 w-44 rounded-lg bg-blue-700 text-white transition hover:bg-blue-800"
            type="submit"
          >
            Save Template
          </button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Templates</h3>
        {loading ? <p className="mt-2 text-slate-600">Loading...</p> : null}
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Name</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Version</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Status</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Fields</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {templates.length ? (
                templates.map((template) => (
                  <tr key={template.id}>
                    <td className="border-b border-slate-100 px-3 py-2">{template.name}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{template.version}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{template.status}</td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {template.fields?.length || 0}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {template.status !== "Published" ? (
                        <button
                          className="rounded-lg bg-emerald-700 px-2 py-1 text-xs text-white hover:bg-emerald-800"
                          type="button"
                          onClick={() => publishTemplate(template.id)}
                        >
                          Publish
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700">Published</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No templates found.
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

export default FormBuilderPage;


