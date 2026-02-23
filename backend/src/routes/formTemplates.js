const express = require("express");
const { FormTemplate, FormField } = require("../models");

const router = express.Router();

function normalizeFields(fields = []) {
  return fields.map((field, index) => ({
    label: field.label,
    key: field.key,
    type: field.type,
    required: Boolean(field.required),
    options: Array.isArray(field.options) ? JSON.stringify(field.options) : field.options || null,
    orderIndex: Number.isInteger(field.orderIndex) ? field.orderIndex : index
  }));
}

router.get("/", async (req, res, next) => {
  try {
    const templates = await FormTemplate.findAll({
      include: [{ model: FormField, as: "fields" }],
      order: [["createdAt", "DESC"]]
    });
    res.json(templates);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const template = await FormTemplate.findByPk(req.params.id, {
      include: [{ model: FormField, as: "fields" }]
    });
    if (!template) return res.status(404).json({ message: "Template not found" });
    res.json(template);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, description, status, fields = [] } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const template = await FormTemplate.create({
      name,
      description,
      status: status || "Draft",
      version: 1
    });

    if (fields.length) {
      await FormField.bulkCreate(
        normalizeFields(fields).map((field) => ({ ...field, formTemplateId: template.id }))
      );
    }

    const saved = await FormTemplate.findByPk(template.id, {
      include: [{ model: FormField, as: "fields" }]
    });
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const template = await FormTemplate.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });

    const { name, description, status, fields } = req.body;

    await template.update({
      name: name ?? template.name,
      description: description ?? template.description,
      status: status ?? template.status,
      version: fields ? template.version + 1 : template.version
    });

    if (Array.isArray(fields)) {
      await FormField.destroy({ where: { formTemplateId: template.id } });
      if (fields.length) {
        await FormField.bulkCreate(
          normalizeFields(fields).map((field) => ({ ...field, formTemplateId: template.id }))
        );
      }
    }

    const saved = await FormTemplate.findByPk(template.id, {
      include: [{ model: FormField, as: "fields" }]
    });
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/publish", async (req, res, next) => {
  try {
    const template = await FormTemplate.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    await template.update({ status: "Published" });
    res.json(template);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const template = await FormTemplate.findByPk(req.params.id);
    if (!template) return res.status(404).json({ message: "Template not found" });
    await template.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;

