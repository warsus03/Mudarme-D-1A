import React from 'react';
import { Plus, TrendingUp, Users, DollarSign, Calendar, FileText } from 'lucide-react';
import '../styles/dashboard.css';

export default function Dashboard({ user, empresa, cotizaciones, planes, onNewQuotation }) {
  const planActual = planes.find(p => p.id === user.plan);
  const porcentajeUso = (user.cotizacionesUsadas / planActual.cotizaciones) * 100;
  
  const totalCotizado = cotizaciones.reduce((sum, cot) => {
    const items = cot.items || [];
    const subtotal = items.reduce((s, item) => s + (item.cantidad * item.valorUnitario), 0);
    return sum + subtotal;
  }, 0);

  const clientesUnicos = new Set(cotizaciones.map(c => c.cliente)).size;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="text-3xl font-bold">Bienvenido, {empresa.nombre}</h1>
          <p className="text-gray-500 mt-1">Tu espacio de trabajo está listo</p>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onNewQuotation}>
          <Plus size={20} /> Nueva Cotización
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Cotizaciones Creadas</span>
            <FileText size={20} className="stat-icon primary" />
          </div>
          <div className="stat-value">{cotizaciones.length}</div>
          <div className="stat-subtext">Plan: {planActual.cotizaciones} disponibles</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Clientes</span>
            <Users size={20} className="stat-icon accent" />
          </div>
          <div className="stat-value">{clientesUnicos}</div>
          <div className="stat-subtext">Contactos únicos</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Valor Cotizado</span>
            <DollarSign size={20} className="stat-icon success" />
          </div>
          <div className="stat-value">${(totalCotizado / 1000000).toFixed(1)}M</div>
          <div className="stat-subtext">Subtotal en cotizaciones</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Plan Actual</span>
            <TrendingUp size={20} className="stat-icon warning" />
          </div>
          <div className="stat-value">{planActual.nombre}</div>
          <div className="stat-subtext">
            {planActual.precio === 0 ? 'Gratis' : `$${planActual.precio.toLocaleString('es-CO')}/mes`}
          </div>
        </div>
      </div>

      <div className="dashboard-usage">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Uso del Plan</h2>
          <div className="usage-bar">
            <div 
              className={`usage-fill ${porcentajeUso > 80 ? 'critical' : porcentajeUso > 50 ? 'warning' : 'normal'}`}
              style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
            />
          </div>
          <div className="usage-text">
            <span>{user.cotizacionesUsadas} de {planActual.cotizaciones} cotizaciones usadas</span>
            <span className="font-semibold">{Math.round(porcentajeUso)}%</span>
          </div>
          {porcentajeUso > 80 && (
            <p className="usage-warning">⚠️ Estás usando más del 80% de tu límite</p>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3 className="font-semibold mb-3">Últimas Cotizaciones</h3>
          {cotizaciones.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay cotizaciones aún</p>
          ) : (
            <ul className="space-y-2">
              {cotizaciones.slice(-5).reverse().map((cot) => (
                <li key={cot.id} className="flex justify-between text-sm py-2 border-b">
                  <span className="font-mono text-accent">{cot.numero}</span>
                  <span className="text-gray-600">{cot.cliente || 'Sin cliente'}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Información Rápida</h3>
          <div className="quick-info">
            <div className="info-item">
              <span className="info-label">NIT:</span>
              <span className="font-mono">{empresa.identificacion}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span>{empresa.telefono}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="text-accent">{empresa.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ciudad:</span>
              <span>{empresa.ciudad}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}