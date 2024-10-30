"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState(''); // Cambiar 'username' a 'email'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Cambiar 'username' a 'email'
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setToken(data.access_token));
        setSuccess('Login successful!');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error en la solicitud de login:', error);
      setError('Error en la conexión con el servidor');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email" // Cambiar a type="email" para validación automática de correos electrónicos
        placeholder="Correo Electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Iniciar Sesión</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default LoginPage;