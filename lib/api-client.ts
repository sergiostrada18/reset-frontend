import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Service, ServiceCreate, Product, User, AuthResponse, LoginRequest, RegisterRequest, ApiResponse, PaginatedResponse, CarouselSlide, CarouselSlideCreate, CarouselSlideUpdate } from '@/types';

class ApiClient {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // URL del backend - cambiar según el entorno
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      // Reduce timeout to fail fast when backend is unreachable
      timeout: 8000,
    });

    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        console.log('🔑 Request interceptor - Token check:', {
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
          url: config.url,
          method: config.method?.toUpperCase()
        });
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Authorization header added');
        } else {
          console.log('❌ No token found - Authorization header NOT added');
        }
        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de respuesta
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Response success:', {
          status: response.status,
          url: response.config.url,
          method: response.config.method?.toUpperCase()
        });
        return response;
      },
      (error) => {
        console.error('❌ Response error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          data: error.response?.data
        });
        
        if (error.response?.status === 401) {
          console.log('🚫 401 Unauthorized - Clearing token and redirecting');
          // Token expirado o inválido
          this.clearAuthToken();
          // Solo redirigir si estamos en el cliente
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticación
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }

  private setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_token', token);
    }
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    console.log('🔑 Attempting login for:', credentials.email);

    const response: AxiosResponse<any> = await this.api.post(
      '/api/v1/auth/login',
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('✅ Login response received:', response.data);

    // El backend devuelve access_token, no accessToken
    const token = response.data.access_token;
    
    if (!token) {
      throw new Error('No se recibió token de autenticación');
    }

    // Guardar token y datos de usuario
    this.setAuthToken(token);
    
    if (response.data.user) {
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    console.log('💾 Token and user data saved');

    // Transformar la respuesta al formato esperado por el frontend
    return {
      accessToken: token,
      tokenType: response.data.token_type || 'bearer',
      user: response.data.user
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/api/v1/auth/register', userData);
    
    // Guardar token automáticamente
    this.setAuthToken(response.data.accessToken);
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/api/v1/auth/me');
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/api/v1/auth/logout');
    } finally {
      this.clearAuthToken();
    }
  }

  // Services endpoints
  async getServices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    isActive?: boolean;
  }): Promise<Service[]> {
    const response: AxiosResponse<Service[]> = await this.api.get('/api/v1/services/', {
      params,
    });
    return response.data;
  }

  async getServiceById(id: string): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.get(`/api/v1/services/${id}`);
    return response.data;
  }

  async createService(serviceData: ServiceCreate): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.post('/api/v1/services/', serviceData);
    return response.data;
  }

  async updateService(id: string, serviceData: Partial<Service>): Promise<Service> {
    const response: AxiosResponse<Service> = await this.api.put(`/api/v1/services/${id}`, serviceData);
    return response.data;
  }

  async deleteService(id: string): Promise<void> {
    await this.api.delete(`/api/v1/services/${id}`);
  }

  async getServiceCategories(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/api/v1/services/categories');
    return response.data;
  }

  // Products endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    isActive?: boolean;
  }): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get('/api/v1/products/', {
      params,
    });
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/api/v1/products/${id}`);
    return response.data;
  }

  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response: AxiosResponse<Product> = await this.api.post('/api/v1/products/', productData);
      return response.data;
    } catch (error: any) {
      console.error('❌ createProduct error detail:', {
        status: error.response?.status,
        detail: error.response?.data?.detail ?? error.response?.data
      });
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.put(`/api/v1/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/api/v1/products/${id}`);
  }

  async getProductCategories(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/api/v1/products/categories');
    return response.data;
  }

  // Search endpoints
  async searchServices(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Service[]> {
    const response: AxiosResponse<Service[]> = await this.api.get('/api/v1/services/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  }

  async searchProducts(query: string, filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get('/api/v1/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  }

  // ============ CAROUSEL ENDPOINTS ============
  
  // Obtener slides activos para el frontend público
  async getActiveCarouselSlides(): Promise<CarouselSlide[]> {
    const response: AxiosResponse<CarouselSlide[]> = await this.api.get('/api/v1/carousel/slides/active');
    // Mapear _id a id para compatibilidad con el frontend
    return response.data.map(slide => ({
      ...slide,
      id: (slide as any)._id || slide.id
    }));
  }

  // Obtener todos los slides (admin)
  async getAllCarouselSlides(activeOnly: boolean = false): Promise<CarouselSlide[]> {
    const response: AxiosResponse<CarouselSlide[]> = await this.api.get('/api/v1/carousel/slides', {
      params: { active_only: activeOnly }
    });
    // Mapear _id a id para compatibilidad con el frontend
    return response.data.map(slide => ({
      ...slide,
      id: (slide as any)._id || slide.id
    }));
  }

  // Obtener slide por ID
  async getCarouselSlideById(slideId: string): Promise<CarouselSlide> {
    const response: AxiosResponse<CarouselSlide> = await this.api.get(`/api/v1/carousel/slides/${slideId}`);
    return response.data;
  }

  // Crear nuevo slide (admin)
  async createCarouselSlide(slideData: CarouselSlideCreate): Promise<CarouselSlide> {
    const response: AxiosResponse<CarouselSlide> = await this.api.post('/api/v1/carousel/slides', slideData);
    return response.data;
  }

  // Actualizar slide (admin)
  async updateCarouselSlide(slideId: string, slideData: CarouselSlideUpdate): Promise<CarouselSlide> {
    const response: AxiosResponse<CarouselSlide> = await this.api.put(`/api/v1/carousel/slides/${slideId}`, slideData);
    return response.data;
  }

  // Cambiar estado activo/inactivo (admin)
  async toggleCarouselSlideStatus(slideId: string): Promise<CarouselSlide> {
    const response: AxiosResponse<CarouselSlide> = await this.api.patch(`/api/v1/carousel/slides/${slideId}/toggle`);
    return response.data;
  }

  // Eliminar slide (admin)
  async deleteCarouselSlide(slideId: string): Promise<void> {
    await this.api.delete(`/api/v1/carousel/slides/${slideId}`);
  }

  // Reordenar slides (admin)
  async reorderCarouselSlides(slideOrders: Array<{ id: string; order: number }>): Promise<void> {
    await this.api.post('/api/v1/carousel/slides/reorder', slideOrders);
  }

  // === UPLOADS ===
  
  // Subir imagen
  async uploadImage(file: File): Promise<{ success: boolean; filename: string; url: string; size: number }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.api.post('/api/v1/uploads/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Listar imágenes subidas (admin)
  async listImages(): Promise<{ images: Array<{ filename: string; url: string; size: number; created: number }> }> {
    const response = await this.api.get('/api/v1/uploads/images');
    return response.data;
  }

  // Eliminar imagen (admin)
  async deleteImage(filename: string): Promise<{ success: boolean; message: string }> {
    const response = await this.api.delete(`/api/v1/uploads/images/${filename}`);
    return response.data;
  }

  // === CONTACT ===
  async submitContactMinimal(data: { name: string; phone: string; message?: string }): Promise<{ message: string; status: string }> {
    const payload = {
      name: data.name,
      phone: data.phone,
      message: data.message ?? "",
      // backend allows email null; we omit it here
    } as any;
    const response = await this.api.post('/api/v1/contact/contact', payload);
    return response.data;
  }
}

// Singleton instance
export const apiClient = new ApiClient();
export default apiClient;
