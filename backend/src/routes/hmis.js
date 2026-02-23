const express = require("express");
const { Op } = require("sequelize");
const {
  HmisReportSubmission,
  DiseaseSurveillanceReport,
  Visit,
  Appointment,
  Admission,
  PatientTransfer,
  DischargeSummary,
  LabOrder,
  RadiologyOrder,
  Surgery,
  Prescription,
  Invoice,
  Payment,
  Employee,
  Provider,
  EmployeeAttendance,
  EmployeePerformanceMetric,
  StockItem,
  InventoryBatch,
  InventoryTransaction,
  PurchaseOrder,
  QueueTicket
} = require("../models");

const router = express.Router();

const HMIS_EXPORT_MAPPINGS = {
  HMIS105: [
    { key: "reportCode", label: "Report Code" },
    { key: "facilityCode", label: "Facility Code" },
    { key: "district", label: "District" },
    { key: "periodStart", label: "Period Start" },
    { key: "periodEnd", label: "Period End" },
    { key: "totalVisits", label: "Total Visits" },
    { key: "outpatientVisits", label: "Outpatient Visits" },
    { key: "inpatientVisits", label: "Inpatient Visits" },
    { key: "emergencyVisits", label: "Emergency Visits" },
    { key: "totalAppointments", label: "Appointments" },
    { key: "noShowAppointments", label: "No Show Appointments" },
    { key: "queueWaiting", label: "Queue Waiting" },
    { key: "labOrders", label: "Lab Orders" },
    { key: "radiologyOrders", label: "Radiology Orders" },
    { key: "prescriptions", label: "Prescriptions" }
  ],
  HMIS108: [
    { key: "reportCode", label: "Report Code" },
    { key: "facilityCode", label: "Facility Code" },
    { key: "district", label: "District" },
    { key: "periodStart", label: "Period Start" },
    { key: "periodEnd", label: "Period End" },
    { key: "admissions", label: "Admissions" },
    { key: "discharges", label: "Discharges" },
    { key: "transfers", label: "Transfers" },
    { key: "averageLengthOfStayDays", label: "Average Length of Stay (Days)" },
    { key: "activeAdmissionsAtEnd", label: "Active Admissions End Period" }
  ],
  HMIS033A: [
    { key: "reportCode", label: "Report Code" },
    { key: "caseNumber", label: "Case Number" },
    { key: "diseaseName", label: "Disease Name" },
    { key: "facilityCode", label: "Facility Code" },
    { key: "district", label: "District" },
    { key: "suspectedAt", label: "Suspected At" },
    { key: "confirmedAt", label: "Confirmed At" },
    { key: "deadlineAt", label: "Deadline At" },
    { key: "reportedAt", label: "Reported At" },
    { key: "timelinessStatus", label: "Timeliness Status" }
  ],
  HMIS033B: [
    { key: "reportCode", label: "Report Code" },
    { key: "facilityCode", label: "Facility Code" },
    { key: "district", label: "District" },
    { key: "weekStart", label: "Week Start" },
    { key: "weekEnd", label: "Week End" },
    { key: "diseaseName", label: "Disease Name" },
    { key: "suspectedCases", label: "Suspected Cases" },
    { key: "confirmedCases", label: "Confirmed Cases" },
    { key: "reportedOnTime", label: "Reported On Time" },
    { key: "reportedLate", label: "Reported Late" }
  ],
  HMIS106: [
    { key: "reportCode", label: "Report Code" },
    { key: "facilityCode", label: "Facility Code" },
    { key: "district", label: "District" },
    { key: "periodStart", label: "Period Start" },
    { key: "periodEnd", label: "Period End" },
    { key: "stockItems", label: "Stock Items" },
    { key: "inventoryBatches", label: "Inventory Batches" },
    { key: "expiredOrBlockedBatches", label: "Expired or Blocked Batches" },
    { key: "inventoryReceipts", label: "Inventory Receipts" },
    { key: "inventoryIssues", label: "Inventory Issues" },
    { key: "inventoryAdjustments", label: "Inventory Adjustments" },
    { key: "purchaseOrdersRaised", label: "Purchase Orders Raised" }
  ],
  HMIS107: [
    { key: "reportCode", label: "Report Code" },
    { key: "facilityCode", label: "Facility Code" },
    { key: "district", label: "District" },
    { key: "periodStart", label: "Period Start" },
    { key: "periodEnd", label: "Period End" },
    { key: "employees", label: "Employees" },
    { key: "providers", label: "Providers" },
    { key: "attendanceRecords", label: "Attendance Records" },
    { key: "attendanceRatePercent", label: "Attendance Rate %" },
    { key: "avgPerformanceScore", label: "Average Performance Score" }
  ],
  IDSR: [
    { key: "reportCode", label: "Report Code" },
    { key: "facilityCode", label: "Facility Code" },
    { key: "district", label: "District" },
    { key: "periodStart", label: "Period Start" },
    { key: "periodEnd", label: "Period End" },
    { key: "totalNotifiableCases", label: "Total Notifiable Cases" },
    { key: "reportedWithin24h", label: "Reported Within 24h" },
    { key: "reportedLate", label: "Reported Late" },
    { key: "timelinessRatePercent", label: "Timeliness Rate %" },
    { key: "topDisease", label: "Top Disease" }
  ]
};

const HMIS_PDF_TEMPLATES = {
  HMIS105: {
    formName: "HMIS 105",
    title: "Outpatient Monthly Summary",
    section: "Morbidity, service utilization and basic diagnostics summary"
  },
  HMIS108: {
    formName: "HMIS 108",
    title: "Inpatient Monthly Summary",
    section: "Admissions, discharges, transfers and bed utilization"
  },
  HMIS033A: {
    formName: "HMIS 033A",
    title: "Immediate Notifiable Disease Report (24 Hours)",
    section: "Case-based notification for immediately reportable conditions"
  },
  HMIS033B: {
    formName: "HMIS 033B",
    title: "Weekly Epidemiological Surveillance Report",
    section: "Weekly IDSR disease counts and timeliness"
  },
  HMIS106: {
    formName: "HMIS 106",
    title: "Logistics and Commodities Report",
    section: "Stock, inventory, expiry and procurement performance"
  },
  HMIS107: {
    formName: "HMIS 107",
    title: "Human Resource and Service Capacity Report",
    section: "Staff availability, attendance and performance indicators"
  },
  IDSR: {
    formName: "IDSR",
    title: "Integrated Disease Surveillance and Response Summary",
    section: "Notifiable disease timeliness and surveillance outcomes"
  }
};

const HMIS_PDF_LAYOUTS = {
  HMIS105: {
    headerFontSize: 7.4,
    bodyFontSize: 7.2,
    headerRowHeight: 20,
    dataRowHeight: 15,
    columnWeights: [7, 8, 8, 7, 7, 8, 9, 9, 9, 8, 9, 8, 8, 8, 8]
  },
  HMIS108: {
    headerFontSize: 8,
    bodyFontSize: 7.5,
    headerRowHeight: 18,
    dataRowHeight: 15,
    columnWeights: [8, 9, 9, 8, 8, 8, 8, 8, 11, 11]
  },
  HMIS033A: {
    headerFontSize: 7.1,
    bodyFontSize: 6.9,
    headerRowHeight: 20,
    dataRowHeight: 15,
    columnWeights: [7, 8, 10, 8, 8, 9, 9, 9, 9, 8]
  },
  HMIS033B: {
    headerFontSize: 7.2,
    bodyFontSize: 7.1,
    headerRowHeight: 20,
    dataRowHeight: 15,
    columnWeights: [7, 8, 8, 8, 8, 12, 8, 8, 8, 8]
  },
  HMIS106: {
    headerFontSize: 7.2,
    bodyFontSize: 7,
    headerRowHeight: 20,
    dataRowHeight: 15,
    columnWeights: [7, 8, 8, 7, 7, 8, 10, 12, 9, 9, 10, 10]
  },
  HMIS107: {
    headerFontSize: 7.6,
    bodyFontSize: 7.3,
    headerRowHeight: 18,
    dataRowHeight: 15,
    columnWeights: [8, 9, 9, 8, 8, 8, 8, 10, 10, 10]
  },
  IDSR: {
    headerFontSize: 7.4,
    bodyFontSize: 7.2,
    headerRowHeight: 18,
    dataRowHeight: 15,
    columnWeights: [7, 8, 8, 7, 7, 10, 10, 8, 10, 11]
  },
  DEFAULT: {
    headerFontSize: 7.4,
    bodyFontSize: 7.1,
    headerRowHeight: 18,
    dataRowHeight: 15
  }
};

function addDays(dateLike, days) {
  const date = new Date(dateLike);
  date.setDate(date.getDate() + days);
  return date;
}

function firstMondayAfter(dateLike) {
  const date = new Date(dateLike);
  do {
    date.setDate(date.getDate() + 1);
  } while (date.getDay() !== 1);
  return date;
}

function seventhOfNextMonth(dateLike) {
  const end = new Date(dateLike);
  return new Date(end.getFullYear(), end.getMonth() + 1, 7, 23, 59, 59);
}

function seventhOfQuarterDeadline(dateLike) {
  const end = new Date(dateLike);
  const currentQuarter = Math.floor(end.getMonth() / 3);
  const nextQuarterStartMonth = (currentQuarter + 1) * 3;
  return new Date(end.getFullYear(), nextQuarterStartMonth, 7, 23, 59, 59);
}

function augustSeventhNextYear(dateLike) {
  const end = new Date(dateLike);
  return new Date(end.getFullYear() + 1, 7, 7, 23, 59, 59);
}

function expectedDateForReport(reportCode, periodEnd, diseaseDetectedAt) {
  if (reportCode === "HMIS033A") return addDays(diseaseDetectedAt || periodEnd, 1);
  if (reportCode === "HMIS033B") return firstMondayAfter(periodEnd);
  if (reportCode === "HMIS105" || reportCode === "HMIS108" || reportCode === "IDSR") return seventhOfNextMonth(periodEnd);
  if (reportCode === "HMIS106") return seventhOfQuarterDeadline(periodEnd);
  if (reportCode === "HMIS107") return augustSeventhNextYear(periodEnd);
  return addDays(periodEnd, 7);
}

function normalizeDateInput(value, fallback) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function toCsv(rows, mappings) {
  const headers = mappings.map((item) => item.label);
  const keys = mappings.map((item) => item.key);
  const escape = (value) => {
    const text = value == null ? "" : String(value);
    if (/[",\n]/.test(text)) {
      return `"${text.replace(/"/g, "\"\"")}"`;
    }
    return text;
  };
  const lines = [headers.map(escape).join(",")];
  rows.forEach((row) => {
    lines.push(keys.map((key) => escape(row[key])).join(","));
  });
  return lines.join("\n");
}

function escapePdfText(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function truncateToWidth(text, width, fontSize) {
  const value = text == null ? "" : String(text);
  const approxCharWidth = fontSize * 0.52;
  const maxChars = Math.max(1, Math.floor(width / approxCharWidth));
  if (value.length <= maxChars) return value;
  return `${value.slice(0, Math.max(1, maxChars - 3))}...`;
}

function drawText(commands, x, y, size, text) {
  commands.push(`BT /F1 ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${escapePdfText(text)}) Tj ET`);
}

function drawLine(commands, x1, y1, x2, y2) {
  commands.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
}

function resolveColumnWidths(reportCode, mappings, tableWidth) {
  const layout = HMIS_PDF_LAYOUTS[reportCode] || HMIS_PDF_LAYOUTS.DEFAULT;
  const provided = layout.columnWeights || [];
  const fallback = new Array(mappings.length).fill(1);
  const weights = mappings.map((_, index) => Number(provided[index] || fallback[index]));
  const total = weights.reduce((sum, value) => sum + value, 0) || 1;
  return weights.map((weight) => (weight / total) * tableWidth);
}

function toStyledMultipagePdfBuffer(reportCode, rows, mappings, meta) {
  const template = HMIS_PDF_TEMPLATES[reportCode] || {
    formName: reportCode,
    title: "HMIS Export",
    section: "Generated export"
  };
  const layout = HMIS_PDF_LAYOUTS[reportCode] || HMIS_PDF_LAYOUTS.DEFAULT;
  const pageWidth = 595;
  const pageHeight = 842;
  const marginLeft = 36;
  const marginRight = 36;
  const topY = 806;
  const bottomY = 52;
  const tableTopY = 690;
  const tableWidth = pageWidth - marginLeft - marginRight;
  const colCount = Math.max(1, mappings.length);
  const colWidths = resolveColumnWidths(reportCode, mappings, tableWidth);
  const colStartX = [];
  let runningX = marginLeft;
  for (let i = 0; i < colCount; i += 1) {
    colStartX.push(runningX);
    runningX += colWidths[i];
  }
  const headerFontSize = layout.headerFontSize || 7.4;
  const bodyFontSize = layout.bodyFontSize || 7.1;
  const headerRowHeight = layout.headerRowHeight || 18;
  const dataRowHeight = layout.dataRowHeight || 15;
  const footerHeight = 72;
  const usableTableHeight = tableTopY - bottomY - footerHeight - headerRowHeight;
  const rowsPerPage = Math.max(1, Math.floor(usableTableHeight / dataRowHeight));
  const normalizedRows = rows.length ? rows : [{}];
  const totalPages = Math.ceil(normalizedRows.length / rowsPerPage);
  const pageContents = [];

  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const start = pageIndex * rowsPerPage;
    const end = Math.min(normalizedRows.length, start + rowsPerPage);
    const pageRows = normalizedRows.slice(start, end);
    const commands = [];
    commands.push("0.1 w");

    drawText(commands, marginLeft, topY, 11, "Uganda Ministry of Health - HMIS");
    drawText(commands, marginLeft, topY - 16, 10, `${template.formName}: ${template.title}`);
    drawText(commands, marginLeft, topY - 30, 8, template.section);
    drawText(
      commands,
      marginLeft,
      topY - 44,
      8,
      `Facility: ${meta.facilityCode}   District: ${meta.district}   Period: ${meta.periodStart} to ${meta.periodEnd}`
    );
    drawText(commands, pageWidth - 140, topY - 44, 8, `Page ${pageIndex + 1} of ${totalPages}`);

    const tableHeaderTop = tableTopY;
    const tableHeaderBottom = tableHeaderTop - headerRowHeight;
    drawLine(commands, marginLeft, tableHeaderTop, marginLeft + tableWidth, tableHeaderTop);
    drawLine(commands, marginLeft, tableHeaderBottom, marginLeft + tableWidth, tableHeaderBottom);

    for (let col = 0; col < colCount; col += 1) {
      const x = colStartX[col];
      drawLine(commands, x, tableHeaderTop, x, tableHeaderBottom - pageRows.length * dataRowHeight);
    }
    drawLine(commands, marginLeft + tableWidth, tableHeaderTop, marginLeft + tableWidth, tableHeaderBottom - pageRows.length * dataRowHeight);

    mappings.forEach((mapping, colIndex) => {
      const x = colStartX[colIndex] + 2;
      const label = truncateToWidth(mapping.label, colWidths[colIndex] - 4, headerFontSize);
      const y = tableHeaderBottom + ((headerRowHeight - headerFontSize) / 2);
      drawText(commands, x, y, headerFontSize, label);
    });

    pageRows.forEach((row, rowIndex) => {
      const rowTop = tableHeaderBottom - rowIndex * dataRowHeight;
      const rowBottom = rowTop - dataRowHeight;
      drawLine(commands, marginLeft, rowBottom, marginLeft + tableWidth, rowBottom);
      mappings.forEach((mapping, colIndex) => {
        const rawValue = row[mapping.key];
        const textValue = rawValue == null ? "" : String(rawValue);
        const cell = truncateToWidth(textValue, colWidths[colIndex] - 4, bodyFontSize);
        const x = colStartX[colIndex] + 2;
        const y = rowBottom + ((dataRowHeight - bodyFontSize) / 2);
        drawText(commands, x, y, bodyFontSize, cell);
      });
    });

    const footerTop = bottomY + 44;
    drawLine(commands, marginLeft, footerTop, marginLeft + tableWidth, footerTop);
    drawText(commands, marginLeft, footerTop - 14, 8, "Prepared By (Name/Signature): ______________________");
    drawText(commands, marginLeft + 220, footerTop - 14, 8, "Verified By: ______________________");
    drawText(commands, marginLeft + 390, footerTop - 14, 8, "Date: ______________________");
    drawText(commands, marginLeft, bottomY + 12, 7, "Generated by EMRS HMIS Export Pack. Verify against current MoH approved paper form before submission.");

    pageContents.push(commands.join("\n"));
  }

  const objects = [];
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");
  const pageObjectIds = pageContents.map((_, idx) => 3 + idx * 2);
  const contentObjectIds = pageContents.map((_, idx) => 4 + idx * 2);
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>\nendobj\n`);

  for (let i = 0; i < pageContents.length; i += 1) {
    const pageId = pageObjectIds[i];
    const contentId = contentObjectIds[i];
    objects.push(
      `${pageId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${
        3 + pageContents.length * 2
      } 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`
    );
    const content = pageContents[i];
    objects.push(
      `${contentId} 0 obj\n<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream\nendobj\n`
    );
  }

  const fontObjectId = 3 + pageContents.length * 2;
  objects.push(`${fontObjectId} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  });
  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}
async function buildRows(reportCode, periodStart, periodEnd, facilityCode, district) {
  const common = {
    reportCode,
    facilityCode,
    district,
    periodStart: periodStart.toISOString().slice(0, 10),
    periodEnd: periodEnd.toISOString().slice(0, 10)
  };

  if (reportCode === "HMIS105") {
    const [visits, appointments, noShows, queueWaiting, labOrders, radiologyOrders, prescriptions] =
      await Promise.all([
        Visit.count({ where: { checkInAt: { [Op.between]: [periodStart, periodEnd] } } }),
        Appointment.count({ where: { scheduledAt: { [Op.between]: [periodStart, periodEnd] } } }),
        Appointment.count({ where: { scheduledAt: { [Op.between]: [periodStart, periodEnd] }, status: "NoShow" } }),
        QueueTicket.count({ where: { createdAt: { [Op.between]: [periodStart, periodEnd] }, status: "Waiting" } }),
        LabOrder.count({ where: { createdAt: { [Op.between]: [periodStart, periodEnd] } } }),
        RadiologyOrder.count({ where: { createdAt: { [Op.between]: [periodStart, periodEnd] } } }),
        Prescription.count({ where: { createdAt: { [Op.between]: [periodStart, periodEnd] } } })
      ]);
    const [outpatientVisits, inpatientVisits, emergencyVisits] = await Promise.all([
      Visit.count({ where: { checkInAt: { [Op.between]: [periodStart, periodEnd] }, type: "Outpatient" } }),
      Visit.count({ where: { checkInAt: { [Op.between]: [periodStart, periodEnd] }, type: "Inpatient" } }),
      Visit.count({ where: { checkInAt: { [Op.between]: [periodStart, periodEnd] }, type: "Emergency" } })
    ]);
    return [
      {
        ...common,
        totalVisits: visits,
        outpatientVisits,
        inpatientVisits,
        emergencyVisits,
        totalAppointments: appointments,
        noShowAppointments: noShows,
        queueWaiting,
        labOrders,
        radiologyOrders,
        prescriptions
      }
    ];
  }

  if (reportCode === "HMIS108") {
    const [admissions, discharges, transfers, activeAdmissionsAtEnd, admissionRows] = await Promise.all([
      Admission.count({ where: { admittedAt: { [Op.between]: [periodStart, periodEnd] } } }),
      DischargeSummary.count({ where: { dischargeDate: { [Op.between]: [periodStart, periodEnd] } } }),
      PatientTransfer.count({ where: { transferredAt: { [Op.between]: [periodStart, periodEnd] } } }),
      Admission.count({ where: { admittedAt: { [Op.lte]: periodEnd }, status: "Admitted" } }),
      Admission.findAll({ where: { admittedAt: { [Op.between]: [periodStart, periodEnd] }, dischargedAt: { [Op.not]: null } } })
    ]);
    const avgStay = admissionRows.length
      ? admissionRows.reduce((sum, row) => {
          const start = new Date(row.admittedAt);
          const end = new Date(row.dischargedAt);
          return sum + Math.max(0, (end - start) / 86400000);
        }, 0) / admissionRows.length
      : 0;
    return [
      {
        ...common,
        admissions,
        discharges,
        transfers,
        averageLengthOfStayDays: Number(avgStay.toFixed(2)),
        activeAdmissionsAtEnd
      }
    ];
  }

  if (reportCode === "HMIS033A") {
    const cases = await DiseaseSurveillanceReport.findAll({
      where: {
        reportType: "Immediate24h",
        suspectedAt: { [Op.between]: [periodStart, periodEnd] }
      },
      order: [["suspectedAt", "ASC"]]
    });
    return cases.map((item) => ({
      reportCode,
      caseNumber: item.caseNumber,
      diseaseName: item.diseaseName,
      facilityCode: item.facilityCode || facilityCode,
      district: item.district || district,
      suspectedAt: item.suspectedAt ? new Date(item.suspectedAt).toISOString() : null,
      confirmedAt: item.confirmedAt ? new Date(item.confirmedAt).toISOString() : null,
      deadlineAt: item.deadlineAt ? new Date(item.deadlineAt).toISOString() : null,
      reportedAt: item.reportedAt ? new Date(item.reportedAt).toISOString() : null,
      timelinessStatus: item.timelinessStatus
    }));
  }

  if (reportCode === "HMIS033B") {
    const cases = await DiseaseSurveillanceReport.findAll({
      where: {
        suspectedAt: { [Op.between]: [periodStart, periodEnd] }
      },
      order: [["suspectedAt", "ASC"]]
    });
    const weekly = new Map();
    cases.forEach((item) => {
      const dt = new Date(item.suspectedAt);
      const day = dt.getDay();
      const diffToMonday = (day + 6) % 7;
      const weekStart = new Date(dt);
      weekStart.setDate(dt.getDate() - diffToMonday);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const key = `${weekStart.toISOString().slice(0, 10)}|${item.diseaseName}`;
      const current = weekly.get(key) || {
        reportCode,
        facilityCode,
        district,
        weekStart: weekStart.toISOString().slice(0, 10),
        weekEnd: weekEnd.toISOString().slice(0, 10),
        diseaseName: item.diseaseName,
        suspectedCases: 0,
        confirmedCases: 0,
        reportedOnTime: 0,
        reportedLate: 0
      };
      current.suspectedCases += 1;
      if (item.confirmedAt) current.confirmedCases += 1;
      if (item.timelinessStatus === "OnTime") current.reportedOnTime += 1;
      if (item.timelinessStatus === "Late") current.reportedLate += 1;
      weekly.set(key, current);
    });
    return [...weekly.values()].sort((a, b) => a.weekStart.localeCompare(b.weekStart));
  }

  if (reportCode === "HMIS106") {
    const [stockItems, inventoryBatches, expiredOrBlockedBatches, txReceipts, txIssues, txAdjustments, purchaseOrdersRaised] =
      await Promise.all([
        StockItem.count(),
        InventoryBatch.count({ where: { createdAt: { [Op.between]: [periodStart, periodEnd] } } }),
        InventoryBatch.count({ where: { createdAt: { [Op.between]: [periodStart, periodEnd] }, status: { [Op.in]: ["Expired", "Blocked"] } } }),
        InventoryTransaction.count({ where: { transactionDate: { [Op.between]: [periodStart, periodEnd] }, transactionType: "Receipt" } }),
        InventoryTransaction.count({ where: { transactionDate: { [Op.between]: [periodStart, periodEnd] }, transactionType: "Issue" } }),
        InventoryTransaction.count({ where: { transactionDate: { [Op.between]: [periodStart, periodEnd] }, transactionType: "Adjustment" } }),
        PurchaseOrder.count({ where: { orderDate: { [Op.between]: [periodStart, periodEnd] } } })
      ]);
    return [
      {
        ...common,
        stockItems,
        inventoryBatches,
        expiredOrBlockedBatches,
        inventoryReceipts: txReceipts,
        inventoryIssues: txIssues,
        inventoryAdjustments: txAdjustments,
        purchaseOrdersRaised
      }
    ];
  }

  if (reportCode === "HMIS107") {
    const [employees, providers, attendanceRows, perfRows] = await Promise.all([
      Employee.count(),
      Provider.count(),
      EmployeeAttendance.findAll({ where: { attendanceDate: { [Op.between]: [periodStart, periodEnd] } } }),
      EmployeePerformanceMetric.findAll({ where: { createdAt: { [Op.between]: [periodStart, periodEnd] } } })
    ]);
    const attendanceRatePercent = attendanceRows.length
      ? Number(((attendanceRows.filter((x) => x.status === "Present").length / attendanceRows.length) * 100).toFixed(2))
      : 0;
    const avgPerformanceScore = perfRows.length
      ? Number((perfRows.reduce((sum, x) => sum + Number.parseFloat(x.score || 0), 0) / perfRows.length).toFixed(2))
      : 0;
    return [
      {
        ...common,
        employees,
        providers,
        attendanceRecords: attendanceRows.length,
        attendanceRatePercent,
        avgPerformanceScore
      }
    ];
  }

  if (reportCode === "IDSR") {
    const cases = await DiseaseSurveillanceReport.findAll({
      where: { suspectedAt: { [Op.between]: [periodStart, periodEnd] } }
    });
    const totalNotifiableCases = cases.length;
    const reportedWithin24h = cases.filter((x) => x.reportType === "Immediate24h" && x.timelinessStatus === "OnTime").length;
    const reportedLate = cases.filter((x) => x.timelinessStatus === "Late").length;
    const timelinessRatePercent = totalNotifiableCases
      ? Number(((reportedWithin24h / totalNotifiableCases) * 100).toFixed(2))
      : 0;
    const diseaseCounts = new Map();
    cases.forEach((item) => {
      diseaseCounts.set(item.diseaseName, (diseaseCounts.get(item.diseaseName) || 0) + 1);
    });
    const topDisease = [...diseaseCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "";
    return [
      {
        ...common,
        totalNotifiableCases,
        reportedWithin24h,
        reportedLate,
        timelinessRatePercent,
        topDisease
      }
    ];
  }

  return [];
}

router.post("/report-submissions/derive-deadline", async (req, res, next) => {
  try {
    const { reportCode, reportingPeriodEnd, diseaseDetectedAt } = req.body;
    if (!reportCode || !reportingPeriodEnd) {
      return res.status(400).json({ message: "reportCode and reportingPeriodEnd are required" });
    }
    const expected = expectedDateForReport(reportCode, reportingPeriodEnd, diseaseDetectedAt);
    res.json({ reportCode, expectedSubmissionDate: expected.toISOString() });
  } catch (error) {
    next(error);
  }
});

router.post("/report-submissions/:id/submit", async (req, res, next) => {
  try {
    const report = await HmisReportSubmission.findByPk(req.params.id);
    if (!report) return res.status(404).json({ message: "Report submission not found" });

    const submittedAt = req.body.submittedAt ? new Date(req.body.submittedAt) : new Date();
    const expected = new Date(report.expectedSubmissionDate);
    const timelinessStatus = submittedAt <= expected ? "OnTime" : "Late";

    await report.update({
      submittedAt,
      timelinessStatus,
      completenessPercent: req.body.completenessPercent ?? report.completenessPercent,
      accuracyStatus: req.body.accuracyStatus || report.accuracyStatus,
      submissionChannel: req.body.submissionChannel || report.submissionChannel
    });

    res.json(report);
  } catch (error) {
    next(error);
  }
});

router.post("/disease-surveillance/:id/report", async (req, res, next) => {
  try {
    const item = await DiseaseSurveillanceReport.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Disease surveillance record not found" });
    const reportedAt = req.body.reportedAt ? new Date(req.body.reportedAt) : new Date();
    const timelinessStatus = reportedAt <= new Date(item.deadlineAt) ? "OnTime" : "Late";
    await item.update({ reportedAt, timelinessStatus });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.get("/compliance/dashboard", async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 90 * 86400000);
    const to = req.query.to ? new Date(req.query.to) : new Date();

    const [reports, surveillance] = await Promise.all([
      HmisReportSubmission.findAll({
        where: { reportingPeriodEnd: { [Op.between]: [from, to] } },
        order: [["reportingPeriodEnd", "DESC"]]
      }),
      DiseaseSurveillanceReport.findAll({
        where: { suspectedAt: { [Op.between]: [from, to] } },
        order: [["suspectedAt", "DESC"]]
      })
    ]);

    const summarize = (items, keyField) => {
      const map = new Map();
      items.forEach((item) => {
        const key = item[keyField];
        const current = map.get(key) || {
          key,
          total: 0,
          onTime: 0,
          late: 0,
          pending: 0,
          averageCompleteness: 0
        };
        current.total += 1;
        if (item.timelinessStatus === "OnTime") current.onTime += 1;
        else if (item.timelinessStatus === "Late") current.late += 1;
        else current.pending += 1;
        current.averageCompleteness += Number.parseFloat(item.completenessPercent || 0);
        map.set(key, current);
      });
      return [...map.values()].map((row) => ({
        ...row,
        averageCompleteness: row.total ? Number((row.averageCompleteness / row.total).toFixed(2)) : 0,
        timelinessRate: row.total ? Number(((row.onTime / row.total) * 100).toFixed(2)) : 0
      }));
    };

    const reportByCode = summarize(reports, "reportCode");
    const surveillanceByType = summarize(surveillance, "reportType");
    const notifiable24hOnTime = surveillance.filter(
      (item) => item.reportType === "Immediate24h" && item.timelinessStatus === "OnTime"
    ).length;
    const notifiable24hTotal = surveillance.filter((item) => item.reportType === "Immediate24h").length;

    res.json({
      from: from.toISOString(),
      to: to.toISOString(),
      totals: {
        hmisReports: reports.length,
        surveillanceCases: surveillance.length,
        notifiable24hTimelinessRate: notifiable24hTotal
          ? Number(((notifiable24hOnTime / notifiable24hTotal) * 100).toFixed(2))
          : 0
      },
      reportByCode,
      surveillanceByType,
      recentReports: reports.slice(0, 25),
      recentSurveillance: surveillance.slice(0, 25)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/exports/meta", async (req, res) => {
  res.json({
    reportCodes: Object.keys(HMIS_EXPORT_MAPPINGS),
    mappings: HMIS_EXPORT_MAPPINGS,
    templates: HMIS_PDF_TEMPLATES,
    layouts: HMIS_PDF_LAYOUTS
  });
});

router.get("/exports/:reportCode", async (req, res, next) => {
  try {
    const reportCode = String(req.params.reportCode || "").toUpperCase();
    const mappings = HMIS_EXPORT_MAPPINGS[reportCode];
    if (!mappings) {
      return res.status(400).json({ message: "Unsupported report code" });
    }

    const now = new Date();
    const periodStart = normalizeDateInput(req.query.periodStart, new Date(now.getFullYear(), now.getMonth(), 1));
    const periodEnd = normalizeDateInput(req.query.periodEnd, now);
    if (periodStart > periodEnd) {
      return res.status(400).json({ message: "periodStart cannot be after periodEnd" });
    }
    const facilityCode = String(req.query.facilityCode || "UNKNOWN");
    const district = String(req.query.district || "UNKNOWN");
    const format = String(req.query.format || "json").toLowerCase();

    const rows = await buildRows(reportCode, periodStart, periodEnd, facilityCode, district);
    const baseName = `${reportCode}_${periodStart.toISOString().slice(0, 10)}_${periodEnd.toISOString().slice(0, 10)}`;

    if (format === "csv") {
      const csv = toCsv(rows, mappings);
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="${baseName}.csv"`);
      return res.send(csv);
    }

    if (format === "pdf") {
      const pdf = toStyledMultipagePdfBuffer(reportCode, rows, mappings, {
        facilityCode,
        district,
        periodStart: periodStart.toISOString().slice(0, 10),
        periodEnd: periodEnd.toISOString().slice(0, 10)
      });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${baseName}.pdf"`);
      return res.send(pdf);
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${baseName}.json"`);
    return res.json({
      reportCode,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      facilityCode,
      district,
      columns: mappings,
      rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
