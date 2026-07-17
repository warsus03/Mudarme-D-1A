import React, { useState } from 'react';
import { Save, Palette } from 'lucide-react';
import '../styles/settings.css';

export default function SettingsModule({ user, empresa, onSave }) {
  const [formData, setFormData] = useState({
    nombreEmpresa: empresa.nombre || '',
    identificacion: empresa.identificacion || '',
    telefono: empresa.telefono || '',
    email: empresa.email || '',
    ciudad: empresa.ciudad || '',
    direccion: empresa.direccion || '',
    logoUrl: empresa.logoUrl || '',
    impuestoDefault: empresa.impuestoDefault || 19,
    moneda: empresa.moneda || 'COP',
    colorPrimario: empresa.colorPrimario || '#4f46e5',
  });
  const handleGuardar = () => { onSave(formData); };
  return (
    <div className="settings-container">
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      <div className="settings-grid">
        <div className="card settings-card">
          <h2 className="card-title">🏢 Datos de Empresa</h2>
          <div className="input-group">
            <label className="input-label">Nombre de Empresa</label>
            <input type="text" value={formData.nombreEmpresa} onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })} className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">NIT / Identificación</label>
            <input type="text" value={formData.identificacion} onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })} className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">Teléfono</label>
            <input type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">Ciudad</label>
            <input type="text" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">Dirección</label>
            <input type="text" value={formData.direccion} onChange={(e) => setFormData({ ...formData, direccion: e.target.value })} className="input-field" />
          </div>
        </div>
        <div className="card settings-card">
          <h2 className="card-title">🎨 Logo y Branding</h2>
          <div className="input-group">
            <label className="input-label">URL del Logo</label>
            <input type="url" value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} className="input-field" placeholder="https://ejemplo.com/logo.png" />
          </div>
          {formData.logoUrl && (
            <div className="logo-preview">
              <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
              <img src={formData.logoUrl} alt="Logo" className="logo-image" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
          <div className="input-group">
            <label className="input-label"><Palette size={16} className="inline mr-2" />Color Primario</label>
            <div className="color-picker-group">
              <input type="color" value={formData.colorPrimario} onChange={(e) => setFormData({ ...formData, colorPrimario: e.target.value })} className="color-picker" />
              <input type="text" value={formData.colorPrimario} onChange={(e) => setFormData({ ...formData, colorPrimario: e.target.value })} className="input-field" placeholder="#4f46e5" />
            </div>
          </div>
        </div>
        <div className="card settings-card">
          <h2 className="card-title">💰 Facturación</h2>
          <div className="input-group">
            <label className="input-label">Impuesto por Defecto (%)</label>
            <input type="number" value={formData.impuestoDefault} onChange={(e) => setFormData({ ...formData, impuestoDefault: parseFloat(e.target.value) })} className="input-field" step="0.1" />
          </div>
          <div className="input-group">
            <label className="input-label">Moneda</label>
            <select value={formData.moneda} onChange={(e) => setFormData({ ...formData, moneda: e.target.value })} className="input-field">
              <option value="COP">COP - Peso Colombiano</option>
              <option value="USD">USD - Dólar Americano</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>
        </div>
        <div className="card settings-card">
          <h2 className="card-title">👤 Información de Cuenta</h2>
          <div className="info-box">
            <p className="text-xs text-gray-500">Email de Registro</p>
            <p className="font-semibold text-gray-900">{user.email}</p>
          </div>
          <div className="info-box">
            <p className="text-xs text-gray-500">Fecha de Registro</p>
            <p className="font-semibold text-gray-900">{new Date(user.id).toLocaleDateString('es-CO')}</p>
          </div>
          <div className="info-box">
            <p className="text-xs text-gray-500">ID de Usuario</p>
            <p className="font-mono text-sm text-gray-600">{user.id}</p>
          </div>
        </div>
      </div>
      <div className="settings-actions">
        <button onClick={handleGuardar} className="btn btn-success btn-lg"><Save size={20} /> Guardar Cambios</button>
      </div>
    </div>
  );
}