import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login({ onLogin, onGoogleLogin, onDiscordLogin, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      
      // En una implementación real, aquí harías una llamada a tu API/backend
      // para verificar las credenciales en la base de datos
      console.log('Verificando credenciales en base de datos:', formData.email);
      
      // Simulamos un login exitoso para demostración
      // En producción, esto vendría de tu base de datos
      const user = {
        id: Date.now().toString(),
        firstName: 'Usuario',
        lastName: 'Demo',
        email: formData.email,
        phone: '123-456-7890',
        userType: 'owner',
        salonName: 'Mi Centro de Estética',
        createdAt: new Date().toISOString()
      };
      
      onLogin(user);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    onGoogleLogin(decoded);
  };

  const handleGoogleError = () => {
    setErrors({ general: 'Error al iniciar sesión con Google' });
  };

  const handleDiscordLogin = () => {
    const clientId = '1433584890192072864';
    const redirectUri = encodeURIComponent('http://localhost:3000/auth/discord/callback');
    const scope = encodeURIComponent('identify email');
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
    
    window.location.href = discordAuthUrl;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email no válido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    }
    
    setErrors(errors);
    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Iniciar Sesión</h2>
        
        {/* Botones de redes sociales */}
        <div className="social-login-section">
          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              theme="filled_blue"
              size="large"
              width="100%"
            />
          </div>
          
          <button 
            type="button"
            className="btn-discord"
            onClick={handleDiscordLogin}
            disabled={isLoading}
          >
            <div className="discord-icon">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.18.33.25c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"/>
              </svg>
            </div>
            Iniciar sesión con Discord
          </button>
        </div>

        <div className="divider">
          <span>o</span>
        </div>

        {/* Formulario tradicional */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.general && (
            <div className="error-message general-error">
              ⚠️ {errors.general}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Procesando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-switch">
          <p>¿No tienes cuenta? 
            <button 
              type="button" 
              onClick={onSwitchToRegister} 
              className="link-button"
              disabled={isLoading}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
