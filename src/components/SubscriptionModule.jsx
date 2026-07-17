import React from 'react';
import { Zap, Check, ArrowRight } from 'lucide-react';
import '../styles/subscription.css';

export default function SubscriptionModule({ user, planes, onUpgrade }) {
  const planActual = planes.find(p => p.id === user.plan);
  const porcentajeUso = (user.cotizacionesUsadas / planActual.cotizaciones) * 100;
  return (
    <div className="subscription-container">
      <div className="subscription-header">
        <h1 className="text-3xl font-bold">Mi Suscripción</h1>
        <p className="text-gray-500">Gestiona tu plan y acceso a CotizaSaaS</p>
      </div>
      <div className="current-plan card">
        <div className="plan-badge">Plan Actual</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{planActual.nombre}</h2>
        <p className="text-gray-600 mb-4">{planActual.descripcion}</p>
        <div className="plan-price">
          {planActual.precio === 0 ? (
            <span className="text-3xl font-bold text-success">Gratis</span>
          ) : (
            <>
              <span className="text-3xl font-bold text-accent">${planActual.precio.toLocaleString('es-CO')}</span>
              <span className="text-gray-500">/mes</span>
            </>
          )}
        </div>
        <div className="plan-features mb-6">
          <div className="feature-item">
            <Zap size={20} className="text-accent" />
            <span>{planActual.cotizaciones} cotizaciones/mes</span>
          </div>
          <div className="feature-item">
            <Check size={20} className="text-success" />
            <span>Cotizaciones ilimitadas</span>
          </div>
          <div className="feature-item">
            <Check size={20} className="text-success" />
            <span>Compartir y aceptar cotizaciones</span>
          </div>
          <div className="feature-item">
            <Check size={20} className="text-success" />
            <span>Descargar PDF profesional</span>
          </div>
        </div>
        <div className="usage-section">
          <div className="usage-header">
            <span className="font-semibold">Uso del Plan</span>
            <span className="text-sm text-gray-500">{Math.round(porcentajeUso)}%</span>
          </div>
          <div className="usage-bar">
            <div className={`usage-fill ${porcentajeUso > 80 ? 'critical' : porcentajeUso > 50 ? 'warning' : 'normal'}`} style={{ width: `${Math.min(porcentajeUso, 100)}%` }} />
          </div>
          <p className="text-sm text-gray-600 mt-2">{user.cotizacionesUsadas} de {planActual.cotizaciones} cotizaciones utilizadas</p>
        </div>
      </div>
      {user.plan === 'gratis' && (
        <div className="upgrade-plans">
          <h3 className="text-xl font-bold mb-4">Mejora tu Plan</h3>
          <div className="plans-grid">
            {planes.filter(p => p.id !== 'gratis').map((plan) => (
              <div key={plan.id} className="plan-card card">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.descripcion}</p>
                <div className="plan-price mb-4">
                  <span className="text-2xl font-bold text-accent">${plan.precio.toLocaleString('es-CO')}</span>
                  <span className="text-gray-500 text-sm">/mes</span>
                </div>
                <div className="plan-features mb-6">
                  <div className="feature-item">
                    <Zap size={18} className="text-accent" />
                    <span className="text-sm">{plan.cotizaciones} cotizaciones/mes</span>
                  </div>
                </div>
                <button onClick={() => onUpgrade(plan.id)} className="btn btn-primary btn-block">Cambiar a {plan.nombre} <ArrowRight size={16} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="card billing-info">
        <h3 className="card-title">📋 Información de Facturación</h3>
        <div className="billing-grid">
          <div className="billing-item">
            <span className="text-gray-600">Método de Pago</span>
            <span className="font-semibold">Wompi</span>
          </div>
          <div className="billing-item">
            <span className="text-gray-600">Renovación</span>
            <span className="font-semibold">Automática mensual</span>
          </div>
          <div className="billing-item">
            <span className="text-gray-600">Email de Factura</span>
            <span className="font-semibold">{user.email}</span>
          </div>
          <div className="billing-item">
            <span className="text-gray-600">Estado</span>
            <span className="badge badge-success">✓ Activo</span>
          </div>
        </div>
      </div>
      <div className="card help-section">
        <h3 className="font-bold mb-3">¿Necesitas ayuda?</h3>
        <p className="text-gray-600 text-sm mb-4">Si tienes preguntas sobre tu suscripción o necesitas cambiar de plan, contáctanos.</p>
        <a href="mailto:soporte@cotizasaas.com" className="btn btn-secondary">Contactar Soporte</a>
      </div>
    </div>
  );
}