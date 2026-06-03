import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, token }) => {
  const [stats, setStats] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchWorkspaces();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/stats/global`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/workspaces`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWorkspaces(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      setLoading(false);
    }
  };

  const toggleSuspend = async (workspaceId, currentStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/workspaces/${workspaceId}/suspend`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ suspended: !currentStatus })
      });
      if (response.ok) {
        fetchWorkspaces();
      }
    } catch (error) {
      console.error('Error toggling suspend:', error);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Cargando dashboard global...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>📊 Dashboard Global</h2>
      <p style={{ color: '#8b949e', marginBottom: '30px' }}>
        Bienvenido, {user?.name}. Aquí puedes ver todas las empresas y métricas globales.
      </p>

      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f6feb' }}>{stats?.totalWorkspaces || 0}</div>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>Total Empresas</div>
        </div>
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#238636' }}>{stats?.activeWorkspaces || 0}</div>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>Activas</div>
        </div>
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#da3633' }}>{stats?.suspendedWorkspaces || 0}</div>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>Suspendidas</div>
        </div>
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', border: '1px solid #30363d' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f0883e' }}>{stats?.totalUsers || 0}</div>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>Usuarios</div>
        </div>
      </div>

      {/* Tabla de empresas */}
      <h3 style={{ marginBottom: '15px' }}>🏢 Empresas Registradas</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363d', textAlign: 'left' }}>
              <th style={{ padding: '12px', color: '#8b949e' }}>Nombre</th>
              <th style={{ padding: '12px', color: '#8b949e' }}>Dueño</th>
              <th style={{ padding: '12px', color: '#8b949e' }}>Plan</th>
              <th style={{ padding: '12px', color: '#8b949e' }}>Estado</th>
              <th style={{ padding: '12px', color: '#8b949e' }}>Creado</th>
              <th style={{ padding: '12px', color: '#8b949e' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {workspaces.map(ws => (
              <tr key={ws._id} style={{ borderBottom: '1px solid #21262d' }}>
                <td style={{ padding: '12px', fontWeight: 500 }}>{ws.name}</td>
                <td style={{ padding: '12px', color: '#c9d1d9' }}>{ws.owner?.name || 'N/A'}</td>
                <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#21262d', padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>{ws.plan}</span></td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: ws.suspended ? '#da3633' : '#238636' }}>
                    {ws.suspended ? 'Suspendida' : 'Activa'}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#8b949e' }}>
                  {new Date(ws.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => toggleSuspend(ws._id, ws.suspended)}
                    style={{
                      backgroundColor: ws.suspended ? '#238636' : '#da3633',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
                  >
                    {ws.suspended ? 'Activar' : 'Suspender'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;