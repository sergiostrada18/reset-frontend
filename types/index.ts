// Tipos para los servicios
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string; // Nombre del icono en lugar de image_url
  is_active: boolean;
  estimated_duration: number; // en minutos
  features: string[];
  created_at: string;
}

export interface ServiceCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string; // Nombre del icono
  estimated_duration: number;
  features: string[];
}

export interface ServiceUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  icon?: string; // Nombre del icono
  is_active?: boolean;
  estimated_duration?: number;
  features?: string[];
}

// Tipos para productos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string; // Icono en lugar de image_url
  image?: string; // URL de imagen del producto
  is_active: boolean;
  stock: number;
  features: string[];
  created_at: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string; // Icono en lugar de image_url
  image?: string; // URL de imagen cargada
  stock: number;
  features: string[];
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  icon?: string; // Icono en lugar de image_url
  image?: string; // URL de imagen actualizada
  is_active?: boolean;
  stock?: number;
  features?: string[];
}

// Tipos para autenticación
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    is_active: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Tipos para el carrusel
export interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  show_button: boolean;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarouselSlideCreate {
  title: string;
  description: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
  show_button?: boolean;
  order?: number;
  is_active?: boolean;
}

export interface CarouselSlideUpdate {
  title?: string;
  description?: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  show_button?: boolean;
  order?: number;
  is_active?: boolean;
}
