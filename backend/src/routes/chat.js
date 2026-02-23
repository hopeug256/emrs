const express = require("express");
const { Op } = require("sequelize");
const { ChatThread, ChatThreadParticipant, ChatMessage, User } = require("../models");
const { publishChatMessage } = require("../services/chatRealtime");

const router = express.Router();

router.get("/my-threads", async (req, res, next) => {
  try {
    const memberships = await ChatThreadParticipant.findAll({
      where: { userId: req.user.id },
      include: [{ model: ChatThread }],
      order: [["createdAt", "DESC"]]
    });
    res.json(memberships.map((item) => item.ChatThread).filter(Boolean));
  } catch (error) {
    next(error);
  }
});

router.post("/threads", async (req, res, next) => {
  try {
    const { title, threadType = "Direct", participantUserIds = [] } = req.body;
    const uniqueParticipants = [...new Set([req.user.id, ...participantUserIds])];
    if (!uniqueParticipants.length) {
      return res.status(400).json({ message: "At least one participant is required" });
    }
    const thread = await ChatThread.create({
      threadNumber: `THR-${Date.now()}`,
      title: title || "Clinical Chat",
      threadType
    });
    for (const userId of uniqueParticipants) {
      await ChatThreadParticipant.create({
        chatThreadId: thread.id,
        userId,
        role: userId === req.user.id ? "Owner" : "Member"
      });
    }
    const saved = await ChatThread.findByPk(thread.id, {
      include: [{ model: ChatThreadParticipant, as: "participants", include: [User] }]
    });
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

router.get("/threads/:threadId/messages", async (req, res, next) => {
  try {
    const membership = await ChatThreadParticipant.findOne({
      where: { chatThreadId: req.params.threadId, userId: req.user.id }
    });
    if (!membership) return res.status(403).json({ message: "Not a participant in this thread" });
    const messages = await ChatMessage.findAll({
      where: { chatThreadId: req.params.threadId },
      include: [{ model: User, as: "sender" }],
      order: [["sentAt", "ASC"]],
      limit: 500
    });
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

router.post("/threads/:threadId/messages", async (req, res, next) => {
  try {
    const membership = await ChatThreadParticipant.findOne({
      where: { chatThreadId: req.params.threadId, userId: req.user.id }
    });
    if (!membership) return res.status(403).json({ message: "Not a participant in this thread" });
    if (!req.body.body) return res.status(400).json({ message: "Message body is required" });

    const message = await ChatMessage.create({
      messageNumber: `MSG-${Date.now()}`,
      chatThreadId: req.params.threadId,
      senderUserId: req.user.id,
      body: req.body.body,
      messageType: "Text",
      sentAt: new Date()
    });
    const saved = await ChatMessage.findByPk(message.id, { include: [{ model: User, as: "sender" }] });

    const participants = await ChatThreadParticipant.findAll({
      where: { chatThreadId: req.params.threadId },
      attributes: ["userId"]
    });
    publishChatMessage(
      participants.map((item) => item.userId),
      {
        type: "chat.message",
        threadId: req.params.threadId,
        message: saved
      }
    );

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

router.get("/search-users", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q) return res.json([]);
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${q}%` } },
          { fullName: { [Op.like]: `%${q}%` } }
        ]
      },
      attributes: ["id", "username", "fullName", "role"],
      limit: 20
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
