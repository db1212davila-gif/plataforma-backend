const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  nombre: { type: String, required: true },
  canal: { type: String, enum: ['whatsapp', 'telegram', 'messenger', 'instagram', 'email'], required: true },
  channelId: { type: String, required: true },
  avatar: { type: String, default: '' },
  telefono: { type: String, default: '' },
  email: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);