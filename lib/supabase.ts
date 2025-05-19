import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Estas variables de entorno deben configurarse en el entorno de producción
// y en un archivo .env.local para desarrollo local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Crear un cliente de Supabase para usar en toda la aplicación
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Función para obtener el menú desde Supabase
export async function getMenu() {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category');

  if (error) {
    console.error('Error al obtener el menú:', error);
    return [];
  }

  return data || [];
}

// Función para guardar un pedido en Supabase
export async function saveOrder(orderItems: any[], customerInfo: any) {
  // Primero creamos el registro del pedido
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      { 
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        total_amount: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending'
      }
    ])
    .select();

  if (orderError || !order || order.length === 0) {
    console.error('Error al guardar el pedido:', orderError);
    return null;
  }

  // Luego guardamos los items del pedido
  const orderItemsToInsert = orderItems.map(item => ({
    order_id: order[0].id,
    menu_item_id: item.id,
    quantity: item.quantity,
    price: item.price,
    notes: item.notes || ''
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsToInsert);

  if (itemsError) {
    console.error('Error al guardar los items del pedido:', itemsError);
    return null;
  }

  return order[0];
}

// Función para obtener los pedidos de un cliente
export async function getCustomerOrders(customerPhone: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*, menu_items(*))
    `)
    .eq('customer_phone', customerPhone)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener los pedidos del cliente:', error);
    return [];
  }

  return data || [];
}