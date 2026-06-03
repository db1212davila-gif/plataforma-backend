const nodemailer = require('nodemailer');

// Configurar el transporter (usando Gmail como ejemplo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // tu correo Gmail
    pass: process.env.EMAIL_PASS  // contraseña o app password
  }
});

// Función para enviar email
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"OmniConnect CRM" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>📧 OmniConnect CRM</h2>
              <p><strong>Mensaje nuevo:</strong></p>
              <p>${text}</p>
              <hr>
              <p style="font-size: 12px; color: #666;">Mensaje enviado desde OmniConnect CRM</p>
             </div>`
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };