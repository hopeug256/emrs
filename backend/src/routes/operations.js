const express = require("express");
const { Op } = require("sequelize");
const {
  QueueTicket,
  Appointment,
  PatientMonitoringRecord,
  PaymentGatewayTransaction,
  Payment,
  Invoice,
  EmergencyCase
} = require("../models");

const router = express.Router();

function parseDate(value, fallback) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

router.get("/waiting-time-analytics", async (req, res, next) => {
  try {
    const from = parseDate(req.query.from, new Date(Date.now() - 30 * 86400000));
    const to = parseDate(req.query.to, new Date());
    const tickets = await QueueTicket.findAll({
      where: { createdAt: { [Op.between]: [from, to] } },
      attributes: ["createdAt", "calledAt", "servedAt", "status", "servicePoint"]
    });

    let totalWaitMinutes = 0;
    let measured = 0;
    const byServicePoint = new Map();

    tickets.forEach((ticket) => {
      if (!ticket.calledAt) return;
      const wait = (new Date(ticket.calledAt) - new Date(ticket.createdAt)) / 60000;
      if (!Number.isFinite(wait) || wait < 0) return;
      measured += 1;
      totalWaitMinutes += wait;
      const point = ticket.servicePoint || "Unknown";
      const current = byServicePoint.get(point) || { servicePoint: point, count: 0, avgWaitMinutes: 0, total: 0 };
      current.count += 1;
      current.total += wait;
      byServicePoint.set(point, current);
    });

    const servicePoints = [...byServicePoint.values()].map((row) => ({
      servicePoint: row.servicePoint,
      count: row.count,
      avgWaitMinutes: row.count ? Number((row.total / row.count).toFixed(2)) : 0
    }));

    const noShows = await Appointment.count({
      where: { scheduledAt: { [Op.between]: [from, to] }, status: "NoShow" }
    });

    res.json({
      from: from.toISOString(),
      to: to.toISOString(),
      totalTickets: tickets.length,
      measuredTickets: measured,
      avgWaitMinutes: measured ? Number((totalWaitMinutes / measured).toFixed(2)) : 0,
      noShows,
      byServicePoint: servicePoints
    });
  } catch (error) {
    next(error);
  }
});

router.get("/patient-monitoring-summary", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.patientId) where.patientId = req.query.patientId;
    const rows = await PatientMonitoringRecord.findAll({
      where,
      order: [["monitoredAt", "DESC"]],
      limit: 200
    });
    const critical = rows.filter((x) => x.alertLevel === "Critical").length;
    const warning = rows.filter((x) => x.alertLevel === "Warning").length;
    const normal = rows.filter((x) => x.alertLevel === "Normal").length;
    res.json({
      totalRecords: rows.length,
      critical,
      warning,
      normal,
      recent: rows.slice(0, 25)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/ae-kpis", async (req, res, next) => {
  try {
    const from = parseDate(req.query.from, new Date(Date.now() - 30 * 86400000));
    const to = parseDate(req.query.to, new Date());
    const rows = await EmergencyCase.findAll({
      where: { arrivalAt: { [Op.between]: [from, to] } },
      attributes: [
        "caseNumber",
        "arrivalAt",
        "triagedAt",
        "providerSeenAt",
        "dispositionAt",
        "triageLevel",
        "status"
      ],
      order: [["arrivalAt", "DESC"]]
    });

    function averageMinutes(values) {
      const valid = values.filter((v) => Number.isFinite(v) && v >= 0);
      if (!valid.length) return 0;
      return Number((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(2));
    }

    const doorToTriage = rows.map((x) => (x.triagedAt ? (new Date(x.triagedAt) - new Date(x.arrivalAt)) / 60000 : NaN));
    const doorToProvider = rows.map((x) => (x.providerSeenAt ? (new Date(x.providerSeenAt) - new Date(x.arrivalAt)) / 60000 : NaN));
    const dispositionTime = rows.map((x) => (x.dispositionAt ? (new Date(x.dispositionAt) - new Date(x.arrivalAt)) / 60000 : NaN));

    const byTriage = rows.reduce((acc, row) => {
      acc[row.triageLevel] = (acc[row.triageLevel] || 0) + 1;
      return acc;
    }, {});
    const byStatus = rows.reduce((acc, row) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      from: from.toISOString(),
      to: to.toISOString(),
      totalCases: rows.length,
      avgDoorToTriageMinutes: averageMinutes(doorToTriage),
      avgDoorToProviderMinutes: averageMinutes(doorToProvider),
      avgDispositionMinutes: averageMinutes(dispositionTime),
      byTriage,
      byStatus,
      recentCases: rows.slice(0, 30)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/payment-gateway/process", async (req, res, next) => {
  try {
    const { invoiceId, patientId, amount, gatewayName, externalReference } = req.body;
    if (!invoiceId || !patientId || !amount) {
      return res.status(400).json({ message: "invoiceId, patientId, amount are required" });
    }

    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const gatewayTx = await PaymentGatewayTransaction.create({
      transactionNumber: `PGT-${Date.now()}`,
      invoiceId,
      patientId,
      gatewayName: gatewayName || "Custom",
      externalReference: externalReference || null,
      amount,
      status: "Captured",
      processedAt: new Date(),
      requestPayload: JSON.stringify(req.body),
      responsePayload: JSON.stringify({ gatewayDecision: "Approved" })
    });

    const payment = await Payment.create({
      paymentNumber: `PAY-${Date.now()}`,
      invoiceId,
      patientId,
      amount,
      method: "MobileMoney",
      status: "Completed",
      paidAt: new Date(),
      reference: gatewayTx.transactionNumber
    });

    await gatewayTx.update({ paymentId: payment.id });
    await invoice.update({ status: "Paid" });

    res.status(201).json({
      message: "Payment captured",
      gatewayTransaction: gatewayTx,
      payment
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
