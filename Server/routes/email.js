const router = require('express').Router();
const { sendEmail } = require('../services/emailService');
const auth = require('../middleware/auth');

// Enviar email desde el dashboard
router.post('/send', auth, async (req, res) => {
  try {
    const { to, subject, message } = req.body;
    
    const result = await sendEmail(to, subject, message);
    
    if (result.success) {
      res.json({ success: true, message: 'Email enviado correctamente' });
    } else {
      res.status(500).json({ error: result.error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;