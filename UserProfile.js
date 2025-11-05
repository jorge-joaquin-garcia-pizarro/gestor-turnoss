import React from 'react';

function UserProfile({ user, onLogout }) {
  const getUserTypeText = (type) => {
    const types = {
      'owner': 'Dueño/Administrador',
      'receptionist': 'Recepcionista',
      'employee': 'Empleado'
    };
    return types[type] || type;
  };

  const getRoleBadgeClass = (type) => {
    const classes = {
      'owner': 'role-badge role-owner',
      'receptionist': 'role-badge role-receptionist',
      'employee': 'role-badge role-employee'
    };
    return classes[type] || 'role-badge';
  };

  const getPermissions = (type) => {
    const permissions = {
      owner: ['Gestionar todos los turnos', 'Gestionar empleados', 'Ver reportes', 'Configuración del sistema', 'Eliminar turnos'],
      receptionist: ['Agendar turnos', 'Modificar turnos', 'Cancelar turnos', 'Ver calendario', 'Ver lista de turnos'],
      employee: ['Ver turnos asignados', 'Completar turnos', 'Cancelar turnos propios', 'Ver calendario']
    };
    return permissions[type] || [];
  };

  const getLoginMethod = () => {
    if (user.isGoogleUser) return 'Google';
    if (user.isDiscordUser) return 'Discord';
    return 'Email y contraseña';
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h3>👤 Perfil de Usuario</h3>
        <button onClick={onLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </div>
      
      <div className="profile-info">
        {user.picture && (
          <div className="profile-picture">
            <img src={user.picture} alt="Profile" />
          </div>
        )}
        
        <div className="profile-item">
          <strong>Rol:</strong> 
          <span className={getRoleBadgeClass(user.userType)}>
            {getUserTypeText(user.userType)}
          </span>
        </div>
        
        <div className="profile-item">
          <strong>Nombre:</strong> {user.firstName} {user.lastName}
        </div>
        <div className="profile-item">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="profile-item">
          <strong>Teléfono:</strong> {user.phone}
        </div>
        
        {user.salonName && (
          <div className="profile-item">
            <strong>Centro:</strong> {user.salonName}
          </div>
        )}
        
        <div className="profile-item">
          <strong>Miembro desde:</strong> {new Date(user.createdAt).toLocaleDateString('es-ES')}
        </div>
        
        <div className="profile-item">
          <strong>Método de acceso:</strong> {getLoginMethod()}
        </div>
        
        <div className="profile-item">
          <strong>Permisos:</strong>
          <div className="permissions-list">
            {getPermissions(user.userType).map((permission, index) => (
              <span key={index} className="permission-tag">
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;