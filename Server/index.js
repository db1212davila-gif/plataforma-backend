require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const contactRoutes = require('./routes/contacts');

// Webhooks
const whatsappWebhook = require('./webhooks/whatsapp');
const telegramWebhook = require('./webhooks/telegram');

app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/contacts', contactRoutes);

app.use('/webhook/whatsapp', whatsappWebhook);
app.use('/webhook/telegram', telegramWebhook);

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error MongoDB:', err));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});