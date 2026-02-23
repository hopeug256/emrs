const express = require("express");
const { Op } = require("sequelize");
const {
  Patient,
  Appointment,
  Invoice,
  LabOrder,
  RadiologyOrder,
  Admission,
  QueueTicket,
  Surgery,
  Payment,
  Claim,
  EmployeeAttendance,
  EmployeePerformanceMetric,
  Visit
} = require("../models");

const router = express.Router();

router.get("/overview", async (req, res, next) => {
  try {
    const [
      totalPatients,
      totalAppointments,
      pendingInvoices,
      totalLabOrders,
      totalRadiologyOrders,
      activeAdmissions,
      waitingQueue,
      scheduledSurgeries
    ] = await Promise.all([
      Patient.count(),
      Appointment.count(),
      Invoice.count({ where: { status: "Pending" } }),
      LabOrder.count(),
      RadiologyOrder.count(),
      Admission.count({ where: { status: "Admitted" } }),
      QueueTicket.count({ where: { status: "Waiting" } }),
      Surgery.count({ where: { status: "Scheduled" } })
    ]);

    res.json({
      totalPatients,
      totalAppointments,
      pendingInvoices,
      totalLabOrders,
      totalRadiologyOrders,
      activeAdmissions,
      waitingQueue,
      scheduledSurgeries,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

router.get("/historical", async (req, res, next) => {
  try {
    const days = Math.min(365, Math.max(7, Number.parseInt(req.query.days, 10) || 30));
    const since = new Date(Date.now() - days * 86400000);

    const [appointments, invoices, payments, claims, visits] = await Promise.all([
      Appointment.findAll({
        where: { createdAt: { [Op.gte]: since } },
        attributes: ["createdAt", "status"]
      }),
      Invoice.findAll({
        where: { createdAt: { [Op.gte]: since } },
        attributes: ["createdAt", "status", "amount"]
      }),
      Payment.findAll({
        where: { paidAt: { [Op.gte]: since } },
        attributes: ["paidAt", "status", "amount"]
      }),
      Claim.findAll({
        where: { createdAt: { [Op.gte]: since } },
        attributes: ["createdAt", "status", "amountClaimed", "amountApproved"]
      }),
      Visit.findAll({
        where: { createdAt: { [Op.gte]: since } },
        attributes: ["createdAt", "type", "status"]
      })
    ]);

    const summarizeByDay = (rows, dateField, valueField) => {
      const map = new Map();
      rows.forEach((row) => {
        const day = new Date(row[dateField]).toISOString().slice(0, 10);
        const current = map.get(day) || { count: 0, amount: 0 };
        current.count += 1;
        if (valueField) current.amount += Number.parseFloat(row[valueField] || 0);
        map.set(day, current);
      });
      return [...map.entries()]
        .map(([day, values]) => ({ day, ...values, amount: Number(values.amount.toFixed(2)) }))
        .sort((a, b) => a.day.localeCompare(b.day));
    };

    res.json({
      since: since.toISOString(),
      days,
      appointmentsByDay: summarizeByDay(appointments, "createdAt"),
      invoicesByDay: summarizeByDay(invoices, "createdAt", "amount"),
      paymentsByDay: summarizeByDay(payments, "paidAt", "amount"),
      claimsByDay: summarizeByDay(claims, "createdAt", "amountClaimed"),
      visitsByDay: summarizeByDay(visits, "createdAt")
    });
  } catch (error) {
    next(error);
  }
});

router.get("/analytics", async (req, res, next) => {
  try {
    const [
      invoiceAgg,
      paymentAgg,
      claimAgg,
      claimsByStatus,
      noShowAppointments,
      attendanceAgg,
      perfAgg
    ] = await Promise.all([
      Invoice.findAll({ attributes: ["status", "amount"] }),
      Payment.findAll({ attributes: ["status", "amount"] }),
      Claim.findAll({ attributes: ["status", "amountClaimed", "amountApproved"] }),
      Claim.count({ group: ["status"] }),
      Appointment.count({ where: { status: "NoShow" } }),
      EmployeeAttendance.findAll({ attributes: ["status"] }),
      EmployeePerformanceMetric.findAll({ attributes: ["score"] })
    ]);

    const sum = (rows, field) =>
      Number(
        rows
          .reduce((acc, row) => acc + Number.parseFloat(row[field] || 0), 0)
          .toFixed(2)
      );

    const totalBilled = sum(invoiceAgg, "amount");
    const totalCollected = sum(paymentAgg.filter((p) => p.status === "Completed"), "amount");
    const totalClaimed = sum(claimAgg, "amountClaimed");
    const totalApprovedClaims = sum(claimAgg, "amountApproved");
    const collectionRate = totalBilled ? Number(((totalCollected / totalBilled) * 100).toFixed(2)) : 0;
    const claimApprovalRate = totalClaimed ? Number(((totalApprovedClaims / totalClaimed) * 100).toFixed(2)) : 0;
    const attendancePresent = attendanceAgg.filter((a) => a.status === "Present").length;
    const attendanceRate = attendanceAgg.length
      ? Number(((attendancePresent / attendanceAgg.length) * 100).toFixed(2))
      : 0;
    const avgPerformanceScore = perfAgg.length
      ? Number((perfAgg.reduce((acc, row) => acc + Number.parseFloat(row.score || 0), 0) / perfAgg.length).toFixed(2))
      : 0;

    res.json({
      revenue: {
        totalBilled,
        totalCollected,
        collectionRate
      },
      claims: {
        totalClaimed,
        totalApprovedClaims,
        claimApprovalRate,
        byStatus: claimsByStatus
      },
      operations: {
        appointmentNoShowCount: noShowAppointments
      },
      workforce: {
        attendanceRate,
        avgPerformanceScore
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
