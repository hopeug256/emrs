const express = require("express");
const createResourceRouter = require("./resourceRouter");
const authRoutes = require("./auth");
const userRoutes = require("./users");
const securityEventRoutes = require("./securityEvents");
const formTemplateRoutes = require("./formTemplates");
const formSubmissionRoutes = require("./formSubmissions");
const theatreWorkflowRoutes = require("./theatreWorkflow");
const reportsRoutes = require("./reports");
const portalRoutes = require("./portal");
const notificationRoutes = require("./notifications");
const appointmentsActionsRoutes = require("./appointmentsActions");
const mobileRoutes = require("./mobile");
const barcodePrintRoutes = require("./barcodePrint");
const bookingRoutes = require("./booking");
const backupRoutes = require("./backup");
const labWorkflowRoutes = require("./labWorkflow");
const billingRoutes = require("./billing");
const calendarRoutes = require("./calendar");
const careFlowRoutes = require("./careFlow");
const hmisRoutes = require("./hmis");
const operationsRoutes = require("./operations");
const chatRoutes = require("./chat");
const paymentWebhooksRoutes = require("./paymentWebhooks");
const accountingRoutes = require("./accounting");
const authenticate = require("../middleware/auth");
const enforcePasswordChange = require("../middleware/enforcePasswordChange");
const authorize = require("../middleware/authorize");
const mobileGuard = require("../middleware/mobileGuard");
const {
  Patient,
  Department,
  Provider,
  Appointment,
  Visit,
  Encounter,
  Medication,
  Prescription,
  Invoice,
  User,
  TheatreRoom,
  TheatreProcedure,
  Surgery,
  InsuranceProvider,
  InsurancePolicy,
  LabTest,
  LabOrder,
  LabPanel,
  LabAnalyte,
  LabPanelAnalyte,
  LabResult,
  LabResultValue,
  LabInstrument,
  LabInstrumentRun,
  LabResultVerification,
  LabReportTemplate,
  RadiologyModality,
  RadiologyOrder,
  Ward,
  Bed,
  Admission,
  QueueTicket,
  TelemedicineSession,
  ClinicalDocument,
  Asset,
  Payor,
  Claim,
  Employee,
  PayrollCycle,
  Payslip,
  Notification,
  MobileClient,
  BarcodeLabel,
  PrintJob,
  AccountingPolicy,
  AccountingPeriod,
  ChartAccount,
  JournalEntry,
  JournalEntryLine,
  Budget,
  BudgetLine,
  Vendor,
  PurchaseOrder,
  PurchaseOrderLine,
  StockItem,
  InventoryBatch,
  InventoryTransaction,
  CompoundRecord,
  CaseProgram,
  CaseRecord,
  CaseNote,
  CarePlan,
  ActionPlan,
  CaseApproval,
  Tenant,
  Location,
  ProviderAssignment,
  BookingRule,
  AppointmentSeries,
  BackupSchedule,
  BackupLog,
  CalendarEvent,
  PracticeProfile,
  EmCodingRecord,
  PrescriptionRenewalRequest,
  PrescriptionCancellationRequest,
  CareSummaryExchange,
  ServiceCatalog,
  PricingRule,
  ServicePackage,
  PackageItem,
  ChargeItem,
  Payment,
  RevenueCycleTask,
  IntakeFormSubmission,
  AssessmentNote,
  ProgressNote,
  VisitVerification,
  EmployeeAttendance,
  EmployeePerformanceMetric,
  PatientTransfer,
  DischargeSummary,
  HmisReportSubmission,
  DiseaseSurveillanceReport,
  Referral,
  ClientAccount,
  CreditControlEvent,
  EmergencyCase,
  DayCareEpisode,
  PaymentGatewayTransaction,
  PatientMonitoringRecord,
  ChatThread,
  ChatThreadParticipant,
  ChatMessage,
  ElectronicLabNotebookEntry
} = require("../models");

const router = express.Router();

const ALL = ["admin", "doctor", "nurse", "receptionist"];
const CLINICAL = ["admin", "doctor", "nurse"];
const FRONT_DESK = ["admin", "receptionist"];

router.use("/auth", authRoutes);
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "emrs-backend" });
});

router.use("/payment-webhooks", paymentWebhooksRoutes);

router.use("/mobile", mobileGuard, mobileRoutes);

router.use(
  "/users",
  authenticate,
  enforcePasswordChange,
  authorize({ "*": ["admin"] }),
  userRoutes
);

router.use(
  "/security-events",
  authenticate,
  enforcePasswordChange,
  authorize({ "*": ["admin"] }),
  securityEventRoutes
);

router.use(
  "/form-templates",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"], "*": CLINICAL }),
  formTemplateRoutes
);

router.use(
  "/form-submissions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL }),
  formSubmissionRoutes
);

router.use(
  "/theatre-rooms",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(TheatreRoom, {
    searchFields: ["code", "name", "location"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/theatre-procedures",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(TheatreProcedure, {
    searchFields: ["code", "name", "specialty"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/surgeries",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(Surgery, {
    include: [
      { model: TheatreRoom },
      { model: TheatreProcedure },
      { model: Patient },
      { model: Provider, as: "primarySurgeon" }
    ],
    createRequired: ["surgeryNumber", "scheduledStart", "theatreRoomId", "theatreProcedureId", "patientId"]
  })
);

router.use(
  "/patients",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: [...CLINICAL, ...FRONT_DESK], PUT: ALL, DELETE: ["admin"] }),
  createResourceRouter(Patient, {
    searchFields: ["mrn", "firstName", "lastName", "phone", "email"],
    createRequired: ["mrn", "firstName", "lastName", "gender", "dateOfBirth"]
  })
);

router.use(
  "/departments",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Department, {
    searchFields: ["name", "location"],
    createRequired: ["name"]
  })
);

router.use(
  "/providers",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Provider, {
    include: [{ model: Department }],
    searchFields: ["providerCode", "firstName", "lastName", "specialty"],
    createRequired: ["providerCode", "firstName", "lastName"]
  })
);

router.use(
  "/referrals",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(Referral, {
    include: [{ model: Patient }, { model: Provider, as: "fromProvider" }, { model: Provider, as: "toProvider" }],
    searchFields: ["referralNumber", "destinationFacility", "destinationDepartment", "status"],
    createRequired: ["referralNumber", "patientId"]
  })
);

router.use(
  "/appointments",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin", "receptionist"] }),
  createResourceRouter(Appointment, {
    include: [{ model: Patient }, { model: Provider }, { model: Department }],
    createRequired: ["scheduledAt", "patientId", "providerId"]
  })
);

router.use(
  "/appointments",
  authenticate,
  enforcePasswordChange,
  authorize({ POST: ["admin", "receptionist", "doctor", "nurse"] }),
  appointmentsActionsRoutes
);

router.use(
  "/booking",
  authenticate,
  enforcePasswordChange,
  authorize({ POST: ["admin", "receptionist", "doctor", "nurse"] }),
  bookingRoutes
);

router.use(
  "/visits",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin", "receptionist"] }),
  createResourceRouter(Visit, {
    include: [{ model: Patient }, { model: Provider }, { model: Department }],
    createRequired: ["checkInAt", "patientId"]
  })
);

router.use(
  "/encounters",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(Encounter, {
    include: [{ model: Patient }, { model: Provider }, { model: Visit }],
    createRequired: ["encounterDate", "patientId"]
  })
);

router.use(
  "/intake-form-submissions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(IntakeFormSubmission, {
    include: [{ model: Visit }, { model: Patient }, { model: User, as: "submittedBy" }],
    searchFields: ["submissionNumber", "chiefComplaint", "triageCategory"],
    createRequired: ["submissionNumber", "visitId", "patientId"]
  })
);

router.use(
  "/assessment-notes",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(AssessmentNote, {
    include: [{ model: Encounter }, { model: Patient }, { model: Provider }],
    searchFields: ["noteNumber", "assessmentType", "diagnosis"],
    createRequired: ["noteNumber", "encounterId", "patientId", "providerId"]
  })
);

router.use(
  "/progress-notes",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(ProgressNote, {
    include: [{ model: Encounter }, { model: Patient }, { model: Provider }],
    searchFields: ["noteNumber"],
    createRequired: ["noteNumber", "encounterId", "patientId", "providerId"]
  })
);

router.use(
  "/visit-verifications",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(VisitVerification, {
    include: [{ model: Visit }, { model: User, as: "verifiedBy" }],
    searchFields: ["verificationCode", "method", "status"],
    createRequired: ["verificationCode", "visitId"]
  })
);

router.use(
  "/medications",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(Medication, {
    searchFields: ["name", "genericName", "manufacturer"],
    createRequired: ["name"]
  })
);

router.use(
  "/prescriptions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: ["admin", "doctor"], PUT: ["admin", "doctor"], DELETE: ["admin", "doctor"] }),
  createResourceRouter(Prescription, {
    include: [{ model: Patient }, { model: Provider }, { model: Medication }, { model: Encounter }],
    createRequired: ["patientId", "providerId", "medicationId"]
  })
);

router.use(
  "/invoices",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: FRONT_DESK, PUT: FRONT_DESK, DELETE: ["admin"] }),
  createResourceRouter(Invoice, {
    include: [{ model: Patient }, { model: Visit }],
    createRequired: ["amount", "issuedAt", "patientId"]
  })
);

router.use(
  "/service-catalog",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(ServiceCatalog, {
    searchFields: ["serviceCode", "name", "category"],
    createRequired: ["serviceCode", "name"]
  })
);

router.use(
  "/pricing-rules",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(PricingRule, {
    searchFields: ["ruleCode", "name", "applyOn"],
    createRequired: ["ruleCode", "name"]
  })
);

router.use(
  "/service-packages",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(ServicePackage, {
    include: [{ model: PackageItem, as: "items" }],
    searchFields: ["packageCode", "name"],
    createRequired: ["packageCode", "name"]
  })
);

router.use(
  "/package-items",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(PackageItem, {
    include: [{ model: ServicePackage }, { model: ServiceCatalog }],
    createRequired: ["servicePackageId", "serviceCatalogId"]
  })
);

router.use(
  "/charge-items",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: FRONT_DESK, PUT: FRONT_DESK, DELETE: ["admin"] }),
  createResourceRouter(ChargeItem, {
    include: [{ model: Invoice }, { model: ServiceCatalog }, { model: ServicePackage }],
    searchFields: ["chargeNumber", "status"],
    createRequired: ["chargeNumber", "invoiceId"]
  })
);

router.use(
  "/payments",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: FRONT_DESK, PUT: FRONT_DESK, DELETE: ["admin"] }),
  createResourceRouter(Payment, {
    include: [{ model: Invoice }, { model: Patient }],
    searchFields: ["paymentNumber", "method", "status", "reference"],
    createRequired: ["paymentNumber", "invoiceId", "patientId", "amount"]
  })
);

router.use(
  "/client-accounts",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: FRONT_DESK, PUT: FRONT_DESK, DELETE: ["admin"] }),
  createResourceRouter(ClientAccount, {
    include: [{ model: Patient }, { model: CreditControlEvent, as: "creditEvents" }],
    searchFields: ["accountNumber", "accountType", "status"],
    createRequired: ["accountNumber"]
  })
);

router.use(
  "/credit-control-events",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: FRONT_DESK, PUT: FRONT_DESK, DELETE: ["admin"] }),
  createResourceRouter(CreditControlEvent, {
    include: [{ model: ClientAccount }, { model: User, as: "actionBy" }],
    searchFields: ["eventNumber", "eventType", "status"],
    createRequired: ["eventNumber", "clientAccountId"]
  })
);

router.use(
  "/payment-gateway-transactions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: FRONT_DESK, PUT: FRONT_DESK, DELETE: ["admin"] }),
  createResourceRouter(PaymentGatewayTransaction, {
    include: [{ model: Invoice }, { model: Patient }, { model: Payment }],
    searchFields: ["transactionNumber", "gatewayName", "status", "externalReference"],
    createRequired: ["transactionNumber", "invoiceId", "patientId", "amount"]
  })
);

router.use(
  "/revenue-cycle-tasks",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(RevenueCycleTask, {
    include: [{ model: Invoice }, { model: Claim }, { model: User, as: "assignedTo" }],
    searchFields: ["taskNumber", "taskType", "status"],
    createRequired: ["taskNumber"]
  })
);

router.use(
  "/billing",
  authenticate,
  enforcePasswordChange,
  authorize({ POST: [...CLINICAL, ...FRONT_DESK], GET: ALL }),
  billingRoutes
);

router.use(
  "/theatre-workflow",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, PUT: CLINICAL, POST: CLINICAL }),
  theatreWorkflowRoutes
);

router.use(
  "/reports",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin", "doctor", "nurse"] }),
  reportsRoutes
);

router.use(
  "/hmis-report-submissions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(HmisReportSubmission, {
    include: [{ model: User, as: "submittedBy" }],
    searchFields: ["submissionNumber", "reportCode", "facilityCode", "district"],
    createRequired: [
      "submissionNumber",
      "reportCode",
      "reportName",
      "reportingFrequency",
      "reportingPeriodStart",
      "reportingPeriodEnd",
      "facilityCode",
      "expectedSubmissionDate"
    ]
  })
);

router.use(
  "/disease-surveillance-reports",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(DiseaseSurveillanceReport, {
    include: [{ model: Patient }, { model: User, as: "reportedBy" }],
    searchFields: ["caseNumber", "diseaseName", "facilityCode", "district"],
    createRequired: ["caseNumber", "diseaseName", "suspectedAt", "deadlineAt", "facilityCode"]
  })
);

router.use(
  "/hmis",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL }),
  hmisRoutes
);

router.use(
  "/insurance-providers",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(InsuranceProvider, {
    searchFields: ["code", "name", "phone", "email"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/insurance-policies",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin"] }),
  createResourceRouter(InsurancePolicy, {
    include: [{ model: InsuranceProvider }, { model: Patient }],
    searchFields: ["policyNumber", "memberId", "planName"],
    createRequired: ["policyNumber", "patientId", "insuranceProviderId"]
  })
);

router.use(
  "/lab-tests",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabTest, {
    searchFields: ["code", "name", "specimenType"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/lab-orders",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(LabOrder, {
    include: [{ model: LabTest }, { model: LabPanel }, { model: Patient }, { model: Provider, as: "orderedBy" }, { model: Encounter }],
    createRequired: ["orderNumber", "patientId"]
  })
);

router.use(
  "/lab-panels",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabPanel, {
    include: [{ model: LabAnalyte, as: "analytes" }, { model: LabPanelAnalyte, as: "panelAnalytes", include: [LabAnalyte] }],
    searchFields: ["code", "name"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/lab-analytes",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabAnalyte, {
    searchFields: ["code", "name"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/lab-panel-analytes",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabPanelAnalyte, {
    include: [{ model: LabPanel }, { model: LabAnalyte }],
    createRequired: ["labPanelId", "labAnalyteId"]
  })
);

router.use(
  "/lab-results",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabResult, {
    include: [{ model: LabOrder }, { model: LabResultValue, as: "values" }, { model: LabResultVerification, as: "verifications" }],
    searchFields: ["resultNumber", "status"],
    createRequired: ["resultNumber", "labOrderId"]
  })
);

router.use(
  "/lab-result-values",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabResultValue, {
    include: [{ model: LabResult }, { model: LabAnalyte }],
    createRequired: ["labResultId", "labAnalyteId"]
  })
);

router.use(
  "/lab-instruments",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabInstrument, {
    searchFields: ["instrumentCode", "name", "manufacturer"],
    createRequired: ["instrumentCode", "name"]
  })
);

router.use(
  "/lab-instrument-runs",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabInstrumentRun, {
    include: [{ model: LabInstrument }, { model: LabOrder }, { model: LabResult }],
    createRequired: ["runNumber", "labInstrumentId"]
  })
);

router.use(
  "/lab-result-verifications",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(LabResultVerification, {
    include: [{ model: LabResult }],
    createRequired: ["labResultId", "step", "decision"]
  })
);

router.use(
  "/lab-report-templates",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: ["admin", "doctor"], PUT: ["admin", "doctor"], DELETE: ["admin"] }),
  createResourceRouter(LabReportTemplate, {
    searchFields: ["code", "name"],
    createRequired: ["code", "name", "bodyTemplate"]
  })
);

router.use(
  "/electronic-lab-notebook-entries",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(ElectronicLabNotebookEntry, {
    include: [{ model: LabOrder }, { model: LabResult }, { model: User, as: "createdBy" }],
    searchFields: ["entryNumber", "notebookSection", "experimentTitle"],
    createRequired: ["entryNumber", "experimentTitle"]
  })
);

router.use(
  "/lab-workflow",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL }),
  labWorkflowRoutes
);

router.use(
  "/radiology-modalities",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(RadiologyModality, {
    searchFields: ["code", "name", "location"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/radiology-orders",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(RadiologyOrder, {
    include: [{ model: RadiologyModality }, { model: Patient }, { model: Provider, as: "orderedBy" }, { model: Encounter }],
    createRequired: ["orderNumber", "patientId"]
  })
);

router.use(
  "/wards",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Ward, {
    searchFields: ["code", "name", "type", "floor"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/beds",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "nurse"], PUT: ["admin", "nurse"], DELETE: ["admin"] }),
  createResourceRouter(Bed, {
    include: [{ model: Ward }],
    searchFields: ["bedNumber", "status"],
    createRequired: ["bedNumber", "wardId"]
  })
);

router.use(
  "/admissions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(Admission, {
    include: [{ model: Patient }, { model: Bed }, { model: Provider, as: "admittingProvider" }],
    createRequired: ["admissionNumber", "admittedAt", "patientId", "bedId"]
  })
);

router.use(
  "/patient-transfers",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(PatientTransfer, {
    include: [{ model: Admission }, { model: Patient }, { model: Bed, as: "fromBed" }, { model: Bed, as: "toBed" }],
    searchFields: ["transferNumber", "transferType", "status"],
    createRequired: ["transferNumber", "admissionId", "patientId"]
  })
);

router.use(
  "/discharge-summaries",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(DischargeSummary, {
    include: [{ model: Admission }, { model: Patient }, { model: Provider }],
    searchFields: ["dischargeNumber", "finalDiagnosis"],
    createRequired: ["dischargeNumber", "admissionId", "patientId", "dischargeDate"]
  })
);

router.use(
  "/emergency-cases",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(EmergencyCase, {
    include: [{ model: Patient }, { model: Provider, as: "triagedBy" }, { model: Visit }],
    searchFields: ["caseNumber", "chiefComplaint", "status", "triageLevel"],
    createRequired: ["caseNumber", "arrivalAt", "patientId"]
  })
);

router.use(
  "/day-care-episodes",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(DayCareEpisode, {
    include: [{ model: Patient }, { model: Provider }],
    searchFields: ["episodeNumber", "procedureName", "status"],
    createRequired: ["episodeNumber", "patientId"]
  })
);

router.use(
  "/patient-monitoring-records",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(PatientMonitoringRecord, {
    include: [{ model: Patient }, { model: Encounter }, { model: Provider }],
    searchFields: ["recordNumber", "alertLevel"],
    createRequired: ["recordNumber", "patientId"]
  })
);

router.use(
  "/queue-tickets",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin", "receptionist"] }),
  createResourceRouter(QueueTicket, {
    include: [{ model: Patient }, { model: Department }],
    createRequired: ["tokenNumber", "servicePoint"]
  })
);

router.use(
  "/telemedicine-sessions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(TelemedicineSession, {
    include: [{ model: Patient }, { model: Provider }],
    createRequired: ["sessionNumber", "patientId", "providerId"]
  })
);

router.use(
  "/clinical-documents",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(ClinicalDocument, {
    include: [{ model: Patient }, { model: Encounter }],
    searchFields: ["documentNumber", "title", "category"],
    createRequired: ["documentNumber", "title", "patientId"]
  })
);

router.use(
  "/assets",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Asset, {
    searchFields: ["assetTag", "name", "category", "location"],
    createRequired: ["assetTag", "name"]
  })
);

router.use(
  "/payors",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Payor, {
    searchFields: ["code", "name", "type"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/claims",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(Claim, {
    include: [{ model: Payor }, { model: Patient }, { model: InsurancePolicy }, { model: Invoice }],
    searchFields: ["claimNumber", "status", "claimType"],
    createRequired: ["claimNumber", "amountClaimed", "patientId", "payorId"]
  })
);

router.use(
  "/employees",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Employee, {
    include: [{ model: Department }],
    searchFields: ["employeeCode", "fullName", "designation"],
    createRequired: ["employeeCode", "fullName"]
  })
);

router.use(
  "/employee-attendance",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(EmployeeAttendance, {
    include: [{ model: Employee }],
    searchFields: ["status", "remarks"],
    createRequired: ["employeeId", "attendanceDate"]
  })
);

router.use(
  "/employee-performance-metrics",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "doctor"], PUT: ["admin", "doctor"], DELETE: ["admin"] }),
  createResourceRouter(EmployeePerformanceMetric, {
    include: [{ model: Employee }],
    searchFields: ["metricCode", "metricName"],
    createRequired: ["employeeId", "metricCode", "metricName"]
  })
);

router.use(
  "/payroll-cycles",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(PayrollCycle, {
    searchFields: ["cycleCode", "status"],
    createRequired: ["cycleCode", "periodStart", "periodEnd"]
  })
);

router.use(
  "/payslips",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Payslip, {
    include: [{ model: Employee }, { model: PayrollCycle }],
    searchFields: ["slipNumber", "paymentStatus"],
    createRequired: ["slipNumber", "employeeId", "payrollCycleId"]
  })
);

router.use(
  "/notifications",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin"] }),
  createResourceRouter(Notification, {
    include: [{ model: Patient }, { model: Appointment }],
    searchFields: ["title", "type", "status"],
    createRequired: ["title", "message"]
  })
);

router.use(
  "/notifications",
  authenticate,
  enforcePasswordChange,
  authorize({ POST: ["admin", "receptionist", "doctor", "nurse"] }),
  notificationRoutes
);

router.use(
  "/chat-threads",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin"] }),
  createResourceRouter(ChatThread, {
    include: [{ model: ChatThreadParticipant, as: "participants", include: [User] }, { model: ChatMessage, as: "messages" }],
    searchFields: ["threadNumber", "title", "threadType", "status"],
    createRequired: ["threadNumber"]
  })
);

router.use(
  "/chat-thread-participants",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin"] }),
  createResourceRouter(ChatThreadParticipant, {
    include: [{ model: ChatThread }, { model: User }],
    createRequired: ["chatThreadId", "userId"]
  })
);

router.use(
  "/chat-messages",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin"] }),
  createResourceRouter(ChatMessage, {
    include: [{ model: ChatThread }, { model: User, as: "sender" }],
    searchFields: ["messageNumber", "messageType", "body"],
    createRequired: ["messageNumber", "chatThreadId", "body"]
  })
);

router.use(
  "/chat",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL }),
  chatRoutes
);

router.use(
  "/portal",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin", "doctor", "nurse", "receptionist", "patient"] }),
  portalRoutes
);

router.use(
  "/barcode",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL }),
  barcodePrintRoutes
);

router.use(
  "/mobile-clients",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(MobileClient, {
    searchFields: ["clientId", "name", "platform"],
    createRequired: ["clientId", "name", "apiKey"]
  })
);

router.use(
  "/barcode-labels",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(BarcodeLabel, {
    searchFields: ["barcode", "entityType", "entityId"],
    createRequired: ["barcode", "entityType", "entityId"]
  })
);

router.use(
  "/print-jobs",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: ALL, DELETE: ["admin"] }),
  createResourceRouter(PrintJob, {
    searchFields: ["jobNumber", "templateName", "status"],
    createRequired: ["jobNumber"]
  })
);

router.use(
  "/accounting-policy",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(AccountingPolicy, {
    createRequired: ["country", "currencyCode"]
  })
);

router.use(
  "/accounting-periods",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(AccountingPeriod, {
    searchFields: ["periodCode", "periodName", "status"],
    createRequired: ["periodCode", "periodName", "fiscalYear", "startDate", "endDate"]
  })
);

router.use(
  "/chart-accounts",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(ChartAccount, {
    searchFields: ["accountCode", "accountName", "accountType"],
    createRequired: ["accountCode", "accountName", "accountType"]
  })
);

router.use(
  "/journal-entries",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(JournalEntry, {
    include: [
      { model: ChartAccount },
      { model: AccountingPeriod },
      { model: JournalEntryLine, as: "lines", include: [ChartAccount] }
    ],
    searchFields: ["entryNumber", "referenceNumber", "description", "status"],
    createRequired: ["entryNumber", "entryDate"]
  })
);

router.use(
  "/journal-entry-lines",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(JournalEntryLine, {
    include: [{ model: JournalEntry }, { model: ChartAccount }],
    createRequired: ["journalEntryId", "chartAccountId"]
  })
);

router.use(
  "/budgets",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Budget, {
    include: [
      { model: AccountingPeriod },
      { model: BudgetLine, as: "lines", include: [ChartAccount] }
    ],
    searchFields: ["budgetCode", "budgetName", "status"],
    createRequired: ["budgetCode", "budgetName", "fiscalYear"]
  })
);

router.use(
  "/budget-lines",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(BudgetLine, {
    include: [{ model: Budget }, { model: ChartAccount }],
    createRequired: ["budgetId", "chartAccountId", "annualAmount"]
  })
);

router.use(
  "/accounting",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"] }),
  accountingRoutes
);

router.use(
  "/vendors",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Vendor, {
    searchFields: ["vendorCode", "name", "contactPerson"],
    createRequired: ["vendorCode", "name"]
  })
);

router.use(
  "/purchase-orders",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(PurchaseOrder, {
    include: [{ model: Vendor }, { model: Location }, { model: PurchaseOrderLine, as: "lines" }],
    searchFields: ["poNumber", "status"],
    createRequired: ["poNumber", "orderDate", "vendorId"]
  })
);

router.use(
  "/purchase-order-lines",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(PurchaseOrderLine, {
    include: [{ model: PurchaseOrder }, { model: StockItem }],
    createRequired: ["purchaseOrderId", "itemName", "quantity", "unitCost"]
  })
);

router.use(
  "/stock-items",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(StockItem, {
    searchFields: ["sku", "name", "category"],
    createRequired: ["sku", "name"]
  })
);

router.use(
  "/inventory-batches",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(InventoryBatch, {
    include: [{ model: StockItem }, { model: Location }],
    searchFields: ["batchNumber", "lotNumber", "status"],
    createRequired: ["batchNumber", "stockItemId"]
  })
);

router.use(
  "/inventory-transactions",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(InventoryTransaction, {
    include: [{ model: StockItem }, { model: InventoryBatch }],
    searchFields: ["transactionNumber", "transactionType", "reason"],
    createRequired: ["transactionNumber", "transactionType", "quantity", "stockItemId"]
  })
);

router.use(
  "/compound-records",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(CompoundRecord, {
    include: [{ model: StockItem }],
    searchFields: ["compoundNumber", "formulaName"],
    createRequired: ["compoundNumber", "formulaName", "quantityProduced", "stockItemId"]
  })
);

router.use(
  "/case-programs",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(CaseProgram, {
    searchFields: ["code", "name"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/case-records",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(CaseRecord, {
    include: [{ model: CaseProgram }, { model: Patient }, { model: Provider, as: "assignedProvider" }],
    searchFields: ["caseNumber", "diagnosis", "status"],
    createRequired: ["caseNumber", "patientId", "caseProgramId"]
  })
);

router.use(
  "/case-notes",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(CaseNote, {
    include: [{ model: CaseRecord }],
    createRequired: ["caseRecordId", "content"]
  })
);

router.use(
  "/care-plans",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(CarePlan, {
    include: [{ model: CaseRecord }],
    createRequired: ["caseRecordId", "goal"]
  })
);

router.use(
  "/action-plans",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(ActionPlan, {
    include: [{ model: CaseRecord }],
    createRequired: ["caseRecordId", "title"]
  })
);

router.use(
  "/case-approvals",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: ["admin", "doctor"], PUT: ["admin", "doctor"], DELETE: ["admin"] }),
  createResourceRouter(CaseApproval, {
    include: [{ model: CaseRecord }],
    createRequired: ["caseRecordId", "approvalType"]
  })
);

router.use(
  "/tenants",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Tenant, {
    searchFields: ["code", "name"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/locations",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(Location, {
    include: [{ model: Tenant }],
    searchFields: ["code", "name", "address"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/provider-assignments",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(ProviderAssignment, {
    include: [{ model: Provider }, { model: Location }],
    createRequired: ["providerId", "locationId"]
  })
);

router.use(
  "/booking-rules",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(BookingRule, {
    searchFields: ["name"],
    createRequired: ["name"]
  })
);

router.use(
  "/appointment-series",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "receptionist"], PUT: ["admin", "receptionist"], DELETE: ["admin"] }),
  createResourceRouter(AppointmentSeries, {
    include: [{ model: BookingRule }, { model: Patient }, { model: Provider }],
    createRequired: ["seriesNumber", "patientId", "providerId"]
  })
);

router.use(
  "/calendar-events",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: [...CLINICAL, ...FRONT_DESK], PUT: [...CLINICAL, ...FRONT_DESK], DELETE: ["admin"] }),
  createResourceRouter(CalendarEvent, {
    include: [Patient, Provider, Appointment, Surgery, TelemedicineSession],
    searchFields: ["eventNumber", "title", "eventType", "status"],
    createRequired: ["eventNumber", "title", "startAt"]
  })
);

router.use(
  "/calendar",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL }),
  calendarRoutes
);

router.use(
  "/operations",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL }),
  operationsRoutes
);

router.use(
  "/care-flow",
  authenticate,
  enforcePasswordChange,
  authorize({ POST: CLINICAL }),
  careFlowRoutes
);

router.use(
  "/backup-schedules",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(BackupSchedule, {
    searchFields: ["name", "frequency"],
    createRequired: ["name", "frequency"]
  })
);

router.use(
  "/backup-logs",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ["admin"], POST: ["admin"], PUT: ["admin"], DELETE: ["admin"] }),
  createResourceRouter(BackupLog, {
    include: [{ model: BackupSchedule }],
    searchFields: ["status"],
    createRequired: ["backupScheduleId"]
  })
);

router.use(
  "/backup",
  authenticate,
  enforcePasswordChange,
  authorize({ POST: ["admin"] }),
  backupRoutes
);

router.use(
  "/practice-profiles",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ["admin", "doctor"], PUT: ["admin", "doctor"], DELETE: ["admin"] }),
  createResourceRouter(PracticeProfile, {
    searchFields: ["code", "name", "specialty"],
    createRequired: ["code", "name"]
  })
);

router.use(
  "/em-coding-records",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: CLINICAL, POST: CLINICAL, PUT: CLINICAL, DELETE: ["admin", "doctor"] }),
  createResourceRouter(EmCodingRecord, {
    include: [{ model: PracticeProfile }, { model: Encounter }, { model: Provider }],
    createRequired: ["code", "practiceProfileId", "encounterId", "providerId"]
  })
);

router.use(
  "/prescription-renewal-requests",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(PrescriptionRenewalRequest, {
    include: [{ model: Prescription }, { model: Patient }],
    createRequired: ["requestNumber", "prescriptionId", "patientId"]
  })
);

router.use(
  "/prescription-cancellation-requests",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(PrescriptionCancellationRequest, {
    include: [{ model: Prescription }, { model: Patient }],
    createRequired: ["requestNumber", "prescriptionId", "patientId"]
  })
);

router.use(
  "/care-summary-exchanges",
  authenticate,
  enforcePasswordChange,
  authorize({ GET: ALL, POST: ALL, PUT: CLINICAL, DELETE: ["admin"] }),
  createResourceRouter(CareSummaryExchange, {
    include: [{ model: Patient }],
    searchFields: ["exchangeNumber", "direction", "status"],
    createRequired: ["exchangeNumber", "patientId"]
  })
);

module.exports = router;
