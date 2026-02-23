const express = require("express");
const {
  Surgery,
  TheatreRoom,
  TheatreProcedure,
  Patient,
  Provider,
  SurgeryPreOpChecklist,
  SurgeryIntraOpNote,
  SurgeryPostOpOutcome,
  User
} = require("../models");

const router = express.Router();

const surgeryInclude = [
  { model: TheatreRoom },
  { model: TheatreProcedure },
  { model: Patient },
  { model: Provider, as: "primarySurgeon" },
  { model: SurgeryPreOpChecklist, as: "preOpChecklist", include: [{ model: User, as: "completedBy" }] },
  { model: SurgeryIntraOpNote, as: "intraOpNote", include: [{ model: User, as: "recordedBy" }] },
  { model: SurgeryPostOpOutcome, as: "postOpOutcome", include: [{ model: User, as: "recordedBy" }] }
];

async function getSurgeryOr404(surgeryId, res) {
  const surgery = await Surgery.findByPk(surgeryId, { include: surgeryInclude });
  if (!surgery) {
    res.status(404).json({ message: "Surgery not found" });
    return null;
  }
  return surgery;
}

router.get("/:surgeryId", async (req, res, next) => {
  try {
    const surgery = await getSurgeryOr404(req.params.surgeryId, res);
    if (!surgery) return;
    res.json(surgery);
  } catch (error) {
    next(error);
  }
});

router.put("/:surgeryId/pre-op", async (req, res, next) => {
  try {
    const surgery = await getSurgeryOr404(req.params.surgeryId, res);
    if (!surgery) return;

    const payload = {
      consentSigned: Boolean(req.body.consentSigned),
      npoConfirmed: Boolean(req.body.npoConfirmed),
      allergiesReviewed: Boolean(req.body.allergiesReviewed),
      siteMarked: Boolean(req.body.siteMarked),
      anesthesiaAssessmentCompleted: Boolean(req.body.anesthesiaAssessmentCompleted),
      bloodAvailabilityConfirmed: Boolean(req.body.bloodAvailabilityConfirmed),
      equipmentCheckCompleted: Boolean(req.body.equipmentCheckCompleted),
      remarks: req.body.remarks || null,
      completedAt: req.body.completedAt || new Date(),
      completedByUserId: req.user.id
    };

    const existing = await SurgeryPreOpChecklist.findOne({ where: { surgeryId: surgery.id } });
    if (existing) await existing.update(payload);
    else await SurgeryPreOpChecklist.create({ ...payload, surgeryId: surgery.id });

    const saved = await Surgery.findByPk(surgery.id, { include: surgeryInclude });
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

router.put("/:surgeryId/intra-op", async (req, res, next) => {
  try {
    const surgery = await getSurgeryOr404(req.params.surgeryId, res);
    if (!surgery) return;

    const payload = {
      anesthesiaType: req.body.anesthesiaType || null,
      procedureDetails: req.body.procedureDetails || null,
      estimatedBloodLossMl: req.body.estimatedBloodLossMl || null,
      complications: req.body.complications || null,
      spongeCountCorrect: req.body.spongeCountCorrect !== false,
      instrumentCountCorrect: req.body.instrumentCountCorrect !== false,
      specimenSent: Boolean(req.body.specimenSent),
      notes: req.body.notes || null,
      recordedAt: req.body.recordedAt || new Date(),
      recordedByUserId: req.user.id
    };

    const existing = await SurgeryIntraOpNote.findOne({ where: { surgeryId: surgery.id } });
    if (existing) await existing.update(payload);
    else await SurgeryIntraOpNote.create({ ...payload, surgeryId: surgery.id });

    const saved = await Surgery.findByPk(surgery.id, { include: surgeryInclude });
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

router.put("/:surgeryId/post-op", async (req, res, next) => {
  try {
    const surgery = await getSurgeryOr404(req.params.surgeryId, res);
    if (!surgery) return;

    const payload = {
      outcomeStatus: req.body.outcomeStatus || "Stable",
      postOpDiagnosis: req.body.postOpDiagnosis || null,
      disposition: req.body.disposition || "Ward",
      painScore: req.body.painScore || null,
      followUpPlan: req.body.followUpPlan || null,
      dischargeInstructions: req.body.dischargeInstructions || null,
      recordedAt: req.body.recordedAt || new Date(),
      recordedByUserId: req.user.id
    };

    const existing = await SurgeryPostOpOutcome.findOne({ where: { surgeryId: surgery.id } });
    if (existing) await existing.update(payload);
    else await SurgeryPostOpOutcome.create({ ...payload, surgeryId: surgery.id });

    const saved = await Surgery.findByPk(surgery.id, { include: surgeryInclude });
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
