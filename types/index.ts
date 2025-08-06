// Tipos para los servicios
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  estimatedDuration: number; // en minutos
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// Tipos para productos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  stock: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
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
  userId: string;
  userEmail: string;
  userName: string;
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
