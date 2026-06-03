import React, { useState, useEffect } from 'react';

const AgentsPanel = ({ workspaceId, token, userRole }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('agent');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspaceId}/members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setAgents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setLoading(false);
    }
  };

  const inviteAgent = async () => {
    if (!newAgentEmail) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspaceId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: newAgentEmail, role: newAgentRole })
      });
      if (response.ok) {
        alert('✅ Agente invitado correctamente');
        setNewAgentEmail('');
        fetchAgents();
      } else {
        const error = await response.json();
        alert('❌ Error: ' + error.error);
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Cargando agentes...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>👥 Gestión de Agentes</h2>
      
      {userRole === 'admin' && (
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
          <h3>Invitar nuevo agente</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Email del agente"
              value={newAgentEmail}
              onChange={(e) => setNewAgentEmail(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: 'white' }}
            />
            <select
              value={newAgentRole}
              onChange={(e) => setNewAgentRole(e.target.value)}
              style={{ padding: '10px', borderRadius: '6px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: 'white' }}
            >
              <option value="agent">Agente</option>
              <option value="viewer">Viewer (solo lectura)</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={inviteAgent} style={{ padding: '10px 20px', backgroundColor: '#238636', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>Invitar</button>
          </div>
        </div>
      )}
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #30363d' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e' }}>Rol</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#8b949e' }}>Ingresó</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.user?._id} style={{ borderBottom: '1px solid #21262d' }}>
                <td style={{ padding: '12px', color: 'white' }}>{agent.user?.name || 'N/A'}</td>
                <td style={{ padding: '12px', color: '#c9d1d9' }}>{agent.user?.email}</td>
                <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#21262d', padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>{agent.role}</span></td>
                <td style={{ padding: '12px', fontSize: '12px', color: '#8b949e' }}>{new Date(agent.joinedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AgentsPanel;