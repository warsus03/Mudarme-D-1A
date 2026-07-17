import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import ProductRow from './ProductRow';
import '../styles/quotation.css';

export default function NewQuotation({ 
  user, 
  empresa, 
  onSave, 
  onCancel,
  planes 
}) {
  const [cotizacion, setCotizacion] = useState({
    numero: 'COT-' + Date.now().toString().slice(-6),
    fecha: new Date().toISOString().split('T')[0],
    cliente: '',
    telefonoCliente: '',
    emailCliente: '',
    ciudad: '',
    validaHasta: '',
    impuesto: 19,
    descuentoGeneral: 0,
    observaciones: '',
    items: [{ 
      id: 1, 
      cantidad: 1, 
      nombre: '', 
      unidad: 'unit',
      valorUnitario: 0,
      descuento: 0
    }],
  });

  const agregarFila = () => {
    const nuevoId = Math.max(...cotizacion.items.map(i => i.id), 0) + 1;
    setCotizacion({
      ...cotizacion,
      items: [...cotizacion.items, { 
        id: nuevoId, 
        cantidad: 1, 
        nombre: '', 
        unidad: 'unit',
        valorUnitario: 0,
        descuento: 0
      }],
    });
  };

  const actualizarItem = (id, campo, valor) => {
    setCotizacion({
      ...cotizacion,
      items: cotizacion.items.map(item =>
        item.id === id 
          ? { ...item, [campo]: isNaN(valor) ? valor : parseFloat(valor) } 
          : item
      ),
    });
  };

  const eliminarFila = (id) => {
    if (cotizacion.items.length > 1) {
      setCotizacion({
        ...cotizacion,
        items: cotizacion.items.filter(item => item.id !== id),
      });
    }
  };

  const duplicarFila = (item) => {
    const nuevoId = Math.max(...cotizacion.items.map(i => i.id), 0) + 1;
    setCotizacion({
      ...cotizacion,
      items: [...cotizacion.items, { ...item, id: nuevoId }],
    });
  };

  const calcularTotales = () => {
    const subtotal = cotizacion.items.reduce((sum, item) => {
      const total = item.cantidad * item.valorUnitario;
      const descuento = total * (item.descuento / 100);
      return sum + (total - descuento);
    }, 0);

    const descuentoGeneral = subtotal * (cotizacion.descuentoGeneral / 100);
    const subtotalFinal = subtotal - descuentoGeneral;
    const impuesto = subtotalFinal * (cotizacion.impuesto / 100);
    const total = subtotalFinal + impuesto;

    return { subtotal, descuentoGeneral, subtotalFinal, impuesto, total };
  };

  const { subtotal, descuentoGeneral, subtotalFinal, impuesto, total } = calcularTotales();

  const handleGuardar = () => {
    if (!cotizacion.cliente || cotizacion.items.some(i => !i.nombre)) {
      alert('Por favor completa al menos el nombre del cliente y descripción de productos');
      return;
    }
    onSave(cotizacion);
  };

  return (
    <div className="quotation-container">
      <div className="quotation-header">
        <div>
          <h1 className="text-3xl font-bold">Nueva Cotización</h1>
          <p className="text-gray-500">{cotizacion.numero}</p>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
      </div>

      <div className="quotation-grid">
        <div className="card quotation-card">
          <h2 className="card-title">📋 Datos de Empresa</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 font-semibold">Nombre</p>
              <p className="font-semibold">{empresa.nombre}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">NIT</p>
              <p className="font-mono text-sm">{empresa.identificacion}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Teléfono</p>
              <p className="text-sm">{empresa.telefono}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Email</p>
              <p className="text-sm text-blue-600">{empresa.email}</p>
            </div>
          </div>
        </div>

        <div className="card quotation-card">
          <h2 className="card-title">👤 Datos del Cliente</h2>
          <div className="input-group">
            <label className="input-label">Nombre del Cliente</label>
            <input type="text" value={cotizacion.cliente} onChange={(e) => setCotizacion({ ...cotizacion, cliente: e.target.value })} className="input-field" placeholder="Ej: Juan García" />
          </div>
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" value={cotizacion.emailCliente} onChange={(e) => setCotizacion({ ...cotizacion, emailCliente: e.target.value })} className="input-field" placeholder="cliente@email.com" />
          </div>
          <div className="input-group">
            <label className="input-label">Teléfono</label>
            <input type="tel" value={cotizacion.telefonoCliente} onChange={(e) => setCotizacion({ ...cotizacion, telefonoCliente: e.target.value })} className="input-field" placeholder="3125551234" />
          </div>
          <div className="input-group">
            <label className="input-label">Ciudad</label>
            <input type="text" value={cotizacion.ciudad} onChange={(e) => setCotizacion({ ...cotizacion, ciudad: e.target.value })} className="input-field" placeholder="Bogotá" />
          </div>
        </div>

        <div className="card quotation-card">
          <h2 className="card-title">📅 Fechas</h2>
          <div className="input-group">
            <label className="input-label">Fecha de Cotización</label>
            <input type="date" value={cotizacion.fecha} onChange={(e) => setCotizacion({ ...cotizacion, fecha: e.target.value })} className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">Válida hasta</label>
            <input type="date" value={cotizacion.validaHasta} onChange={(e) => setCotizacion({ ...cotizacion, validaHasta: e.target.value })} className="input-field" />
          </div>
        </div>

        <div className="card quotation-card">
          <h2 className="card-title">💰 Impuestos y Descuentos</h2>
          <div className="input-group">
            <label className="input-label">Impuesto (%)</label>
            <input type="number" value={cotizacion.impuesto} onChange={(e) => setCotizacion({ ...cotizacion, impuesto: parseFloat(e.target.value) })} className="input-field" step="0.1" />
          </div>
          <div className="input-group">
            <label className="input-label">Descuento General (%)</label>
            <input type="number" value={cotizacion.descuentoGeneral} onChange={(e) => setCotizacion({ ...cotizacion, descuentoGeneral: parseFloat(e.target.value) })} className="input-field" step="0.1" min="0" />
          </div>
        </div>
      </div>

      <div className="card quotation-products">
        <h2 className="card-title mb-4">📦 Productos y Servicios</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Descripción</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Cant.</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Unidad</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">V. Unitario</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Desc. %</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {cotizacion.items.map((item) => (
                <ProductRow key={item.id} item={item} onUpdate={actualizarItem} onDelete={eliminarFila} onDuplicate={duplicarFila} canDelete={cotizacion.items.length > 1} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 border-t rounded-b-lg">
          <button onClick={agregarFila} className="btn btn-primary">
            <Plus size={18} /> Agregar línea
          </button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">📝 Observaciones</h2>
        <textarea value={cotizacion.observaciones} onChange={(e) => setCotizacion({ ...cotizacion, observaciones: e.target.value })} placeholder="Agregar notas, términos, condiciones o información adicional..." className="input-field" rows="4" />
      </div>

      <div className="quotation-totals">
        <div className="total-card">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
        </div>
        {cotizacion.descuentoGeneral > 0 && (
          <div className="total-card discount">
            <span>Descuento ({cotizacion.descuentoGeneral}%)</span>
            <span>-${descuentoGeneral.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
          </div>
        )}
        <div className="total-card">
          <span>Subtotal Final</span>
          <span>${subtotalFinal.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
        </div>
        <div className="total-card">
          <span>Impuesto ({cotizacion.impuesto}%)</span>
          <span>${impuesto.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
        </div>
        <div className="total-card total-final">
          <span>TOTAL</span>
          <span>${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</span>
        </div>
      </div>

      <div className="quotation-actions">
        <button onClick={handleGuardar} className="btn btn-success btn-lg">✓ Guardar Cotización</button>
        <button onClick={onCancel} className="btn btn-secondary btn-lg">✕ Cancelar</button>
      </div>
    </div>
  );
}