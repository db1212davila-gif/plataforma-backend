import React, { useState, useEffect } from 'react';

const ReportsPanel = ({ workspaceId, token }) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leads/${workspaceId}/metrics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setLoading(false);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Cargando reportes...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>📈 Reportes y Analytics</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f6feb' }}>{metrics?.hotLeads || 0}</div>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>Leads Calientes</div>
        </div>
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#f0883e' }}>${metrics?.pipelineValue || 0}</div>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>Valor del Pipeline</div>
        </div>
        <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>{metrics?.stages?.customer || 0}</div>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>Clientes Convertidos</div>
        </div>
      </div>
      
      <h3>Embudo de Ventas</h3>
      <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px' }}>
        {metrics?.stages && Object.entries(metrics.stages).map(([stage, count]) => (
          <div key={stage} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>{stage}</span>
              <span>{count} leads</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#30363d', borderRadius: '4px' }}>
              <div style={{ width: `${(count / Math.max(...Object.values(metrics.stages))) * 100}%`, height: '8px', backgroundColor: '#1f6feb', borderRadius: '4px' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPanel;