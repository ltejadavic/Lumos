"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import './home.css'; // Optional, add any custom styles

interface Role {
    id: number;
    nombre: string; // Usa `name` o `nombre` según cómo se defina en tu backend
  }

  interface DecodedToken {
    nombre: string;
    apellidos: string;
    username: string; // Si necesitas usar el correo electrónico
    sub: number;
    role: Role;
    exp: number;
  }

const HomePage = () => {  
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserName(`${decoded.nombre} ${decoded.apellidos}`);
      setRole(decoded.role.nombre);

      // Verifica el contenido
      console.log('Role:', decoded.role.nombre);

      // Check token expiration
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Bienvenido, {userName}!</h1>
      {role && <p className="text-center">Tu rol es: {role}</p>}
      {role === 'Administrador' && (
        <div className="text-center mt-3">
          <a href="/register" className="btn btn-secondary">Ir a Registro</a>
        </div>
      )}
      <div className="text-center mt-4">
        <button onClick={handleLogout} className="btn btn-danger">Cerrar sesión</button>
      </div>
    </div>
  );
};

export default HomePage;