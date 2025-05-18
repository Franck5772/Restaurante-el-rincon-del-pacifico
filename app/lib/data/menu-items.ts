import { MenuItem } from '../types';

/**
 * Datos de productos para el menú del Restaurante El Rincón del Pacífico
 * Especialidad en comida del Pacífico colombiano
 */
export const menuItems: MenuItem[] = [
  {
    id: 'encocado-pescado',
    name: 'Encocado de Pescado',
    description: 'Delicioso pescado en salsa de coco con hierbas y especias del Pacífico',
    price: 95.00,
    imageUrl: '🐟',
    categoryId: 'mariscos',
    available: true,
    featured: true
  },
  {
    id: 'ceviche-pacifico',
    name: 'Ceviche del Pacífico',
    description: 'Pescado fresco marinado en limón, coco y hierbas aromáticas del Pacífico',
    price: 85.00,
    imageUrl: '🐟',
    categoryId: 'mariscos',
    available: true
  },
  {
    id: 'camarones-encocados',
    name: 'Camarones Encocados',
    description: 'Camarones en deliciosa salsa de coco con especias del Pacífico',
    price: 110.00,
    imageUrl: '🦐',
    categoryId: 'mariscos',
    available: true
  },
  {
    id: 'pescado-aborrajado',
    name: 'Pescado Aborrajado',
    description: 'Filete de pescado envuelto en masa de plátano maduro y frito',
    price: 120.00,
    imageUrl: '🐠',
    categoryId: 'mariscos',
    available: true
  },
  {
    id: 'cazuela-mariscos',
    name: 'Cazuela de Mariscos',
    description: 'Deliciosa combinación de mariscos en salsa de coco con especias',
    price: 140.00,
    imageUrl: '🦞',
    categoryId: 'mariscos',
    available: true,
    featured: true
  },
  {
    id: 'agua-coco',
    name: 'Agua de Coco',
    description: 'Agua de coco natural y refrescante',
    price: 35.00,
    imageUrl: '🥥',
    categoryId: 'bebidas',
    available: true
  },
  {
    id: 'limonada-coco',
    name: 'Limonada de Coco',
    description: 'Refrescante limonada con leche de coco',
    price: 40.00,
    imageUrl: '🍹',
    categoryId: 'bebidas',
    available: true,
    featured: true
  },
  {
    id: 'jugo-borojó',
    name: 'Jugo de Borojó',
    description: 'Energizante jugo de fruta típica del Pacífico colombiano',
    price: 45.00,
    imageUrl: '🧃',
    categoryId: 'bebidas',
    available: true
  },
  {
    id: 'arroz-coco',
    name: 'Arroz con Coco',
    description: 'Tradicional arroz cocinado en leche de coco',
    price: 35.00,
    imageUrl: '🍚',
    categoryId: 'extras',
    available: true,
    featured: true
  },
  {
    id: 'patacones',
    name: 'Patacones',
    description: 'Plátano verde frito y aplastado, típico del Pacífico colombiano',
    price: 30.00,
    imageUrl: '🍌',
    categoryId: 'extras',
    available: true
  },
  {
    id: 'aborrajados',
    name: 'Aborrajados',
    description: 'Plátano maduro relleno de queso y frito',
    price: 40.00,
    imageUrl: '🧀',
    categoryId: 'extras',
    available: true
  }
];

export const menuCategories = [
  { id: 'mariscos', name: 'Mariscos', icon: '🦐' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
  { id: 'extras', name: 'Extras', icon: '🍽️' }
];