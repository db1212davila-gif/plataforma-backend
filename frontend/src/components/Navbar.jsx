import React from 'react';

const Navbar = ({ user, workspace, activeTab, setActiveTab, onLogout }) => {
  const isSuperAdmin = user?.role === 'super_admin';
  
  // Menú para SUPER ADMIN
  const superAdminMenu = [
    { id: 'global_dashboard', label: '📊 Dashboard Global', icon: '🏠' },
    { id: 'clients', label: '👥 Clientes', icon: '🏢' },
    { id: 'workspaces', label: '🏭 Workspaces', icon: '📁' },
    { id: 'users', label: '👤 Usuarios', icon: '🧑' },
    { id: 'global_reports', label: '📈 Reportes Globales', icon: '📊' },
    { id: 'billing', label: '💰 Facturación', icon: '💳' },
    { id: 'system_settings', label: '⚙️ Configuración Sistema', icon: '🔧' },
    { id: 'audit_logs', label: '📝 Logs', icon: '📜' },
  ];
  
  // Menú para CLIENTE (empresa)
  const clientMenu = [
    { id: 'conversations', label: '💬 Conversaciones', icon: '💬' },
    { id: 'contacts', label: '📒 Contactos', icon: '👥' },
    { id: 'agents', label: '👥 Agentes', icon: '🧑‍💼' },
    { id: 'reports', label: '📊 Reportes', icon: '📈' },
    { id: 'settings', label: '⚙️ Configuración', icon: '🔧' },
    { id: 'billing', label: '💳 Facturación', icon: '💰' },
  ];
  
  const menu = isSuperAdmin ? superAdminMenu : clientMenu;
  
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0d1117',
      borderBottom: '1px solid #30363d',
      padding: '0 20px',
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🚀</span>
        <span style={{ fontWeight: 'bold', color: 'white' }}>
          {isSuperAdmin ? 'OmniConnect Admin' : (workspace?.name || 'OmniConnect')}
        </span>
      </div>
      
      {/* Menú principal */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              color: activeTab === item.id ? '#ffffff' : '#8b949e',
              backgroundColor: activeTab === item.id ? '#1f6feb' : 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
      
      {/* Usuario */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>
            {user?.name}
          </div>
          <div style={{ color: '#8b949e', fontSize: '11px' }}>
            {isSuperAdmin ? 'Super Admin' : user?.role}
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: 'none',
            border: '1px solid #30363d',
            padding: '6px 12px',
            borderRadius: '6px',
            color: '#c9d1d9',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;