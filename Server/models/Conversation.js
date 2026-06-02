const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  canal: { type: String, enum: ['whatsapp', 'telegram', 'messenger', 'instagram', 'email'], required: true },
  estado: { type: String, enum: ['open', 'pending', 'resolved'], default: 'open' },
  ultimoMensaje: { type: String, default: '' },
  ultimaActividad: { type: Date, default: Date.now },
  noLeidos: { type: Number, default: 0 },
  asignadoA: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
