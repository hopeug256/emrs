const express = require("express");
const { Op } = require("sequelize");
const {
  sequelize,
  ChartAccount,
  JournalEntry,
  JournalEntryLine,
  Budget,
  BudgetLine
} = require("../models");

const router = express.Router();

function toAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function round2(value) {
  return Number(value.toFixed(2));
}

function normalBalanceForType(accountType) {
  if (["Asset", "Expense"].includes(accountType)) return "Debit";
  return "Credit";
}

const ugandaHospitalChartTemplate = [
  { code: "1000", name: "Assets", type: "Asset", class: "Header", level: 1, posting: false, parent: null, order: 1000 },
  { code: "1100", name: "Current Assets", type: "Asset", class: "Current Assets", level: 2, posting: false, parent: "1000", order: 1100 },
  { code: "1110", name: "Cash on Hand", type: "Asset", class: "Cash", level: 3, posting: true, parent: "1100", order: 1110 },
  { code: "1120", name: "Bank Account - Operations", type: "Asset", class: "Bank", level: 3, posting: true, parent: "1100", order: 1120 },
  { code: "1130", name: "Accounts Receivable - Patients", type: "Asset", class: "Receivable", level: 3, posting: true, parent: "1100", order: 1130 },
  { code: "1140", name: "Accounts Receivable - Insurance", type: "Asset", class: "Receivable", level: 3, posting: true, parent: "1100", order: 1140 },
  { code: "1200", name: "Inventory Assets", type: "Asset", class: "Inventory", level: 2, posting: false, parent: "1000", order: 1200 },
  { code: "1210", name: "Pharmacy Stock", type: "Asset", class: "Inventory", level: 3, posting: true, parent: "1200", order: 1210 },
  { code: "1220", name: "Laboratory Reagents", type: "Asset", class: "Inventory", level: 3, posting: true, parent: "1200", order: 1220 },
  { code: "1230", name: "Medical Consumables", type: "Asset", class: "Inventory", level: 3, posting: true, parent: "1200", order: 1230 },
  { code: "2000", name: "Liabilities", type: "Liability", class: "Header", level: 1, posting: false, parent: null, order: 2000 },
  { code: "2100", name: "Current Liabilities", type: "Liability", class: "Current Liabilities", level: 2, posting: false, parent: "2000", order: 2100 },
  { code: "2110", name: "Accounts Payable", type: "Liability", class: "Payables", level: 3, posting: true, parent: "2100", order: 2110 },
  { code: "2120", name: "Payroll Payable", type: "Liability", class: "Payroll", level: 3, posting: true, parent: "2100", order: 2120 },
  { code: "2130", name: "Tax Payable", type: "Liability", class: "Taxes", level: 3, posting: true, parent: "2100", order: 2130 },
  { code: "3000", name: "Equity", type: "Equity", class: "Header", level: 1, posting: false, parent: null, order: 3000 },
  { code: "3100", name: "Accumulated Surplus", type: "Equity", class: "Surplus", level: 2, posting: true, parent: "3000", order: 3100 },
  { code: "4000", name: "Revenue", type: "Revenue", class: "Header", level: 1, posting: false, parent: null, order: 4000 },
  { code: "4100", name: "Patient Service Revenue", type: "Revenue", class: "Service Revenue", level: 2, posting: false, parent: "4000", order: 4100 },
  { code: "4110", name: "Consultation Revenue", type: "Revenue", class: "Service Revenue", level: 3, posting: true, parent: "4100", order: 4110 },
  { code: "4120", name: "Laboratory Revenue", type: "Revenue", class: "Service Revenue", level: 3, posting: true, parent: "4100", order: 4120 },
  { code: "4130", name: "Radiology Revenue", type: "Revenue", class: "Service Revenue", level: 3, posting: true, parent: "4100", order: 4130 },
  { code: "4140", name: "Pharmacy Revenue", type: "Revenue", class: "Service Revenue", level: 3, posting: true, parent: "4100", order: 4140 },
  { code: "5000", name: "Expenses", type: "Expense", class: "Header", level: 1, posting: false, parent: null, order: 5000 },
  { code: "5100", name: "Human Resource Costs", type: "Expense", class: "HR", level: 2, posting: false, parent: "5000", order: 5100 },
  { code: "5110", name: "Salaries and Wages", type: "Expense", class: "HR", level: 3, posting: true, parent: "5100", order: 5110 },
  { code: "5120", name: "Allowances", type: "Expense", class: "HR", level: 3, posting: true, parent: "5100", order: 5120 },
  { code: "5200", name: "Medical Supplies Expense", type: "Expense", class: "Clinical", level: 2, posting: false, parent: "5000", order: 5200 },
  { code: "5210", name: "Drug Consumption Expense", type: "Expense", class: "Clinical", level: 3, posting: true, parent: "5200", order: 5210 },
  { code: "5220", name: "Lab Reagent Consumption Expense", type: "Expense", class: "Clinical", level: 3, posting: true, parent: "5200", order: 5220 },
  { code: "5300", name: "Administrative Expenses", type: "Expense", class: "Administration", level: 2, posting: false, parent: "5000", order: 5300 },
  { code: "5310", name: "Utilities Expense", type: "Expense", class: "Administration", level: 3, posting: true, parent: "5300", order: 5310 },
  { code: "5320", name: "Repairs and Maintenance Expense", type: "Expense", class: "Administration", level: 3, posting: true, parent: "5300", order: 5320 }
];

router.post("/chart-of-accounts/seed-uganda-hospital", async (req, res, next) => {
  try {
    const tx = await sequelize.transaction();
    try {
      const byCode = new Map();
      for (const template of ugandaHospitalChartTemplate) {
        const [account, created] = await ChartAccount.findOrCreate({
          where: { accountCode: template.code },
          defaults: {
            accountName: template.name,
            accountType: template.type,
            accountClass: template.class,
            normalBalance: normalBalanceForType(template.type),
            level: template.level,
            isPostingAllowed: template.posting,
            sortOrder: template.order,
            isActive: true
          },
          transaction: tx
        });
        byCode.set(template.code, account);
      }

      for (const template of ugandaHospitalChartTemplate) {
        if (!template.parent) continue;
        const account = byCode.get(template.code);
        const parent = byCode.get(template.parent);
        if (account && parent && account.parentAccountId !== parent.id) {
          await account.update({ parentAccountId: parent.id }, { transaction: tx });
        }
      }

      await tx.commit();
      res.json({
        message: "Uganda hospital chart template seeded.",
        accountCount: ugandaHospitalChartTemplate.length
      });
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

router.post("/chart-of-accounts/import-template", async (req, res, next) => {
  try {
    const { accounts } = req.body;
    if (!Array.isArray(accounts) || !accounts.length) {
      return res.status(400).json({ message: "accounts[] is required" });
    }

    const tx = await sequelize.transaction();
    try {
      const byCode = new Map();
      for (const row of accounts) {
        if (!row.accountCode || !row.accountName || !row.accountType) {
          await tx.rollback();
          return res.status(400).json({
            message: "Each account requires accountCode, accountName, and accountType"
          });
        }
        const [account] = await ChartAccount.findOrCreate({
          where: { accountCode: row.accountCode },
          defaults: {
            accountName: row.accountName,
            accountType: row.accountType,
            accountClass: row.accountClass || null,
            normalBalance: row.normalBalance || normalBalanceForType(row.accountType),
            level: row.level || 1,
            isPostingAllowed: row.isPostingAllowed !== false,
            sortOrder: row.sortOrder || 0,
            isActive: row.isActive !== false
          },
          transaction: tx
        });
        if (!created) {
          await account.update(
            {
              accountName: row.accountName,
              accountType: row.accountType,
              accountClass: row.accountClass || null,
              normalBalance: row.normalBalance || normalBalanceForType(row.accountType),
              level: row.level || 1,
              isPostingAllowed: row.isPostingAllowed !== false,
              sortOrder: row.sortOrder || 0,
              isActive: row.isActive !== false
            },
            { transaction: tx }
          );
        }
        byCode.set(row.accountCode, account);
      }

      for (const row of accounts) {
        if (!row.parentAccountCode) continue;
        const account = byCode.get(row.accountCode);
        const parent =
          byCode.get(row.parentAccountCode) ||
          (await ChartAccount.findOne({
            where: { accountCode: row.parentAccountCode },
            transaction: tx
          }));
        if (account && parent) {
          await account.update({ parentAccountId: parent.id }, { transaction: tx });
        }
      }

      await tx.commit();
      res.json({ message: "Chart template imported.", accountCount: accounts.length });
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

router.get("/chart-of-accounts/tree", async (req, res, next) => {
  try {
    const accounts = await ChartAccount.findAll({
      order: [["sortOrder", "ASC"], ["accountCode", "ASC"]]
    });

    const nodes = new Map();
    accounts.forEach((account) => {
      nodes.set(account.id, {
        ...account.toJSON(),
        children: []
      });
    });

    const roots = [];
    nodes.forEach((node) => {
      if (node.parentAccountId && nodes.has(node.parentAccountId)) {
        nodes.get(node.parentAccountId).children.push(node);
      } else {
        roots.push(node);
      }
    });

    res.json(roots);
  } catch (error) {
    next(error);
  }
});

router.post("/journal-entries/:id/post", async (req, res, next) => {
  try {
    const journal = await JournalEntry.findByPk(req.params.id, {
      include: [{ model: JournalEntryLine, as: "lines", include: [ChartAccount] }]
    });
    if (!journal) return res.status(404).json({ message: "Journal entry not found" });
    if (journal.status === "Posted") return res.status(409).json({ message: "Journal already posted" });
    if (!journal.lines?.length) return res.status(400).json({ message: "Journal requires at least one line" });

    const totals = journal.lines.reduce(
      (acc, line) => {
        acc.debit += toAmount(line.debitAmount);
        acc.credit += toAmount(line.creditAmount);
        return acc;
      },
      { debit: 0, credit: 0 }
    );

    if (round2(totals.debit) !== round2(totals.credit)) {
      return res.status(400).json({
        message: "Debits and credits are not balanced.",
        totals: { debit: round2(totals.debit), credit: round2(totals.credit) }
      });
    }

    await journal.update({
      debitAmount: round2(totals.debit),
      creditAmount: round2(totals.credit),
      status: "Posted",
      postedAt: new Date(),
      postedByUserId: req.user?.id || null
    });

    res.json({
      id: journal.id,
      status: "Posted",
      totals: { debit: round2(totals.debit), credit: round2(totals.credit) }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/trial-balance", async (req, res, next) => {
  try {
    const from = req.query.from || "1900-01-01";
    const to = req.query.to || "2999-12-31";

    const postedLines = await JournalEntryLine.findAll({
      include: [
        {
          model: JournalEntry,
          where: { status: "Posted", entryDate: { [Op.between]: [from, to] } },
          attributes: ["id", "entryDate", "status"]
        },
        {
          model: ChartAccount,
          attributes: [
            "id",
            "accountCode",
            "accountName",
            "accountType",
            "accountClass",
            "normalBalance",
            "isPostingAllowed"
          ]
        }
      ]
    });

    const balances = new Map();
    postedLines.forEach((line) => {
      const account = line.ChartAccount;
      if (!account) return;
      const key = account.id;
      const current = balances.get(key) || {
        accountId: account.id,
        accountCode: account.accountCode,
        accountName: account.accountName,
        accountType: account.accountType,
        accountClass: account.accountClass,
        normalBalance: account.normalBalance,
        debit: 0,
        credit: 0
      };
      current.debit += toAmount(line.debitAmount);
      current.credit += toAmount(line.creditAmount);
      balances.set(key, current);
    });

    const rows = [...balances.values()]
      .map((row) => ({
        ...row,
        debit: round2(row.debit),
        credit: round2(row.credit),
        net: round2(row.debit - row.credit)
      }))
      .sort((a, b) => a.accountCode.localeCompare(b.accountCode));

    const totals = rows.reduce(
      (acc, row) => {
        acc.debit += row.debit;
        acc.credit += row.credit;
        return acc;
      },
      { debit: 0, credit: 0 }
    );

    res.json({
      from,
      to,
      totals: { debit: round2(totals.debit), credit: round2(totals.credit) },
      isBalanced: round2(totals.debit) === round2(totals.credit),
      rows
    });
  } catch (error) {
    next(error);
  }
});

router.get("/budget-variance", async (req, res, next) => {
  try {
    const { budgetId, from, to } = req.query;
    if (!budgetId) return res.status(400).json({ message: "budgetId is required" });

    const budget = await Budget.findByPk(budgetId, {
      include: [{ model: BudgetLine, as: "lines", include: [ChartAccount] }]
    });
    if (!budget) return res.status(404).json({ message: "Budget not found" });

    const periodFrom = from || `${budget.fiscalYear}-01-01`;
    const periodTo = to || `${budget.fiscalYear}-12-31`;

    const postedLines = await JournalEntryLine.findAll({
      include: [
        {
          model: JournalEntry,
          where: { status: "Posted", entryDate: { [Op.between]: [periodFrom, periodTo] } },
          attributes: ["entryDate"]
        },
        {
          model: ChartAccount,
          attributes: ["id"]
        }
      ]
    });

    const actualsByAccountId = new Map();
    postedLines.forEach((line) => {
      const accountId = line.chartAccountId;
      const debit = toAmount(line.debitAmount);
      const credit = toAmount(line.creditAmount);
      const net = debit - credit;
      actualsByAccountId.set(accountId, (actualsByAccountId.get(accountId) || 0) + net);
    });

    const lines = budget.lines.map((line) => {
      const budgetAmount = toAmount(line.annualAmount);
      const actualAmount = actualsByAccountId.get(line.chartAccountId) || 0;
      const variance = budgetAmount - actualAmount;
      return {
        budgetLineId: line.id,
        accountId: line.chartAccountId,
        accountCode: line.ChartAccount?.accountCode || null,
        accountName: line.ChartAccount?.accountName || null,
        budgetAmount: round2(budgetAmount),
        actualAmount: round2(actualAmount),
        variance: round2(variance),
        variancePct: budgetAmount ? round2((variance / budgetAmount) * 100) : 0,
        costCenter: line.costCenter,
        departmentName: line.departmentName
      };
    });

    const totals = lines.reduce(
      (acc, line) => {
        acc.budget += line.budgetAmount;
        acc.actual += line.actualAmount;
        acc.variance += line.variance;
        return acc;
      },
      { budget: 0, actual: 0, variance: 0 }
    );

    res.json({
      budgetId: budget.id,
      budgetCode: budget.budgetCode,
      budgetName: budget.budgetName,
      periodFrom,
      periodTo,
      totals: {
        budget: round2(totals.budget),
        actual: round2(totals.actual),
        variance: round2(totals.variance)
      },
      lines
    });
  } catch (error) {
    next(error);
  }
});

router.post("/budgets/:id/approve", async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    await budget.update({ status: "Approved" });
    res.json({ id: budget.id, status: budget.status });
  } catch (error) {
    next(error);
  }
});

router.post("/budgets/:id/lock", async (req, res, next) => {
  try {
    const budget = await Budget.findByPk(req.params.id);
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    await budget.update({ status: "Locked" });
    res.json({ id: budget.id, status: budget.status });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
