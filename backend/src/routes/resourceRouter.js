const express = require("express");

function createResourceRouter(model, options = {}) {
  const router = express.Router();
  const include = options.include || [];
  const searchFields = options.searchFields || [];
  const createRequired = options.createRequired || [];

  router.get("/", async (req, res, next) => {
    try {
      const { q } = req.query;
      const where = {};
      if (q && searchFields.length) {
        const { Op } = require("sequelize");
        where[Op.or] = searchFields.map((field) => ({
          [field]: { [Op.like]: `%${q}%` }
        }));
      }
      const items = await model.findAll({
        where,
        include,
        order: [["createdAt", "DESC"]]
      });
      res.json(items);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const item = await model.findByPk(req.params.id, { include });
      if (!item) {
        return res.status(404).json({ message: "Record not found" });
      }
      res.json(item);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const missing = createRequired.filter((field) => !req.body[field]);
      if (missing.length) {
        return res
          .status(400)
          .json({ message: `Missing required fields: ${missing.join(", ")}` });
      }
      const created = await model.create(req.body);
      const saved = await model.findByPk(created.id, { include });
      res.status(201).json(saved);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const item = await model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Record not found" });
      }
      await item.update(req.body);
      const saved = await model.findByPk(req.params.id, { include });
      res.json(saved);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const item = await model.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Record not found" });
      }
      await item.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = createResourceRouter;

