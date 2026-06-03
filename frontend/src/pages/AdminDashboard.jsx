import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ user, token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/stats/global`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '40px' }}>Cargando dashboard global...</div>;
  }

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>📊 Dashboard Global</h2>
      <p style={{ color: '#8b949e', marginBottom: '30px' }}>
        Bienvenido, {user?.name}. Aquí puedes ver todas las empresas y métricas globales.
      </p>

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
    </div>
  );
};

export default AdminDashboard;