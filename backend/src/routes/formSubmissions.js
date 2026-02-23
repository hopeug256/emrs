const express = require("express");
const {
  FormSubmission,
  FormTemplate,
  FormField,
  Patient,
  Visit,
  Encounter,
  User
} = require("../models");

const router = express.Router();

function parseFieldOptions(field) {
  if (!field.options) return [];
  try {
    const parsed = JSON.parse(field.options);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

router.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.formTemplateId) where.formTemplateId = req.query.formTemplateId;
    if (req.query.patientId) where.patientId = req.query.patientId;

    const submissions = await FormSubmission.findAll({
      where,
      include: [
        { model: FormTemplate, as: "template" },
        { model: Patient },
        { model: Visit },
        { model: Encounter },
        { model: User, as: "submittedBy" }
      ],
      order: [["submittedAt", "DESC"]]
    });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { formTemplateId, patientId, visitId, encounterId, data } = req.body;
    if (!formTemplateId || !data || typeof data !== "object") {
      return res.status(400).json({ message: "formTemplateId and data object are required" });
    }

    const template = await FormTemplate.findByPk(formTemplateId, {
      include: [{ model: FormField, as: "fields" }]
    });
    if (!template) return res.status(404).json({ message: "Template not found" });

    for (const field of template.fields || []) {
      const value = data[field.key];
      if (field.required && (value === undefined || value === null || value === "")) {
        return res.status(400).json({ message: `Missing required field: ${field.label}` });
      }
      if (field.type === "select" && value !== undefined && value !== null && value !== "") {
        const options = parseFieldOptions(field);
        if (options.length && !options.includes(value)) {
          return res.status(400).json({ message: `Invalid option for field: ${field.label}` });
        }
      }
    }

    const submission = await FormSubmission.create({
      formTemplateId,
      patientId: patientId || null,
      visitId: visitId || null,
      encounterId: encounterId || null,
      submittedByUserId: req.user?.id || null,
      data: JSON.stringify(data),
      submittedAt: new Date()
    });

    const saved = await FormSubmission.findByPk(submission.id, {
      include: [
        { model: FormTemplate, as: "template" },
        { model: Patient },
        { model: Visit },
        { model: Encounter },
        { model: User, as: "submittedBy" }
      ]
    });

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
