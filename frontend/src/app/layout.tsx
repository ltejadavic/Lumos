"use client";

import { Provider } from 'react-redux';
import store from '@/store'; // Asegúrate de que esta ruta apunte correctamente a tu store
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap aquí
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lato:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}