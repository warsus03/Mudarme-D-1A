import React, { useState, useEffect } from 'react';
import { storage } from './firebase-config';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import NewQuotation from './components/NewQuotation';
import QuotationsList from './components/QuotationsList';
import ClientsModule from './components/ClientsModule';
import SettingsModule from './components/SettingsModule';
import SubscriptionModule from './components/SubscriptionModule';
import './styles/theme.css';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [pantalla, setPantalla] = useState('login');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registroData, setRegistroData] = useState({
    email: '', password: '', confirmPassword: '', nombreEmpresa: '',
    identificacion: '', telefono: '', ciudad: '', logoFile: null,
  });
  const planes = [
    { id: 'gratis', nombre: 'Gratis', cotizaciones: 50, precio: 0, color: 'gray', descripcion: 'Perfecto para probar' },
    { id: 'premium', nombre: 'Premium', cotizaciones: 100, precio: 10000, color: 'blue', descripcion: 'Para pequeños negocios' },
    { id: 'elite', nombre: 'Elite', cotizaciones: 1000, precio: 50000, color: 'purple', descripcion: 'Para empresas grandes' },
  ];

  const showToast = (message, type = 'success') => { setToast({ message, type }); };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) { showToast('Por favor completa todos los campos', 'error'); return; }
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioEncontrado = usuarios.find(u => u.email === loginData.email && u.password === loginData.password);
    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
      setEmpresa(usuarioEncontrado.empresa);
      setCotizaciones(usuarioEncontrado.cotizaciones || []);
      setPantalla('dashboard');
      showToast('¡Bienvenido!', 'success');
    } else {
      showToast('Email o contraseña incorrectos', 'error');
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (registroData.password !== registroData.confirmPassword) { showToast('Las contraseñas no coinciden', 'error'); return; }
    if (!registroData.email || !registroData.password || !registroData.nombreEmpresa) { showToast('Por favor completa los campos obligatorios', 'error'); return; }
    try {
      let logoUrl = '';
      if (registroData.logoFile) {
        const logoRef = ref(storage, `logos/${registroData.email}-${Date.now()}.png`);
        await uploadBytes(logoRef, registroData.logoFile);
        logoUrl = await getDownloadURL(logoRef);
      }
      const nuevoUsuario = {
        id: Date.now(),
        email: registroData.email,
        password: registroData.password,
        plan: 'gratis',
        cotizacionesUsadas: 0,
        empresa: {
          nombre: registroData.nombreEmpresa,
          identificacion: registroData.identificacion,
          telefono: registroData.telefono,
          ciudad: registroData.ciudad,
          email: registroData.email,
          direccion: '',
          logoUrl,
        },
        cotizaciones: [],
      };
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      setUsuario(nuevoUsuario);
      setEmpresa(nuevoUsuario.empresa);
      setPantalla('dashboard');
      showToast('¡Registro exitoso!', 'success');
    } catch (error) {
      console.error('Error en registro:', error);
      showToast('Error al registrarse', 'error');
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setEmpresa(null);
    setCotizaciones([]);
    setPantalla('login');
    setLoginData({ email: '', password: '' });
    setSidebarOpen(false);
  };

  const guardarCotizacion = (nuevaCot) => {
    const planActual = planes.find(p => p.id === usuario.plan);
    if (usuario.cotizacionesUsadas >= planActual.cotizaciones) { showToast(`Has alcanzado el límite de ${planActual.cotizaciones} cotizaciones`, 'error'); return; }
    const cotizacionGuardada = { ...nuevaCot, id: Date.now(), empresaId: usuario.id, fechaCreacion: new Date().toISOString(), idPublico: null, enlacePublico: null, aceptada: false };
    const nuevasCotizaciones = [...cotizaciones, cotizacionGuardada];
    setCotizaciones(nuevasCotizaciones);
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
    if (usuarioIndex !== -1) {
      usuarios[usuarioIndex].cotizaciones = nuevasCotizaciones;
      usuarios[usuarioIndex].cotizacionesUsadas = usuario.cotizacionesUsadas + 1;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      setUsuario({ ...usuario, cotizacionesUsadas: usuario.cotizacionesUsadas + 1 });
    }
    showToast('✓ Cotización guardada correctamente', 'success');
    setPantalla('cotizaciones');
  };

  const eliminarCotizacion = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cotización?')) {
      const nuevasCotizaciones = cotizaciones.filter(c => c.id !== id);
      setCotizaciones(nuevasCotizaciones);
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
      if (usuarioIndex !== -1) { usuarios[usuarioIndex].cotizaciones = nuevasCotizaciones; localStorage.setItem('usuarios', JSON.stringify(usuarios)); }
      showToast('Cotización eliminada', 'success');
    }
  };

  const duplicarCotizacion = (cot) => {
    const cotizacionDuplicada = { ...cot, id: Date.now(), numero: 'COT-' + Date.now().toString().slice(-6), fecha: new Date().toISOString().split('T')[0] };
    const nuevasCotizaciones = [...cotizaciones, cotizacionDuplicada];
    setCotizaciones(nuevasCotizaciones);
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
    if (usuarioIndex !== -1) { usuarios[usuarioIndex].cotizaciones = nuevasCotizaciones; localStorage.setItem('usuarios', JSON.stringify(usuarios)); }
    showToast('Cotización duplicada', 'success');
  };

  const exportarPDF = (cot) => {
    const { subtotal, impuestoMonto, total } = calcularTotales(cot.items, cot.impuesto);
    const htmlContent = `<div style="font-family: Arial, sans-serif; width: 8.5in; height: 11in; padding: 0.5in; box-sizing: border-box; background: white; color: #333;"><div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px;"><div>${empresa.logoUrl ? `<img src="${empresa.logoUrl}" style="height: 60px; object-fit: contain; margin-bottom: 10px;" alt="Logo">` : ''}<h1 style="margin: 0; color: #1f2937; font-size: 24px; font-weight: bold;">${empresa.nombre}</h1><p style="margin: 5px 0 0 0; color: #6b7280; font-size: 12px;">NIT: ${empresa.identificacion}</p></div><div style="background: #4f46e5; color: white; padding: 20px; border-radius: 8px; text-align: center; font-weight: bold;"><div style="font-size: 20px; margin-bottom: 5px;">COTIZACIÓN</div><div style="font-size: 16px; font-family: monospace;">#${cot.numero}</div></div></div><table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px;"><thead><tr style="background: #4f46e5; color: white;"><th style="padding: 10px; text-align: left; font-weight: bold;">Descripción</th><th style="padding: 10px; text-align: center; font-weight: bold;">Cant.</th><th style="padding: 10px; text-align: right; font-weight: bold;">V. Unitario</th><th style="padding: 10px; text-align: right; font-weight: bold;">Total</th></tr></thead><tbody>${cot.items.map(item => `<tr style="border: 1px solid #e5e7eb;"><td style="padding: 8px; border: 1px solid #e5e7eb;">${item.nombre || '-'}</td><td style="padding: 8px; text-align: center; border: 1px solid #e5e7eb;">${item.cantidad}</td><td style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">$${item.valorUnitario.toLocaleString('es-CO')}</td><td style="padding: 8px; text-align: right; border: 1px solid #e5e7eb;">$${(item.cantidad * item.valorUnitario).toLocaleString('es-CO')}</td></tr>`).join('')}</tbody></table><div style="display: flex; justify-content: flex-end; margin-bottom: 20px;"><div style="width: 300px; border-top: 2px solid #4f46e5; padding-top: 10px; font-size: 11px;"><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span><strong>SUBTOTAL</strong></span><span>$${subtotal.toLocaleString('es-CO')}</span></div><div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span><strong>IMPUESTO (${cot.impuesto}%)</strong></span><span>$${impuestoMonto.toLocaleString('es-CO')}</span></div><div style="display: flex; justify-content: space-between; background: #4f46e5; color: white; padding: 10px; border-radius: 4px; font-weight: bold;"><span>TOTAL</span><span>$${total.toLocaleString('es-CO')}</span></div></div></div></div>`;
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      if (typeof html2pdf !== 'undefined') {
        const opt = { margin: 0, filename: `cotizacion-${cot.numero}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
        html2pdf().set(opt).from(element).save();
      }
      document.body.removeChild(element);
    };
    document.head.appendChild(script);
  };

  const compartirCotizacion = (cot) => {
    const enlacePublico = generarEnlacePublico(cot);
    navigator.clipboard.writeText(enlacePublico);
    showToast('✓ Enlace copiado al portapapeles', 'success');
  };

  const generarEnlacePublico = (cotizacion) => {
    if (cotizacion.enlacePublico) return cotizacion.enlacePublico;
    const idPublico = `${cotizacion.id}-${Math.random().toString(36).substr(2, 9)}`;
    const enlace = `${window.location.origin}/cotizacion-publica/${idPublico}`;
    return enlace;
  };

  const calcularTotales = (items, impuesto) => {
    const subtotal = items.reduce((sum, item) => sum + item.cantidad * item.valorUnitario, 0);
    const impuestoMonto = subtotal * (impuesto / 100);
    return { subtotal, impuestoMonto, total: subtotal + impuestoMonto };
  };

  const actualizarConfiguracion = (formData) => {
    const empresaActualizada = { ...empresa, ...formData };
    setEmpresa(empresaActualizada);
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
    if (usuarioIndex !== -1) { usuarios[usuarioIndex].empresa = empresaActualizada; localStorage.setItem('usuarios', JSON.stringify(usuarios)); }
    showToast('✓ Configuración actualizada', 'success');
  };

  const handleUpgrade = (planId) => {
    const plan = planes.find(p => p.id === planId);
    if (plan.precio === 0) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const usuarioIndex = usuarios.findIndex(u => u.id === usuario.id);
      if (usuarioIndex !== -1) { usuarios[usuarioIndex].plan = planId; usuarios[usuarioIndex].cotizacionesUsadas = 0; localStorage.setItem('usuarios', JSON.stringify(usuarios)); setUsuario({ ...usuario, plan: planId, cotizacionesUsadas: 0 }); }
      showToast(`✓ Plan ${plan.nombre} activado`, 'success');
    } else {
      showToast('Redirigiendo a Wompi para pago...', 'success');
    }
  };

  if (pantalla === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Cotización SaaS PRO</h1>
          <p className="text-center text-gray-600 mb-6">Sistema profesional de cotizaciones 🚀</p>
          {toast && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{toast.message}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" placeholder="tu@email.com" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
              <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 mb-4">Iniciar Sesión</button>
          </form>
          <button onClick={() => setPantalla('registro')} className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700">Crear Cuenta</button>
        </div>
      </div>
    );
  }

  if (pantalla === 'registro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md max-h-screen overflow-y-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Crear Cuenta</h1>
          <p className="text-center text-gray-600 mb-6">Regístrate y comienza a cotizar profesionalmente</p>
          {toast && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{toast.message}</div>}
          <form onSubmit={handleRegistro}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Nombre de Empresa</label>
              <input type="text" value={registroData.nombreEmpresa} onChange={(e) => setRegistroData({ ...registroData, nombreEmpresa: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input type="email" value={registroData.email} onChange={(e) => setRegistroData({ ...registroData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
              <input type="password" value={registroData.password} onChange={(e) => setRegistroData({ ...registroData, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Confirmar Contraseña</label>
              <input type="password" value={registroData.confirmPassword} onChange={(e) => setRegistroData({ ...registroData, confirmPassword: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Identificación (NIT)</label>
              <input type="text" value={registroData.identificacion} onChange={(e) => setRegistroData({ ...registroData, identificacion: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Teléfono</label>
              <input type="tel" value={registroData.telefono} onChange={(e) => setRegistroData({ ...registroData, telefono: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Ciudad</label>
              <input type="text" value={registroData.ciudad} onChange={(e) => setRegistroData({ ...registroData, ciudad: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600" />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Logo (opcional)</label>
              <input type="file" accept="image/*" onChange={(e) => setRegistroData({ ...registroData, logoFile: e.target.files[0] })} className="w-full" />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 mb-4">Registrarse</button>
          </form>
          <button onClick={() => setPantalla('login')} className="w-full text-indigo-600 font-semibold hover:underline">Volver al Login</button>
        </div>
      </div>
    );
  }

  if (usuario && empresa) {
    return (
      <div>
        <Sidebar user={usuario} currentScreen={pantalla} onNavigate={setPantalla} onLogout={handleLogout} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="main-content">
          {pantalla === 'dashboard' && <Dashboard user={usuario} empresa={empresa} cotizaciones={cotizaciones} planes={planes} onNewQuotation={() => setPantalla('nueva-cotizacion')} />}
          {pantalla === 'nueva-cotizacion' && <NewQuotation user={usuario} empresa={empresa} onSave={guardarCotizacion} onCancel={() => setPantalla('dashboard')} planes={planes} />}
          {pantalla === 'cotizaciones' && <QuotationsList cotizaciones={cotizaciones} planes={planes} user={usuario} onDelete={eliminarCotizacion} onShare={compartirCotizacion} onView={() => {}} onExport={exportarPDF} onDuplicate={duplicarCotizacion} />}
          {pantalla === 'clientes' && <ClientsModule user={usuario} onAddClient={() => {}} />}
          {pantalla === 'configuracion' && <SettingsModule user={usuario} empresa={empresa} onSave={actualizarConfiguracion} />}
          {pantalla === 'suscripcion' && <SubscriptionModule user={usuario} planes={planes} onUpgrade={handleUpgrade} />}
        </main>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    );
  }

  return null;
}