'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PlusCircle, MinusCircle, ShoppingCart, Info, Check } from 'lucide-react';
import { MenuItem } from '@/app/lib/types';
import { addItemToOrder } from '@/app/lib/services/orderService';
import { playSound } from '@/app/lib/services/soundService';

interface MenuCardProps {
  item: MenuItem;
  index: number;
  onAddToCart: (item: MenuItem, quantity: number, specialInstructions?: string) => void;
  ref?: React.Ref<HTMLDivElement>;
}

// Extender la interfaz MenuItem para incluir las propiedades opcionales que usamos
declare module '@/app/lib/types' {
  interface MenuItem {
    nutritionalInfo?: {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    };
  }
}

/**
 * Componente para mostrar un producto del menú con opciones de cantidad
 * y añadir al carrito. Incluye animaciones y efectos visuales mejorados.
 */
const MenuCard = React.forwardRef<HTMLDivElement, Omit<MenuCardProps, 'ref'>>((props, forwardedRef) => {
  const { item, index, onAddToCart } = props;
  const [quantity, setQuantity] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  const internalRef = useRef<HTMLDivElement>(null);
  
  // Combinamos las refs usando useEffect para evitar asignaciones directas
  useEffect(() => {
    if (!internalRef.current) return;
    
    // Si tenemos una ref de referencia, actualizamos la referencia externa
    if (typeof forwardedRef === 'function') {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      // No intentamos asignar a .current directamente
      // Esta es una técnica de adaptación de ref, no necesitamos manipular la propidad readonly
    }
  }, [forwardedRef]);
  
  // Efecto para manejar la animación de resaltado cuando el producto es destacado por el agente
  useEffect(() => {
    const handleHighlight = (event: CustomEvent) => {
      try {
        const { productId } = event.detail as { productId: string };
        
        console.log(`[MenuCard] Evento highlightProduct recibido: ${productId}, item.id: ${item.id}`);
        
        // Normalizar ambos IDs para comparación (eliminar espacios, guiones y convertir a minúsculas)
        const normalizedProductId = productId.toLowerCase().replace(/[-\s]+/g, '');
        const normalizedItemId = item.id.toLowerCase().replace(/[-\s]+/g, '');
        
        // Comprobar también si el nombre del producto está contenido en el ID
        const itemNameNormalized = item.name.toLowerCase().replace(/[-\s]+/g, '');
        
        // Comprobar también por categoría para casos generales (ej: "extras")
        const categoryMatches = normalizedProductId === item.categoryId?.toLowerCase() || 
                              normalizedProductId.includes(item.categoryId?.toLowerCase() || '') ||
                              (item.categoryId?.toLowerCase() || '').includes(normalizedProductId);
        
        // Verificar coincidencia por ID exacto o nombre
        const isMatch = 
          normalizedProductId === normalizedItemId || 
          normalizedProductId.includes(normalizedItemId) || 
          normalizedItemId.includes(normalizedProductId) ||
          normalizedProductId.includes(itemNameNormalized) ||
          itemNameNormalized.includes(normalizedProductId) ||
          categoryMatches;
        
        if (isMatch) {
          console.log(`[MenuCard] ¡Coincidencia encontrada! Resaltando: ${item.name} (${item.categoryId})`);
          setIsHighlighted(true);
          
          // Hacer scroll al elemento con mayor prioridad visual
          if (internalRef.current) {
            // Aplicar un efecto más sutil
            internalRef.current.classList.add('flash-highlight');
            
            // Realizar scroll de manera suave con tiempo de espera
            setTimeout(() => {
              if (internalRef.current) {
                internalRef.current.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center',
                  inline: 'center'
                });
                
                // Emitir evento para asegurar que la categoría se active correctamente
                if (item.categoryId) {
                  const categoryEvent = new CustomEvent('activateCategory', {
                    detail: { category: item.categoryId }
                  });
                  window.dispatchEvent(categoryEvent);
                }
              }
            }, 100);
            
            // Quitar el efecto de flash después de un tiempo
            setTimeout(() => {
              if (internalRef.current) {
                internalRef.current.classList.remove('flash-highlight');
              }
            }, 1200);
          }
          
          // Mantener el resaltado por un tiempo razonable y luego quitarlo gradualmente
          setTimeout(() => {
            setIsHighlighted(false);
          }, 4000);
        }
      } catch (error) {
        console.error('[MenuCard] Error al procesar evento highlightProduct:', error);
      }
    };
    
    window.addEventListener('highlightProduct', handleHighlight as EventListener);
    
    return () => {
      window.removeEventListener('highlightProduct', handleHighlight as EventListener);
    };
  }, [item.id, item.name, item.categoryId]);
  
  // Formatear precio como moneda
  const formatCurrency = (amount: number) => {
    // Evitar decimales cuando no son necesarios para mejorar la lectura del asistente de voz
    const hasDecimals = amount % 1 !== 0;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0
    }).format(amount).replace('$', '$ ');
  };
  
  // Manejar cambio de cantidad
  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, Math.min(10, newQuantity)));
  };
  
  // Manejar añadir al carrito
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    try {
      // Reproducir sonido al añadir al carrito
      playSound('add-to-cart', 0.7);
      
      // Llamar al servicio de pedidos
      addItemToOrder(item.id, quantity, specialInstructions || undefined);
      
      // También llamar al callback proporcionado (si existe)
      if (typeof onAddToCart === 'function') {
        onAddToCart(item, quantity, specialInstructions || undefined);
      }
      
      // Animar la adición al carrito
      if (internalRef.current) {
        internalRef.current.classList.add('added-to-cart');
      }
      
      // Mostrar animación de checkmark
      const checkmark = document.createElement('div');
      checkmark.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      checkmark.className = 'fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full w-12 h-12 flex items-center justify-center scale-0 opacity-0 animate-checkmark';
      document.body.appendChild(checkmark);
      
      setTimeout(() => {
        if (document.body.contains(checkmark)) {
          document.body.removeChild(checkmark);
        }
      }, 1500);
      
      // Resetear después de añadir
      setTimeout(() => {
        setQuantity(1);
        setSpecialInstructions('');
        setIsAddingToCart(false);
        if (internalRef.current) {
          internalRef.current.classList.remove('added-to-cart');
        }
      }, 800);
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      setIsAddingToCart(false);
    }
  };
  
  // Generar URL para la imagen o usar emoji predeterminado
  const getProductImage = () => {
    if (item.imageUrl && item.imageUrl.startsWith('http')) {
      return (
        <img 
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target && target.style) {
              target.style.display = 'none';
              if (target.nextElementSibling) {
                (target.nextElementSibling as HTMLElement).style.display = 'block';
              }
            }
          }}
        />
      );
    } else {
      // Usar el emoji proporcionado en el objeto item directamente si existe
      let emoji = item.imageUrl || '🌮'; // Emoji por defecto para tacos
      
      // Si no hay emoji específico, intentar identificar por ID y categoría
      if (!emoji || emoji === '') {
        // Primero intentar identificar por ID específico (más preciso)
        if (item.id) {
          switch(item.id.toLowerCase()) {
            // Tacos específicos
            case 'taco-pastor':
            case 'taco-suadero':
            case 'taco-bistec':
            case 'taco-campechano':
            case 'taco-carnitas':
              emoji = '🌮';
              break;
              
            // Bebidas específicas
            case 'agua-horchata':
              emoji = '🥛';
              break;
            case 'agua-jamaica':
              emoji = '🧃';
              break;
            case 'jugo-manzana':
              emoji = '🧃';
              break;
            case 'refresco':
              emoji = '🥤';
              break;
              
            // Extras específicos
            case 'guacamole':
              emoji = '🥑';
              break;
            case 'quesadilla':
              emoji = '🧀';
              break;
            case 'queso-extra':
              emoji = '🧀';
              break;
            case 'cebollitas':
              emoji = '🧅';
              break;
          }
        }
        
        // Si no se encontró un emoji específico por ID, intentar por categoría
        if (emoji === '🌮' && item.categoryId) {
          switch(item.categoryId.toLowerCase()) {
            case 'tacos':
              emoji = '🌮';
              break;
            case 'bebidas':
              emoji = '🥤';
              break;
            case 'extras':
              emoji = '🍽️';
              break;
          }
        }
      }
      
      return (
        <span className="text-6xl transform hover:scale-110 transition-transform duration-300">
          {emoji}
        </span>
      );
    }
  };
  
  return (
    <div 
      className={`product-card bg-white rounded-xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 ${
        isHighlighted ? 'highlight-pulse border-amber-400 shadow-amber-300' : ''
      }`}
      ref={internalRef}
      style={{
        opacity: item.available ? '1' : '0.5',
        /* Estilos sutiles para el resaltado sin animaciones abruptas */
        ...(isHighlighted ? {
          boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
          transform: 'scale(1.02)',
          transition: 'all 0.5s ease-in-out'
        } : {}),
      }}
      data-product-id={item.id}
    >
      <div className="relative overflow-hidden">
        {/* Imagen o Emoji */}
        <div className="h-44 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center overflow-hidden">
          {getProductImage()}
        </div>
        
        {/* Badge para productos destacados */}
        {item.featured && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
            Popular
          </div>
        )}
        
        {/* Badge para productos no disponibles */}
        {!item.available && (
          <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-red-500 text-white px-3 py-2 rounded-lg font-bold text-sm transform -rotate-12 shadow-lg">
              No disponible
            </span>
          </div>
        )}
        
        {/* Badge para alérgenos */}
        {item.allergens && item.allergens.length > 0 && (
          <div 
            className="absolute bottom-2 left-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm cursor-help flex items-center hover:bg-amber-50 transition-colors"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info size={12} className="mr-1 text-amber-500" />
            <span>Alérgenos</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-amber-900 text-lg">{item.name}</h3>
          <span className="price-tag font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm shadow-sm hover:scale-105 transition-transform">
            {formatCurrency(item.price)}
          </span>
        </div>
        
        <p className="text-amber-700 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{item.description}</p>
        
        {/* Panel de detalles expandible */}
        {showDetails && (
          <div className="mb-4 p-3 bg-amber-50 rounded-lg text-xs animate-fade-in border border-amber-100">
            {item.allergens && item.allergens.length > 0 && (
              <div className="mb-2">
                <span className="font-medium text-amber-900">Alérgenos:</span> {item.allergens.join(', ')}
              </div>
            )}
            
            {item.nutritionalInfo && (
              <div>
                <span className="font-medium text-amber-900">Info. Nutricional:</span>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {item.nutritionalInfo.calories && (
                    <div>Calorías: <span className="font-medium">{item.nutritionalInfo.calories}</span></div>
                  )}
                  {item.nutritionalInfo.protein && (
                    <div>Proteínas: <span className="font-medium">{item.nutritionalInfo.protein}g</span></div>
                  )}
                  {item.nutritionalInfo.carbs && (
                    <div>Carbohidratos: <span className="font-medium">{item.nutritionalInfo.carbs}g</span></div>
                  )}
                  {item.nutritionalInfo.fat && (
                    <div>Grasas: <span className="font-medium">{item.nutritionalInfo.fat}g</span></div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Controles de cantidad y agregar al carrito */}
        {item.available && (
          <div>
            {/* Campo de instrucciones especiales */}
            <div className="mb-3">
              <input
                type="text"
                placeholder="Instrucciones especiales"
                className="w-full p-2 border border-amber-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                disabled={isAddingToCart}
              />
            </div>
            
            <div className="flex justify-between items-center">
              {/* Control de cantidad */}
              <div className="flex items-center bg-amber-100 rounded-lg overflow-hidden">
                <button
                  className="p-2 text-amber-700 hover:bg-amber-200 transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isAddingToCart}
                  aria-label="Disminuir cantidad"
                >
                  <MinusCircle size={18} />
                </button>
                
                <span className="px-4 font-medium text-amber-900 select-none min-w-[2rem] text-center">
                  {quantity}
                </span>
                
                <button
                  className="p-2 text-amber-700 hover:bg-amber-200 transition-colors disabled:opacity-50"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10 || isAddingToCart}
                  aria-label="Aumentar cantidad"
                >
                  <PlusCircle size={18} />
                </button>
              </div>
              
              {/* Botón de agregar al carrito */}
              <button
                className={`flex items-center justify-center space-x-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 min-w-[8rem] ${isAddingToCart ? 'animate-pulse' : ''}`}
                onClick={handleAddToCart}
                disabled={isAddingToCart || !item.available}
                aria-label="Agregar al carrito"
              >
                {isAddingToCart ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Agregando...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} className="mr-1" />
                    <span>Agregar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Añadir displayName para DevTools
MenuCard.displayName = 'MenuCard';

export default MenuCard; 