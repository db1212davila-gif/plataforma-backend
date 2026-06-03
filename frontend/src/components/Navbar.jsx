import React from 'react';

const Navbar = ({ user, workspace, activeTab, setActiveTab, onLogout }) => {
  const isSuperAdmin = user?.role === 'super_admin';
  
  const superAdminMenu = [
    { id: 'global_dashboard', label: '📊 Dashboard Global', icon: '🏠' },
    { id: 'clients', label: '👥 Clientes', icon: '🏢' },
    { id: 'workspaces', label: '🏭 Workspaces', icon: '📁' },
    { id: 'users', label: '👤 Usuarios', icon: '🧑' },
  ];
  
  const clientMenu = [
    { id: 'conversations', label: '💬 Conversaciones', icon: '💬' },
    { id: 'pipeline', label: '📊 Pipeline', icon: '📊' },
    { id: 'scoring', label: '🎯 Scoring', icon: '🎯' },
    { id: 'contacts', label: '📒 Contactos', icon: '👥' },
    { id: 'agents', label: '👥 Agentes', icon: '🧑‍💼' },
    { id: 'reports', label: '📈 Reportes', icon: '📊' },
    { id: 'settings', label: '⚙️ Configuración', icon: '🔧' },
    { id: 'billing', label: '💰 Facturación', icon: '💰' },
  ];
  
  const menu = isSuperAdmin ? superAdminMenu : clientMenu;
  
  // Determinar si es móvil
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            zIndex: 1001,
            background: '#1f6feb',
            border: 'none',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ☰
        </button>
        <div style={{
          position: 'fixed',
          top: 0,
          left: menuOpen ? 0 : '-280px',
          width: '280px',
          height: '100vh',
          backgroundColor: '#0d1117',
          borderRight: '1px solid #30363d',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #30363d' }}>
            <h3 style={{ color: 'white', margin: 0 }}>{workspace?.name || 'OmniConnect'}</h3>
            <p style={{ color: '#8b949e', fontSize: '12px', margin: '5px 0 0' }}>{user?.name} • {user?.role}</p>
          </div>
          {menu.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMenuOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                marginBottom: '8px',
                borderRadius: '6px',
                backgroundColor: activeTab === item.id ? '#1f6feb' : 'transparent',
                color: activeTab === item.id ? '#ffffff' : '#8b949e',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '20px',
              borderRadius: '6px',
              backgroundColor: '#21262d',
              color: '#c9d1d9',
              border: '1px solid #30363d',
              cursor: 'pointer'
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </>
    );
  }

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🚀</span>
        <span style={{ fontWeight: 'bold', color: 'white' }}>
          {isSuperAdmin ? 'OmniConnect Admin' : (workspace?.name || 'OmniConnect')}
        </span>
      </div>
      
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {menu.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{user?.name}</div>
          <div style={{ color: '#8b949e', fontSize: '11px' }}>{user?.role}</div>
        </div>
        <button onClick={onLogout} style={{
          background: 'none',
          border: '1px solid #30363d',
          padding: '6px 12px',
          borderRadius: '6px',
          color: '#c9d1d9',
          cursor: 'pointer'
        }}>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;