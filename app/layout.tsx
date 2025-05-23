import type { Metadata } from "next";
import "@/app/globals.css";
import Script from 'next/script';
import { SupabaseProvider } from '@/app/context/SupabaseProvider';

export const metadata: Metadata = {
  title: "Restaurante El Rincón del Pacífico",
  description: "Sistema de pedidos para el Restaurante El Rincón del Pacífico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* <!-- Fathom - beautiful, simple website analytics --> */}
        <script src="https://cdn.usefathom.com/script.js" data-site="ONYOCTXK" defer></script>
        {/* <!-- / Fathom --> */}
      </head>
      <body className="bg-black text-white">
        <SupabaseProvider>
          <div className="flex flex-col h-screen">
            {children}
          </div>
        </SupabaseProvider>
        <Script src="/confetti.js" />
      </body>
    </html>
  );
}
