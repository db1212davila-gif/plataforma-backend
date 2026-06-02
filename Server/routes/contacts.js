const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const authMiddleware = require('../middleware/auth');

// Obtener todos los contactos del workspace
router.get('/', authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({ workspace: req.user.workspaceId })
      .sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear contacto
router.post('/', authMiddleware, async (req, res) => {
  try {
    const contact = new Contact({
      workspace: req.user.workspaceId,
      nombre: req.body.nombre,
      canal: req.body.canal,
      channelId: req.body.channelId,
      telefono: req.body.telefono,
      email: req.body.email,
    });
    await contact.save();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un contacto
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;