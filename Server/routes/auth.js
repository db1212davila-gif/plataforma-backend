const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Contact = require('../models/Contact'); // ← NUEVO

// ============================================================
// Función para obtener contactos de ejemplo según el rubro
// ============================================================
const getSampleContacts = (workspaceName) => {
  const name = workspaceName.toLowerCase();
  
  if (name.includes('pizzeria') || name.includes('pizza') || name.includes('sabor')) {
    return [
      { name: "Juan Pérez", channel: "whatsapp", channelId: "+593961234567", phoneNumber: "+593961234567" },
      { name: "María González", channel: "telegram", channelId: "@maria_g", username: "@maria_g" },
      { name: "Carlos López", channel: "whatsapp", channelId: "+593987654321", phoneNumber: "+593987654321" },
      { name: "Ana Martínez", channel: "messenger", channelId: "ana.mtz", username: "ana.mtz" }
    ];
  }
  
  if (name.includes('ferreteria') || name.includes('martillo')) {
    return [
      { name: "Roberto Gómez", channel: "whatsapp", channelId: "+593971234567", phoneNumber: "+593971234567" },
      { name: "Carmen Rojas", channel: "telegram", channelId: "@carmen_r", username: "@carmen_r" },
      { name: "José Castillo", channel: "whatsapp", channelId: "+593982345678", phoneNumber: "+593982345678" }
    ];
  }
  
  if (name.includes('clinica') || name.includes('dental') || name.includes('sonrisa')) {
    return [
      { name: "Patricia Vega", channel: "whatsapp", channelId: "+593978901234", phoneNumber: "+593978901234" },
      { name: "Andrés Solano", channel: "telegram", channelId: "@andres_s", username: "@andres_s" },
      { name: "Marcela Jiménez", channel: "whatsapp", channelId: "+593989012345", phoneNumber: "+593989012345" }
    ];
  }
  
  // Contactos genéricos para cualquier otra empresa
  return [
    { name: "Cliente Ejemplo 1", channel: "whatsapp", channelId: "+593900000001", phoneNumber: "+593900000001" },
    { name: "Cliente Ejemplo 2", channel: "telegram", channelId: "@cliente2", username: "@cliente2" }
  ];
};

// ============================================================
// Registro de nuevo usuario con workspace y contactos de ejemplo
// ============================================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, workspaceName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      role: 'admin'
    });
    await user.save();
    
    const workspace = new Workspace({
      name: workspaceName || `${name}'s Workspace`,
      owner: user._id,
      members: [{ user: user._id, role: 'admin' }]
    });
    await workspace.save();
    
    // Actualizar usuario con workspace asignado
    user.workspace = workspace._id;
    await user.save();
    
    // ============================================================
    // NUEVO: Crear contactos de ejemplo para esta empresa
    // ============================================================
    const sampleContacts = getSampleContacts(workspaceName || workspace.name);
    for (const contactData of sampleContacts) {
      const contact = new Contact({
        ...contactData,
        workspace: workspace._id
      });
      await contact.save();
    }
    console.log(`✅ Contactos de ejemplo creados para workspace: ${workspace.name}`);
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        workspaceId: workspace._id,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        workspace: user.workspace
      },
      workspace: {
        id: workspace._id,
        name: workspace.name
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
// Login (sin cambios)
// ============================================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    let workspace = null;
    let workspaceId = null;
    
    if (user.role === 'super_admin') {
      workspaceId = null;
    } else {
      workspace = await Workspace.findOne({ owner: user._id });
      if (!workspace && user.workspace) {
        workspace = await Workspace.findById(user.workspace);
      }
      if (workspace) {
        workspaceId = workspace._id;
      }
    }
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        workspaceId: workspaceId,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
        workspace: user.workspace
      },
      workspace: workspace ? {
        id: workspace._id,
        name: workspace.name
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;