"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setToken } from '@/store/authSlice';
import './login.css'; // Importar el CSS personalizado


const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
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
        localStorage.setItem('token', data.access_token);
        dispatch(setToken(data.access_token));
        setSuccess('Login successful!');
        router.push('/home'); // Redirige a la vista de Home
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error en la solicitud de login:', error);
      setError('Error en la conexión con el servidor');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <form onSubmit={handleLogin} className="card p-4 shadow-lg bg-dark text-white" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center mb-4">Iniciar Sesión</h1>
        <div className="mb-3">
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"/>
        </div>
        <div className="mb-3">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"/>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
        {error && <p className="mt-3 text-danger">{error}</p>}
        {success && <p className="mt-3 text-success">{success}</p>}

        {/* Link para navegar a la vista de register */}
        <p className="mt-3 text-center text-white">
        ¿No tienes una cuenta?{" "}
        <a href="/register" className="text-decoration-underline link-hover">
            Regístrate aquí
        </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;