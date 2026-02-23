import { useEffect, useMemo, useState } from "react";
import api from "../api";

function TheatreWorkflowPage() {
  const [surgeries, setSurgeries] = useState([]);
  const [selectedSurgeryId, setSelectedSurgeryId] = useState("");
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [preOp, setPreOp] = useState({
    consentSigned: false,
    npoConfirmed: false,
    allergiesReviewed: false,
    siteMarked: false,
    anesthesiaAssessmentCompleted: false,
    bloodAvailabilityConfirmed: false,
    equipmentCheckCompleted: false,
    remarks: ""
  });

  const [intraOp, setIntraOp] = useState({
    anesthesiaType: "",
    procedureDetails: "",
    estimatedBloodLossMl: "",
    complications: "",
    spongeCountCorrect: true,
    instrumentCountCorrect: true,
    specimenSent: false,
    notes: ""
  });

  const [postOp, setPostOp] = useState({
    outcomeStatus: "Stable",
    postOpDiagnosis: "",
    disposition: "Ward",
    painScore: "",
    followUpPlan: "",
    dischargeInstructions: ""
  });

  const selectedSurgery = useMemo(
    () => surgeries.find((item) => item.id === selectedSurgeryId),
    [surgeries, selectedSurgeryId]
  );

  async function loadSurgeries() {
    const { data } = await api.get("/surgeries");
    setSurgeries(data);
  }

  async function loadWorkflow(surgeryId) {
    if (!surgeryId) return;
    const { data } = await api.get(`/theatre-workflow/${surgeryId}`);
    setWorkflow(data);
    setPreOp({
      consentSigned: Boolean(data.preOpChecklist?.consentSigned),
      npoConfirmed: Boolean(data.preOpChecklist?.npoConfirmed),
      allergiesReviewed: Boolean(data.preOpChecklist?.allergiesReviewed),
      siteMarked: Boolean(data.preOpChecklist?.siteMarked),
      anesthesiaAssessmentCompleted: Boolean(data.preOpChecklist?.anesthesiaAssessmentCompleted),
      bloodAvailabilityConfirmed: Boolean(data.preOpChecklist?.bloodAvailabilityConfirmed),
      equipmentCheckCompleted: Boolean(data.preOpChecklist?.equipmentCheckCompleted),
      remarks: data.preOpChecklist?.remarks || ""
    });
    setIntraOp({
      anesthesiaType: data.intraOpNote?.anesthesiaType || "",
      procedureDetails: data.intraOpNote?.procedureDetails || "",
      estimatedBloodLossMl: data.intraOpNote?.estimatedBloodLossMl ?? "",
      complications: data.intraOpNote?.complications || "",
      spongeCountCorrect: data.intraOpNote?.spongeCountCorrect ?? true,
      instrumentCountCorrect: data.intraOpNote?.instrumentCountCorrect ?? true,
      specimenSent: Boolean(data.intraOpNote?.specimenSent),
      notes: data.intraOpNote?.notes || ""
    });
    setPostOp({
      outcomeStatus: data.postOpOutcome?.outcomeStatus || "Stable",
      postOpDiagnosis: data.postOpOutcome?.postOpDiagnosis || "",
      disposition: data.postOpOutcome?.disposition || "Ward",
      painScore: data.postOpOutcome?.painScore ?? "",
      followUpPlan: data.postOpOutcome?.followUpPlan || "",
      dischargeInstructions: data.postOpOutcome?.dischargeInstructions || ""
    });
  }

  async function bootstrap() {
    setLoading(true);
    setError("");
    try {
      await loadSurgeries();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  useEffect(() => {
    if (!selectedSurgeryId) return;
    setError("");
    loadWorkflow(selectedSurgeryId).catch((err) => {
      setError(err?.response?.data?.message || err.message);
    });
  }, [selectedSurgeryId]);

  async function savePreOp(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put(`/theatre-workflow/${selectedSurgeryId}/pre-op`, preOp);
      await loadWorkflow(selectedSurgeryId);
      setSuccess("Pre-op checklist saved.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function saveIntraOp(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put(`/theatre-workflow/${selectedSurgeryId}/intra-op`, {
        ...intraOp,
        estimatedBloodLossMl:
          intraOp.estimatedBloodLossMl === "" ? null : Number(intraOp.estimatedBloodLossMl)
      });
      await loadWorkflow(selectedSurgeryId);
      setSuccess("Intra-op notes saved.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  async function savePostOp(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.put(`/theatre-workflow/${selectedSurgeryId}/post-op`, {
        ...postOp,
        painScore: postOp.painScore === "" ? null : Number(postOp.painScore)
      });
      await loadWorkflow(selectedSurgeryId);
      setSuccess("Post-op outcome saved.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <header>
        <h2 className="text-2xl font-semibold text-slate-900">Theatre Workflow Sub-Forms</h2>
        <p className="mt-1 text-slate-600">
          Complete pre-op checklist, intra-op notes, and post-op outcome per surgery.
        </p>
      </header>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-slate-700">Select Surgery</span>
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
            value={selectedSurgeryId}
            onChange={(e) => setSelectedSurgeryId(e.target.value)}
          >
            <option value="">Select</option>
            {surgeries.map((surgery) => (
              <option key={surgery.id} value={surgery.id}>
                {surgery.surgeryNumber} - {surgery.Patient?.mrn || "No MRN"} - {surgery.status}
              </option>
            ))}
          </select>
        </label>
        {loading ? <p className="mt-2 text-slate-600">Loading surgeries...</p> : null}
        {selectedSurgery ? (
          <p className="mt-2 text-sm text-slate-600">
            {selectedSurgery.surgeryNumber} | {selectedSurgery.status} |{" "}
            {selectedSurgery.priority}
          </p>
        ) : null}
      </section>

      {selectedSurgeryId ? (
        <>
          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Pre-Op Checklist</h3>
            <form className="mt-3 grid gap-3" onSubmit={savePreOp}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  ["consentSigned", "Consent Signed"],
                  ["npoConfirmed", "NPO Confirmed"],
                  ["allergiesReviewed", "Allergies Reviewed"],
                  ["siteMarked", "Surgical Site Marked"],
                  ["anesthesiaAssessmentCompleted", "Anesthesia Assessment Completed"],
                  ["bloodAvailabilityConfirmed", "Blood Availability Confirmed"],
                  ["equipmentCheckCompleted", "Equipment Check Completed"]
                ].map(([key, label]) => (
                  <label className="inline-flex items-center gap-2 text-sm" key={key}>
                    <input
                      type="checkbox"
                      checked={Boolean(preOp[key])}
                      onChange={(e) => setPreOp((prev) => ({ ...prev, [key]: e.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <textarea
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                placeholder="Remarks"
                value={preOp.remarks}
                onChange={(e) => setPreOp((prev) => ({ ...prev, remarks: e.target.value }))}
              />
              <button className="h-10 w-56 rounded-lg bg-blue-700 text-white hover:bg-blue-800" type="submit">
                Save Pre-Op Checklist
              </button>
            </form>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Intra-Op Notes</h3>
            <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={saveIntraOp}>
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                placeholder="Anesthesia Type"
                value={intraOp.anesthesiaType}
                onChange={(e) => setIntraOp((prev) => ({ ...prev, anesthesiaType: e.target.value }))}
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                placeholder="Estimated Blood Loss (ml)"
                type="number"
                value={intraOp.estimatedBloodLossMl}
                onChange={(e) =>
                  setIntraOp((prev) => ({ ...prev, estimatedBloodLossMl: e.target.value }))
                }
              />
              <textarea
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2 sm:col-span-2"
                placeholder="Procedure Details"
                value={intraOp.procedureDetails}
                onChange={(e) =>
                  setIntraOp((prev) => ({ ...prev, procedureDetails: e.target.value }))
                }
              />
              <textarea
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2 sm:col-span-2"
                placeholder="Complications"
                value={intraOp.complications}
                onChange={(e) => setIntraOp((prev) => ({ ...prev, complications: e.target.value }))}
              />
              <textarea
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2 sm:col-span-2"
                placeholder="Additional Notes"
                value={intraOp.notes}
                onChange={(e) => setIntraOp((prev) => ({ ...prev, notes: e.target.value }))}
              />
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(intraOp.spongeCountCorrect)}
                  onChange={(e) =>
                    setIntraOp((prev) => ({ ...prev, spongeCountCorrect: e.target.checked }))
                  }
                />
                Sponge Count Correct
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(intraOp.instrumentCountCorrect)}
                  onChange={(e) =>
                    setIntraOp((prev) => ({ ...prev, instrumentCountCorrect: e.target.checked }))
                  }
                />
                Instrument Count Correct
              </label>
              <label className="inline-flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={Boolean(intraOp.specimenSent)}
                  onChange={(e) =>
                    setIntraOp((prev) => ({ ...prev, specimenSent: e.target.checked }))
                  }
                />
                Specimen Sent
              </label>
              <button className="h-10 w-48 rounded-lg bg-blue-700 text-white hover:bg-blue-800 sm:col-span-2" type="submit">
                Save Intra-Op Notes
              </button>
            </form>
          </section>

          <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Post-Op Outcome</h3>
            <form className="mt-3 grid gap-3 sm:grid-cols-2" onSubmit={savePostOp}>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                value={postOp.outcomeStatus}
                onChange={(e) => setPostOp((prev) => ({ ...prev, outcomeStatus: e.target.value }))}
              >
                <option>Stable</option>
                <option>Critical</option>
                <option>Transferred</option>
                <option>Deceased</option>
              </select>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                value={postOp.disposition}
                onChange={(e) => setPostOp((prev) => ({ ...prev, disposition: e.target.value }))}
              >
                <option>Ward</option>
                <option>ICU</option>
                <option>Discharged</option>
                <option>Morgue</option>
              </select>
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                placeholder="Post-op Diagnosis"
                value={postOp.postOpDiagnosis}
                onChange={(e) => setPostOp((prev) => ({ ...prev, postOpDiagnosis: e.target.value }))}
              />
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2"
                type="number"
                min="0"
                max="10"
                placeholder="Pain Score (0-10)"
                value={postOp.painScore}
                onChange={(e) => setPostOp((prev) => ({ ...prev, painScore: e.target.value }))}
              />
              <textarea
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2 sm:col-span-2"
                placeholder="Follow-up Plan"
                value={postOp.followUpPlan}
                onChange={(e) => setPostOp((prev) => ({ ...prev, followUpPlan: e.target.value }))}
              />
              <textarea
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none ring-blue-400 focus:ring-2 sm:col-span-2"
                placeholder="Discharge Instructions"
                value={postOp.dischargeInstructions}
                onChange={(e) =>
                  setPostOp((prev) => ({ ...prev, dischargeInstructions: e.target.value }))
                }
              />
              <button className="h-10 w-52 rounded-lg bg-blue-700 text-white hover:bg-blue-800 sm:col-span-2" type="submit">
                Save Post-Op Outcome
              </button>
            </form>
          </section>
        </>
      ) : null}

      {success ? <p className="mt-4 text-sm text-emerald-700">{success}</p> : null}
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

export default TheatreWorkflowPage;
