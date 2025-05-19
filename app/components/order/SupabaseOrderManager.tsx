'use client';

import { useState, useEffect } from 'react';
import { useSupabase } from '@/app/context/SupabaseProvider';
import { saveOrder, getCustomerOrders } from '@/lib/supabase';
import { OrderItem } from '@/lib/types';

type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
};

type SupabaseOrderManagerProps = {
  currentOrder: OrderItem[];
  onOrderComplete: () => void;
};

export default function SupabaseOrderManager({ currentOrder, onOrderComplete }: SupabaseOrderManagerProps) {
  const { user } = useSupabase();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Cargar historial de pedidos si el usuario está autenticado
  useEffect(() => {
    if (user && customerInfo.phone) {
      loadOrderHistory();
    }
  }, [user, customerInfo.phone]);

  const loadOrderHistory = async () => {
    if (!customerInfo.phone) return;
    
    const orders = await getCustomerOrders(customerInfo.phone);
    setOrderHistory(orders);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentOrder.length === 0) {
      alert('Por favor, agrega al menos un producto a tu pedido');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await saveOrder(currentOrder, customerInfo);
      
      if (result) {
        alert('¡Pedido realizado con éxito!');
        onOrderComplete();
        loadOrderHistory();
      } else {
        alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-amber-50 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">Finalizar Pedido</h2>
      
      <form onSubmit={handleSubmitOrder} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-amber-700 font-medium mb-1">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-amber-700 font-medium mb-1">Teléfono</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerInfo.phone}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-amber-700 font-medium mb-1">Dirección</label>
          <input
            type="text"
            id="address"
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
          />
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
          </button>
        </div>
      </form>
      
      {customerInfo.phone && orderHistory.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-amber-700 font-medium flex items-center"
          >
            {showHistory ? 'Ocultar historial' : 'Ver historial de pedidos'}
            <svg
              className={`ml-2 w-5 h-5 transition-transform ${showHistory ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showHistory && (
            <div className="mt-4 space-y-4">
              {orderHistory.map((order) => (
                <div key={order.id} className="border border-amber-200 rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-amber-800">
                      Pedido #{order.id}
                    </span>
                    <span className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    Estado: <span className="font-medium capitalize">{order.status}</span>
                  </div>
                  <div className="text-sm text-gray-700">
                    Total: <span className="font-medium">${order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-amber-100">
                    <h4 className="text-sm font-medium text-amber-800 mb-2">Productos:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {order.order_items.map((item: any) => (
                        <li key={item.id} className="flex justify-between">
                          <span>{item.menu_items.name} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}