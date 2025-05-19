# Guía de Integración con Supabase y Despliegue

Esta guía te ayudará a configurar tu aplicación "Restaurante El Rincón del Pacífico" con Supabase como base de datos y desplegarla en la web.

## 1. Configuración de Supabase

### Crear una cuenta en Supabase

1. Ve a [Supabase](https://supabase.com/) y crea una cuenta gratuita
2. Crea un nuevo proyecto y anota la URL y la clave anónima (se usarán más adelante)

### Configurar la base de datos

En el panel de Supabase, ve a la sección "SQL Editor" y ejecuta el siguiente script para crear las tablas necesarias:

```sql
-- Crear tabla para los elementos del menú
CREATE TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para los pedidos
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para los items de cada pedido
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  menu_item_id INTEGER REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar algunos elementos de menú de ejemplo
INSERT INTO menu_items (name, description, price, category) VALUES
('Tacos de Pescado', 'Deliciosos tacos de pescado fresco con salsa especial', 12.99, 'Tacos'),
('Ceviche Mixto', 'Ceviche de mariscos mixtos con limón y cilantro', 15.99, 'Entradas'),
('Camarones al Ajillo', 'Camarones salteados con ajo y mantequilla', 18.99, 'Platos Principales');
```

## 2. Configuración del Proyecto

### Configurar variables de entorno

1. Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edita el archivo `.env.local` y agrega tus credenciales de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-supabase
   ```

### Actualizar el layout principal

Modifica el archivo `app/layout.tsx` para incluir el proveedor de Supabase:

```tsx
import { SupabaseProvider } from '@/app/context/SupabaseProvider';

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
```

## 3. Uso de Supabase en los Componentes

Para usar Supabase en tus componentes, importa las funciones desde el archivo `lib/supabase.ts`:

```tsx
import { getMenu, saveOrder } from '@/lib/supabase';

// Ejemplo de uso en un componente
const MenuComponent = () => {
  const [menuItems, setMenuItems] = useState([]);
  
  useEffect(() => {
    async function loadMenu() {
      const menu = await getMenu();
      setMenuItems(menu);
    }
    
    loadMenu();
  }, []);
  
  // Resto del componente...
}
```

## 4. Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/) si aún no tienes una

2. Instala la CLI de Vercel:
   ```bash
   npm install -g vercel
   ```

3. Inicia sesión en Vercel desde la terminal:
   ```bash
   vercel login
   ```

4. Despliega tu aplicación:
   ```bash
   vercel
   ```

5. Configura las variables de entorno en el panel de Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. Para futuros despliegues, puedes usar:
   ```bash
   vercel --prod
   ```

## 5. Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Vercel](https://vercel.com/docs)

## Notas Importantes

- Nunca compartas tus claves de Supabase en repositorios públicos
- Considera implementar Row Level Security (RLS) en Supabase para mayor seguridad
- Para entornos de producción, configura políticas de autenticación adecuadas