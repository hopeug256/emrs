const express = require("express");
const {
  sequelize,
  Admission,
  Bed,
  PatientTransfer,
  DischargeSummary,
  Visit,
  VisitVerification
} = require("../models");

const router = express.Router();

router.post("/admissions/:admissionId/transfer", async (req, res, next) => {
  const tx = await sequelize.transaction();
  try {
    const admission = await Admission.findByPk(req.params.admissionId, { transaction: tx });
    if (!admission) {
      await tx.rollback();
      return res.status(404).json({ message: "Admission not found" });
    }

    const fromBed = admission.bedId ? await Bed.findByPk(admission.bedId, { transaction: tx }) : null;
    const toBed = req.body.toBedId ? await Bed.findByPk(req.body.toBedId, { transaction: tx }) : null;
    if (req.body.toBedId && !toBed) {
      await tx.rollback();
      return res.status(404).json({ message: "Destination bed not found" });
    }

    const transfer = await PatientTransfer.create(
      {
        transferNumber: req.body.transferNumber,
        admissionId: admission.id,
        patientId: admission.patientId,
        fromBedId: fromBed?.id || null,
        toBedId: toBed?.id || null,
        requestedByUserId: req.user?.id || null,
        transferType: req.body.transferType || "WardToWard",
        reason: req.body.reason || null,
        status: "Completed",
        transferredAt: req.body.transferredAt || new Date()
      },
      { transaction: tx }
    );

    if (fromBed) await fromBed.update({ status: "Available" }, { transaction: tx });
    if (toBed) await toBed.update({ status: "Occupied" }, { transaction: tx });
    if (toBed) await admission.update({ bedId: toBed.id, status: "Transferred" }, { transaction: tx });

    await tx.commit();
    res.status(201).json(transfer);
  } catch (error) {
    await tx.rollback();
    next(error);
  }
});

router.post("/admissions/:admissionId/discharge", async (req, res, next) => {
  const tx = await sequelize.transaction();
  try {
    const admission = await Admission.findByPk(req.params.admissionId, { transaction: tx });
    if (!admission) {
      await tx.rollback();
      return res.status(404).json({ message: "Admission not found" });
    }

    const bed = admission.bedId ? await Bed.findByPk(admission.bedId, { transaction: tx }) : null;
    const summary = await DischargeSummary.create(
      {
        dischargeNumber: req.body.dischargeNumber,
        admissionId: admission.id,
        patientId: admission.patientId,
        providerId: req.body.providerId || null,
        dischargeDate: req.body.dischargeDate || new Date(),
        finalDiagnosis: req.body.finalDiagnosis || null,
        treatmentSummary: req.body.treatmentSummary || null,
        followUpInstructions: req.body.followUpInstructions || null
      },
      { transaction: tx }
    );

    await admission.update(
      {
        status: "Discharged",
        dischargedAt: req.body.dischargeDate || new Date()
      },
      { transaction: tx }
    );
    if (bed) await bed.update({ status: "Available" }, { transaction: tx });

    await tx.commit();
    res.status(201).json(summary);
  } catch (error) {
    await tx.rollback();
    next(error);
  }
});

router.post("/visits/:visitId/verify", async (req, res, next) => {
  try {
    const visit = await Visit.findByPk(req.params.visitId);
    if (!visit) return res.status(404).json({ message: "Visit not found" });

    const [verification, created] = await VisitVerification.findOrCreate({
      where: { visitId: visit.id },
      defaults: {
        verificationCode: req.body.verificationCode,
        visitId: visit.id,
        method: req.body.method || "Manual",
        status: "Verified",
        verifiedAt: req.body.verifiedAt || new Date(),
        verifiedByUserId: req.user?.id || null
      }
    });

    if (!created) {
      await verification.update({
        verificationCode: req.body.verificationCode || verification.verificationCode,
        method: req.body.method || verification.method,
        status: req.body.status || "Verified",
        verifiedAt: req.body.verifiedAt || new Date(),
        verifiedByUserId: req.user?.id || verification.verifiedByUserId
      });
    }

    res.json(verification);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
