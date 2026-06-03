const router = require('express').Router();
const { hasRole, hasWorkspaceAccess, isWorkspaceActive } = require('../middleware/roleMiddleware');
const Workspace = require('../models/Workspace');
const User = require('../models/User');

// Obtener el workspace del usuario autenticado
router.get('/me', async (req, res) => {
  try {
    if (req.user.role === 'super_admin') {
      return res.json({ isSuperAdmin: true, workspaces: await Workspace.find() });
    }
    
    const workspace = await Workspace.findById(req.user.workspace);
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener workspace específico (solo si tiene acceso)
router.get('/:workspaceId', hasWorkspaceAccess, isWorkspaceActive, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate('members.user', 'name email');
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar configuración de canales (solo admin del workspace)
router.patch('/:workspaceId/channels', hasWorkspaceAccess, hasRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { channel, config } = req.body;
    const workspace = await Workspace.findById(req.params.workspaceId);
    
    if (workspace.channels[channel]) {
      workspace.channels[channel] = { ...workspace.channels[channel], ...config };
      await workspace.save();
      res.json({ success: true, channel: workspace.channels[channel] });
    } else {
      res.status(400).json({ error: 'Canal no válido' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Invitar miembro al workspace (solo admin)
router.post('/:workspaceId/members', hasWorkspaceAccess, hasRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { email, role } = req.body;
    const workspace = await Workspace.findById(req.params.workspaceId);
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const isMember = workspace.members.some(m => m.user.toString() === user._id.toString());
    if (isMember) {
      return res.status(400).json({ error: 'El usuario ya es miembro' });
    }
    
    workspace.members.push({ user: user._id, role: role || 'agent' });
    user.workspace = workspace._id;
    user.role = role || 'agent';
    await user.save();
    await workspace.save();
    
    res.json({ success: true, member: { user, role: role || 'agent' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener miembros del workspace
router.get('/:workspaceId/members', hasWorkspaceAccess, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate('members.user', 'name email role');
    res.json(workspace.members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;