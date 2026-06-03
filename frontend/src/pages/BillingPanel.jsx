import React from 'react';

const BillingPanel = ({ workspace, user }) => {
  const plans = [
    { id: 'free', name: 'Free', price: 0, features: ['1 agente', '100 conversaciones/mes', '2 canales'] },
    { id: 'basic', name: 'Básico', price: 29, features: ['3 agentes', 'Conversaciones ilimitadas', '5 canales', 'Soporte email'] },
    { id: 'pro', name: 'Pro', price: 99, features: ['10 agentes', 'Conversaciones ilimitadas', 'Todos los canales', 'Soporte prioritario', 'Reportes avanzados'] },
    { id: 'enterprise', name: 'Enterprise', price: 299, features: ['Agentes ilimitados', 'Conversaciones ilimitadas', 'Todos los canales', 'Soporte 24/7', 'API personalizada', 'SLA garantizado'] }
  ];

  const currentPlan = plans.find(p => p.id === workspace?.plan) || plans[0];

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>💰 Facturación</h2>
      
      <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
        <h3>Plan Actual: {currentPlan.name}</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f6feb' }}>${currentPlan.price}/mes</p>
        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
          {currentPlan.features.map(f => <li key={f}>{f}</li>)}
        </ul>
      </div>
      
      <h3>Planes Disponibles</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {plans.map(plan => (
          <div key={plan.id} style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', border: workspace?.plan === plan.id ? '2px solid #1f6feb' : '1px solid #30363d' }}>
            <h3>{plan.name}</h3>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f6feb' }}>${plan.price}/mes</p>
            <ul style={{ paddingLeft: '20px', fontSize: '12px', marginBottom: '20px' }}>
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
            {workspace?.plan !== plan.id && (
              <button style={{ width: '100%', padding: '10px', backgroundColor: '#238636', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>
                Cambiar a {plan.name}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingPanel;