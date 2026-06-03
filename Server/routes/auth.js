const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Workspace = require('../models/Workspace');

// Registro de nuevo usuario con workspace
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
      role: 'admin' // El primer usuario de la empresa es admin
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
    res.status(500).json({ error: error.message });
  }
});

// Login
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
    
    // Super admin no tiene workspace
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