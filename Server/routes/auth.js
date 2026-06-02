const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Workspace = require('../models/Workspace');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, workspaceName } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    const workspace = new Workspace({
      name: workspaceName || `${name}'s Workspace`,
      owner: user._id,
      members: [{ user: user._id, role: 'admin' }]
    });
    await workspace.save();
    
    const token = jwt.sign(
      { userId: user._id, workspaceId: workspace._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ token, user, workspace });
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
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    const workspace = await Workspace.findOne({ owner: user._id });
    const token = jwt.sign(
      { userId: user._id, workspaceId: workspace._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user, workspace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;