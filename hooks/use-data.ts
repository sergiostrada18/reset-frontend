import { useState, useEffect } from 'react';
import { Service, Product, CarouselSlide, CarouselSlideCreate, CarouselSlideUpdate } from '@/types';
import { apiClient } from '@/lib/api-client';
import { processCarouselSlideImages } from '@/lib/image-utils';

// Mock data mientras no tengas el backend conectado
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Sistemas de Seguridad',
    description: 'Cámaras IP, CCTV, alarmas y control de acceso',
    price: 299,
    category: 'Seguridad',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    estimatedDuration: 120,
    features: ['Cámaras HD/4K', 'Monitoreo remoto', 'Grabación en la nube', 'Instalación profesional'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Aires Acondicionados',
    description: 'Instalación, reparación y mantenimiento',
    price: 599,
    category: 'Climatización',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    estimatedDuration: 180,
    features: ['Todas las marcas', 'Servicio 24/7', 'Repuestos originales', 'Garantía extendida'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Servicios de Informática',
    description: 'Soporte técnico y soluciones IT',
    price: 149,
    category: 'Informática',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    estimatedDuration: 90,
    features: ['Reparación de PC', 'Redes y WiFi', 'Software y hardware', 'Consultoría IT'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Reparaciones Generales',
    description: 'Mantenimiento integral para hogar y negocio',
    price: 99,
    category: 'Mantenimiento',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    estimatedDuration: 60,
    features: ['Electricidad', 'Plomería', 'Carpintería', 'Pintura y acabados'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cámara IP 4K',
    description: 'Cámara de seguridad con resolución 4K',
    price: 299,
    category: 'Seguridad',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    stock: 15,
    features: ['Resolución 4K', 'Visión nocturna', 'Audio bidireccional', 'Resistente al agua'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Kit de 4 Cámaras',
    description: 'Kit completo de videovigilancia',
    price: 899,
    category: 'Seguridad',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    stock: 8,
    features: ['4 cámaras HD', 'DVR incluido', 'Cables y accesorios', 'App móvil gratuita'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Aire Split 12000 BTU',
    description: 'Aire acondicionado Split inverter',
    price: 599,
    category: 'Climatización',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    stock: 12,
    features: ['Inverter', 'Bajo consumo', 'Control remoto', 'Instalación incluida'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Sistema de Alarma',
    description: 'Sistema de alarma inalámbrico',
    price: 399,
    category: 'Seguridad',
    imageUrl: '/placeholder.svg?height=300&width=300',
    isActive: true,
    stock: 20,
    features: ['Sensores inalámbricos', 'Panel táctil', 'Notificaciones móvil', 'Batería de respaldo'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Hook para servicios
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // TODO: Reemplazar con llamada real a la API
        // const response = await apiClient.getServices();
        // setServices(response.items);
        
        // Por ahora usar datos mock
        setTimeout(() => {
          setServices(mockServices);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error al cargar servicios');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error, refetch: () => window.location.reload() };
};

// Hook para productos
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // TODO: Reemplazar con llamada real a la API
        // const response = await apiClient.getProducts();
        // setProducts(response.items);
        
        // Por ahora usar datos mock
        setTimeout(() => {
          setProducts(mockProducts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Error al cargar productos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error, refetch: () => window.location.reload() };
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
      
      let slidesData: CarouselSlide[];
      if (activeOnly) {
        slidesData = await apiClient.getActiveCarouselSlides();
      } else {
        slidesData = await apiClient.getAllCarouselSlides();
      }
      
      // Procesar URLs de imágenes para que sean completas
      const processedSlides = processCarouselSlideImages(slidesData);
      setSlides(processedSlides);
    } catch (err: any) {
      console.error('Error fetching carousel slides:', err);
      setError(err.message || 'Error al cargar slides del carrusel');
      
      // Fallback a datos mock en caso de error
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, [activeOnly]);

  const refetch = () => {
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
