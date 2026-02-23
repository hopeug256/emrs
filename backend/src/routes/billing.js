const express = require("express");
const { Op } = require("sequelize");
const {
  ServiceCatalog,
  ServicePackage,
  PackageItem,
  PricingRule,
  ChargeItem,
  Invoice
} = require("../models");

const router = express.Router();

function toAmount(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

router.post("/price-preview", async (req, res, next) => {
  try {
    const { serviceCatalogId, servicePackageId, quantity = 1 } = req.body;
    const qty = Math.max(1, toAmount(quantity));
    let base = 0;
    let source = null;

    if (serviceCatalogId) {
      const service = await ServiceCatalog.findByPk(serviceCatalogId);
      if (!service) return res.status(404).json({ message: "Service not found" });
      base = toAmount(service.basePrice) * qty;
      source = { type: "Service", id: service.id, code: service.serviceCode, name: service.name };
    } else if (servicePackageId) {
      const pkg = await ServicePackage.findByPk(servicePackageId);
      if (!pkg) return res.status(404).json({ message: "Package not found" });
      base = toAmount(pkg.packagePrice) * qty;
      source = { type: "Package", id: pkg.id, code: pkg.packageCode, name: pkg.name };
    } else {
      return res.status(400).json({ message: "Provide serviceCatalogId or servicePackageId" });
    }

    const rules = await PricingRule.findAll({
      where: {
        active: true,
        [Op.or]: [
          { applyOn: source.type },
          { applyOn: "Invoice" }
        ]
      },
      order: [["createdAt", "ASC"]]
    });

    let running = base;
    const adjustments = rules.map((rule) => {
      const value = toAmount(rule.adjustmentValue);
      const delta =
        rule.adjustmentType === "Percentage"
          ? (running * value) / 100
          : value;
      running += delta;
      return {
        ruleCode: rule.ruleCode,
        name: rule.name,
        applyOn: rule.applyOn,
        adjustmentType: rule.adjustmentType,
        adjustmentValue: value,
        delta: Number(delta.toFixed(2))
      };
    });

    res.json({
      source,
      quantity: qty,
      baseAmount: Number(base.toFixed(2)),
      adjustments,
      finalAmount: Number(running.toFixed(2))
    });
  } catch (error) {
    next(error);
  }
});

router.post("/packages/:packageId/expand", async (req, res, next) => {
  try {
    const pkg = await ServicePackage.findByPk(req.params.packageId, {
      include: [{ model: PackageItem, as: "items", include: [ServiceCatalog] }]
    });
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const items = pkg.items.map((item) => {
      const quantity = toAmount(item.quantity);
      const linePrice = toAmount(item.linePrice);
      return {
        serviceCatalogId: item.serviceCatalogId,
        serviceCode: item.ServiceCatalog?.serviceCode || null,
        serviceName: item.ServiceCatalog?.name || null,
        quantity,
        unitPrice: linePrice,
        total: Number((quantity * linePrice).toFixed(2))
      };
    });

    const derivedTotal = items.reduce((sum, item) => sum + item.total, 0);
    res.json({
      packageId: pkg.id,
      packageCode: pkg.packageCode,
      packageName: pkg.name,
      configuredPackagePrice: Number(toAmount(pkg.packagePrice).toFixed(2)),
      expandedTotal: Number(derivedTotal.toFixed(2)),
      items
    });
  } catch (error) {
    next(error);
  }
});

router.post("/invoices/:invoiceId/recompute", async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const lines = await ChargeItem.findAll({ where: { invoiceId: invoice.id } });
    const gross = lines.reduce((sum, line) => sum + toAmount(line.totalAmount), 0);
    await invoice.update({ amount: Number(gross.toFixed(2)) });

    res.json({
      invoiceId: invoice.id,
      lineCount: lines.length,
      recomputedAmount: Number(gross.toFixed(2))
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
