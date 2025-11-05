import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function DiscordCallback({ onDiscordLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          // En un entorno real, aquí enviarías el código a tu backend
          // Para este ejemplo, simularemos la obtención de datos
          const userData = await exchangeCodeForToken(code);
          onDiscordLogin(userData);
          navigate('/');
        } catch (error) {
          console.error('Error en autenticación con Discord:', error);
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, [location, navigate, onDiscordLogin]);

  const exchangeCodeForToken = async (code) => {
    // En un entorno real, esto se haría en el backend por seguridad
    // Esta es una simulación
    return {
      id: 'discord_' + Date.now(),
      firstName: 'Usuario',
      lastName: 'Discord',
      email: `user${Date.now()}@discord.com`,
      userType: 'owner',
      salonName: 'Salon Discord',
      isDiscordUser: true,
      createdAt: new Date().toISOString()
    };
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Procesando autenticación con Discord...</h2>
        <p>Por favor espera mientras te redirigimos.</p>
      </div>
    </div>
  );
}

export default DiscordCallback;