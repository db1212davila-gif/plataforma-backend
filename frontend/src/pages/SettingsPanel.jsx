import React, { useState, useEffect } from 'react';

const SettingsPanel = ({ workspaceId, token }) => {
  const [settings, setSettings] = useState({ timezone: 'America/Santiago', language: 'es' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspaceId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setSettings(data.settings || { timezone: 'America/Santiago', language: 'es' });
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workspaces/${workspaceId}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: value })
      });
      if (response.ok) {
        alert('✅ Configuración actualizada');
        setSettings({ ...settings, [key]: value });
      }
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Cargando configuración...</div>;

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>⚙️ Configuración</h2>
      
      <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <h3>Preferencias Generales</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#8b949e' }}>Zona Horaria</label>
          <select
            value={settings.timezone}
            onChange={(e) => updateSetting('timezone', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: 'white' }}
          >
            <option value="America/Santiago">Chile (Santiago)</option>
            <option value="America/Mexico_City">México (Ciudad de México)</option>
            <option value="America/Bogota">Colombia (Bogotá)</option>
            <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>
            <option value="America/Lima">Perú (Lima)</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: '#8b949e' }}>Idioma</label>
          <select
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: 'white' }}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#161b22', padding: '20px', borderRadius: '12px' }}>
        <h3>Canales de Comunicación</h3>
        <p style={{ color: '#8b949e', fontSize: '12px' }}>Próximamente: Configuración de WhatsApp, Telegram y Messenger</p>
      </div>
    </div>
  );
};

export default SettingsPanel;