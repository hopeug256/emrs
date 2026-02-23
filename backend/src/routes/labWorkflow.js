const express = require("express");
const {
  LabOrder,
  LabPanel,
  LabPanelAnalyte,
  LabAnalyte,
  LabResult,
  LabResultValue,
  LabInstrument,
  LabInstrumentRun,
  LabResultVerification,
  LabReportTemplate,
  Patient,
  Provider,
  User
} = require("../models");

const router = express.Router();

function toNumberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function computeFlag(valueNumeric, referenceMin, referenceMax, criticalMin, criticalMax) {
  if (valueNumeric === null || valueNumeric === undefined) return "Invalid";
  if (criticalMin !== null && criticalMin !== undefined && valueNumeric < Number(criticalMin)) {
    return "CriticalLow";
  }
  if (criticalMax !== null && criticalMax !== undefined && valueNumeric > Number(criticalMax)) {
    return "CriticalHigh";
  }
  if (referenceMin !== null && referenceMin !== undefined && valueNumeric < Number(referenceMin)) {
    return "Low";
  }
  if (referenceMax !== null && referenceMax !== undefined && valueNumeric > Number(referenceMax)) {
    return "High";
  }
  return "Normal";
}

async function getWorkflowOrder(orderId) {
  return LabOrder.findByPk(orderId, {
    include: [
      { model: Patient },
      { model: Provider, as: "orderedBy" },
      {
        model: LabPanel,
        include: [{ model: LabAnalyte, as: "analytes" }, { model: LabPanelAnalyte, as: "panelAnalytes", include: [LabAnalyte] }]
      },
      {
        model: LabResult,
        as: "result",
        include: [
          { model: LabResultValue, as: "values", include: [LabAnalyte] },
          { model: LabResultVerification, as: "verifications", include: [{ model: User, as: "verifiedBy" }] }
        ]
      }
    ]
  });
}

router.post("/orders/:orderId/initialize", async (req, res, next) => {
  try {
    const order = await LabOrder.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Lab order not found" });
    if (!order.labPanelId) return res.status(400).json({ message: "Lab order has no panel assigned" });

    let result = await LabResult.findOne({ where: { labOrderId: order.id } });
    if (!result) {
      result = await LabResult.create({
        resultNumber: `LR-${Date.now()}`,
        labOrderId: order.id,
        status: "Draft"
      });
    }

    const panelItems = await LabPanelAnalyte.findAll({
      where: { labPanelId: order.labPanelId },
      include: [LabAnalyte],
      order: [["orderIndex", "ASC"]]
    });

    for (const item of panelItems) {
      const existing = await LabResultValue.findOne({
        where: { labResultId: result.id, labAnalyteId: item.labAnalyteId }
      });
      if (!existing) {
        await LabResultValue.create({
          labResultId: result.id,
          labAnalyteId: item.labAnalyteId,
          unit: item.LabAnalyte?.unit || null,
          referenceMin: item.LabAnalyte?.referenceMin || null,
          referenceMax: item.LabAnalyte?.referenceMax || null,
          flag: "Invalid"
        });
      }
    }

    const full = await getWorkflowOrder(order.id);
    res.json(full);
  } catch (error) {
    next(error);
  }
});

router.put("/orders/:orderId/results", async (req, res, next) => {
  try {
    const order = await LabOrder.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Lab order not found" });

    let result = await LabResult.findOne({ where: { labOrderId: order.id } });
    if (!result) {
      result = await LabResult.create({
        resultNumber: `LR-${Date.now()}`,
        labOrderId: order.id,
        status: "Draft"
      });
    }

    const values = Array.isArray(req.body.values) ? req.body.values : [];
    for (const input of values) {
      if (!input.labAnalyteId) continue;
      const analyte = await LabAnalyte.findByPk(input.labAnalyteId);
      if (!analyte) continue;
      const valueNumeric = toNumberOrNull(input.valueNumeric ?? input.valueText);
      const referenceMin = toNumberOrNull(input.referenceMin ?? analyte.referenceMin);
      const referenceMax = toNumberOrNull(input.referenceMax ?? analyte.referenceMax);
      const criticalMin = toNumberOrNull(analyte.criticalMin);
      const criticalMax = toNumberOrNull(analyte.criticalMax);
      const flag = computeFlag(valueNumeric, referenceMin, referenceMax, criticalMin, criticalMax);

      const existing = await LabResultValue.findOne({
        where: { labResultId: result.id, labAnalyteId: analyte.id }
      });

      const payload = {
        valueText: input.valueText ?? (valueNumeric !== null ? String(valueNumeric) : null),
        valueNumeric,
        unit: input.unit || analyte.unit || null,
        referenceMin,
        referenceMax,
        flag
      };
      if (existing) await existing.update(payload);
      else await LabResultValue.create({ ...payload, labResultId: result.id, labAnalyteId: analyte.id });
    }

    await order.update({ status: "InProgress", workflowStatus: "Pending" });
    const full = await getWorkflowOrder(order.id);
    res.json(full);
  } catch (error) {
    next(error);
  }
});

router.post("/orders/:orderId/verify", async (req, res, next) => {
  try {
    const order = await LabOrder.findByPk(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Lab order not found" });
    const result = await LabResult.findOne({ where: { labOrderId: order.id } });
    if (!result) return res.status(400).json({ message: "No lab result to verify" });

    const { step, decision, remarks } = req.body;
    if (!step || !decision) return res.status(400).json({ message: "step and decision are required" });

    await LabResultVerification.create({
      labResultId: result.id,
      step,
      decision,
      remarks: remarks || null,
      verifiedByUserId: req.user.id
    });

    if (decision === "Approved") {
      if (step === "Technical") {
        await result.update({ status: "TechnicalVerified" });
        await order.update({ workflowStatus: "TechnicalVerified" });
      } else if (step === "Pathologist") {
        await result.update({ status: "PathologistVerified" });
        await order.update({ workflowStatus: "PathologistVerified" });
      } else if (step === "Final") {
        await result.update({ status: "FinalSigned", finalizedAt: new Date() });
        await order.update({ workflowStatus: "FinalSigned", status: "Completed", reportedAt: new Date() });
      }
    } else {
      await result.update({ status: "Draft" });
      await order.update({ workflowStatus: "Pending", status: "InProgress" });
    }

    const full = await getWorkflowOrder(order.id);
    res.json(full);
  } catch (error) {
    next(error);
  }
});

router.post("/instrument/ingest", async (req, res, next) => {
  try {
    const { instrumentCode, orderNumber, values } = req.body;
    if (!instrumentCode || !orderNumber || !Array.isArray(values)) {
      return res.status(400).json({ message: "instrumentCode, orderNumber, values[] are required" });
    }

    const instrument = await LabInstrument.findOne({ where: { instrumentCode } });
    if (!instrument) return res.status(404).json({ message: "Instrument not found" });
    const order = await LabOrder.findOne({ where: { orderNumber } });
    if (!order) return res.status(404).json({ message: "Lab order not found" });

    let result = await LabResult.findOne({ where: { labOrderId: order.id } });
    if (!result) {
      result = await LabResult.create({
        resultNumber: `LR-${Date.now()}`,
        labOrderId: order.id,
        status: "Draft"
      });
    }

    for (const row of values) {
      const analyte = await LabAnalyte.findOne({ where: { code: row.analyteCode } });
      if (!analyte) continue;
      const valueNumeric = toNumberOrNull(row.valueNumeric ?? row.valueText);
      const flag = computeFlag(
        valueNumeric,
        toNumberOrNull(analyte.referenceMin),
        toNumberOrNull(analyte.referenceMax),
        toNumberOrNull(analyte.criticalMin),
        toNumberOrNull(analyte.criticalMax)
      );
      const existing = await LabResultValue.findOne({
        where: { labResultId: result.id, labAnalyteId: analyte.id }
      });
      const payload = {
        valueText: row.valueText ?? (valueNumeric !== null ? String(valueNumeric) : null),
        valueNumeric,
        unit: row.unit || analyte.unit || null,
        referenceMin: analyte.referenceMin,
        referenceMax: analyte.referenceMax,
        flag
      };
      if (existing) await existing.update(payload);
      else await LabResultValue.create({ ...payload, labResultId: result.id, labAnalyteId: analyte.id });
    }

    await LabInstrumentRun.create({
      runNumber: `RUN-${Date.now()}`,
      labInstrumentId: instrument.id,
      labOrderId: order.id,
      labResultId: result.id,
      rawPayload: JSON.stringify(req.body),
      status: "Processed",
      processedAt: new Date()
    });

    await order.update({ status: "InProgress" });
    const full = await getWorkflowOrder(order.id);
    res.json(full);
  } catch (error) {
    next(error);
  }
});

router.get("/orders/:orderId/printable", async (req, res, next) => {
  try {
    const order = await getWorkflowOrder(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Lab order not found" });
    const template = req.query.templateId
      ? await LabReportTemplate.findByPk(req.query.templateId)
      : await LabReportTemplate.findOne({ where: { active: true }, order: [["createdAt", "DESC"]] });
    if (!template) return res.status(404).json({ message: "No active report template found" });

    const rows = (order.result?.values || [])
      .map(
        (v) =>
          `${v.LabAnalyte?.name || "Analyte"}: ${v.valueText || "-"} ${v.unit || ""} [${v.flag}] (Ref: ${v.referenceMin ?? "-"} - ${v.referenceMax ?? "-"})`
      )
      .join("\n");

    let text = template.bodyTemplate;
    text = text.replaceAll("{{orderNumber}}", order.orderNumber || "");
    text = text.replaceAll("{{patientName}}", `${order.Patient?.firstName || ""} ${order.Patient?.lastName || ""}`.trim());
    text = text.replaceAll("{{panelName}}", order.LabPanel?.name || "");
    text = text.replaceAll("{{reportedAt}}", order.reportedAt ? new Date(order.reportedAt).toISOString() : "");
    text = text.replaceAll("{{results}}", rows);

    res.json({
      template: { id: template.id, name: template.name },
      renderedText: text
    });
  } catch (error) {
    next(error);
  }
});

router.get("/orders/:orderId", async (req, res, next) => {
  try {
    const order = await getWorkflowOrder(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Lab order not found" });
    res.json(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
