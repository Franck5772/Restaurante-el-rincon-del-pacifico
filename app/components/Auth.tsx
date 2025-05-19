'use client';

import { useState } from 'react';
import { useSupabase } from '@/app/context/SupabaseProvider';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function Auth() {
  const { supabase } = useSupabase();
  const [authView, setAuthView] = useState<'sign_in' | 'sign_up'>('sign_in');

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center">
        {authView === 'sign_in' ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>
      
      <SupabaseAuth
        supabaseClient={supabase}
        view={authView}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#f59e0b',
                brandAccent: '#d97706',
              },
            },
          },
        }}
        providers={[]}
        redirectTo={`${window.location.origin}/auth/callback`}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Correo electrónico',
              password_label: 'Contraseña',
              button_label: 'Iniciar sesión',
              loading_button_label: 'Iniciando sesión...',
              link_text: '¿Ya tienes una cuenta? Inicia sesión',
            },
            sign_up: {
              email_label: 'Correo electrónico',
              password_label: 'Contraseña',
              button_label: 'Registrarse',
              loading_button_label: 'Registrando...',
              link_text: '¿No tienes una cuenta? Regístrate',
            },
          },
        }}
      />
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setAuthView(authView === 'sign_in' ? 'sign_up' : 'sign_in')}
          className="text-amber-600 hover:text-amber-800 text-sm font-medium"
        >
          {authView === 'sign_in' 
            ? '¿No tienes una cuenta? Regístrate' 
            : '¿Ya tienes una cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}