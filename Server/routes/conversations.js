const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

// Obtener todas las conversaciones del workspace
router.get('/', authMiddleware, async (req, res) => {
  try {
    const conversations = await Conversation.find({ workspace: req.user.workspaceId })
      .populate('contact')
      .sort({ ultimaActividad: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cambiar estado de conversacion
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true }
    );
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener mensajes de una conversacion
router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ conversation: req.params.id })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enviar mensaje
router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const message = new Message({
      conversation: req.params.id,
      workspace: req.user.workspaceId,
      de: 'agent',
      texto: req.body.texto,
      canal: req.body.canal
    });
    await message.save();

    await Conversation.findByIdAndUpdate(req.params.id, {
      ultimoMensaje: req.body.texto,
      ultimaActividad: Date.now()
    });

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;