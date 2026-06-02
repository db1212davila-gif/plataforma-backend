const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  channels: {
    whatsapp: { apiKey: String, enabled: { type: Boolean, default: false } },
    telegram: { botToken: String, enabled: { type: Boolean, default: false } },
    messenger: { pageAccessToken: String, enabled: { type: Boolean, default: false } }
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'agent'], default: 'agent' }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Workspace', workspaceSchema);