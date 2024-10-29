"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/authSlice';

const LoginPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // Define el estado para success
  
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
      
        try {
          const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
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
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default LoginPage;