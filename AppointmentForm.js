import React, { useState } from 'react';

const services = [
  { id: 'manicure', name: 'Manicura', duration: 30, price: 25 },
  { id: 'pedicure', name: 'Pedicura', duration: 45, price: 30 },
  { id: 'facial', name: 'Limpieza Facial', duration: 60, price: 50 },
  { id: 'massage', name: 'Masaje Relajante', duration: 60, price: 40 },
  { id: 'waxing', name: 'Depilación', duration: 30, price: 35 },
  { id: 'makeup', name: 'Maquillaje', duration: 45, price: 45 }
];

function AppointmentForm({ onAddAppointment, appointments = [], user }) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  // Verificar si el usuario puede agregar turnos
  const canAddAppointments = (user) => {
    return user.userType === 'owner' || user.userType === 'receptionist';
  };

  // Si el usuario no tiene permisos, mostrar mensaje
  if (!canAddAppointments(user)) {
    return (
      <div className="appointment-form">
        <h2>Agendar Nuevo Turno</h2>
        <div className="no-permission-message">
          <div className="permission-denied">
            <h3>❌ Permiso Denegado</h3>
            <p>Los empleados no tienen permisos para agendar nuevos turnos.</p>
            <p>Por favor, contacta al administrador o recepcionista para agendar turnos.</p>
            <div className="permissions-info">
              <strong>Tu rol:</strong> {user.userType === 'employee' ? 'Empleado' : user.userType}
              <br />
              <strong>Permisos disponibles:</strong> Ver turnos pendientes y marcarlos como completados
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Función para verificar disponibilidad
  const checkAvailability = (service, date, time, duration) => {
    if (!service || !date || !time) return true;

    const selectedService = services.find(s => s.id === service);
    if (!selectedService) return true;

    const appointmentDateTime = new Date(`${date}T${time}`);
    const appointmentEndTime = new Date(appointmentDateTime.getTime() + selectedService.duration * 60000);

    // Verificar conflictos con turnos existentes
    const hasConflict = appointments.some(apt => {
      if (apt.status === 'cancelled') return false;
      
      const existingStart = new Date(`${apt.date}T${apt.time}`);
      const existingEnd = new Date(existingStart.getTime() + apt.duration * 60000);

      // Verificar si los horarios se solapan
      const conflict = (
        (appointmentDateTime >= existingStart && appointmentDateTime < existingEnd) ||
        (appointmentEndTime > existingStart && appointmentEndTime <= existingEnd) ||
        (appointmentDateTime <= existingStart && appointmentEndTime >= existingEnd)
      );

      return conflict;
    });

    return !hasConflict;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      // Verificar disponibilidad antes de agregar
      if (!checkAvailability(formData.service, formData.date, formData.time)) {
        setErrors({ 
          general: 'Ya existe un turno en ese horario. Por favor, elija otro horario.' 
        });
        return;
      }

      const selectedService = services.find(s => s.id === formData.service);
      
      onAddAppointment({
        ...formData,
        serviceName: selectedService.name,
        duration: selectedService.duration,
        price: selectedService.price
      });

      // Reset form
      setFormData({
        clientName: '',
        phone: '',
        email: '',
        service: '',
        date: '',
        time: '',
        notes: ''
      });
      setErrors({});

      // La notificación se maneja en App.js ahora
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.clientName.trim()) {
      errors.clientName = 'El nombre del cliente es requerido';
    }
    
    if (!formData.service) {
      errors.service = 'El servicio es requerido';
    }
    
    if (!formData.date) {
      errors.date = 'La fecha es requerida';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.date = 'No se pueden agendar turnos en fechas pasadas';
      }
    }
    
    if (!formData.time) {
      errors.time = 'La hora es requerida';
    } else {
      // Validar horario laboral (9:00 - 18:00)
      const [hours] = formData.time.split(':').map(Number);
      if (hours < 9 || hours > 18) {
        errors.time = 'Los turnos solo están disponibles entre 9:00 y 18:00';
      }
    }
    
    setErrors(errors);
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores cuando el usuario modifica
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Limpiar error general cuando se cambia algún campo
    if (errors.general) {
      setErrors({
        ...errors,
        general: ''
      });
    }

    // Verificar disponibilidad en tiempo real cuando se complete fecha, hora y servicio
    if (name === 'date' || name === 'time' || name === 'service') {
      if (formData.date && formData.time && formData.service) {
        const isAvailable = checkAvailability(
          name === 'service' ? value : formData.service,
          name === 'date' ? value : formData.date,
          name === 'time' ? value : formData.time
        );
        
        if (!isAvailable) {
          setErrors({ 
            general: '⚠️ Este horario ya está ocupado. Por favor, elija otro horario.' 
          });
        } else if (errors.general) {
          setErrors({
            ...errors,
            general: ''
          });
        }
      }
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Generar opciones de horario disponibles
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // Cada 30 minutos
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="appointment-form">
      <h2>Agendar Nuevo Turno</h2>
      
      <div className="form-permissions-info">
        <small>
          {user && user.userType === 'owner' 
            ? '👑 Permisos de administrador: Puede gestionar todos los turnos'
            : user && user.userType === 'receptionist'
            ? '💼 Permisos de recepcionista: Puede agendar y modificar turnos'
            : '👨‍💼 Permisos de empleado: Puede ver y completar turnos asignados'
          }
        </small>
      </div>
      
      {errors.general && (
        <div className="error-message general-error" style={{ 
          backgroundColor: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #ffcccc'
        }}>
          ⚠️ {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Cliente *</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={errors.clientName ? 'error' : ''}
            required
          />
          {errors.clientName && <span className="error-message">{errors.clientName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Servicio *</label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className={errors.service ? 'error' : ''}
            required
          >
            <option value="">Seleccione un servicio</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.duration}min - ${service.price}
              </option>
            ))}
          </select>
          {errors.service && <span className="error-message">{errors.service}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fecha *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              className={errors.date ? 'error' : ''}
              required
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label>Hora *</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={errors.time ? 'error' : ''}
              required
            >
              <option value="">Seleccione una hora</option>
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && <span className="error-message">{errors.time}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Notas adicionales</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Alergias, preferencias, información adicional..."
          />
        </div>

        <button type="submit" className="btn-primary">
          Agendar Turno
        </button>
      </form>
    </div>
  );
}

export default AppointmentForm;