"use client";

import { Provider } from 'react-redux';
import store from '@/store'; // Asegúrate de que esta ruta apunte correctamente a tu store
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}