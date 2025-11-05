import React, { useState } from 'react';

function CalendarView({ appointments }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getAppointmentsForDay = (day) => {
    const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    
    return appointments.filter(apt => apt.date === dateString);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)}>‹</button>
        <h2>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => navigateMonth(1)}>›</button>
      </div>

      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day empty"></div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayAppointments = getAppointmentsForDay(day);
          
          return (
            <div key={day} className="calendar-day">
              <div className="day-number">{day}</div>
              {dayAppointments.length > 0 && (
                <div className="appointments-count">
                  {dayAppointments.length} turno(s)
                </div>
              )}
              <div className="appointments-list">
                {dayAppointments.map(apt => (
                  <div 
                    key={apt.id} 
                    className={`appointment-mini ${apt.status}`}
                    title={`${apt.clientName} - ${apt.serviceName} - ${apt.time}`}
                  >
                    {apt.time} - {apt.clientName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;