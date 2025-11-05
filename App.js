

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/App.css';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import CalendarView from './components/CalendarView';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import DiscordCallback from './components/DiscordCallback';
import Notification from './components/Notification';

function App() {
  const [appointments, setAppointments] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [authView, setAuthView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Verificar si hay usuario logueado al cargar la app
  useEffect(() => {
    // Limpiar localStorage para usar base de datos
    localStorage.removeItem('beautySalonCurrentUser');
    localStorage.removeItem('beautyAppointments');
    localStorage.removeItem('beautySalonUsers');
    
    // Aquí iría la conexión a la base de datos
    // Por ahora solo inicializamos con arrays vacíos
    console.log('Conectando a base de datos...');
    
    // En una implementación real, aquí harías una llamada a tu API/backend
    // para cargar los datos desde la base de datos
    
  }, []);

  // En una implementación real, aquí guardarías en la base de datos
  // en lugar de localStorage
  useEffect(() => {
    // En lugar de guardar en localStorage, aquí iría la llamada a la API
    // para guardar en la base de datos
    if (appointments.length > 0) {
      console.log('Guardando citas en base de datos:', appointments);
    }
    
    if (currentUser) {
      console.log('Usuario actual en sesión:', currentUser);
    }
  }, [appointments, currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setAuthView('app');
    showNotification(`¡Bienvenido/a de nuevo ${user.firstName}!`, 'success');
  };

  const handleGoogleLogin = (googleUser) => {
    // En una implementación real, aquí verificarías/con la base de datos
    console.log('Verificando usuario Google en base de datos:', googleUser.email);
    
    const user = {
      id: Date.now().toString(),
      firstName: googleUser.given_name,
      lastName: googleUser.family_name || '',
      email: googleUser.email,
      phone: '',
      password: 'google_oauth',
      userType: 'owner',
      salonName: `${googleUser.given_name}'s Salon`,
      createdAt: new Date().toISOString(),
      picture: googleUser.picture,
      isGoogleUser: true
    };
    
    setCurrentUser(user);
    setAuthView('app');
    showNotification(`¡Bienvenido/a ${user.firstName}!`, 'success');
  };

  const handleDiscordLogin = (discordUser) => {
    // En una implementación real, aquí verificarías con la base de datos
    console.log('Verificando usuario Discord en base de datos:', discordUser.email);
    
    const user = {
      ...discordUser,
      id: 'discord_' + Date.now(),
      phone: '',
      password: 'discord_oauth',
      userType: 'owner',
      salonName: discordUser.salonName || `${discordUser.firstName}'s Salon`,
      createdAt: new Date().toISOString(),
      isDiscordUser: true
    };
    
    setCurrentUser(user);
    setAuthView('app');
    showNotification(`¡Bienvenido/a ${user.firstName}!`, 'success');
  };

  const handleRegister = (user) => {
    // En una implementación real, aquí guardarías en la base de datos
    console.log('Guardando nuevo usuario en base de datos:', user.email);
    
    setCurrentUser(user);
    setAuthView('app');
    showNotification(`¡Bienvenido/a ${user.firstName}! Tu cuenta ha sido creada exitosamente.`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthView('login');
    showNotification('Sesión cerrada correctamente', 'info');
  };

  const addAppointment = (appointment) => {
    const newAppointment = {
      id: Date.now().toString(),
      ...appointment,
      status: 'pending',
      createdBy: currentUser.id
    };
    
    // En una implementación real, aquí guardarías en la base de datos
    console.log('Guardando nueva cita en base de datos:', newAppointment);
    
    setAppointments([...appointments, newAppointment]);
    showNotification('¡Turno agendado exitosamente!', 'success');
  };

  const cancelAppointment = (id) => {
    // En una implementación real, aquí actualizarías en la base de datos
    console.log('Actualizando cita en base de datos (cancelar):', id);
    
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    ));
    showNotification('Turno cancelado correctamente', 'warning');
  };

  const completeAppointment = (id) => {
    // En una implementación real, aquí actualizarías en la base de datos
    console.log('Actualizando cita en base de datos (completar):', id);
    
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'completed' } : apt
    ));
    showNotification('Turno marcado como completado', 'success');
  };

  const deleteAppointment = (id) => {
    // En una implementación real, aquí eliminarías de la base de datos
    console.log('Eliminando cita de base de datos:', id);
    
    setAppointments(appointments.filter(apt => apt.id !== id));
    showNotification('Turno eliminado correctamente', 'info');
  };

  // Renderizar vistas de autenticación
  if (authView === 'login') {
    return (
      <GoogleOAuthProvider clientId="453964587083-btseb35poq27ltpjqfls0oj4qh8o07ae.apps.googleusercontent.com">
        <Router>
          <div className="app">
            <div className="auth-header">
              <h1>💅 Centro de Estética - Iniciar Sesión</h1>
            </div>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
            <Routes>
              <Route 
                path="/auth/discord/callback" 
                element={<DiscordCallback onDiscordLogin={handleDiscordLogin} />} 
              />
              <Route 
                path="*" 
                element={
                  <Login 
                    onLogin={handleLogin}
                    onGoogleLogin={handleGoogleLogin}
                    onDiscordLogin={handleDiscordLogin}
                    onSwitchToRegister={() => setAuthView('register')}
                  />
                } 
              />
            </Routes>
          </div>
        </Router>
      </GoogleOAuthProvider>
    );
  }

  if (authView === 'register') {
    return (
      <GoogleOAuthProvider clientId="453964587083-btseb35poq27ltpjqfls0oj4qh8o07ae.apps.googleusercontent.com">
        <Router>
          <div className="app">
            <div className="auth-header">
              <h1>💅 Centro de Estética - Crear Cuenta</h1>
            </div>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={closeNotification}
              />
            )}
            <Routes>
              <Route 
                path="/auth/discord/callback" 
                element={<DiscordCallback onDiscordLogin={handleDiscordLogin} />} 
              />
              <Route 
                path="*" 
                element={
                  <Register 
                    onRegister={handleRegister}
                    onGoogleLogin={handleGoogleLogin}
                    onDiscordLogin={handleDiscordLogin}
                    onSwitchToLogin={() => setAuthView('login')}
                  />
                } 
              />
            </Routes>
          </div>
        </Router>
      </GoogleOAuthProvider>
    );
  }

  // Vista principal de la aplicación
  return (
    <Router>
      <div className="app">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
        <header className="app-header">
          <div className="header-top">
            <div className="header-title">
              <h1>💅 {currentUser.salonName || 'Gestor de Turnos'}</h1>
              <span className={`role-indicator ${currentUser.userType === 'owner' ? 'role-owner' : currentUser.userType === 'receptionist' ? 'role-receptionist' : 'role-employee'}`}>
                {currentUser.userType === 'owner' ? '👑 Administrador' : currentUser.userType === 'receptionist' ? '💼 Recepcionista' : '👨‍💼 Empleado'}
              </span>
            </div>
            <UserProfile user={currentUser} onLogout={handleLogout} />
          </div>
          
          {/* Navegación condicional actualizada */}
          <nav className="nav-tabs">
            <button 
              className={currentView === 'list' ? 'active' : ''}
              onClick={() => setCurrentView('list')}
            >
              📋 Lista
            </button>
            <button 
              className={currentView === 'calendar' ? 'active' : ''}
              onClick={() => setCurrentView('calendar')}
            >
              📅 Calendario
            </button>
            {(currentUser.userType === 'owner' || currentUser.userType === 'receptionist') && (
              <button 
                className={currentView === 'add' ? 'active' : ''}
                onClick={() => setCurrentView('add')}
              >
                ➕ Nueva Cita
              </button>
            )}
          </nav>
        </header>

        <main className="main-content">
          {currentView === 'add' && (
            <AppointmentForm 
              onAddAppointment={addAppointment} 
              appointments={appointments}
              user={currentUser}
            />
          )}
          
          {currentView === 'list' && (
            <AppointmentList 
              appointments={appointments}
              onCancel={cancelAppointment}
              onComplete={completeAppointment}
              onDelete={deleteAppointment}
              user={currentUser}
            />
          )}
          
          {currentView === 'calendar' && (
            <CalendarView appointments={appointments} />
          )}
        </main>

        <footer className="app-footer">
          <p>
            Usuario: {currentUser.firstName} {currentUser.lastName} | 
            Total de citas: {appointments.length} | 
            Pendientes: {appointments.filter(a => a.status === 'pending').length} | 
            Completadas: {appointments.filter(a => a.status === 'completed').length}
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
