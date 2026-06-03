const router = require('express').Router();
const { isSuperAdmin, hasWorkspaceAccess } = require('../middleware/roleMiddleware');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Todas estas rutas requieren SUPER_ADMIN
router.use(isSuperAdmin);

// Obtener todos los workspaces (todas las empresas)
router.get('/workspaces', async (req, res) => {
  try {
    const workspaces = await Workspace.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener workspace específico con detalles
router.get('/workspaces/:workspaceId', hasWorkspaceAccess, async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate('owner', 'name email')
      .populate('members.user', 'name email role');
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear workspace (cliente) manualmente
router.post('/workspaces', async (req, res) => {
  try {
    const { name, ownerEmail, plan } = req.body;
    
    let owner = await User.findOne({ email: ownerEmail });
    if (!owner) {
      return res.status(404).json({ error: 'Dueño no encontrado' });
    }
    
    const workspace = new Workspace({
      name,
      owner: owner._id,
      members: [{ user: owner._id, role: 'admin' }],
      plan: plan || 'free'
    });
    await workspace.save();
    
    owner.workspace = workspace._id;
    owner.role = 'admin';
    await owner.save();
    
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suspender workspace
router.patch('/workspaces/:workspaceId/suspend', async (req, res) => {
  try {
    const { suspended } = req.body;
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.workspaceId,
      { suspended },
      { new: true }
    );
    res.json({ success: true, suspended: workspace.suspended });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar workspace (soft delete)
router.delete('/workspaces/:workspaceId', async (req, res) => {
  try {
    await Workspace.findByIdAndDelete(req.params.workspaceId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los usuarios (con filtro por rol)
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role && role !== 'all') filter.role = role;
    
    const users = await User.find(filter).select('-password').populate('workspace', 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Estadísticas globales
router.get('/stats/global', async (req, res) => {
  try {
    const totalWorkspaces = await Workspace.countDocuments();
    const activeWorkspaces = await Workspace.countDocuments({ suspended: false });
    const suspendedWorkspaces = await Workspace.countDocuments({ suspended: true });
    const totalUsers = await User.countDocuments();
    const totalConversations = await Conversation.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    res.json({
      totalWorkspaces,
      activeWorkspaces,
      suspendedWorkspaces,
      totalUsers,
      totalConversations,
      totalMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener métricas por workspace
router.get('/metrics/workspace/:workspaceId', async (req, res) => {
  try {
    const conversations = await Conversation.find({ workspace: req.params.workspaceId });
    const messages = await Message.find({ conversation: { $in: conversations.map(c => c._id) } });
    
    res.json({
      totalConversations: conversations.length,
      totalMessages: messages.length,
      openConversations: conversations.filter(c => c.status === 'open').length,
      resolvedConversations: conversations.filter(c => c.status === 'resolved').length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;