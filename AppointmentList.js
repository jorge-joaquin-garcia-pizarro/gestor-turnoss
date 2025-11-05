import React, { useState } from 'react';

function AppointmentList({ appointments, onCancel, onComplete, onDelete, user }) {
  const [filter, setFilter] = useState('all');

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  // Funciones de permisos por rol - ACTUALIZADAS
  const canManageAppointments = (user) => {
    return user.userType === 'owner'; // Solo administradores pueden eliminar
  };

  const canCompleteAppointments = (user) => {
    return user.userType === 'owner' || user.userType === 'employee'; // Dueños y empleados pueden completar
  };

  const canCancelAppointments = (user) => {
    return user.userType === 'owner' || user.userType === 'receptionist'; // Dueños y recepcionistas pueden cancelar
  };

  const canViewAllAppointments = (user) => {
    return user.userType === 'owner' || user.userType === 'receptionist'; // Dueños y recepcionistas ven todos
  };

  // Filtrar citas para empleados (solo las asignadas o pendientes)
  const getFilteredAppointmentsForUser = () => {
    if (user.userType === 'employee') {
      return filteredAppointments.filter(apt => 
        apt.status === 'pending' || apt.createdBy === user.id
      );
    }
    return filteredAppointments;
  };

  const userFilteredAppointments = getFilteredAppointmentsForUser();

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: 'status-pending', text: 'Pendiente' },
      completed: { class: 'status-completed', text: 'Completada' },
      cancelled: { class: 'status-cancelled', text: 'Cancelada' }
    };
    
    const config = statusConfig[status];
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (appointments.length === 0) {
    return (
      <div className="appointment-list">
        <h2>Lista de Turnos</h2>
        <p className="no-appointments">No hay turnos agendados</p>
      </div>
    );
  }

  return (
    <div className="appointment-list">
      <div className="list-header">
        <h2>Lista de Turnos</h2>
        
        <div className="filter-buttons">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Todos ({user.userType === 'employee' ? userFilteredAppointments.length : appointments.length})
          </button>
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pendientes ({appointments.filter(a => a.status === 'pending').length})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completadas ({appointments.filter(a => a.status === 'completed').length})
          </button>
        </div>
      </div>

      {user.userType === 'employee' && (
        <div className="user-permission-notice">
          <small>👨‍💼 Vista de empleado: Solo puedes ver turnos pendientes y los que has creado</small>
        </div>
      )}

      <div className="appointments-grid">
        {userFilteredAppointments.map(appointment => (
          <div key={appointment.id} className="appointment-card">
            <div className="card-header">
              <h3>{appointment.clientName}</h3>
              {getStatusBadge(appointment.status)}
            </div>
            
            <div className="card-body">
              <p><strong>Servicio:</strong> {appointment.serviceName}</p>
              <p><strong>Fecha:</strong> {formatDate(appointment.date)}</p>
              <p><strong>Hora:</strong> {appointment.time}</p>
              <p><strong>Duración:</strong> {appointment.duration} min</p>
              <p><strong>Precio:</strong> ${appointment.price}</p>
              {appointment.phone && <p><strong>Teléfono:</strong> {appointment.phone}</p>}
              {appointment.notes && <p><strong>Notas:</strong> {appointment.notes}</p>}
              {user.userType === 'owner' && (
                <p><strong>Creado por:</strong> {appointment.createdBy === user.id ? 'Tú' : 'Otro usuario'}</p>
              )}
            </div>

            <div className="card-actions">
              {appointment.status === 'pending' && (
                <>
                  {canCompleteAppointments(user) && (
                    <button 
                      className="btn-success"
                      onClick={() => onComplete(appointment.id)}
                    >
                      ✅ Completar
                    </button>
                  )}
                  {canCancelAppointments(user) && (
                    <button 
                      className="btn-warning"
                      onClick={() => onCancel(appointment.id)}
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </>
              )}
              {canManageAppointments(user) && (
                <button 
                  className="btn-danger"
                  onClick={() => {
                    if (window.confirm('¿Está seguro de eliminar este turno?')) {
                      onDelete(appointment.id);
                    }
                  }}
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentList;