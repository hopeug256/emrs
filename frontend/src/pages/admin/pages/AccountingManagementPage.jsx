import { useEffect, useMemo, useState } from "react";
import api from "../../../api";

function formatMoney(value) {
  const num = Number.parseFloat(value || 0);
  return Number.isFinite(num) ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
}

function flattenTree(nodes, depth = 0, rows = []) {
  nodes.forEach((node) => {
    rows.push({ ...node, depth });
    if (node.children?.length) flattenTree(node.children, depth + 1, rows);
  });
  return rows;
}

function AccountingManagementPage() {
  const [coaTree, setCoaTree] = useState([]);
  const [draftJournals, setDraftJournals] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [trialFilter, setTrialFilter] = useState({ from: "", to: "" });
  const [trialBalance, setTrialBalance] = useState(null);
  const [variance, setVariance] = useState(null);
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const flattenedAccounts = useMemo(() => flattenTree(coaTree), [coaTree]);

  async function loadData() {
    const [coaRes, journalRes, budgetRes] = await Promise.all([
      api.get("/accounting/chart-of-accounts/tree"),
      api.get("/journal-entries"),
      api.get("/budgets")
    ]);
    setCoaTree(coaRes.data || []);
    setDraftJournals((journalRes.data || []).filter((row) => row.status === "Draft"));
    setBudgets(budgetRes.data || []);
  }

  async function loadTrialBalance() {
    const params = {};
    if (trialFilter.from) params.from = trialFilter.from;
    if (trialFilter.to) params.to = trialFilter.to;
    const { data } = await api.get("/accounting/trial-balance", { params });
    setTrialBalance(data);
  }

  async function loadVariance(budgetId) {
    if (!budgetId) return;
    const { data } = await api.get("/accounting/budget-variance", { params: { budgetId } });
    setVariance(data);
  }

  useEffect(() => {
    (async () => {
      try {
        setBusy(true);
        await loadData();
        await loadTrialBalance();
      } catch (err) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  async function handleSeedChart() {
    try {
      setBusy(true);
      setError("");
      setMessage("");
      const { data } = await api.post("/accounting/chart-of-accounts/seed-uganda-hospital");
      await loadData();
      setMessage(`${data.message} (${data.accountCount} accounts)`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePostJournal(journalId) {
    try {
      setBusy(true);
      setError("");
      setMessage("");
      await api.post(`/accounting/journal-entries/${journalId}/post`);
      await Promise.all([loadData(), loadTrialBalance()]);
      setMessage("Journal posted successfully.");
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleApplyTrialFilter(e) {
    e.preventDefault();
    try {
      setBusy(true);
      setError("");
      await loadTrialBalance();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleVarianceChange(e) {
    const budgetId = e.target.value;
    setSelectedBudgetId(budgetId);
    try {
      setBusy(true);
      setError("");
      await loadVariance(budgetId);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Accounting & Budget Management</h2>
        <p className="mt-1 text-sm text-slate-600">
          Uganda hospital chart-of-accounts structure, journal posting controls, trial balance, and budget variance.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-70"
            onClick={handleSeedChart}
            disabled={busy}
          >
            Seed Uganda Hospital CoA Template
          </button>
        </div>
        {message ? <p className="mt-2 text-sm text-emerald-700">{message}</p> : null}
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Chart of Accounts Tree</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Code</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Name</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Type</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Class</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Posting</th>
              </tr>
            </thead>
            <tbody>
              {flattenedAccounts.length ? (
                flattenedAccounts.map((row) => (
                  <tr key={row.id}>
                    <td className="border-b border-slate-100 px-3 py-2">{row.accountCode}</td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      <span style={{ paddingLeft: `${row.depth * 1.2}rem` }}>{row.accountName}</span>
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2">{row.accountType}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{row.accountClass || "-"}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{row.isPostingAllowed ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Draft Journal Posting Queue</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Entry No</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Date</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Reference</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Status</th>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {draftJournals.length ? (
                draftJournals.map((row) => (
                  <tr key={row.id}>
                    <td className="border-b border-slate-100 px-3 py-2">{row.entryNumber}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{row.entryDate}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{row.referenceNumber || "-"}</td>
                    <td className="border-b border-slate-100 px-3 py-2">{row.status}</td>
                    <td className="border-b border-slate-100 px-3 py-2">
                      <button
                        type="button"
                        className="rounded bg-slate-800 px-3 py-1 text-xs text-white hover:bg-slate-900 disabled:opacity-70"
                        onClick={() => handlePostJournal(row.id)}
                        disabled={busy}
                      >
                        Post
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    No draft journals pending.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Trial Balance</h3>
            <p className="text-xs text-slate-500">Posted entries only</p>
          </div>
          <form className="ml-auto flex flex-wrap items-end gap-2" onSubmit={handleApplyTrialFilter}>
            <label className="text-xs text-slate-600">
              From
              <input
                type="date"
                value={trialFilter.from}
                onChange={(e) => setTrialFilter((p) => ({ ...p, from: e.target.value }))}
                className="mt-1 block rounded border border-slate-300 px-2 py-1 text-sm"
              />
            </label>
            <label className="text-xs text-slate-600">
              To
              <input
                type="date"
                value={trialFilter.to}
                onChange={(e) => setTrialFilter((p) => ({ ...p, to: e.target.value }))}
                className="mt-1 block rounded border border-slate-300 px-2 py-1 text-sm"
              />
            </label>
            <button type="submit" className="rounded bg-blue-700 px-3 py-2 text-xs text-white hover:bg-blue-800">
              Apply
            </button>
          </form>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Account</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right">Debit</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right">Credit</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right">Net</th>
              </tr>
            </thead>
            <tbody>
              {trialBalance?.rows?.length ? (
                trialBalance.rows.map((row) => (
                  <tr key={row.accountId}>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {row.accountCode} - {row.accountName}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right">{formatMoney(row.debit)}</td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right">{formatMoney(row.credit)}</td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right">{formatMoney(row.net)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={4}>
                    No posted entries in selected period.
                  </td>
                </tr>
              )}
            </tbody>
            {trialBalance ? (
              <tfoot>
                <tr>
                  <th className="border-t border-slate-200 px-3 py-2 text-left">Totals</th>
                  <th className="border-t border-slate-200 px-3 py-2 text-right">{formatMoney(trialBalance.totals?.debit)}</th>
                  <th className="border-t border-slate-200 px-3 py-2 text-right">{formatMoney(trialBalance.totals?.credit)}</th>
                  <th className="border-t border-slate-200 px-3 py-2 text-right">{trialBalance.isBalanced ? "Balanced" : "Not Balanced"}</th>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Budget Variance</h3>
            <p className="text-xs text-slate-500">Budget vs posted actuals by account</p>
          </div>
          <label className="ml-auto text-xs text-slate-600">
            Budget
            <select
              className="mt-1 block min-w-56 rounded border border-slate-300 px-2 py-1 text-sm"
              value={selectedBudgetId}
              onChange={handleVarianceChange}
            >
              <option value="">Select budget</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.budgetCode} - {budget.budgetName}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-3 py-2 text-left">Account</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right">Budget</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right">Actual</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right">Variance</th>
                <th className="border-b border-slate-200 px-3 py-2 text-right">Variance %</th>
              </tr>
            </thead>
            <tbody>
              {variance?.lines?.length ? (
                variance.lines.map((line) => (
                  <tr key={line.budgetLineId}>
                    <td className="border-b border-slate-100 px-3 py-2">
                      {line.accountCode} - {line.accountName}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right">{formatMoney(line.budgetAmount)}</td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right">{formatMoney(line.actualAmount)}</td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right">{formatMoney(line.variance)}</td>
                    <td className="border-b border-slate-100 px-3 py-2 text-right">{formatMoney(line.variancePct)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={5}>
                    Select a budget to view variance.
                  </td>
                </tr>
              )}
            </tbody>
            {variance ? (
              <tfoot>
                <tr>
                  <th className="border-t border-slate-200 px-3 py-2 text-left">Totals</th>
                  <th className="border-t border-slate-200 px-3 py-2 text-right">{formatMoney(variance.totals?.budget)}</th>
                  <th className="border-t border-slate-200 px-3 py-2 text-right">{formatMoney(variance.totals?.actual)}</th>
                  <th className="border-t border-slate-200 px-3 py-2 text-right">{formatMoney(variance.totals?.variance)}</th>
                  <th className="border-t border-slate-200 px-3 py-2 text-right">-</th>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </div>
      </section>
    </div>
  );
}

export default AccountingManagementPage;

