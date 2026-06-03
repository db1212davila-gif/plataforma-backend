// Verificar que el usuario sea SUPER_ADMIN
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    return next();
  }
  return res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de super administrador.' });
};

// Verificar que tenga acceso al workspace (super_admin puede acceder a todos)
const hasWorkspaceAccess = (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
  
  // Super admin tiene acceso a todo
  if (req.user && req.user.role === 'super_admin') {
    if (workspaceId) req.workspaceId = workspaceId;
    return next();
  }
  
  // Cliente normal solo a su workspace
  if (req.user && req.user.workspace && req.user.workspace.toString() === workspaceId) {
    req.workspaceId = workspaceId;
    return next();
  }
  
  return res.status(403).json({ error: 'No tienes acceso a este workspace' });
};

// Verificar rol mínimo requerido
const hasRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({ 
      error: `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}` 
    });
  };
};

// Verificar que el workspace no esté suspendido
const isWorkspaceActive = async (req, res, next) => {
  const workspaceId = req.params.workspaceId || req.body.workspaceId || req.query.workspaceId;
  
  if (!workspaceId) return next();
  
  const Workspace = require('../models/Workspace');
  const workspace = await Workspace.findById(workspaceId);
  
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace no encontrado' });
  }
  
  if (workspace.suspended) {
    return res.status(403).json({ error: 'Tu cuenta ha sido suspendida. Contacta al soporte.' });
  }
  
  req.workspace = workspace;
  next();
};

module.exports = { isSuperAdmin, hasWorkspaceAccess, hasRole, isWorkspaceActive };