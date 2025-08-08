import { useState, useEffect } from 'react';
import { Service, Product, ServiceCreate, ServiceUpdate, ProductCreate, ProductUpdate, CarouselSlide, CarouselSlideCreate, CarouselSlideUpdate } from '@/types';
import { apiClient } from '@/lib/api-client';
import { processCarouselSlideImages } from '@/lib/image-utils';

// Mock data mientras no tengas el backend conectado
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Sistemas de Seguridad',
    description: 'Cámaras IP, CCTV, alarmas y control de acceso',
    price: 299,
    category: 'seguridad',
    icon: 'shield',
    is_active: true,
    estimated_duration: 120,
    features: ['Cámaras HD/4K', 'Monitoreo remoto', 'Grabación en la nube', 'Instalación profesional'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Aires Acondicionados',
    description: 'Instalación, reparación y mantenimiento',
    price: 599,
    category: 'climatizacion',
    icon: 'snowflake',
    is_active: true,
    estimated_duration: 180,
    features: ['Todas las marcas', 'Servicio 24/7', 'Repuestos originales', 'Garantía extendida'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Servicios de Informática',
    description: 'Soporte técnico y soluciones IT',
    price: 149,
    category: 'informatica',
    icon: 'monitor',
    is_active: true,
    estimated_duration: 90,
    features: ['Reparación de PC', 'Redes y WiFi', 'Software y hardware', 'Consultoría IT'],
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Reparaciones Generales',
    description: 'Mantenimiento integral para hogar y negocio',
    price: 99,
    category: 'mantenimiento',
    icon: 'wrench',
    is_active: true,
    estimated_duration: 60,
    features: ['Electricidad', 'Plomería', 'Carpintería', 'Pintura y acabados'],
    created_at: new Date().toISOString(),
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cámara IP 4K',
    description: 'Cámara de seguridad con resolución 4K',
    price: 299,
    category: 'Seguridad',
    image_url: '/placeholder.svg?height=300&width=300',
    is_active: true,
    stock: 15,
    features: ['Resolución 4K', 'Visión nocturna', 'Audio bidireccional', 'Resistente al agua'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Kit de 4 Cámaras',
    description: 'Kit completo de videovigilancia',
    price: 899,
    category: 'Seguridad',
    image_url: '/placeholder.svg?height=300&width=300',
    is_active: true,
    stock: 8,
    features: ['4 cámaras HD', 'DVR incluido', 'Cables y accesorios', 'App móvil gratuita'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Aire Split 12000 BTU',
    description: 'Aire acondicionado Split inverter',
    price: 599,
    category: 'Climatización',
    image_url: '/placeholder.svg?height=300&width=300',
    is_active: true,
    stock: 12,
    features: ['Inverter', 'Bajo consumo', 'Control remoto', 'Instalación incluida'],
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sistema de Alarma',
    description: 'Sistema de alarma inalámbrico',
    price: 399,
    category: 'Seguridad',
    image_url: '/placeholder.svg?height=300&width=300',
    is_active: true,
    stock: 20,
    features: ['Sensores inalámbricos', 'Panel táctil', 'Notificaciones móvil', 'Batería de respaldo'],
    created_at: new Date().toISOString(),
  },
];

// Hook para servicios
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📡 Cargando servicios desde el backend...');
      const services = await apiClient.getServices();
      
      if (services) {
        setServices(services);
        console.log('✅ Servicios cargados exitosamente:', services.length);
      } else {
        throw new Error('No se encontraron servicios');
      }
      
    } catch (err) {
      console.error('Error al cargar servicios:', err);
      setError('Error al cargar servicios');
      // Fallback a datos mock en caso de error
      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const refetch = async () => {
    await fetchServices();
  };

  return { services, loading, error, refetch };
};

// Hook para productos
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Llamada real a la API
      const response = await apiClient.getProducts();
      // Verificar si la respuesta es un array o un objeto con data
      const productsData = Array.isArray(response) ? response : response?.data || [];
      setProducts(productsData);
      
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar productos');
      // Fallback a datos mock en caso de error
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const refetch = async () => {
    await fetchProducts();
  };

  return { products, loading, error, refetch };
};

// Hook para categorías
export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // TODO: Reemplazar con llamada real a la API
        // const serviceCategories = await apiClient.getServiceCategories();
        // const productCategories = await apiClient.getProductCategories();
        // const allCategories = [...new Set([...serviceCategories, ...productCategories])];
        // setCategories(allCategories);
        
        // Por ahora usar datos mock
        setTimeout(() => {
          setCategories(['Seguridad', 'Climatización', 'Informática', 'Mantenimiento']);
          setLoading(false);
        }, 500);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};

// Hook para el carrusel
export const useCarouselSlides = (activeOnly: boolean = false) => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching carousel slides...', { activeOnly });
      console.log('🌐 API Base URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
      
      let slidesData: CarouselSlide[];
      if (activeOnly) {
        console.log('📡 Calling getActiveCarouselSlides...');
        slidesData = await apiClient.getActiveCarouselSlides();
      } else {
        console.log('📡 Calling getAllCarouselSlides...');
        slidesData = await apiClient.getAllCarouselSlides();
      }
      
      console.log('✅ Carousel slides received:', slidesData.length, 'slides');
      console.log('📊 Slides data:', slidesData);
      
      // Procesar URLs de imágenes para que sean completas
      const processedSlides = processCarouselSlideImages(slidesData);
      console.log('🖼️ Processed slides:', processedSlides.length, 'slides');
      console.log('🖼️ First processed slide:', processedSlides[0]);
      
      setSlides(processedSlides);
    } catch (err: any) {
      console.error('❌ Error fetching carousel slides:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      setError(err.message || 'Error al cargar slides del carrusel');
      
      // Fallback a datos vacíos en caso de error
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [activeOnly]);

  const refetch = () => {
    console.log('🔄 Refetching carousel slides...');
    fetchSlides();
  };

  return { 
    slides, 
    loading, 
    error, 
    refetch 
  };
};

// Hook para gestión del carrusel (admin)
export const useCarouselManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSlide = async (slideData: CarouselSlideCreate): Promise<CarouselSlide | null> => {
    try {
      setLoading(true);
      setError(null);
      const newSlide = await apiClient.createCarouselSlide(slideData);
      return newSlide;
    } catch (err: any) {
      console.error('Error creating slide:', err);
      if (err.response?.status === 401) {
        // Token expirado, redirigir al login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al crear slide');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSlide = async (slideId: string, slideData: CarouselSlideUpdate): Promise<CarouselSlide | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedSlide = await apiClient.updateCarouselSlide(slideId, slideData);
      return updatedSlide;
    } catch (err: any) {
      console.error('Error updating slide:', err);
      if (err.response?.status === 401) {
        // Token expirado, redirigir al login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al actualizar slide');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteSlide = async (slideId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteCarouselSlide(slideId);
      return true;
    } catch (err: any) {
      console.error('Error deleting slide:', err);
      setError(err.message || 'Error al eliminar slide');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSlideStatus = async (slideId: string): Promise<CarouselSlide | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedSlide = await apiClient.toggleCarouselSlideStatus(slideId);
      return updatedSlide;
    } catch (err: any) {
      console.error('Error toggling slide status:', err);
      setError(err.message || 'Error al cambiar estado del slide');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reorderSlides = async (slideOrders: Array<{ id: string; order: number }>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.reorderCarouselSlides(slideOrders);
      return true;
    } catch (err: any) {
      console.error('Error reordering slides:', err);
      setError(err.message || 'Error al reordenar slides');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createSlide,
    updateSlide,
    deleteSlide,
    toggleSlideStatus,
    reorderSlides,
  };
};

// Hook para gestión de servicios (admin)
export const useServiceManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createService = async (serviceData: ServiceCreate): Promise<Service | null> => {
    try {
      setLoading(true);
      setError(null);
      const newService = await apiClient.createService(serviceData);
      return newService;
    } catch (err: any) {
      console.error('Error creating service:', err);
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al crear servicio');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceId: string, serviceData: ServiceUpdate): Promise<Service | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedService = await apiClient.updateService(serviceId, serviceData);
      return updatedService;
    } catch (err: any) {
      console.error('Error updating service:', err);
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al actualizar servicio');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteService(serviceId);
      return true;
    } catch (err: any) {
      console.error('Error deleting service:', err);
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al eliminar servicio');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createService,
    updateService,
    deleteService,
  };
};

// Hook para gestión de productos (admin)
export const useProductManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (productData: ProductCreate): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      const newProduct = await apiClient.createProduct(productData);
      return newProduct;
    } catch (err: any) {
      console.error('Error creating product:', err);
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al crear producto');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, productData: ProductUpdate): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedProduct = await apiClient.updateProduct(productId, productData);
      return updatedProduct;
    } catch (err: any) {
      console.error('Error updating product:', err);
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al actualizar producto');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteProduct(productId);
      return true;
    } catch (err: any) {
      console.error('Error deleting product:', err);
      if (err.response?.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        setError('Sesión expirada. Redirigiendo al login...');
      } else {
        setError(err.response?.data?.detail || err.message || 'Error al eliminar producto');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
