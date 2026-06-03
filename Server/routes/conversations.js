const router = require('express').Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const auth = require('../middleware/auth');
const { hasWorkspaceAccess } = require('../middleware/roleMiddleware');

// Obtener conversaciones del workspace
router.get('/:workspaceId', auth, hasWorkspaceAccess, async (req, res) => {
  try {
    const conversations = await Conversation.find({ workspace: req.params.workspaceId })
      .populate('contact')
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener conversación específica con mensajes
router.get('/:workspaceId/:conversationId', auth, hasWorkspaceAccess, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.conversationId,
      workspace: req.params.workspaceId
    }).populate('contact').populate('assignedTo', 'name email');
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }
    
    const messages = await Message.find({ conversation: conversation._id }).sort({ timestamp: 1 });
    res.json({ conversation, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar conversación
router.patch('/:workspaceId/:conversationId', auth, hasWorkspaceAccess, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.conversationId, workspace: req.params.workspaceId },
      { status, assignedTo, updatedAt: new Date() },
      { new: true }
    );
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;