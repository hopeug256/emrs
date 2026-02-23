# EMRS - Hospital Management System

This project is a lightweight OpenMRS-inspired hospital management system with two main folders:

- `backend`: Node.js + Express + Sequelize REST API
- `frontend`: Native React (JSX) application styled with Tailwind CSS

## Implemented modules

- Users (admin role management)
- Form Builder (templates, fields, publish)
- Form Submissions (dynamic clinical form capture)
- Theatre Rooms
- Theatre Procedures
- Surgeries (theatre scheduling)
- Theatre Workflow Sub-Forms (pre-op checklist, intra-op notes, post-op outcome)
- Insurance Management (providers, policies)
- Laboratory Management (tests, orders)
- Radiology Management (modalities, orders)
- Ward / Bed / Admission Management
- Queue Management
- Telemedicine Sessions
- Clinical Document Management
- Asset Management
- MIS Reporting
- Claims + Payor Management
- Payroll + HRM
- Patient Portal + Physician Portal
- Notifications / Reminders + No-Show Tracking
- Mobile SDK/API hardening (mobile client headers + SDK version gate)
- Barcode and print job workflows
- Procurement & vendor management
- Advanced inventory controls (batch/lot, expiry/block status, transactions, compounding)
- Case management suite (case records, notes, care plans, action plans, approvals)
- Multi-tenant/location/provider assignment controls
- Online booking enhancements (booking rules, recurring series, confirmations)
- Backup schedules and logs
- Practice management + E/M coding
- PHR depth (renewal/cancellation requests, care summary exchange)
- Advanced lab result workflow (panels/analytes, flagging, instrument ingest, verification chain, printable templates)
- Patients
- Providers
- Departments
- Appointments
- Visits
- Encounters
- Medications
- Prescriptions
- Billing (Invoices)
- Billing & Revenue Cycle Management (service catalog, dynamic pricing rules, packages, charges, payments, RCM tasks)
- Historical Reporting / Analytical Reports / Analytics
- Calendar Management (unified timeline + manual calendar events)
- Intake Forms, Assessment Notes, Progress Notes, Visit Verification
- Employee Tracking (attendance + performance metrics)
- Patient Transfer / Discharge workflows (transactional care-flow APIs)
- Mobile Access dashboard (client registry + SDK hardening probe)
- Uganda MoH HMIS compliance layer (HMIS report tracking, IDSR/notifiable timeliness, compliance dashboard)
- Referral management & tracking
- Client management & credit control
- Accident & emergency care
- Day care management
- Payment processing gateway flow
- Accounting & Budget Management (hospital chart hierarchy, posting controls, trial balance, budget variance)
- Patient monitoring and waiting-time analytics
- Chat / messaging
- Electronic laboratory notebook
- Role-specific UI shells:
  - `frontend/src/pages/admin` (Admin Console UI)
  - `frontend/src/pages/clinical` (Doctor/Nurse Workspace UI)
  - `frontend/src/pages/reception` (Front-Desk UI)
  - `frontend/src/pages/patient` (Minimal Self-Service UI)
  - `frontend/src/pages/shared` (Shared/global pages)

## Run backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs at `http://localhost:4000`.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Notes

- Backend uses SQLite by default for quick local setup.
- On startup, backend auto-syncs Sequelize models.
- CORS is enabled for frontend-to-backend communication.
- JWT authentication and role-based access control (RBAC) are enabled.
- Access tokens are short-lived and renewed with rotating refresh tokens.
- Refresh token reuse detection invalidates all active sessions for the user.
- First login requires password reset before module access.

## Authentication

### Roles

- `admin`
- `doctor`
- `nurse`
- `receptionist`
- `patient`

### Seeded users

All seeded users use the same password: `ChangeMe123!`

- `admin` (admin)
- `doctor` (doctor)
- `nurse` (nurse)
- `receptionist` (receptionist)
- `patient1` (patient, linked to MRN-0001)

### Auth endpoints

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me` (Bearer token required)
- `POST /api/auth/change-password` (Bearer token required)
- `POST /api/auth/logout`
- `GET /api/security-events` (admin only)
- `GET/POST/PUT/DELETE /api/form-templates`
- `POST /api/form-templates/:id/publish`
- `GET/POST /api/form-submissions`
- `GET/POST/PUT/DELETE /api/theatre-rooms`
- `GET/POST/PUT/DELETE /api/theatre-procedures`
- `GET/POST/PUT/DELETE /api/surgeries`
- `GET /api/theatre-workflow/:surgeryId`
- `PUT /api/theatre-workflow/:surgeryId/pre-op`
- `PUT /api/theatre-workflow/:surgeryId/intra-op`
- `PUT /api/theatre-workflow/:surgeryId/post-op`
- `GET/POST/PUT/DELETE /api/insurance-providers`
- `GET/POST/PUT/DELETE /api/insurance-policies`
- `GET/POST/PUT/DELETE /api/lab-tests`
- `GET/POST/PUT/DELETE /api/lab-orders`
- `GET/POST/PUT/DELETE /api/lab-panels`
- `GET/POST/PUT/DELETE /api/lab-analytes`
- `GET/POST/PUT/DELETE /api/lab-panel-analytes`
- `GET/POST/PUT/DELETE /api/lab-results`
- `GET/POST/PUT/DELETE /api/lab-result-values`
- `GET/POST/PUT/DELETE /api/lab-instruments`
- `GET/POST/PUT/DELETE /api/lab-instrument-runs`
- `GET/POST/PUT/DELETE /api/lab-result-verifications`
- `GET/POST/PUT/DELETE /api/lab-report-templates`
- `GET /api/lab-workflow/orders/:orderId`
- `POST /api/lab-workflow/orders/:orderId/initialize`
- `PUT /api/lab-workflow/orders/:orderId/results`
- `POST /api/lab-workflow/orders/:orderId/verify`
- `POST /api/lab-workflow/instrument/ingest`
- `GET /api/lab-workflow/orders/:orderId/printable`
- `GET/POST/PUT/DELETE /api/radiology-modalities`
- `GET/POST/PUT/DELETE /api/radiology-orders`
- `GET/POST/PUT/DELETE /api/wards`
- `GET/POST/PUT/DELETE /api/beds`
- `GET/POST/PUT/DELETE /api/admissions`
- `GET/POST/PUT/DELETE /api/queue-tickets`
- `GET/POST/PUT/DELETE /api/telemedicine-sessions`
- `GET/POST/PUT/DELETE /api/clinical-documents`
- `GET/POST/PUT/DELETE /api/assets`
- `GET /api/reports/overview`
- `GET /api/reports/historical?days=30`
- `GET /api/reports/analytics`
- `GET/POST/PUT/DELETE /api/hmis-report-submissions`
- `GET/POST/PUT/DELETE /api/disease-surveillance-reports`
- `POST /api/hmis/report-submissions/derive-deadline`
- `POST /api/hmis/report-submissions/:id/submit`
- `POST /api/hmis/disease-surveillance/:id/report`
- `GET /api/hmis/compliance/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/hmis/exports/meta`
- `GET /api/hmis/exports/:reportCode?format=json|csv|pdf&periodStart=YYYY-MM-DD&periodEnd=YYYY-MM-DD&facilityCode=...&district=...`
  - PDF exports use multi-page rendering (no row truncation) with Uganda MoH HMIS form-styled headers/sign-off blocks per report code.
  - Each HMIS code has its own PDF layout profile (column width ratios, header/body typography, row heights) for closer paper-form alignment.
- `GET/POST/PUT/DELETE /api/service-catalog`
- `GET/POST/PUT/DELETE /api/pricing-rules`
- `GET/POST/PUT/DELETE /api/service-packages`
- `GET/POST/PUT/DELETE /api/package-items`
- `GET/POST/PUT/DELETE /api/charge-items`
- `GET/POST/PUT/DELETE /api/payments`
- `GET/POST/PUT/DELETE /api/revenue-cycle-tasks`
- `POST /api/billing/price-preview`
- `POST /api/billing/packages/:packageId/expand`
- `POST /api/billing/invoices/:invoiceId/recompute`
- `GET/POST/PUT/DELETE /api/intake-form-submissions`
- `GET/POST/PUT/DELETE /api/assessment-notes`
- `GET/POST/PUT/DELETE /api/progress-notes`
- `GET/POST/PUT/DELETE /api/visit-verifications`
- `GET/POST/PUT/DELETE /api/employee-attendance`
- `GET/POST/PUT/DELETE /api/employee-performance-metrics`
- `GET/POST/PUT/DELETE /api/patient-transfers`
- `GET/POST/PUT/DELETE /api/discharge-summaries`
- `POST /api/care-flow/admissions/:admissionId/transfer`
- `POST /api/care-flow/admissions/:admissionId/discharge`
- `POST /api/care-flow/visits/:visitId/verify`
- `GET/POST/PUT/DELETE /api/calendar-events`
- `GET /api/calendar/timeline?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET/POST/PUT/DELETE /api/payors`
- `GET/POST/PUT/DELETE /api/claims`
- `GET/POST/PUT/DELETE /api/employees`
- `GET/POST/PUT/DELETE /api/payroll-cycles`
- `GET/POST/PUT/DELETE /api/payslips`
- `GET/POST/PUT/DELETE /api/notifications`
- `POST /api/notifications/appointment-reminders/generate`
- `POST /api/appointments/:id/mark-no-show`
- `GET /api/portal/patient-summary?patientId=<id>`
- `GET /api/portal/physician-summary?providerId=<id>`
- `GET /api/mobile/sdk-config` (requires mobile headers: `x-mobile-client-id`, `x-mobile-api-key`, `x-mobile-sdk-version`)
- `GET /api/barcode/resolve/:barcode`
- `POST /api/barcode/print-jobs/:id/mark-printed`
- `GET/POST/PUT/DELETE /api/mobile-clients`
- `GET/POST/PUT/DELETE /api/barcode-labels`
- `GET/POST/PUT/DELETE /api/print-jobs`
- `GET/POST/PUT/DELETE /api/accounting-policy`
- `GET/POST/PUT/DELETE /api/accounting-periods`
- `GET/POST/PUT/DELETE /api/chart-accounts`
- `GET/POST/PUT/DELETE /api/journal-entries`
- `GET/POST/PUT/DELETE /api/journal-entry-lines`
- `GET/POST/PUT/DELETE /api/budgets`
- `GET/POST/PUT/DELETE /api/budget-lines`
- `POST /api/accounting/chart-of-accounts/seed-uganda-hospital`
- `POST /api/accounting/chart-of-accounts/import-template` (bulk import exact account codebook)
- `GET /api/accounting/chart-of-accounts/tree`
- `POST /api/accounting/journal-entries/:id/post`
- `GET /api/accounting/trial-balance?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/accounting/budget-variance?budgetId=<id>&from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/accounting/budgets/:id/approve`
- `POST /api/accounting/budgets/:id/lock`
- `GET/POST/PUT/DELETE /api/vendors`
- `GET/POST/PUT/DELETE /api/purchase-orders`
- `GET/POST/PUT/DELETE /api/purchase-order-lines`
- `GET/POST/PUT/DELETE /api/stock-items`
- `GET/POST/PUT/DELETE /api/inventory-batches`
- `GET/POST/PUT/DELETE /api/inventory-transactions`
- `GET/POST/PUT/DELETE /api/compound-records`
- `GET/POST/PUT/DELETE /api/case-programs`
- `GET/POST/PUT/DELETE /api/case-records`
- `GET/POST/PUT/DELETE /api/case-notes`
- `GET/POST/PUT/DELETE /api/care-plans`
- `GET/POST/PUT/DELETE /api/action-plans`
- `GET/POST/PUT/DELETE /api/case-approvals`
- `GET/POST/PUT/DELETE /api/tenants`
- `GET/POST/PUT/DELETE /api/locations`
- `GET/POST/PUT/DELETE /api/provider-assignments`
- `GET/POST/PUT/DELETE /api/booking-rules`
- `GET/POST/PUT/DELETE /api/appointment-series`
- `POST /api/booking/appointments/recurring`
- `POST /api/booking/appointments/:id/confirm`
- `GET/POST/PUT/DELETE /api/backup-schedules`
- `GET/POST/PUT/DELETE /api/backup-logs`
- `POST /api/backup/run/:scheduleId`
- `GET/POST/PUT/DELETE /api/practice-profiles`
- `GET/POST/PUT/DELETE /api/em-coding-records`
- `GET/POST/PUT/DELETE /api/prescription-renewal-requests`
- `GET/POST/PUT/DELETE /api/prescription-cancellation-requests`
- `GET/POST/PUT/DELETE /api/care-summary-exchanges`
- `GET/POST/PUT/DELETE /api/referrals`
- `GET/POST/PUT/DELETE /api/client-accounts`
- `GET/POST/PUT/DELETE /api/credit-control-events`
- `GET/POST/PUT/DELETE /api/emergency-cases`
- `GET/POST/PUT/DELETE /api/day-care-episodes`
- `GET/POST/PUT/DELETE /api/payment-gateway-transactions`
- `GET/POST/PUT/DELETE /api/patient-monitoring-records`
- `GET /api/operations/waiting-time-analytics?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/operations/patient-monitoring-summary?patientId=<id>`
- `GET /api/operations/ae-kpis?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `POST /api/operations/payment-gateway/process`
- `POST /api/payment-webhooks/:gateway` (signature header: `x-signature` or `x-emrs-signature`; HMAC SHA256)
- `GET/POST/PUT/DELETE /api/chat-threads`
- `GET/POST/PUT/DELETE /api/chat-thread-participants`
- `GET/POST/PUT/DELETE /api/chat-messages`
- `GET /api/chat/my-threads`
- `POST /api/chat/threads`
- `GET /api/chat/threads/:threadId/messages`
- `POST /api/chat/threads/:threadId/messages`
- `GET /api/chat/search-users?q=<query>`
- `GET/POST/PUT/DELETE /api/electronic-lab-notebook-entries`

Realtime chat websocket endpoint:
- `ws://localhost:4000/ws/chat?token=<accessToken>`

All module endpoints except `/api/health`, `/api/auth/login`, and `/api/auth/refresh` require a valid access token.

Patient-role users can only access their own data in `GET /api/portal/patient-summary` (self-scoped by linked `patientId`).

Uganda CoA note:
- The app includes a Uganda hospital chart-of-accounts template seed with parent-child account hierarchy and normal balance rules.
- If your facility follows a stricter UCMB codebook variant, update seeded account codes/names in `backend/src/routes/accounting.js` to match your official finance policy document exactly.
