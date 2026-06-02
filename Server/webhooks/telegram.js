const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Workspace = require('../models/Workspace');

router.post('/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const update = req.body;

    if (!update.message) return res.sendStatus(200);

    const chatId = update.message.chat.id.toString();
    const texto = update.message.text;
    const nombre = update.message.from.first_name + ' ' + (update.message.from.last_name || '');

    // Buscar o crear contacto
    let contact = await Contact.findOne({ workspace: workspaceId, channelId: chatId });
    if (!contact) {
      contact = await Contact.create({
        workspace: workspaceId,
        nombre: nombre,
        canal: 'telegram',
        channelId: chatId,
      });
    }

    // Buscar o crear conversacion
    let conversation = await Conversation.findOne({ workspace: workspaceId, contact: contact._id, canal: 'telegram' });
    if (!conversation) {
      conversation = await Conversation.create({
        workspace: workspaceId,
        contact: contact._id,
        canal: 'telegram',
        estado: 'open',
      });
    }

    // Guardar mensaje
    await Message.create({
      conversation: conversation._id,
      workspace: workspaceId,
      de: 'contact',
      texto: texto,
      canal: 'telegram',
    });

    // Actualizar conversacion
    await Conversation.findByIdAndUpdate(conversation._id, {
      ultimoMensaje: texto,
      ultimaActividad: Date.now(),
      noLeidos: conversation.noLeidos + 1,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('Error webhook Telegram:', err);
    res.sendStatus(500);
  }
});

module.exports = router;