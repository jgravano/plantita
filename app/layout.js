import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';

export const metadata = {
  title: 'Plantita',
  description: 'Diagnóstico inteligente de plantas con IA',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
