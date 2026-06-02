const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  de: { type: String, enum: ['contact', 'agent', 'bot'], required: true },
  texto: { type: String, required: true },
  canal: { type: String, enum: ['whatsapp', 'telegram', 'messenger', 'instagram', 'email'] },
  leido: { type: Boolean, default: false },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);