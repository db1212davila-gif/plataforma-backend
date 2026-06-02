const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Verificacion de webhook (requerido por Meta)
router.get('/:workspaceId', (req, res) => {
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'mi_token_verificacion';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Recibir mensajes
router.post('/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') return res.sendStatus(200);

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) return res.sendStatus(200);

    const msg = messages[0];
    const telefono = msg.from;
    const texto = msg.text?.body || '';
    const nombre = value?.contacts?.[0]?.profile?.name || telefono;

    // Buscar o crear contacto
    let contact = await Contact.findOne({ workspace: workspaceId, channelId: telefono });
    if (!contact) {
      contact = await Contact.create({
        workspace: workspaceId,
        nombre: nombre,
        canal: 'whatsapp',
        channelId: telefono,
        telefono: telefono,
      });
    }

    // Buscar o crear conversacion
    let conversation = await Conversation.findOne({ workspace: workspaceId, contact: contact._id, canal: 'whatsapp' });
    if (!conversation) {
      conversation = await Conversation.create({
        workspace: workspaceId,
        contact: contact._id,
        canal: 'whatsapp',
        estado: 'open',
      });
    }

    // Guardar mensaje
    await Message.create({
      conversation: conversation._id,
      workspace: workspaceId,
      de: 'contact',
      texto: texto,
      canal: 'whatsapp',
    });

    // Actualizar conversacion
    await Conversation.findByIdAndUpdate(conversation._id, {
      ultimoMensaje: texto,
      ultimaActividad: Date.now(),
      noLeidos: conversation.noLeidos + 1,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('Error webhook WhatsApp:', err);
    res.sendStatus(500);
  }
});

module.exports = router;