import React, { useState } from 'react';
import { Search, Download, Share2, Eye, Trash2, Copy, CheckCircle, Clock } from 'lucide-react';
import '../styles/list.css';

export default function QuotationsList({ cotizaciones, planes, user, onDelete, onShare, onView, onExport, onDuplicate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('todos');
  const planActual = planes.find(p => p.id === user.plan);
  const filteredCotizaciones = cotizaciones.filter(cot => {
    const matchSearch = cot.numero.toLowerCase().includes(searchTerm.toLowerCase()) || (cot.cliente || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (filterState === 'aceptada') return matchSearch && cot.aceptada;
    if (filterState === 'pendiente') return matchSearch && !cot.aceptada;
    return matchSearch;
  });
  const calcularTotal = (items, impuesto) => {
    const subtotal = items.reduce((sum, item) => sum + item.cantidad * item.valorUnitario, 0);
    const impuestoMonto = subtotal * (impuesto / 100);
    return subtotal + impuestoMonto;
  };
  if (cotizaciones.length === 0) {
    return <div className="quotations-container"><div className="empty-state"><div className="empty-state-icon">📄</div><h3 className="empty-state-title">No hay cotizaciones aún</h3><p className="empty-state-text">Comienza creando tu primera cotización profesional</p></div></div>;
  }
  return (
    <div className="quotations-container">
      <div className="quotations-header">
        <h1 className="text-2xl font-bold">Cotizaciones</h1>
        <p className="text-gray-500">{cotizaciones.length} total • {user.cotizacionesUsadas}/{planActual.cotizaciones} usadas</p>
      </div>
      <div className="quotations-filters">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Buscar por número o cliente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
        </div>
        <div className="filter-buttons">
          <button onClick={() => setFilterState('todos')} className={`filter-btn ${filterState === 'todos' ? 'active' : ''}`}>Todos</button>
          <button onClick={() => setFilterState('pendiente')} className={`filter-btn ${filterState === 'pendiente' ? 'active' : ''}`}><Clock size={16} /> Pendientes</button>
          <button onClick={() => setFilterState('aceptada')} className={`filter-btn ${filterState === 'aceptada' ? 'active' : ''}`}><CheckCircle size={16} /> Aceptadas</button>
        </div>
      </div>
      <div className="quotations-table-wrapper">
        <table className="quotations-table">
          <thead>
            <tr>
              <th>Cotización</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Válida hasta</th>
              <th className="text-right">Total</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCotizaciones.slice().reverse().map((cot) => {
              const total = calcularTotal(cot.items, cot.impuesto);
              return (
                <tr key={cot.id} className="quotation-row">
                  <td className="font-mono font-semibold text-accent">{cot.numero}</td>
                  <td className="font-medium">{cot.cliente || <span className="text-gray-400">Sin cliente</span>}</td>
                  <td className="text-sm text-gray-600">{new Date(cot.fecha).toLocaleDateString('es-CO')}</td>
                  <td className="text-sm text-gray-600">{cot.validaHasta ? new Date(cot.validaHasta).toLocaleDateString('es-CO') : '-'}</td>
                  <td className="text-right font-semibold">${total.toLocaleString('es-CO', { minimumFractionDigits: 0 })}</td>
                  <td>{cot.aceptada ? <span className="badge badge-success">✓ Aceptada</span> : <span className="badge badge-pending">⏱ Pendiente</span>}</td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <button onClick={() => onExport(cot)} className="action-btn" title="Descargar PDF"><Download size={16} /></button>
                      <button onClick={() => onShare(cot)} className="action-btn" title="Compartir"><Share2 size={16} /></button>
                      <button onClick={() => onDuplicate(cot)} className="action-btn" title="Duplicar"><Copy size={16} /></button>
                      <button onClick={() => onDelete(cot.id)} className="action-btn danger" title="Eliminar"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredCotizaciones.length === 0 && <div className="empty-state"><p className="empty-state-text">No se encontraron cotizaciones con esos criterios</p></div>}
    </div>
  );
}