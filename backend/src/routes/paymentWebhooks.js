const express = require("express");
const crypto = require("crypto");
const { PaymentGatewayTransaction, Invoice, Payment } = require("../models");

const router = express.Router();

function getWebhookSecret(gateway) {
  const perGateway = process.env[`PAYMENT_WEBHOOK_SECRET_${String(gateway || "").toUpperCase()}`];
  return perGateway || process.env.PAYMENT_WEBHOOK_SECRET || "dev-webhook-secret";
}

function verifySignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) return false;
  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const normalized = String(signature).replace(/^sha256=/i, "").trim();
  try {
    return crypto.timingSafeEqual(Buffer.from(digest, "utf8"), Buffer.from(normalized, "utf8"));
  } catch {
    return false;
  }
}

router.post("/:gateway", async (req, res, next) => {
  try {
    const gateway = req.params.gateway;
    const signature = req.headers["x-signature"] || req.headers["x-emrs-signature"] || req.headers["x-webhook-signature"];
    const secret = getWebhookSecret(gateway);
    const isValid = verifySignature(req.rawBody, signature, secret);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid webhook signature" });
    }

    const {
      transactionNumber,
      externalReference,
      status,
      amount,
      invoiceId,
      patientId
    } = req.body || {};

    if (!transactionNumber && !externalReference) {
      return res.status(400).json({ message: "transactionNumber or externalReference is required" });
    }

    const tx = await PaymentGatewayTransaction.findOne({
      where: transactionNumber ? { transactionNumber } : { externalReference }
    });

    if (!tx) {
      return res.status(404).json({ message: "Gateway transaction not found" });
    }

    await tx.update({
      status: status || tx.status,
      responsePayload: JSON.stringify(req.body || {}),
      processedAt: new Date()
    });

    if ((status || "").toLowerCase() === "captured" || (status || "").toLowerCase() === "success") {
      const resolvedInvoiceId = invoiceId || tx.invoiceId;
      const resolvedPatientId = patientId || tx.patientId;
      const payment = await Payment.create({
        paymentNumber: `PAY-WEB-${Date.now()}`,
        invoiceId: resolvedInvoiceId,
        patientId: resolvedPatientId,
        amount: amount || tx.amount,
        method: "MobileMoney",
        status: "Completed",
        paidAt: new Date(),
        reference: tx.externalReference || tx.transactionNumber
      });
      await tx.update({ paymentId: payment.id });
      const invoice = await Invoice.findByPk(resolvedInvoiceId);
      if (invoice) await invoice.update({ status: "Paid" });
    }

    res.json({ message: "Webhook processed", gateway, transactionId: tx.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
