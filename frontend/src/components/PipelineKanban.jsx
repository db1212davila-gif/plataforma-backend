import React, { useState, useEffect } from 'react';

const PipelineKanban = ({ workspaceId, token }) => {
  const [leads, setLeads] = useState({});
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState(null);
  const [currentMobileStage, setCurrentMobileStage] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const stages = [
    { id: 'lead', name: '🟣 Lead', color: '#a855f7', description: 'Contacto inicial' },
    { id: 'contacted', name: '🔵 Contactado', color: '#3b82f6', description: 'Primer contacto' },
    { id: 'opportunity', name: '🟡 Oportunidad', color: '#eab308', description: 'Interés real' },
    { id: 'negotiation', name: '🟠 Negociación', color: '#f97316', description: 'Cerrando trato' },
    { id: 'customer', name: '🟢 Cliente', color: '#22c55e', description: 'Venta cerrada' },
    { id: 'lost', name: '⚪ Perdido', color: '#6b7280', description: 'No concretado' }
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [workspaceId]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leads/${workspaceId}/kanban`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setLeads(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLoading(false);
    }
  };

  const handleDragStart = (lead, stageId) => {
    setDraggedLead({ lead, sourceStage: stageId });
  };

  const handleDrop = async (targetStageId) => {
    if (!draggedLead || draggedLead.sourceStage === targetStageId) return;
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leads/${workspaceId}/${draggedLead.lead._id}/stage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stage: targetStageId })
      });
      
      if (response.ok) {
        await fetchLeads();
      }
    } catch (error) {
      console.error('Error moving lead:', error);
    }
    setDraggedLead(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  const nextStage = () => {
    if (currentMobileStage < stages.length - 1) {
      setCurrentMobileStage(currentMobileStage + 1);
    }
  };

  const prevStage = () => {
    if (currentMobileStage > 0) {
      setCurrentMobileStage(currentMobileStage - 1);
    }
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '40px', textAlign: 'center' }}>Cargando canalización...</div>;
  }

  // ============================================================
  // VISTA MÓVIL: CARRUSEL
  // ============================================================
  if (isMobile) {
    const currentStage = stages[currentMobileStage];
    const currentLeads = leads[currentStage.id] || [];
    
    return (
      <div style={{ padding: '16px', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
        {/* Título y navegación */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={prevStage}
            disabled={currentMobileStage === 0}
            style={{
              background: currentMobileStage === 0 ? '#21262d' : '#1f6feb',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              fontSize: '20px',
              cursor: currentMobileStage === 0 ? 'not-allowed' : 'pointer',
              opacity: currentMobileStage === 0 ? 0.5 : 1
            }}
          >
            ◀
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{currentStage.name}</div>
            <div style={{ fontSize: '12px', color: '#8b949e' }}>{currentStage.description}</div>
            <div style={{ fontSize: '11px', color: currentStage.color, marginTop: '4px' }}>
              {currentLeads.length} {currentLeads.length === 1 ? 'lead' : 'leads'}
            </div>
          </div>
          
          <button
            onClick={nextStage}
            disabled={currentMobileStage === stages.length - 1}
            style={{
              background: currentMobileStage === stages.length - 1 ? '#21262d' : '#1f6feb',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: 'white',
              fontSize: '20px',
              cursor: currentMobileStage === stages.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentMobileStage === stages.length - 1 ? 0.5 : 1
            }}
          >
            ▶
          </button>
        </div>

        {/* Puntos indicadores */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {stages.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentMobileStage(idx)}
              style={{
                width: currentMobileStage === idx ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentMobileStage === idx ? stages[idx].color : '#30363d',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

        {/* Tarjetas de leads */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {currentLeads.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#8b949e',
              padding: '40px',
              backgroundColor: '#161b22',
              borderRadius: '16px',
              border: '1px dashed #30363d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <div>No hay leads en esta etapa</div>
              <div style={{ fontSize: '12px', marginTop: '8px' }}>Arrastra desde otra columna</div>
            </div>
          ) : (
            currentLeads.map(lead => (
              <div
                key={lead._id}
                draggable
                onDragStart={() => handleDragStart(lead, currentStage.id)}
                style={{
                  backgroundColor: '#0d1117',
                  border: `1px solid ${currentStage.color}40`,
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: 'grab'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${getScoreColor(lead.score)}, ${currentStage.color})`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {lead.contact?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', color: 'white' }}>{lead.contact?.name || 'Sin nombre'}</div>
                      <div style={{ fontSize: '11px', color: '#8b949e' }}>{lead.contact?.channel || 'N/A'}</div>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: getScoreColor(lead.score),
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {lead.score}%
                  </div>
                </div>
                
                <div style={{ fontSize: '12px', color: '#c9d1d9', marginBottom: '8px' }}>
                  📧 {lead.contact?.channelId || 'Sin contacto'}
                </div>
                
                {lead.estimatedValue > 0 && (
                  <div style={{ fontSize: '13px', color: '#f0883e', marginBottom: '8px' }}>
                    💰 ${lead.estimatedValue}
                  </div>
                )}
                
                <div style={{ fontSize: '10px', color: '#6e7681' }}>
                  Última actividad: {new Date(lead.lastActivity).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // VISTA ESCRITORIO: KANBAN NORMAL
  // ============================================================
  return (
    <div style={{ padding: '20px', height: 'calc(100vh - 70px)', overflowX: 'auto' }}>
      <h2 style={{ color: 'white', marginBottom: '20px', fontSize: '20px' }}>📊 Canalización de Ventas</h2>
      
      <div style={{ display: 'flex', gap: '16px', minWidth: '900px', height: 'calc(100% - 60px)' }}>
        {stages.map(stage => (
          <div
            key={stage.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage.id)}
            style={{
              flex: 1,
              minWidth: '280px',
              backgroundColor: '#161b22',
              borderRadius: '16px',
              border: `1px solid ${stage.color}30`,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{
              padding: '14px 16px',
              backgroundColor: `${stage.color}15`,
              borderBottom: `2px solid ${stage.color}`,
              fontWeight: 'bold',
              color: 'white'
            }}>
              {stage.name}
              <span style={{
                marginLeft: '8px',
                backgroundColor: '#30363d',
                padding: '2px 8px',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                {(leads[stage.id] || []).length}
              </span>
            </div>
            
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
              {(leads[stage.id] || []).map(lead => (
                <div
                  key={lead._id}
                  draggable
                  onDragStart={() => handleDragStart(lead, stage.id)}
                  style={{
                    backgroundColor: '#0d1117',
                    border: '1px solid #30363d',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '10px',
                    cursor: 'grab',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: 'white' }}>{lead.contact?.name || 'Sin nombre'}</strong>
                    <span style={{
                      backgroundColor: getScoreColor(lead.score),
                      padding: '2px 8px',
                      borderRadius: '20px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {lead.score}%
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '4px' }}>
                    📧 {lead.contact?.channelId || 'Sin contacto'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6e7681' }}>
                    Última actividad: {new Date(lead.lastActivity).toLocaleDateString()}
                  </div>
                  {lead.estimatedValue > 0 && (
                    <div style={{ fontSize: '11px', color: '#f0883e', marginTop: '8px' }}>
                      💰 ${lead.estimatedValue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineKanban;