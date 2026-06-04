const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// ============================================================
// MODIFICADO: Ahora recibe workspaceId como parámetro
// ============================================================

// Obtener todos los contactos del workspace
router.get('/:workspaceId', async (req, res) => {
  try {
    const contacts = await Contact.find({ workspace: req.params.workspaceId })
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear contacto (recibe workspaceId como parámetro)
router.post('/:workspaceId', async (req, res) => {
  try {
    const contact = new Contact({
      workspace: req.params.workspaceId,
      name: req.body.name,
      channel: req.body.channel,
      channelId: req.body.channelId,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email
    });
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un contacto por ID
router.get('/:workspaceId/:contactId', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;