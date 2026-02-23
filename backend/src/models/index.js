const sequelize = require("../config/database");

const Patient = require("./patient")(sequelize);
const Department = require("./department")(sequelize);
const Provider = require("./provider")(sequelize);
const Appointment = require("./appointment")(sequelize);
const Visit = require("./visit")(sequelize);
const Encounter = require("./encounter")(sequelize);
const Medication = require("./medication")(sequelize);
const Prescription = require("./prescription")(sequelize);
const Invoice = require("./invoice")(sequelize);
const User = require("./user")(sequelize);
const RefreshToken = require("./refreshToken")(sequelize);
const SecurityEvent = require("./securityEvent")(sequelize);
const FormTemplate = require("./formTemplate")(sequelize);
const FormField = require("./formField")(sequelize);
const FormSubmission = require("./formSubmission")(sequelize);
const TheatreRoom = require("./theatreRoom")(sequelize);
const TheatreProcedure = require("./theatreProcedure")(sequelize);
const Surgery = require("./surgery")(sequelize);
const SurgeryPreOpChecklist = require("./surgeryPreOpChecklist")(sequelize);
const SurgeryIntraOpNote = require("./surgeryIntraOpNote")(sequelize);
const SurgeryPostOpOutcome = require("./surgeryPostOpOutcome")(sequelize);
const InsuranceProvider = require("./insuranceProvider")(sequelize);
const InsurancePolicy = require("./insurancePolicy")(sequelize);
const LabTest = require("./labTest")(sequelize);
const LabOrder = require("./labOrder")(sequelize);
const LabPanel = require("./labPanel")(sequelize);
const LabAnalyte = require("./labAnalyte")(sequelize);
const LabPanelAnalyte = require("./labPanelAnalyte")(sequelize);
const LabResult = require("./labResult")(sequelize);
const LabResultValue = require("./labResultValue")(sequelize);
const LabInstrument = require("./labInstrument")(sequelize);
const LabInstrumentRun = require("./labInstrumentRun")(sequelize);
const LabResultVerification = require("./labResultVerification")(sequelize);
const LabReportTemplate = require("./labReportTemplate")(sequelize);
const RadiologyModality = require("./radiologyModality")(sequelize);
const RadiologyOrder = require("./radiologyOrder")(sequelize);
const Ward = require("./ward")(sequelize);
const Bed = require("./bed")(sequelize);
const Admission = require("./admission")(sequelize);
const QueueTicket = require("./queueTicket")(sequelize);
const TelemedicineSession = require("./telemedicineSession")(sequelize);
const ClinicalDocument = require("./clinicalDocument")(sequelize);
const Asset = require("./asset")(sequelize);
const Payor = require("./payor")(sequelize);
const Claim = require("./claim")(sequelize);
const Employee = require("./employee")(sequelize);
const PayrollCycle = require("./payrollCycle")(sequelize);
const Payslip = require("./payslip")(sequelize);
const Notification = require("./notification")(sequelize);
const MobileClient = require("./mobileClient")(sequelize);
const BarcodeLabel = require("./barcodeLabel")(sequelize);
const PrintJob = require("./printJob")(sequelize);
const AccountingPolicy = require("./accountingPolicy")(sequelize);
const ChartAccount = require("./chartAccount")(sequelize);
const JournalEntry = require("./journalEntry")(sequelize);
const Vendor = require("./vendor")(sequelize);
const PurchaseOrder = require("./purchaseOrder")(sequelize);
const PurchaseOrderLine = require("./purchaseOrderLine")(sequelize);
const StockItem = require("./stockItem")(sequelize);
const InventoryBatch = require("./inventoryBatch")(sequelize);
const InventoryTransaction = require("./inventoryTransaction")(sequelize);
const CompoundRecord = require("./compoundRecord")(sequelize);
const CaseProgram = require("./caseProgram")(sequelize);
const CaseRecord = require("./caseRecord")(sequelize);
const CaseNote = require("./caseNote")(sequelize);
const CarePlan = require("./carePlan")(sequelize);
const ActionPlan = require("./actionPlan")(sequelize);
const CaseApproval = require("./caseApproval")(sequelize);
const Tenant = require("./tenant")(sequelize);
const Location = require("./location")(sequelize);
const ProviderAssignment = require("./providerAssignment")(sequelize);
const BookingRule = require("./bookingRule")(sequelize);
const AppointmentSeries = require("./appointmentSeries")(sequelize);
const BackupSchedule = require("./backupSchedule")(sequelize);
const BackupLog = require("./backupLog")(sequelize);
const CalendarEvent = require("./calendarEvent")(sequelize);
const HmisReportSubmission = require("./hmisReportSubmission")(sequelize);
const DiseaseSurveillanceReport = require("./diseaseSurveillanceReport")(sequelize);
const PracticeProfile = require("./practiceProfile")(sequelize);
const EmCodingRecord = require("./emCodingRecord")(sequelize);
const PrescriptionRenewalRequest = require("./prescriptionRenewalRequest")(sequelize);
const PrescriptionCancellationRequest = require("./prescriptionCancellationRequest")(sequelize);
const CareSummaryExchange = require("./careSummaryExchange")(sequelize);
const ServiceCatalog = require("./serviceCatalog")(sequelize);
const PricingRule = require("./pricingRule")(sequelize);
const ServicePackage = require("./servicePackage")(sequelize);
const PackageItem = require("./packageItem")(sequelize);
const ChargeItem = require("./chargeItem")(sequelize);
const Payment = require("./payment")(sequelize);
const RevenueCycleTask = require("./revenueCycleTask")(sequelize);
const IntakeFormSubmission = require("./intakeFormSubmission")(sequelize);
const AssessmentNote = require("./assessmentNote")(sequelize);
const ProgressNote = require("./progressNote")(sequelize);
const VisitVerification = require("./visitVerification")(sequelize);
const EmployeeAttendance = require("./employeeAttendance")(sequelize);
const EmployeePerformanceMetric = require("./employeePerformanceMetric")(sequelize);
const PatientTransfer = require("./patientTransfer")(sequelize);
const DischargeSummary = require("./dischargeSummary")(sequelize);

Department.hasMany(Provider, { foreignKey: "departmentId" });
Provider.belongsTo(Department, { foreignKey: "departmentId" });

Patient.hasMany(Appointment, { foreignKey: "patientId" });
Provider.hasMany(Appointment, { foreignKey: "providerId" });
Department.hasMany(Appointment, { foreignKey: "departmentId" });
Appointment.belongsTo(Patient, { foreignKey: "patientId" });
Appointment.belongsTo(Provider, { foreignKey: "providerId" });
Appointment.belongsTo(Department, { foreignKey: "departmentId" });

Patient.hasMany(Visit, { foreignKey: "patientId" });
Provider.hasMany(Visit, { foreignKey: "providerId" });
Department.hasMany(Visit, { foreignKey: "departmentId" });
Visit.belongsTo(Patient, { foreignKey: "patientId" });
Visit.belongsTo(Provider, { foreignKey: "providerId" });
Visit.belongsTo(Department, { foreignKey: "departmentId" });

Visit.hasMany(Encounter, { foreignKey: "visitId" });
Patient.hasMany(Encounter, { foreignKey: "patientId" });
Provider.hasMany(Encounter, { foreignKey: "providerId" });
Encounter.belongsTo(Visit, { foreignKey: "visitId" });
Encounter.belongsTo(Patient, { foreignKey: "patientId" });
Encounter.belongsTo(Provider, { foreignKey: "providerId" });

Patient.hasMany(Prescription, { foreignKey: "patientId" });
Provider.hasMany(Prescription, { foreignKey: "providerId" });
Medication.hasMany(Prescription, { foreignKey: "medicationId" });
Encounter.hasMany(Prescription, { foreignKey: "encounterId" });
Prescription.belongsTo(Patient, { foreignKey: "patientId" });
Prescription.belongsTo(Provider, { foreignKey: "providerId" });
Prescription.belongsTo(Medication, { foreignKey: "medicationId" });
Prescription.belongsTo(Encounter, { foreignKey: "encounterId" });

Patient.hasMany(Invoice, { foreignKey: "patientId" });
Visit.hasMany(Invoice, { foreignKey: "visitId" });
Invoice.belongsTo(Patient, { foreignKey: "patientId" });
Invoice.belongsTo(Visit, { foreignKey: "visitId" });
Invoice.hasMany(ChargeItem, { foreignKey: "invoiceId" });
ChargeItem.belongsTo(Invoice, { foreignKey: "invoiceId" });
Invoice.hasMany(Payment, { foreignKey: "invoiceId" });
Payment.belongsTo(Invoice, { foreignKey: "invoiceId" });
Patient.hasMany(Payment, { foreignKey: "patientId" });
Payment.belongsTo(Patient, { foreignKey: "patientId" });

User.hasMany(RefreshToken, { foreignKey: "userId" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });
User.hasMany(SecurityEvent, { foreignKey: "userId" });
SecurityEvent.belongsTo(User, { foreignKey: "userId" });
Patient.hasMany(User, { foreignKey: "patientId" });
User.belongsTo(Patient, { foreignKey: "patientId" });

FormTemplate.hasMany(FormField, {
  foreignKey: "formTemplateId",
  as: "fields",
  onDelete: "CASCADE"
});
FormField.belongsTo(FormTemplate, { foreignKey: "formTemplateId" });

FormTemplate.hasMany(FormSubmission, { foreignKey: "formTemplateId", as: "submissions" });
FormSubmission.belongsTo(FormTemplate, { foreignKey: "formTemplateId", as: "template" });

Patient.hasMany(FormSubmission, { foreignKey: "patientId" });
Visit.hasMany(FormSubmission, { foreignKey: "visitId" });
Encounter.hasMany(FormSubmission, { foreignKey: "encounterId" });
User.hasMany(FormSubmission, { foreignKey: "submittedByUserId" });
FormSubmission.belongsTo(Patient, { foreignKey: "patientId" });
FormSubmission.belongsTo(Visit, { foreignKey: "visitId" });
FormSubmission.belongsTo(Encounter, { foreignKey: "encounterId" });
FormSubmission.belongsTo(User, { foreignKey: "submittedByUserId", as: "submittedBy" });

TheatreRoom.hasMany(Surgery, { foreignKey: "theatreRoomId" });
TheatreProcedure.hasMany(Surgery, { foreignKey: "theatreProcedureId" });
Patient.hasMany(Surgery, { foreignKey: "patientId" });
Provider.hasMany(Surgery, { foreignKey: "primarySurgeonId" });
Surgery.belongsTo(TheatreRoom, { foreignKey: "theatreRoomId" });
Surgery.belongsTo(TheatreProcedure, { foreignKey: "theatreProcedureId" });
Surgery.belongsTo(Patient, { foreignKey: "patientId" });
Surgery.belongsTo(Provider, { foreignKey: "primarySurgeonId", as: "primarySurgeon" });

Surgery.hasOne(SurgeryPreOpChecklist, { foreignKey: "surgeryId", as: "preOpChecklist" });
SurgeryPreOpChecklist.belongsTo(Surgery, { foreignKey: "surgeryId" });
Surgery.hasOne(SurgeryIntraOpNote, { foreignKey: "surgeryId", as: "intraOpNote" });
SurgeryIntraOpNote.belongsTo(Surgery, { foreignKey: "surgeryId" });
Surgery.hasOne(SurgeryPostOpOutcome, { foreignKey: "surgeryId", as: "postOpOutcome" });
SurgeryPostOpOutcome.belongsTo(Surgery, { foreignKey: "surgeryId" });

User.hasMany(SurgeryPreOpChecklist, { foreignKey: "completedByUserId" });
User.hasMany(SurgeryIntraOpNote, { foreignKey: "recordedByUserId" });
User.hasMany(SurgeryPostOpOutcome, { foreignKey: "recordedByUserId" });
SurgeryPreOpChecklist.belongsTo(User, { foreignKey: "completedByUserId", as: "completedBy" });
SurgeryIntraOpNote.belongsTo(User, { foreignKey: "recordedByUserId", as: "recordedBy" });
SurgeryPostOpOutcome.belongsTo(User, { foreignKey: "recordedByUserId", as: "recordedBy" });

InsuranceProvider.hasMany(InsurancePolicy, { foreignKey: "insuranceProviderId" });
Patient.hasMany(InsurancePolicy, { foreignKey: "patientId" });
InsurancePolicy.belongsTo(InsuranceProvider, { foreignKey: "insuranceProviderId" });
InsurancePolicy.belongsTo(Patient, { foreignKey: "patientId" });

LabTest.hasMany(LabOrder, { foreignKey: "labTestId" });
LabPanel.hasMany(LabOrder, { foreignKey: "labPanelId" });
Patient.hasMany(LabOrder, { foreignKey: "patientId" });
Provider.hasMany(LabOrder, { foreignKey: "orderedByProviderId" });
Encounter.hasMany(LabOrder, { foreignKey: "encounterId" });
LabOrder.belongsTo(LabTest, { foreignKey: "labTestId" });
LabOrder.belongsTo(LabPanel, { foreignKey: "labPanelId" });
LabOrder.belongsTo(Patient, { foreignKey: "patientId" });
LabOrder.belongsTo(Provider, { foreignKey: "orderedByProviderId", as: "orderedBy" });
LabOrder.belongsTo(Encounter, { foreignKey: "encounterId" });

LabPanel.belongsToMany(LabAnalyte, { through: LabPanelAnalyte, foreignKey: "labPanelId", otherKey: "labAnalyteId", as: "analytes" });
LabAnalyte.belongsToMany(LabPanel, { through: LabPanelAnalyte, foreignKey: "labAnalyteId", otherKey: "labPanelId", as: "panels" });
LabPanel.hasMany(LabPanelAnalyte, { foreignKey: "labPanelId", as: "panelAnalytes" });
LabPanelAnalyte.belongsTo(LabPanel, { foreignKey: "labPanelId" });
LabAnalyte.hasMany(LabPanelAnalyte, { foreignKey: "labAnalyteId" });
LabPanelAnalyte.belongsTo(LabAnalyte, { foreignKey: "labAnalyteId" });

LabOrder.hasOne(LabResult, { foreignKey: "labOrderId", as: "result" });
LabResult.belongsTo(LabOrder, { foreignKey: "labOrderId" });
LabResult.hasMany(LabResultValue, { foreignKey: "labResultId", as: "values" });
LabResultValue.belongsTo(LabResult, { foreignKey: "labResultId" });
LabAnalyte.hasMany(LabResultValue, { foreignKey: "labAnalyteId" });
LabResultValue.belongsTo(LabAnalyte, { foreignKey: "labAnalyteId" });

LabInstrument.hasMany(LabInstrumentRun, { foreignKey: "labInstrumentId" });
LabOrder.hasMany(LabInstrumentRun, { foreignKey: "labOrderId" });
LabResult.hasMany(LabInstrumentRun, { foreignKey: "labResultId" });
LabInstrumentRun.belongsTo(LabInstrument, { foreignKey: "labInstrumentId" });
LabInstrumentRun.belongsTo(LabOrder, { foreignKey: "labOrderId" });
LabInstrumentRun.belongsTo(LabResult, { foreignKey: "labResultId" });

LabResult.hasMany(LabResultVerification, { foreignKey: "labResultId", as: "verifications" });
User.hasMany(LabResultVerification, { foreignKey: "verifiedByUserId" });
LabResultVerification.belongsTo(LabResult, { foreignKey: "labResultId" });
LabResultVerification.belongsTo(User, { foreignKey: "verifiedByUserId", as: "verifiedBy" });

RadiologyModality.hasMany(RadiologyOrder, { foreignKey: "radiologyModalityId" });
Patient.hasMany(RadiologyOrder, { foreignKey: "patientId" });
Provider.hasMany(RadiologyOrder, { foreignKey: "orderedByProviderId" });
Encounter.hasMany(RadiologyOrder, { foreignKey: "encounterId" });
RadiologyOrder.belongsTo(RadiologyModality, { foreignKey: "radiologyModalityId" });
RadiologyOrder.belongsTo(Patient, { foreignKey: "patientId" });
RadiologyOrder.belongsTo(Provider, { foreignKey: "orderedByProviderId", as: "orderedBy" });
RadiologyOrder.belongsTo(Encounter, { foreignKey: "encounterId" });

Ward.hasMany(Bed, { foreignKey: "wardId" });
Bed.belongsTo(Ward, { foreignKey: "wardId" });

Patient.hasMany(Admission, { foreignKey: "patientId" });
Bed.hasMany(Admission, { foreignKey: "bedId" });
Provider.hasMany(Admission, { foreignKey: "admittingProviderId" });
Admission.belongsTo(Patient, { foreignKey: "patientId" });
Admission.belongsTo(Bed, { foreignKey: "bedId" });
Admission.belongsTo(Provider, { foreignKey: "admittingProviderId", as: "admittingProvider" });

Patient.hasMany(QueueTicket, { foreignKey: "patientId" });
Department.hasMany(QueueTicket, { foreignKey: "departmentId" });
QueueTicket.belongsTo(Patient, { foreignKey: "patientId" });
QueueTicket.belongsTo(Department, { foreignKey: "departmentId" });

Patient.hasMany(TelemedicineSession, { foreignKey: "patientId" });
Provider.hasMany(TelemedicineSession, { foreignKey: "providerId" });
TelemedicineSession.belongsTo(Patient, { foreignKey: "patientId" });
TelemedicineSession.belongsTo(Provider, { foreignKey: "providerId" });

Patient.hasMany(ClinicalDocument, { foreignKey: "patientId" });
Encounter.hasMany(ClinicalDocument, { foreignKey: "encounterId" });
ClinicalDocument.belongsTo(Patient, { foreignKey: "patientId" });
ClinicalDocument.belongsTo(Encounter, { foreignKey: "encounterId" });

Payor.hasMany(Claim, { foreignKey: "payorId" });
Patient.hasMany(Claim, { foreignKey: "patientId" });
InsurancePolicy.hasMany(Claim, { foreignKey: "insurancePolicyId" });
Invoice.hasMany(Claim, { foreignKey: "invoiceId" });
Claim.belongsTo(Payor, { foreignKey: "payorId" });
Claim.belongsTo(Patient, { foreignKey: "patientId" });
Claim.belongsTo(InsurancePolicy, { foreignKey: "insurancePolicyId" });
Claim.belongsTo(Invoice, { foreignKey: "invoiceId" });

Department.hasMany(Employee, { foreignKey: "departmentId" });
Employee.belongsTo(Department, { foreignKey: "departmentId" });
Employee.hasMany(Payslip, { foreignKey: "employeeId" });
PayrollCycle.hasMany(Payslip, { foreignKey: "payrollCycleId" });
Payslip.belongsTo(Employee, { foreignKey: "employeeId" });
Payslip.belongsTo(PayrollCycle, { foreignKey: "payrollCycleId" });

Patient.hasMany(Notification, { foreignKey: "patientId" });
User.hasMany(Notification, { foreignKey: "createdByUserId" });
Appointment.hasMany(Notification, { foreignKey: "appointmentId" });
Notification.belongsTo(Patient, { foreignKey: "patientId" });
Notification.belongsTo(User, { foreignKey: "createdByUserId", as: "createdBy" });
Notification.belongsTo(Appointment, { foreignKey: "appointmentId" });

ServicePackage.hasMany(PackageItem, { foreignKey: "servicePackageId", as: "items" });
ServiceCatalog.hasMany(PackageItem, { foreignKey: "serviceCatalogId" });
PackageItem.belongsTo(ServicePackage, { foreignKey: "servicePackageId" });
PackageItem.belongsTo(ServiceCatalog, { foreignKey: "serviceCatalogId" });

ServiceCatalog.hasMany(ChargeItem, { foreignKey: "serviceCatalogId" });
ServicePackage.hasMany(ChargeItem, { foreignKey: "servicePackageId" });
ChargeItem.belongsTo(ServiceCatalog, { foreignKey: "serviceCatalogId" });
ChargeItem.belongsTo(ServicePackage, { foreignKey: "servicePackageId" });

Claim.hasMany(RevenueCycleTask, { foreignKey: "claimId" });
Invoice.hasMany(RevenueCycleTask, { foreignKey: "invoiceId" });
User.hasMany(RevenueCycleTask, { foreignKey: "assignedToUserId" });
RevenueCycleTask.belongsTo(Claim, { foreignKey: "claimId" });
RevenueCycleTask.belongsTo(Invoice, { foreignKey: "invoiceId" });
RevenueCycleTask.belongsTo(User, { foreignKey: "assignedToUserId", as: "assignedTo" });

Visit.hasMany(IntakeFormSubmission, { foreignKey: "visitId" });
Patient.hasMany(IntakeFormSubmission, { foreignKey: "patientId" });
User.hasMany(IntakeFormSubmission, { foreignKey: "submittedByUserId" });
IntakeFormSubmission.belongsTo(Visit, { foreignKey: "visitId" });
IntakeFormSubmission.belongsTo(Patient, { foreignKey: "patientId" });
IntakeFormSubmission.belongsTo(User, { foreignKey: "submittedByUserId", as: "submittedBy" });

Encounter.hasMany(AssessmentNote, { foreignKey: "encounterId" });
Encounter.hasMany(ProgressNote, { foreignKey: "encounterId" });
Patient.hasMany(AssessmentNote, { foreignKey: "patientId" });
Patient.hasMany(ProgressNote, { foreignKey: "patientId" });
Provider.hasMany(AssessmentNote, { foreignKey: "providerId" });
Provider.hasMany(ProgressNote, { foreignKey: "providerId" });
AssessmentNote.belongsTo(Encounter, { foreignKey: "encounterId" });
AssessmentNote.belongsTo(Patient, { foreignKey: "patientId" });
AssessmentNote.belongsTo(Provider, { foreignKey: "providerId" });
ProgressNote.belongsTo(Encounter, { foreignKey: "encounterId" });
ProgressNote.belongsTo(Patient, { foreignKey: "patientId" });
ProgressNote.belongsTo(Provider, { foreignKey: "providerId" });

Visit.hasOne(VisitVerification, { foreignKey: "visitId", as: "verification" });
VisitVerification.belongsTo(Visit, { foreignKey: "visitId" });
User.hasMany(VisitVerification, { foreignKey: "verifiedByUserId" });
VisitVerification.belongsTo(User, { foreignKey: "verifiedByUserId", as: "verifiedBy" });

Employee.hasMany(EmployeeAttendance, { foreignKey: "employeeId" });
Employee.hasMany(EmployeePerformanceMetric, { foreignKey: "employeeId" });
EmployeeAttendance.belongsTo(Employee, { foreignKey: "employeeId" });
EmployeePerformanceMetric.belongsTo(Employee, { foreignKey: "employeeId" });

Admission.hasMany(PatientTransfer, { foreignKey: "admissionId", as: "transfers" });
Patient.hasMany(PatientTransfer, { foreignKey: "patientId" });
Bed.hasMany(PatientTransfer, { foreignKey: "fromBedId" });
Bed.hasMany(PatientTransfer, { foreignKey: "toBedId" });
User.hasMany(PatientTransfer, { foreignKey: "requestedByUserId" });
PatientTransfer.belongsTo(Admission, { foreignKey: "admissionId" });
PatientTransfer.belongsTo(Patient, { foreignKey: "patientId" });
PatientTransfer.belongsTo(Bed, { foreignKey: "fromBedId", as: "fromBed" });
PatientTransfer.belongsTo(Bed, { foreignKey: "toBedId", as: "toBed" });
PatientTransfer.belongsTo(User, { foreignKey: "requestedByUserId", as: "requestedBy" });

Admission.hasOne(DischargeSummary, { foreignKey: "admissionId", as: "dischargeSummary" });
Patient.hasMany(DischargeSummary, { foreignKey: "patientId" });
Provider.hasMany(DischargeSummary, { foreignKey: "providerId" });
DischargeSummary.belongsTo(Admission, { foreignKey: "admissionId" });
DischargeSummary.belongsTo(Patient, { foreignKey: "patientId" });
DischargeSummary.belongsTo(Provider, { foreignKey: "providerId" });

Vendor.hasMany(PurchaseOrder, { foreignKey: "vendorId" });
Location.hasMany(PurchaseOrder, { foreignKey: "locationId" });
PurchaseOrder.belongsTo(Vendor, { foreignKey: "vendorId" });
PurchaseOrder.belongsTo(Location, { foreignKey: "locationId" });

PurchaseOrder.hasMany(PurchaseOrderLine, { foreignKey: "purchaseOrderId", as: "lines" });
StockItem.hasMany(PurchaseOrderLine, { foreignKey: "stockItemId" });
PurchaseOrderLine.belongsTo(PurchaseOrder, { foreignKey: "purchaseOrderId" });
PurchaseOrderLine.belongsTo(StockItem, { foreignKey: "stockItemId" });

StockItem.hasMany(InventoryBatch, { foreignKey: "stockItemId" });
Location.hasMany(InventoryBatch, { foreignKey: "locationId" });
InventoryBatch.belongsTo(StockItem, { foreignKey: "stockItemId" });
InventoryBatch.belongsTo(Location, { foreignKey: "locationId" });

StockItem.hasMany(InventoryTransaction, { foreignKey: "stockItemId" });
InventoryBatch.hasMany(InventoryTransaction, { foreignKey: "inventoryBatchId" });
User.hasMany(InventoryTransaction, { foreignKey: "performedByUserId" });
InventoryTransaction.belongsTo(StockItem, { foreignKey: "stockItemId" });
InventoryTransaction.belongsTo(InventoryBatch, { foreignKey: "inventoryBatchId" });
InventoryTransaction.belongsTo(User, { foreignKey: "performedByUserId", as: "performedBy" });

StockItem.hasMany(CompoundRecord, { foreignKey: "stockItemId" });
User.hasMany(CompoundRecord, { foreignKey: "preparedByUserId" });
CompoundRecord.belongsTo(StockItem, { foreignKey: "stockItemId" });
CompoundRecord.belongsTo(User, { foreignKey: "preparedByUserId", as: "preparedBy" });

CaseProgram.hasMany(CaseRecord, { foreignKey: "caseProgramId" });
Patient.hasMany(CaseRecord, { foreignKey: "patientId" });
Provider.hasMany(CaseRecord, { foreignKey: "assignedProviderId" });
CaseRecord.belongsTo(CaseProgram, { foreignKey: "caseProgramId" });
CaseRecord.belongsTo(Patient, { foreignKey: "patientId" });
CaseRecord.belongsTo(Provider, { foreignKey: "assignedProviderId", as: "assignedProvider" });

CaseRecord.hasMany(CaseNote, { foreignKey: "caseRecordId", as: "notes" });
CaseRecord.hasMany(CarePlan, { foreignKey: "caseRecordId", as: "carePlans" });
CaseRecord.hasMany(ActionPlan, { foreignKey: "caseRecordId", as: "actionPlans" });
CaseRecord.hasMany(CaseApproval, { foreignKey: "caseRecordId", as: "approvals" });
CaseNote.belongsTo(CaseRecord, { foreignKey: "caseRecordId" });
CarePlan.belongsTo(CaseRecord, { foreignKey: "caseRecordId" });
ActionPlan.belongsTo(CaseRecord, { foreignKey: "caseRecordId" });
CaseApproval.belongsTo(CaseRecord, { foreignKey: "caseRecordId" });

User.hasMany(CaseNote, { foreignKey: "createdByUserId" });
User.hasMany(CarePlan, { foreignKey: "createdByUserId" });
User.hasMany(ActionPlan, { foreignKey: "createdByUserId" });
User.hasMany(CaseApproval, { foreignKey: "decidedByUserId" });
CaseNote.belongsTo(User, { foreignKey: "createdByUserId", as: "createdBy" });
CarePlan.belongsTo(User, { foreignKey: "createdByUserId", as: "createdBy" });
ActionPlan.belongsTo(User, { foreignKey: "createdByUserId", as: "createdBy" });
CaseApproval.belongsTo(User, { foreignKey: "decidedByUserId", as: "decidedBy" });

Tenant.hasMany(Location, { foreignKey: "tenantId" });
Location.belongsTo(Tenant, { foreignKey: "tenantId" });
Provider.hasMany(ProviderAssignment, { foreignKey: "providerId" });
Location.hasMany(ProviderAssignment, { foreignKey: "locationId" });
ProviderAssignment.belongsTo(Provider, { foreignKey: "providerId" });
ProviderAssignment.belongsTo(Location, { foreignKey: "locationId" });

BookingRule.hasMany(AppointmentSeries, { foreignKey: "bookingRuleId" });
Patient.hasMany(AppointmentSeries, { foreignKey: "patientId" });
Provider.hasMany(AppointmentSeries, { foreignKey: "providerId" });
AppointmentSeries.belongsTo(BookingRule, { foreignKey: "bookingRuleId" });
AppointmentSeries.belongsTo(Patient, { foreignKey: "patientId" });
AppointmentSeries.belongsTo(Provider, { foreignKey: "providerId" });
AppointmentSeries.hasMany(Appointment, { foreignKey: "appointmentSeriesId" });
Appointment.belongsTo(AppointmentSeries, { foreignKey: "appointmentSeriesId" });

Patient.hasMany(CalendarEvent, { foreignKey: "patientId" });
Provider.hasMany(CalendarEvent, { foreignKey: "providerId" });
Appointment.hasMany(CalendarEvent, { foreignKey: "appointmentId" });
Surgery.hasMany(CalendarEvent, { foreignKey: "surgeryId" });
TelemedicineSession.hasMany(CalendarEvent, { foreignKey: "telemedicineSessionId" });
CalendarEvent.belongsTo(Patient, { foreignKey: "patientId" });
CalendarEvent.belongsTo(Provider, { foreignKey: "providerId" });
CalendarEvent.belongsTo(Appointment, { foreignKey: "appointmentId" });
CalendarEvent.belongsTo(Surgery, { foreignKey: "surgeryId" });
CalendarEvent.belongsTo(TelemedicineSession, { foreignKey: "telemedicineSessionId" });

BackupSchedule.hasMany(BackupLog, { foreignKey: "backupScheduleId" });
User.hasMany(BackupLog, { foreignKey: "triggeredByUserId" });
BackupLog.belongsTo(BackupSchedule, { foreignKey: "backupScheduleId" });
BackupLog.belongsTo(User, { foreignKey: "triggeredByUserId", as: "triggeredBy" });

PracticeProfile.hasMany(EmCodingRecord, { foreignKey: "practiceProfileId" });
Encounter.hasMany(EmCodingRecord, { foreignKey: "encounterId" });
Provider.hasMany(EmCodingRecord, { foreignKey: "providerId" });
EmCodingRecord.belongsTo(PracticeProfile, { foreignKey: "practiceProfileId" });
EmCodingRecord.belongsTo(Encounter, { foreignKey: "encounterId" });
EmCodingRecord.belongsTo(Provider, { foreignKey: "providerId" });

ChartAccount.hasMany(JournalEntry, { foreignKey: "chartAccountId" });
JournalEntry.belongsTo(ChartAccount, { foreignKey: "chartAccountId" });

Prescription.hasMany(PrescriptionRenewalRequest, { foreignKey: "prescriptionId" });
Prescription.hasMany(PrescriptionCancellationRequest, { foreignKey: "prescriptionId" });
Patient.hasMany(PrescriptionRenewalRequest, { foreignKey: "patientId" });
Patient.hasMany(PrescriptionCancellationRequest, { foreignKey: "patientId" });
PrescriptionRenewalRequest.belongsTo(Prescription, { foreignKey: "prescriptionId" });
PrescriptionRenewalRequest.belongsTo(Patient, { foreignKey: "patientId" });
PrescriptionCancellationRequest.belongsTo(Prescription, { foreignKey: "prescriptionId" });
PrescriptionCancellationRequest.belongsTo(Patient, { foreignKey: "patientId" });

Patient.hasMany(CareSummaryExchange, { foreignKey: "patientId" });
CareSummaryExchange.belongsTo(Patient, { foreignKey: "patientId" });

User.hasMany(HmisReportSubmission, { foreignKey: "submittedByUserId" });
HmisReportSubmission.belongsTo(User, { foreignKey: "submittedByUserId", as: "submittedBy" });
Patient.hasMany(DiseaseSurveillanceReport, { foreignKey: "patientId" });
User.hasMany(DiseaseSurveillanceReport, { foreignKey: "reportedByUserId" });
DiseaseSurveillanceReport.belongsTo(Patient, { foreignKey: "patientId" });
DiseaseSurveillanceReport.belongsTo(User, { foreignKey: "reportedByUserId", as: "reportedBy" });

module.exports = {
  sequelize,
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
  RefreshToken,
  SecurityEvent,
  FormTemplate,
  FormField,
  FormSubmission,
  TheatreRoom,
  TheatreProcedure,
  Surgery,
  SurgeryPreOpChecklist,
  SurgeryIntraOpNote,
  SurgeryPostOpOutcome,
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
  ChartAccount,
  JournalEntry,
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
  HmisReportSubmission,
  DiseaseSurveillanceReport,
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
  DischargeSummary
};
