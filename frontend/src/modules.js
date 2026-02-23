export const moduleConfigs = [
  {
    key: "form-builder",
    title: "Form Builder",
    fields: [],
    columns: []
  },
  {
    key: "form-submissions",
    title: "Form Submissions",
    fields: [],
    columns: []
  },
  {
    key: "theatre-rooms",
    title: "Theatre Rooms",
    fields: [
      { name: "code", label: "Room Code", required: true },
      { name: "name", label: "Room Name", required: true },
      { name: "location", label: "Location" },
      { name: "status", label: "Status", type: "select", options: ["Available", "Maintenance", "Closed"] }
    ],
    columns: ["code", "name", "location", "status"]
  },
  {
    key: "theatre-procedures",
    title: "Theatre Procedures",
    fields: [
      { name: "code", label: "Procedure Code", required: true },
      { name: "name", label: "Procedure Name", required: true },
      { name: "specialty", label: "Specialty" },
      { name: "estimatedDurationMinutes", label: "Duration (mins)", type: "number" },
      { name: "riskLevel", label: "Risk Level", type: "select", options: ["Low", "Medium", "High"] }
    ],
    columns: ["code", "name", "specialty", "estimatedDurationMinutes", "riskLevel"]
  },
  {
    key: "surgeries",
    title: "Surgeries",
    fields: [
      { name: "surgeryNumber", label: "Surgery Number", required: true },
      { name: "scheduledStart", label: "Scheduled Start", type: "datetime-local", required: true },
      { name: "scheduledEnd", label: "Scheduled End", type: "datetime-local" },
      { name: "priority", label: "Priority", type: "select", options: ["Elective", "Urgent", "Emergency"] },
      { name: "status", label: "Status", type: "select", options: ["Scheduled", "InProgress", "Completed", "Cancelled"] },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "primarySurgeonId", label: "Primary Surgeon", type: "relation", relation: "providers", display: "providerCode" },
      { name: "theatreRoomId", label: "Theatre Room", type: "relation", relation: "theatre-rooms", display: "name", required: true },
      { name: "theatreProcedureId", label: "Procedure", type: "relation", relation: "theatre-procedures", display: "name", required: true },
      { name: "notes", label: "Notes" }
    ],
    columns: [
      "surgeryNumber",
      "scheduledStart",
      "status",
      "priority",
      "patientId",
      "primarySurgeonId",
      "theatreRoomId",
      "theatreProcedureId"
    ]
  },
  {
    key: "theatre-workflow",
    title: "Theatre Workflow",
    fields: [],
    columns: []
  },
  {
    key: "insurance-providers",
    title: "Insurance Providers",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" }
    ],
    columns: ["code", "name", "phone", "email"]
  },
  {
    key: "insurance-policies",
    title: "Insurance Policies",
    fields: [
      { name: "policyNumber", label: "Policy Number", required: true },
      { name: "memberId", label: "Member ID" },
      { name: "planName", label: "Plan Name" },
      { name: "coverageLimit", label: "Coverage Limit", type: "number" },
      { name: "coPayAmount", label: "Co-Pay", type: "number" },
      { name: "deductibleAmount", label: "Deductible", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Expired", "Pending"] },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "insuranceProviderId", label: "Provider", type: "relation", relation: "insurance-providers", display: "name", required: true }
    ],
    columns: ["policyNumber", "planName", "status", "patientId", "insuranceProviderId"]
  },
  {
    key: "lab-tests",
    title: "Lab Tests",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "specimenType", label: "Specimen Type" },
      { name: "normalRange", label: "Normal Range" },
      { name: "price", label: "Price", type: "number" }
    ],
    columns: ["code", "name", "specimenType", "normalRange", "price"]
  },
  {
    key: "lab-orders",
    title: "Lab Orders",
    fields: [
      { name: "orderNumber", label: "Order Number", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "labTestId", label: "Lab Test", type: "relation", relation: "lab-tests", display: "name" },
      { name: "labPanelId", label: "Lab Panel", type: "relation", relation: "lab-panels", display: "name" },
      { name: "orderedByProviderId", label: "Ordered By", type: "relation", relation: "providers", display: "providerCode" },
      { name: "encounterId", label: "Encounter", type: "relation", relation: "encounters", display: "id" },
      { name: "status", label: "Status", type: "select", options: ["Ordered", "Collected", "InProgress", "Completed", "Cancelled"] },
      { name: "resultText", label: "Result" }
    ],
    columns: ["orderNumber", "patientId", "labTestId", "labPanelId", "status", "workflowStatus", "orderedByProviderId"]
  },
  {
    key: "lab-panels",
    title: "Lab Panels",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "description", label: "Description" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
    ],
    columns: ["code", "name", "status", "description"]
  },
  {
    key: "lab-analytes",
    title: "Lab Analytes",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "unit", label: "Unit" },
      { name: "referenceMin", label: "Ref Min", type: "number" },
      { name: "referenceMax", label: "Ref Max", type: "number" },
      { name: "criticalMin", label: "Critical Min", type: "number" },
      { name: "criticalMax", label: "Critical Max", type: "number" }
    ],
    columns: ["code", "name", "unit", "referenceMin", "referenceMax", "criticalMin", "criticalMax"]
  },
  {
    key: "lab-panel-analytes",
    title: "Lab Panel Analytes",
    fields: [
      { name: "labPanelId", label: "Panel", type: "relation", relation: "lab-panels", display: "name", required: true },
      { name: "labAnalyteId", label: "Analyte", type: "relation", relation: "lab-analytes", display: "name", required: true },
      { name: "orderIndex", label: "Order", type: "number" },
      { name: "required", label: "Required", type: "select", options: ["true", "false"] }
    ],
    columns: ["labPanelId", "labAnalyteId", "orderIndex", "required"]
  },
  {
    key: "lab-instruments",
    title: "Lab Instruments",
    fields: [
      { name: "instrumentCode", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "manufacturer", label: "Manufacturer" },
      { name: "interfaceMode", label: "Interface", type: "select", options: ["Manual", "HL7", "REST"] },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
    ],
    columns: ["instrumentCode", "name", "manufacturer", "interfaceMode", "status"]
  },
  {
    key: "lab-report-templates",
    title: "Lab Report Templates",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "bodyTemplate", label: "Body Template", required: true },
      { name: "active", label: "Active", type: "select", options: ["true", "false"] }
    ],
    columns: ["code", "name", "active"]
  },
  {
    key: "lab-workflow",
    title: "Lab Workflow",
    fields: [],
    columns: []
  },
  {
    key: "radiology-modalities",
    title: "Radiology Modalities",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "location", label: "Location" },
      { name: "status", label: "Status", type: "select", options: ["Available", "Busy", "Maintenance"] }
    ],
    columns: ["code", "name", "location", "status"]
  },
  {
    key: "radiology-orders",
    title: "Radiology Orders",
    fields: [
      { name: "orderNumber", label: "Order Number", required: true },
      { name: "studyType", label: "Study Type" },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "orderedByProviderId", label: "Ordered By", type: "relation", relation: "providers", display: "providerCode" },
      { name: "radiologyModalityId", label: "Modality", type: "relation", relation: "radiology-modalities", display: "name" },
      { name: "encounterId", label: "Encounter", type: "relation", relation: "encounters", display: "id" },
      { name: "status", label: "Status", type: "select", options: ["Ordered", "Scheduled", "InProgress", "Reported", "Cancelled"] },
      { name: "scheduledAt", label: "Scheduled At", type: "datetime-local" },
      { name: "findings", label: "Findings" },
      { name: "impression", label: "Impression" }
    ],
    columns: ["orderNumber", "studyType", "patientId", "radiologyModalityId", "status"]
  },
  {
    key: "wards",
    title: "Wards",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "type", label: "Type" },
      { name: "floor", label: "Floor" }
    ],
    columns: ["code", "name", "type", "floor"]
  },
  {
    key: "beds",
    title: "Beds",
    fields: [
      { name: "bedNumber", label: "Bed Number", required: true },
      { name: "wardId", label: "Ward", type: "relation", relation: "wards", display: "name", required: true },
      { name: "status", label: "Status", type: "select", options: ["Available", "Occupied", "Reserved", "Cleaning", "Maintenance"] }
    ],
    columns: ["bedNumber", "wardId", "status"]
  },
  {
    key: "admissions",
    title: "Admissions",
    fields: [
      { name: "admissionNumber", label: "Admission Number", required: true },
      { name: "admittedAt", label: "Admitted At", type: "datetime-local", required: true },
      { name: "dischargedAt", label: "Discharged At", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["Admitted", "Transferred", "Discharged"] },
      { name: "reason", label: "Reason" },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "bedId", label: "Bed", type: "relation", relation: "beds", display: "bedNumber", required: true },
      { name: "admittingProviderId", label: "Admitting Provider", type: "relation", relation: "providers", display: "providerCode" }
    ],
    columns: ["admissionNumber", "patientId", "bedId", "status", "admittedAt", "dischargedAt"]
  },
  {
    key: "queue-tickets",
    title: "Queue Tickets",
    fields: [
      { name: "tokenNumber", label: "Token Number", required: true },
      { name: "servicePoint", label: "Service Point", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "departmentId", label: "Department", type: "relation", relation: "departments", display: "name" },
      { name: "priority", label: "Priority", type: "select", options: ["Normal", "High", "Emergency"] },
      { name: "status", label: "Status", type: "select", options: ["Waiting", "Called", "InService", "Completed", "NoShow", "Cancelled"] }
    ],
    columns: ["tokenNumber", "servicePoint", "patientId", "departmentId", "priority", "status"]
  },
  {
    key: "telemedicine-sessions",
    title: "Telemedicine Sessions",
    fields: [
      { name: "sessionNumber", label: "Session Number", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode", required: true },
      { name: "scheduledAt", label: "Scheduled At", type: "datetime-local" },
      { name: "meetingUrl", label: "Meeting URL" },
      { name: "status", label: "Status", type: "select", options: ["Scheduled", "InProgress", "Completed", "Cancelled"] },
      { name: "notes", label: "Notes" }
    ],
    columns: ["sessionNumber", "patientId", "providerId", "scheduledAt", "status"]
  },
  {
    key: "clinical-documents",
    title: "Clinical Documents",
    fields: [
      { name: "documentNumber", label: "Document Number", required: true },
      { name: "title", label: "Title", required: true },
      { name: "category", label: "Category" },
      { name: "mimeType", label: "MIME Type" },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "encounterId", label: "Encounter", type: "relation", relation: "encounters", display: "id" },
      { name: "signedBy", label: "Signed By" },
      { name: "contentText", label: "Content" }
    ],
    columns: ["documentNumber", "title", "category", "patientId", "encounterId", "signedBy"]
  },
  {
    key: "assets",
    title: "Assets",
    fields: [
      { name: "assetTag", label: "Asset Tag", required: true },
      { name: "name", label: "Name", required: true },
      { name: "category", label: "Category" },
      { name: "location", label: "Location" },
      { name: "purchaseDate", label: "Purchase Date", type: "date" },
      { name: "nextMaintenanceDate", label: "Next Maintenance", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Maintenance", "Retired"] }
    ],
    columns: ["assetTag", "name", "category", "location", "status", "nextMaintenanceDate"]
  },
  {
    key: "mis-reports",
    title: "MIS Reports",
    fields: [],
    columns: []
  },
  {
    key: "payors",
    title: "Payors",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "type", label: "Type", type: "select", options: ["Insurance", "Corporate", "Government", "SelfPay"] },
      { name: "contactName", label: "Contact Name" },
      { name: "contactPhone", label: "Contact Phone" },
      { name: "contactEmail", label: "Contact Email", type: "email" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
    ],
    columns: ["code", "name", "type", "status", "contactName"]
  },
  {
    key: "claims",
    title: "Claims",
    fields: [
      { name: "claimNumber", label: "Claim Number", required: true },
      { name: "claimType", label: "Claim Type", type: "select", options: ["Electronic", "Paper"] },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Submitted", "InReview", "Approved", "Rejected", "Paid"] },
      { name: "amountClaimed", label: "Amount Claimed", type: "number", required: true },
      { name: "amountApproved", label: "Amount Approved", type: "number" },
      { name: "rejectionReason", label: "Rejection Reason" },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "payorId", label: "Payor", type: "relation", relation: "payors", display: "name", required: true },
      { name: "insurancePolicyId", label: "Insurance Policy", type: "relation", relation: "insurance-policies", display: "policyNumber" },
      { name: "invoiceId", label: "Invoice", type: "relation", relation: "invoices", display: "id" }
    ],
    columns: ["claimNumber", "claimType", "status", "amountClaimed", "patientId", "payorId"]
  },
  {
    key: "employees",
    title: "Employees",
    fields: [
      { name: "employeeCode", label: "Employee Code", required: true },
      { name: "fullName", label: "Full Name", required: true },
      { name: "designation", label: "Designation" },
      { name: "departmentId", label: "Department", type: "relation", relation: "departments", display: "name" },
      { name: "employmentType", label: "Employment Type", type: "select", options: ["FullTime", "PartTime", "Contract"] },
      { name: "dateOfJoin", label: "Date of Join", type: "date" },
      { name: "baseSalary", label: "Base Salary", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
    ],
    columns: ["employeeCode", "fullName", "designation", "departmentId", "employmentType", "status"]
  },
  {
    key: "payroll-cycles",
    title: "Payroll Cycles",
    fields: [
      { name: "cycleCode", label: "Cycle Code", required: true },
      { name: "periodStart", label: "Period Start", type: "date", required: true },
      { name: "periodEnd", label: "Period End", type: "date", required: true },
      { name: "status", label: "Status", type: "select", options: ["Open", "Processed", "Closed"] }
    ],
    columns: ["cycleCode", "periodStart", "periodEnd", "status", "processedAt"]
  },
  {
    key: "payslips",
    title: "Payslips",
    fields: [
      { name: "slipNumber", label: "Slip Number", required: true },
      { name: "employeeId", label: "Employee", type: "relation", relation: "employees", display: "fullName", required: true },
      { name: "payrollCycleId", label: "Payroll Cycle", type: "relation", relation: "payroll-cycles", display: "cycleCode", required: true },
      { name: "basicPay", label: "Basic Pay", type: "number" },
      { name: "allowances", label: "Allowances", type: "number" },
      { name: "deductions", label: "Deductions", type: "number" },
      { name: "netPay", label: "Net Pay", type: "number" },
      { name: "paymentStatus", label: "Payment Status", type: "select", options: ["Pending", "Paid", "OnHold"] }
    ],
    columns: ["slipNumber", "employeeId", "payrollCycleId", "netPay", "paymentStatus"]
  },
  {
    key: "notifications",
    title: "Notifications",
    fields: [
      { name: "channel", label: "Channel", type: "select", options: ["SMS", "Email", "InApp"] },
      { name: "type", label: "Type", type: "select", options: ["AppointmentReminder", "PaymentReminder", "GeneralAlert"] },
      { name: "title", label: "Title", required: true },
      { name: "message", label: "Message", required: true },
      { name: "status", label: "Status", type: "select", options: ["Queued", "Sent", "Failed"] },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "appointmentId", label: "Appointment", type: "relation", relation: "appointments", display: "id" }
    ],
    columns: ["channel", "type", "title", "status", "patientId", "appointmentId"]
  },
  {
    key: "patient-portal",
    title: "Patient Portal",
    fields: [],
    columns: []
  },
  {
    key: "physician-portal",
    title: "Physician Portal",
    fields: [],
    columns: []
  },
  {
    key: "reminders-no-show",
    title: "Reminders & No-Show",
    fields: [],
    columns: []
  },
  {
    key: "revenue-analytics",
    title: "Revenue & Analytics",
    fields: [],
    columns: []
  },
  {
    key: "uganda-hmis-compliance",
    title: "Uganda HMIS Compliance",
    fields: [],
    columns: []
  },
  {
    key: "calendar-management",
    title: "Calendar Management",
    fields: [],
    columns: []
  },
  {
    key: "mobile-access",
    title: "Mobile Access",
    fields: [],
    columns: []
  },
  {
    key: "service-catalog",
    title: "Service Catalog",
    fields: [
      { name: "serviceCode", label: "Service Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "category", label: "Category" },
      { name: "basePrice", label: "Base Price", type: "number" },
      { name: "active", label: "Active", type: "select", options: ["true", "false"] }
    ],
    columns: ["serviceCode", "name", "category", "basePrice", "active"]
  },
  {
    key: "pricing-rules",
    title: "Pricing Rules",
    fields: [
      { name: "ruleCode", label: "Rule Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "adjustmentType", label: "Type", type: "select", options: ["Percentage", "Flat"] },
      { name: "adjustmentValue", label: "Value", type: "number" },
      { name: "applyOn", label: "Apply On", type: "select", options: ["Service", "Package", "Invoice"] },
      { name: "active", label: "Active", type: "select", options: ["true", "false"] }
    ],
    columns: ["ruleCode", "name", "adjustmentType", "adjustmentValue", "applyOn", "active"]
  },
  {
    key: "service-packages",
    title: "Service Packages",
    fields: [
      { name: "packageCode", label: "Package Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "description", label: "Description" },
      { name: "packagePrice", label: "Package Price", type: "number" },
      { name: "active", label: "Active", type: "select", options: ["true", "false"] }
    ],
    columns: ["packageCode", "name", "packagePrice", "active", "description"]
  },
  {
    key: "package-items",
    title: "Package Items",
    fields: [
      { name: "servicePackageId", label: "Package", type: "relation", relation: "service-packages", display: "packageCode", required: true },
      { name: "serviceCatalogId", label: "Service", type: "relation", relation: "service-catalog", display: "serviceCode", required: true },
      { name: "quantity", label: "Quantity", type: "number" },
      { name: "linePrice", label: "Line Price", type: "number" }
    ],
    columns: ["servicePackageId", "serviceCatalogId", "quantity", "linePrice"]
  },
  {
    key: "charge-items",
    title: "Charge Items",
    fields: [
      { name: "chargeNumber", label: "Charge Number", required: true },
      { name: "invoiceId", label: "Invoice", type: "relation", relation: "invoices", display: "id", required: true },
      { name: "serviceCatalogId", label: "Service", type: "relation", relation: "service-catalog", display: "serviceCode" },
      { name: "servicePackageId", label: "Package", type: "relation", relation: "service-packages", display: "packageCode" },
      { name: "quantity", label: "Quantity", type: "number" },
      { name: "unitPrice", label: "Unit Price", type: "number" },
      { name: "discountAmount", label: "Discount", type: "number" },
      { name: "taxAmount", label: "Tax", type: "number" },
      { name: "totalAmount", label: "Total", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Posted", "Cancelled"] }
    ],
    columns: ["chargeNumber", "invoiceId", "serviceCatalogId", "servicePackageId", "totalAmount", "status"]
  },
  {
    key: "payments",
    title: "Payments",
    fields: [
      { name: "paymentNumber", label: "Payment Number", required: true },
      { name: "invoiceId", label: "Invoice", type: "relation", relation: "invoices", display: "id", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "method", label: "Method", type: "select", options: ["Cash", "Card", "MobileMoney", "BankTransfer", "Insurance"] },
      { name: "status", label: "Status", type: "select", options: ["Pending", "Completed", "Failed", "Refunded"] },
      { name: "reference", label: "Reference" }
    ],
    columns: ["paymentNumber", "invoiceId", "patientId", "amount", "method", "status"]
  },
  {
    key: "revenue-cycle-tasks",
    title: "Revenue Cycle Tasks",
    fields: [
      { name: "taskNumber", label: "Task Number", required: true },
      { name: "invoiceId", label: "Invoice", type: "relation", relation: "invoices", display: "id" },
      { name: "claimId", label: "Claim", type: "relation", relation: "claims", display: "claimNumber" },
      { name: "taskType", label: "Type", type: "select", options: ["Coding", "Submission", "FollowUp", "Denial", "Collections"] },
      { name: "status", label: "Status", type: "select", options: ["Open", "InProgress", "Closed"] },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "notes", label: "Notes" }
    ],
    columns: ["taskNumber", "taskType", "status", "dueDate", "invoiceId", "claimId"]
  },
  {
    key: "intake-form-submissions",
    title: "Intake Forms",
    fields: [
      { name: "submissionNumber", label: "Submission Number", required: true },
      { name: "visitId", label: "Visit", type: "relation", relation: "visits", display: "id", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "chiefComplaint", label: "Chief Complaint" },
      { name: "triageCategory", label: "Triage", type: "select", options: ["Routine", "Urgent", "Emergency"] },
      { name: "vitalsJson", label: "Vitals JSON" }
    ],
    columns: ["submissionNumber", "visitId", "patientId", "triageCategory", "submittedAt"]
  },
  {
    key: "assessment-notes",
    title: "Assessment Notes",
    fields: [
      { name: "noteNumber", label: "Note Number", required: true },
      { name: "encounterId", label: "Encounter", type: "relation", relation: "encounters", display: "id", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode", required: true },
      { name: "assessmentType", label: "Assessment Type" },
      { name: "findings", label: "Findings" },
      { name: "diagnosis", label: "Diagnosis" },
      { name: "plan", label: "Plan" }
    ],
    columns: ["noteNumber", "assessmentType", "diagnosis", "patientId", "providerId"]
  },
  {
    key: "progress-notes",
    title: "Progress Notes",
    fields: [
      { name: "noteNumber", label: "Note Number", required: true },
      { name: "encounterId", label: "Encounter", type: "relation", relation: "encounters", display: "id", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode", required: true },
      { name: "subjective", label: "Subjective" },
      { name: "objective", label: "Objective" },
      { name: "assessment", label: "Assessment" },
      { name: "plan", label: "Plan" }
    ],
    columns: ["noteNumber", "patientId", "providerId", "subjective", "assessment"]
  },
  {
    key: "visit-verifications",
    title: "Visit Verification",
    fields: [
      { name: "verificationCode", label: "Verification Code", required: true },
      { name: "visitId", label: "Visit", type: "relation", relation: "visits", display: "id", required: true },
      { name: "method", label: "Method", type: "select", options: ["OTP", "Biometric", "Manual"] },
      { name: "status", label: "Status", type: "select", options: ["Pending", "Verified", "Failed"] },
      { name: "verifiedAt", label: "Verified At", type: "datetime-local" }
    ],
    columns: ["verificationCode", "visitId", "method", "status", "verifiedAt"]
  },
  {
    key: "employee-attendance",
    title: "Employee Attendance",
    fields: [
      { name: "employeeId", label: "Employee", type: "relation", relation: "employees", display: "fullName", required: true },
      { name: "attendanceDate", label: "Date", type: "date", required: true },
      { name: "checkInAt", label: "Check In", type: "datetime-local" },
      { name: "checkOutAt", label: "Check Out", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["Present", "Absent", "Leave", "HalfDay"] },
      { name: "remarks", label: "Remarks" }
    ],
    columns: ["employeeId", "attendanceDate", "checkInAt", "checkOutAt", "status"]
  },
  {
    key: "employee-performance-metrics",
    title: "Employee Performance",
    fields: [
      { name: "employeeId", label: "Employee", type: "relation", relation: "employees", display: "fullName", required: true },
      { name: "metricCode", label: "Metric Code", required: true },
      { name: "metricName", label: "Metric Name", required: true },
      { name: "score", label: "Score", type: "number" },
      { name: "periodStart", label: "Period Start", type: "date" },
      { name: "periodEnd", label: "Period End", type: "date" },
      { name: "notes", label: "Notes" }
    ],
    columns: ["employeeId", "metricCode", "metricName", "score", "periodStart", "periodEnd"]
  },
  {
    key: "patient-transfers",
    title: "Patient Transfers",
    fields: [
      { name: "transferNumber", label: "Transfer Number", required: true },
      { name: "admissionId", label: "Admission", type: "relation", relation: "admissions", display: "admissionNumber", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "fromBedId", label: "From Bed", type: "relation", relation: "beds", display: "bedNumber" },
      { name: "toBedId", label: "To Bed", type: "relation", relation: "beds", display: "bedNumber" },
      { name: "transferType", label: "Transfer Type", type: "select", options: ["WardToWard", "FacilityToFacility"] },
      { name: "status", label: "Status", type: "select", options: ["Requested", "Approved", "Completed", "Cancelled"] },
      { name: "reason", label: "Reason" },
      { name: "transferredAt", label: "Transferred At", type: "datetime-local" }
    ],
    columns: ["transferNumber", "patientId", "admissionId", "transferType", "status", "transferredAt"]
  },
  {
    key: "discharge-summaries",
    title: "Discharge Summaries",
    fields: [
      { name: "dischargeNumber", label: "Discharge Number", required: true },
      { name: "admissionId", label: "Admission", type: "relation", relation: "admissions", display: "admissionNumber", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode" },
      { name: "dischargeDate", label: "Discharge Date", type: "datetime-local", required: true },
      { name: "finalDiagnosis", label: "Final Diagnosis" },
      { name: "treatmentSummary", label: "Treatment Summary" },
      { name: "followUpInstructions", label: "Follow-up Instructions" }
    ],
    columns: ["dischargeNumber", "admissionId", "patientId", "providerId", "dischargeDate"]
  },
  {
    key: "calendar-events",
    title: "Calendar Events",
    fields: [
      { name: "eventNumber", label: "Event Number", required: true },
      { name: "title", label: "Title", required: true },
      { name: "eventType", label: "Type", type: "select", options: ["Appointment", "Surgery", "Telemedicine", "General"] },
      { name: "startAt", label: "Start At", type: "datetime-local", required: true },
      { name: "endAt", label: "End At", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["Scheduled", "Completed", "Cancelled"] },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode" },
      { name: "appointmentId", label: "Appointment", type: "relation", relation: "appointments", display: "id" },
      { name: "surgeryId", label: "Surgery", type: "relation", relation: "surgeries", display: "surgeryNumber" },
      { name: "telemedicineSessionId", label: "Telemedicine Session", type: "relation", relation: "telemedicine-sessions", display: "sessionNumber" },
      { name: "notes", label: "Notes" }
    ],
    columns: ["eventNumber", "title", "eventType", "startAt", "endAt", "status", "patientId", "providerId"]
  },
  {
    key: "hmis-report-submissions",
    title: "HMIS Report Submissions",
    fields: [
      { name: "submissionNumber", label: "Submission Number", required: true },
      { name: "reportCode", label: "Report Code", type: "select", options: ["HMIS105", "HMIS108", "HMIS033A", "HMIS033B", "HMIS106", "HMIS107", "IDSR"], required: true },
      { name: "reportName", label: "Report Name", required: true },
      { name: "reportingFrequency", label: "Frequency", type: "select", options: ["Daily", "Weekly", "Monthly", "Quarterly", "Annual", "AdHoc"], required: true },
      { name: "reportingPeriodStart", label: "Period Start", type: "date", required: true },
      { name: "reportingPeriodEnd", label: "Period End", type: "date", required: true },
      { name: "facilityCode", label: "Facility Code", required: true },
      { name: "district", label: "District" },
      { name: "expectedSubmissionDate", label: "Expected Submission Date", type: "datetime-local", required: true },
      { name: "submittedAt", label: "Submitted At", type: "datetime-local" },
      { name: "timelinessStatus", label: "Timeliness", type: "select", options: ["Pending", "OnTime", "Late"] },
      { name: "completenessPercent", label: "Completeness %", type: "number" },
      { name: "accuracyStatus", label: "Accuracy", type: "select", options: ["Unverified", "Verified", "Rejected"] },
      { name: "submissionChannel", label: "Channel", type: "select", options: ["Paper", "DHIS2", "EMRS", "Hybrid"] }
    ],
    columns: ["submissionNumber", "reportCode", "facilityCode", "reportingPeriodEnd", "expectedSubmissionDate", "submittedAt", "timelinessStatus", "completenessPercent"]
  },
  {
    key: "disease-surveillance-reports",
    title: "Disease Surveillance Reports",
    fields: [
      { name: "caseNumber", label: "Case Number", required: true },
      { name: "diseaseName", label: "Disease", required: true },
      { name: "reportType", label: "Report Type", type: "select", options: ["Immediate24h", "Weekly"] },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "suspectedAt", label: "Suspected At", type: "datetime-local", required: true },
      { name: "confirmedAt", label: "Confirmed At", type: "datetime-local" },
      { name: "deadlineAt", label: "Deadline", type: "datetime-local", required: true },
      { name: "reportedAt", label: "Reported At", type: "datetime-local" },
      { name: "timelinessStatus", label: "Timeliness", type: "select", options: ["Pending", "OnTime", "Late"] },
      { name: "facilityCode", label: "Facility Code", required: true },
      { name: "district", label: "District" },
      { name: "notes", label: "Notes" }
    ],
    columns: ["caseNumber", "diseaseName", "reportType", "suspectedAt", "deadlineAt", "reportedAt", "timelinessStatus", "facilityCode"]
  },
  {
    key: "mobile-clients",
    title: "Mobile Clients",
    fields: [
      { name: "clientId", label: "Client ID", required: true },
      { name: "name", label: "Name", required: true },
      { name: "platform", label: "Platform", type: "select", options: ["Android", "iOS", "Web"] },
      { name: "minSdkVersion", label: "Min SDK Version" },
      { name: "apiKey", label: "API Key", required: true },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
    ],
    columns: ["clientId", "name", "platform", "minSdkVersion", "status"]
  },
  {
    key: "barcode-labels",
    title: "Barcode Labels",
    fields: [
      { name: "barcode", label: "Barcode", required: true },
      { name: "entityType", label: "Entity Type", required: true },
      { name: "entityId", label: "Entity ID", required: true },
      { name: "format", label: "Format", type: "select", options: ["Code128", "QR"] },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
    ],
    columns: ["barcode", "entityType", "entityId", "format", "status"]
  },
  {
    key: "print-jobs",
    title: "Print Jobs",
    fields: [
      { name: "jobNumber", label: "Job Number", required: true },
      { name: "templateName", label: "Template" },
      { name: "payload", label: "Payload" },
      { name: "printerName", label: "Printer" },
      { name: "status", label: "Status", type: "select", options: ["Queued", "Printed", "Failed"] }
    ],
    columns: ["jobNumber", "templateName", "printerName", "status", "printedAt"]
  },
  {
    key: "accounting-policy",
    title: "Accounting Policy",
    fields: [
      { name: "country", label: "Country", required: true },
      { name: "currencyCode", label: "Currency", required: true },
      { name: "vatRatePercent", label: "VAT %", type: "number" },
      { name: "withholdingTaxPercent", label: "WHT %", type: "number" },
      { name: "payeThresholdUgx", label: "PAYE Threshold", type: "number" },
      { name: "efrisEnabled", label: "EFRIS Enabled", type: "select", options: ["true", "false"] }
    ],
    columns: ["country", "currencyCode", "vatRatePercent", "withholdingTaxPercent", "payeThresholdUgx"]
  },
  {
    key: "chart-accounts",
    title: "Chart Accounts",
    fields: [
      { name: "accountCode", label: "Account Code", required: true },
      { name: "accountName", label: "Account Name", required: true },
      { name: "accountType", label: "Type", type: "select", options: ["Asset", "Liability", "Equity", "Revenue", "Expense"], required: true },
      { name: "isActive", label: "Active", type: "select", options: ["true", "false"] }
    ],
    columns: ["accountCode", "accountName", "accountType", "isActive"]
  },
  {
    key: "journal-entries",
    title: "Journal Entries",
    fields: [
      { name: "entryNumber", label: "Entry Number", required: true },
      { name: "entryDate", label: "Entry Date", type: "date", required: true },
      { name: "chartAccountId", label: "Chart Account", type: "relation", relation: "chart-accounts", display: "accountName", required: true },
      { name: "debitAmount", label: "Debit", type: "number", required: true },
      { name: "creditAmount", label: "Credit", type: "number", required: true },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Posted"] },
      { name: "description", label: "Description" }
    ],
    columns: ["entryNumber", "entryDate", "chartAccountId", "debitAmount", "creditAmount", "status"]
  },
  {
    key: "vendors",
    title: "Vendors",
    fields: [
      { name: "vendorCode", label: "Vendor Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "contactPerson", label: "Contact Person" },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Blocked"] }
    ],
    columns: ["vendorCode", "name", "contactPerson", "phone", "status"]
  },
  {
    key: "purchase-orders",
    title: "Purchase Orders",
    fields: [
      { name: "poNumber", label: "PO Number", required: true },
      { name: "orderDate", label: "Order Date", type: "date", required: true },
      { name: "expectedDate", label: "Expected Date", type: "date" },
      { name: "vendorId", label: "Vendor", type: "relation", relation: "vendors", display: "name", required: true },
      { name: "locationId", label: "Location", type: "relation", relation: "locations", display: "name" },
      { name: "totalAmount", label: "Total", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Approved", "Ordered", "PartReceived", "Received", "Cancelled"] }
    ],
    columns: ["poNumber", "orderDate", "vendorId", "locationId", "totalAmount", "status"]
  },
  {
    key: "purchase-order-lines",
    title: "Purchase Order Lines",
    fields: [
      { name: "purchaseOrderId", label: "Purchase Order", type: "relation", relation: "purchase-orders", display: "poNumber", required: true },
      { name: "stockItemId", label: "Stock Item", type: "relation", relation: "stock-items", display: "name" },
      { name: "itemName", label: "Item Name", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "unitCost", label: "Unit Cost", type: "number", required: true },
      { name: "lineTotal", label: "Line Total", type: "number" }
    ],
    columns: ["purchaseOrderId", "itemName", "quantity", "unitCost", "lineTotal"]
  },
  {
    key: "stock-items",
    title: "Stock Items",
    fields: [
      { name: "sku", label: "SKU", required: true },
      { name: "name", label: "Name", required: true },
      { name: "category", label: "Category" },
      { name: "unit", label: "Unit" },
      { name: "reorderLevel", label: "Reorder Level", type: "number" },
      { name: "isCompoundingIngredient", label: "Compounding Ingredient", type: "select", options: ["true", "false"] }
    ],
    columns: ["sku", "name", "category", "unit", "reorderLevel"]
  },
  {
    key: "inventory-batches",
    title: "Inventory Batches",
    fields: [
      { name: "batchNumber", label: "Batch Number", required: true },
      { name: "lotNumber", label: "Lot Number" },
      { name: "stockItemId", label: "Stock Item", type: "relation", relation: "stock-items", display: "name", required: true },
      { name: "locationId", label: "Location", type: "relation", relation: "locations", display: "name" },
      { name: "expiryDate", label: "Expiry Date", type: "date" },
      { name: "quantityOnHand", label: "Quantity", type: "number" },
      { name: "unitCost", label: "Unit Cost", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Expired", "Blocked"] }
    ],
    columns: ["batchNumber", "lotNumber", "stockItemId", "expiryDate", "quantityOnHand", "status"]
  },
  {
    key: "inventory-transactions",
    title: "Inventory Transactions",
    fields: [
      { name: "transactionNumber", label: "Transaction Number", required: true },
      { name: "transactionType", label: "Type", type: "select", options: ["Receipt", "Issue", "Adjustment", "Transfer"], required: true },
      { name: "stockItemId", label: "Stock Item", type: "relation", relation: "stock-items", display: "name", required: true },
      { name: "inventoryBatchId", label: "Batch", type: "relation", relation: "inventory-batches", display: "batchNumber" },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "unitCost", label: "Unit Cost", type: "number" },
      { name: "reason", label: "Reason" }
    ],
    columns: ["transactionNumber", "transactionType", "stockItemId", "inventoryBatchId", "quantity", "transactionDate"]
  },
  {
    key: "compound-records",
    title: "Compound Records",
    fields: [
      { name: "compoundNumber", label: "Compound Number", required: true },
      { name: "formulaName", label: "Formula", required: true },
      { name: "stockItemId", label: "Stock Item", type: "relation", relation: "stock-items", display: "name", required: true },
      { name: "quantityProduced", label: "Qty Produced", type: "number", required: true },
      { name: "notes", label: "Notes" }
    ],
    columns: ["compoundNumber", "formulaName", "stockItemId", "quantityProduced"]
  },
  {
    key: "case-programs",
    title: "Case Programs",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "description", label: "Description" }
    ],
    columns: ["code", "name", "description"]
  },
  {
    key: "case-records",
    title: "Case Records",
    fields: [
      { name: "caseNumber", label: "Case Number", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "caseProgramId", label: "Program", type: "relation", relation: "case-programs", display: "name", required: true },
      { name: "assignedProviderId", label: "Assigned Provider", type: "relation", relation: "providers", display: "providerCode" },
      { name: "diagnosis", label: "Diagnosis" },
      { name: "status", label: "Status", type: "select", options: ["Open", "OnHold", "Closed"] }
    ],
    columns: ["caseNumber", "patientId", "caseProgramId", "assignedProviderId", "status"]
  },
  {
    key: "case-notes",
    title: "Case Notes",
    fields: [
      { name: "caseRecordId", label: "Case", type: "relation", relation: "case-records", display: "caseNumber", required: true },
      { name: "noteType", label: "Note Type", type: "select", options: ["Assessment", "Progress", "General"] },
      { name: "content", label: "Content", required: true }
    ],
    columns: ["caseRecordId", "noteType", "content"]
  },
  {
    key: "care-plans",
    title: "Care Plans",
    fields: [
      { name: "caseRecordId", label: "Case", type: "relation", relation: "case-records", display: "caseNumber", required: true },
      { name: "goal", label: "Goal", required: true },
      { name: "interventions", label: "Interventions" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Completed", "Cancelled"] }
    ],
    columns: ["caseRecordId", "goal", "status"]
  },
  {
    key: "action-plans",
    title: "Action Plans",
    fields: [
      { name: "caseRecordId", label: "Case", type: "relation", relation: "case-records", display: "caseNumber", required: true },
      { name: "title", label: "Title", required: true },
      { name: "dueDate", label: "Due Date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Pending", "InProgress", "Completed", "Cancelled"] }
    ],
    columns: ["caseRecordId", "title", "dueDate", "status"]
  },
  {
    key: "case-approvals",
    title: "Case Approvals",
    fields: [
      { name: "caseRecordId", label: "Case", type: "relation", relation: "case-records", display: "caseNumber", required: true },
      { name: "approvalType", label: "Approval Type", required: true },
      { name: "decision", label: "Decision", type: "select", options: ["Pending", "Approved", "Rejected"] },
      { name: "remarks", label: "Remarks" }
    ],
    columns: ["caseRecordId", "approvalType", "decision", "remarks"]
  },
  {
    key: "tenants",
    title: "Tenants",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] }
    ],
    columns: ["code", "name", "status"]
  },
  {
    key: "locations",
    title: "Locations",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "tenantId", label: "Tenant", type: "relation", relation: "tenants", display: "name" },
      { name: "address", label: "Address" }
    ],
    columns: ["code", "name", "tenantId", "address"]
  },
  {
    key: "provider-assignments",
    title: "Provider Assignments",
    fields: [
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode", required: true },
      { name: "locationId", label: "Location", type: "relation", relation: "locations", display: "name", required: true },
      { name: "startDate", label: "Start Date", type: "date" },
      { name: "endDate", label: "End Date", type: "date" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Ended"] }
    ],
    columns: ["providerId", "locationId", "startDate", "endDate", "status"]
  },
  {
    key: "booking-rules",
    title: "Booking Rules",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "allowRecurring", label: "Allow Recurring", type: "select", options: ["true", "false"] },
      { name: "reminderHoursBefore", label: "Reminder Hours", type: "number" },
      { name: "requireConfirmation", label: "Require Confirmation", type: "select", options: ["true", "false"] },
      { name: "active", label: "Active", type: "select", options: ["true", "false"] }
    ],
    columns: ["name", "allowRecurring", "reminderHoursBefore", "requireConfirmation", "active"]
  },
  {
    key: "appointment-series",
    title: "Appointment Series",
    fields: [
      { name: "seriesNumber", label: "Series Number", required: true },
      { name: "bookingRuleId", label: "Booking Rule", type: "relation", relation: "booking-rules", display: "name" },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode", required: true },
      { name: "frequency", label: "Frequency", type: "select", options: ["Daily", "Weekly", "Monthly"] },
      { name: "intervalValue", label: "Interval", type: "number" },
      { name: "occurrences", label: "Occurrences", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Completed", "Cancelled"] }
    ],
    columns: ["seriesNumber", "patientId", "providerId", "frequency", "occurrences", "status"]
  },
  {
    key: "backup-schedules",
    title: "Backup Schedules",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "frequency", label: "Frequency", type: "select", options: ["Hourly", "Daily", "Weekly"] },
      { name: "targetPath", label: "Target Path" },
      { name: "enabled", label: "Enabled", type: "select", options: ["true", "false"] },
      { name: "continuousBackup", label: "Continuous", type: "select", options: ["true", "false"] }
    ],
    columns: ["name", "frequency", "targetPath", "enabled", "continuousBackup"]
  },
  {
    key: "backup-logs",
    title: "Backup Logs",
    fields: [
      { name: "backupScheduleId", label: "Schedule", type: "relation", relation: "backup-schedules", display: "name", required: true },
      { name: "status", label: "Status", type: "select", options: ["Success", "Failed"] },
      { name: "detail", label: "Detail" }
    ],
    columns: ["backupScheduleId", "runAt", "status", "detail"]
  },
  {
    key: "practice-profiles",
    title: "Practice Profiles",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Name", required: true },
      { name: "specialty", label: "Specialty" },
      { name: "active", label: "Active", type: "select", options: ["true", "false"] }
    ],
    columns: ["code", "name", "specialty", "active"]
  },
  {
    key: "em-coding-records",
    title: "E/M Coding",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "level", label: "Level" },
      { name: "practiceProfileId", label: "Practice Profile", type: "relation", relation: "practice-profiles", display: "name", required: true },
      { name: "encounterId", label: "Encounter", type: "relation", relation: "encounters", display: "id", required: true },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode", required: true },
      { name: "description", label: "Description" },
      { name: "billedAmount", label: "Billed Amount", type: "number" }
    ],
    columns: ["code", "level", "practiceProfileId", "encounterId", "providerId", "billedAmount"]
  },
  {
    key: "prescription-renewal-requests",
    title: "Prescription Renewals",
    fields: [
      { name: "requestNumber", label: "Request Number", required: true },
      { name: "prescriptionId", label: "Prescription", type: "relation", relation: "prescriptions", display: "id", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "status", label: "Status", type: "select", options: ["Requested", "Approved", "Rejected", "Cancelled"] },
      { name: "reason", label: "Reason" }
    ],
    columns: ["requestNumber", "prescriptionId", "patientId", "status"]
  },
  {
    key: "prescription-cancellation-requests",
    title: "Prescription Cancellations",
    fields: [
      { name: "requestNumber", label: "Request Number", required: true },
      { name: "prescriptionId", label: "Prescription", type: "relation", relation: "prescriptions", display: "id", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "status", label: "Status", type: "select", options: ["Requested", "Approved", "Rejected"] },
      { name: "reason", label: "Reason" }
    ],
    columns: ["requestNumber", "prescriptionId", "patientId", "status"]
  },
  {
    key: "care-summary-exchanges",
    title: "Care Summary Exchange",
    fields: [
      { name: "exchangeNumber", label: "Exchange Number", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn", required: true },
      { name: "direction", label: "Direction", type: "select", options: ["Outbound", "Inbound"] },
      { name: "status", label: "Status", type: "select", options: ["Draft", "Sent", "Received", "Failed"] },
      { name: "payload", label: "Payload" }
    ],
    columns: ["exchangeNumber", "patientId", "direction", "status"]
  },
  {
    key: "users",
    title: "Users",
    fields: [
      { name: "username", label: "Username", required: true },
      { name: "fullName", label: "Full Name", required: true },
      { name: "role", label: "Role", type: "select", options: ["admin", "doctor", "nurse", "receptionist", "patient"], required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "password", label: "Password", type: "password", required: true }
    ],
    columns: ["username", "fullName", "role", "mustChangePassword", "isActive"]
  },
  {
    key: "patients",
    title: "Patients",
    fields: [
      { name: "mrn", label: "MRN", required: true },
      { name: "firstName", label: "First Name", required: true },
      { name: "lastName", label: "Last Name", required: true },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"], required: true },
      { name: "dateOfBirth", label: "Date of Birth", type: "date", required: true },
      { name: "nationalId", label: "National ID (NIN)" },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" }
    ],
    columns: ["mrn", "firstName", "lastName", "gender", "dateOfBirth", "nationalId", "phone"]
  },
  {
    key: "departments",
    title: "Departments",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "location", label: "Location" },
      { name: "description", label: "Description" }
    ],
    columns: ["name", "location", "description"]
  },
  {
    key: "providers",
    title: "Providers",
    fields: [
      { name: "providerCode", label: "Provider Code", required: true },
      { name: "firstName", label: "First Name", required: true },
      { name: "lastName", label: "Last Name", required: true },
      { name: "specialty", label: "Specialty" },
      { name: "nationalId", label: "National ID (NIN)" },
      { name: "departmentId", label: "Department", type: "relation", relation: "departments", display: "name" },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email", type: "email" }
    ],
    columns: ["providerCode", "firstName", "lastName", "specialty", "nationalId", "departmentId"]
  },
  {
    key: "appointments",
    title: "Appointments",
    fields: [
      { name: "scheduledAt", label: "Scheduled At", type: "datetime-local", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode" },
      { name: "departmentId", label: "Department", type: "relation", relation: "departments", display: "name" },
      { name: "reason", label: "Reason" },
      { name: "status", label: "Status", type: "select", options: ["Scheduled", "CheckedIn", "Completed", "Cancelled", "NoShow"] }
    ],
    columns: ["scheduledAt", "patientId", "providerId", "status", "reason"]
  },
  {
    key: "visits",
    title: "Visits",
    fields: [
      { name: "checkInAt", label: "Check In", type: "datetime-local", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode" },
      { name: "departmentId", label: "Department", type: "relation", relation: "departments", display: "name" },
      { name: "type", label: "Type", type: "select", options: ["Outpatient", "Inpatient", "Emergency"] },
      { name: "status", label: "Status", type: "select", options: ["Open", "Closed", "Cancelled"] }
    ],
    columns: ["checkInAt", "patientId", "providerId", "type", "status"]
  },
  {
    key: "encounters",
    title: "Encounters",
    fields: [
      { name: "encounterDate", label: "Encounter Date", type: "datetime-local", required: true },
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode" },
      { name: "visitId", label: "Visit", type: "relation", relation: "visits", display: "id" },
      { name: "encounterType", label: "Type", type: "select", options: ["Consultation", "Lab", "Procedure", "FollowUp"] },
      { name: "diagnosis", label: "Diagnosis" }
    ],
    columns: ["encounterDate", "patientId", "providerId", "encounterType", "diagnosis"]
  },
  {
    key: "medications",
    title: "Medications",
    fields: [
      { name: "name", label: "Name", required: true },
      { name: "genericName", label: "Generic Name" },
      { name: "form", label: "Form" },
      { name: "strength", label: "Strength" },
      { name: "stockQuantity", label: "Stock Quantity", type: "number" },
      { name: "unitPrice", label: "Unit Price", type: "number" }
    ],
    columns: ["name", "genericName", "form", "strength", "stockQuantity", "unitPrice"]
  },
  {
    key: "prescriptions",
    title: "Prescriptions",
    fields: [
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "providerId", label: "Provider", type: "relation", relation: "providers", display: "providerCode" },
      { name: "medicationId", label: "Medication", type: "relation", relation: "medications", display: "name" },
      { name: "encounterId", label: "Encounter", type: "relation", relation: "encounters", display: "id" },
      { name: "dosage", label: "Dosage" },
      { name: "frequency", label: "Frequency" },
      { name: "durationDays", label: "Duration (days)", type: "number" },
      { name: "status", label: "Status", type: "select", options: ["Active", "Completed", "Cancelled"] }
    ],
    columns: ["patientId", "providerId", "medicationId", "dosage", "frequency", "status"]
  },
  {
    key: "invoices",
    title: "Invoices",
    fields: [
      { name: "patientId", label: "Patient", type: "relation", relation: "patients", display: "mrn" },
      { name: "visitId", label: "Visit", type: "relation", relation: "visits", display: "id" },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "issuedAt", label: "Issued At", type: "datetime-local", required: true },
      { name: "dueDate", label: "Due Date", type: "datetime-local" },
      { name: "status", label: "Status", type: "select", options: ["Pending", "Paid", "Overdue", "Cancelled"] }
    ],
    columns: ["patientId", "visitId", "amount", "status", "issuedAt", "dueDate"]
  }
];
