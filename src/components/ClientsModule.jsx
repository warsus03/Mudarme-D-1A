import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import '../styles/clients.css';

export default function ClientsModule({ user, onAddClient }) {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', email: '', telefono: '', ciudad: '', empresa: '',
  });
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`clientes_${user.id}`) || '[]');
    setClientes(stored);
  }, [user.id]);
  const guardarCliente = () => {
    if (!formData.nombre) { alert('El nombre es obligatorio'); return; }
    let clientesActualizados;
    if (editingId) {
      clientesActualizados = clientes.map(c => c.id === editingId ? { ...formData, id: editingId } : c);
    } else {
      clientesActualizados = [...clientes, { ...formData, id: Date.now() }];
    }
    setClientes(clientesActualizados);
    localStorage.setItem(`clientes_${user.id}`, JSON.stringify(clientesActualizados));
    setFormData({ nombre: '', email: '', telefono: '', ciudad: '', empresa: '' });
    setShowForm(false);
    setEditingId(null);
  };
  const eliminarCliente = (id) => {
    if (confirm('¿Eliminar este cliente?')) {
      const clientesActualizados = clientes.filter(c => c.id !== id);
      setClientes(clientesActualizados);
      localStorage.setItem(`clientes_${user.id}`, JSON.stringify(clientesActualizados));
    }
  };
  const editarCliente = (cliente) => {
    setFormData(cliente);
    setEditingId(cliente.id);
    setShowForm(true);
  };
  const filteredClientes = clientes.filter(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="clients-container">
      <div className="clients-header">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-500">{clientes.length} cliente(s) registrado(s)</p>
        </div>
        <button onClick={() => { setFormData({ nombre: '', email: '', telefono: '', ciudad: '', empresa: '' }); setEditingId(null); setShowForm(true); }} className="btn btn-primary">
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>
      {showForm && (
        <div className="card clients-form">
          <h2 className="card-title">{editingId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
          <div className="form-grid">
            <div className="input-group">
              <label className="input-label">Nombre *</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="input-field" placeholder="Nombre del cliente" />
            </div>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" placeholder="cliente@email.com" />
            </div>
            <div className="input-group">
              <label className="input-label">Teléfono</label>
              <input type="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="input-field" placeholder="3125551234" />
            </div>
            <div className="input-group">
              <label className="input-label">Empresa</label>
              <input type="text" value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} className="input-field" placeholder="Nombre de empresa" />
            </div>
            <div className="input-group">
              <label className="input-label">Ciudad</label>
              <input type="text" value={formData.ciudad} onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })} className="input-field" placeholder="Bogotá" />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={guardarCliente} className="btn btn-success">✓ Guardar</button>
            <button onClick={() => { setShowForm(false); setEditingId(null); }} className="btn btn-secondary">✕ Cancelar</button>
          </div>
        </div>
      )}
      <div className="clients-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Buscar clientes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
      </div>
      {filteredClientes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3 className="empty-state-title">No hay clientes</h3>
          <p className="empty-state-text">Comienza agregando tu primer cliente</p>
        </div>
      ) : (
        <div className="clients-grid">
          {filteredClientes.map((cliente) => (
            <div key={cliente.id} className="client-card card">
              <div className="client-header">
                <h3 className="font-semibold text-gray-900">{cliente.nombre}</h3>
                <div className="client-actions">
                  <button onClick={() => editarCliente(cliente)} className="action-btn" title="Editar"><Edit2 size={16} /></button>
                  <button onClick={() => eliminarCliente(cliente.id)} className="action-btn danger" title="Eliminar"><Trash2 size={16} /></button>
                </div>
              </div>
              {cliente.empresa && <p className="text-sm text-gray-600 mb-3">{cliente.empresa}</p>}
              <div className="client-info">
                {cliente.email && <div className="info-item"><Mail size={16} /><a href={`mailto:${cliente.email}`} className="text-blue-600 hover:underline">{cliente.email}</a></div>}
                {cliente.telefono && <div className="info-item"><Phone size={16} /><a href={`tel:${cliente.telefono}`} className="text-blue-600 hover:underline">{cliente.telefono}</a></div>}
                {cliente.ciudad && <div className="info-item"><MapPin size={16} /><span>{cliente.ciudad}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}