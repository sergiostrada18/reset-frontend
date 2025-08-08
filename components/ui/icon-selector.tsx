'use client'

import { useState } from 'react';
import { 
  Snowflake, 
  Wifi, 
  Camera, 
  Shield, 
  Wrench, 
  Monitor, 
  Smartphone, 
  Cpu, 
  HardDrive, 
  Router, 
  Zap, 
  Car, 
  Home, 
  Lock, 
  Settings, 
  Hammer, 
  Laptop, 
  Server, 
  Database, 
  Globe,
  Phone,
  Tv,
  Radio,
  Headphones,
  Printer,
  Keyboard,
  Mouse,
  Gamepad2,
  Watch,
  Tablet,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IconOption {
  name: string;
  icon: LucideIcon;
  category: string;
  description: string;
}

const iconOptions: IconOption[] = [
  // Climatización
  { name: 'snowflake', icon: Snowflake, category: 'climatizacion', description: 'Aire acondicionado / Refrigeración' },
  { name: 'zap', icon: Zap, category: 'climatizacion', description: 'Sistemas eléctricos / Ventilación' },
  
  // Informática y Redes
  { name: 'wifi', icon: Wifi, category: 'informatica', description: 'Redes inalámbricas / WiFi' },
  { name: 'monitor', icon: Monitor, category: 'informatica', description: 'Computadoras / Monitores' },
  { name: 'laptop', icon: Laptop, category: 'informatica', description: 'Laptops / Portátiles' },
  { name: 'smartphone', icon: Smartphone, category: 'informatica', description: 'Smartphones / Móviles' },
  { name: 'cpu', icon: Cpu, category: 'informatica', description: 'Procesadores / Hardware' },
  { name: 'hard-drive', icon: HardDrive, category: 'informatica', description: 'Almacenamiento / Discos' },
  { name: 'router', icon: Router, category: 'informatica', description: 'Routers / Equipos de red' },
  { name: 'server', icon: Server, category: 'informatica', description: 'Servidores / Sistemas' },
  { name: 'database', icon: Database, category: 'informatica', description: 'Bases de datos / Software' },
  { name: 'globe', icon: Globe, category: 'informatica', description: 'Internet / Web' },
  { name: 'printer', icon: Printer, category: 'informatica', description: 'Impresoras / Periféricos' },
  { name: 'keyboard', icon: Keyboard, category: 'informatica', description: 'Teclados / Accesorios' },
  { name: 'mouse', icon: Mouse, category: 'informatica', description: 'Mouse / Periféricos' },
  { name: 'tablet', icon: Tablet, category: 'informatica', description: 'Tablets / Dispositivos móviles' },
  
  // Seguridad
  { name: 'camera', icon: Camera, category: 'seguridad', description: 'Cámaras de seguridad / CCTV' },
  { name: 'shield', icon: Shield, category: 'seguridad', description: 'Sistemas de seguridad / Alarmas' },
  { name: 'lock', icon: Lock, category: 'seguridad', description: 'Control de acceso / Cerraduras' },
  
  // Mantenimiento
  { name: 'wrench', icon: Wrench, category: 'mantenimiento', description: 'Reparaciones generales' },
  { name: 'hammer', icon: Hammer, category: 'mantenimiento', description: 'Herramientas / Mantenimiento' },
  { name: 'settings', icon: Settings, category: 'mantenimiento', description: 'Configuración / Ajustes' },
  { name: 'car', icon: Car, category: 'mantenimiento', description: 'Vehículos / Automotriz' },
  { name: 'home', icon: Home, category: 'mantenimiento', description: 'Hogar / Residencial' },
  
  // Electrónicos y Entretenimiento
  { name: 'tv', icon: Tv, category: 'otros', description: 'Televisores / Entretenimiento' },
  { name: 'radio', icon: Radio, category: 'otros', description: 'Audio / Sonido' },
  { name: 'headphones', icon: Headphones, category: 'otros', description: 'Audio / Auriculares' },
  { name: 'gamepad', icon: Gamepad2, category: 'otros', description: 'Gaming / Videojuegos' },
  { name: 'watch', icon: Watch, category: 'otros', description: 'Relojes / Wearables' },
  { name: 'phone', icon: Phone, category: 'otros', description: 'Teléfonos / Comunicación' },
];

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconName: string) => void;
  category?: string;
  className?: string;
}

export function IconSelector({ selectedIcon, onIconSelect, category, className }: IconSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar iconos por categoría y término de búsqueda
  const filteredIcons = iconOptions.filter(option => {
    const matchesCategory = !category || option.category === category;
    const matchesSearch = !searchTerm || 
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(opt => opt.name === iconName);
    if (!option) return Monitor; // Icon por defecto
    return option.icon;
  };

  const SelectedIconComponent = getIconComponent(selectedIcon);

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Vista previa del icono seleccionado */}
        <div className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
          <SelectedIconComponent className="h-8 w-8 text-blue-600" />
          <div>
            <p className="font-medium">Icono seleccionado: {selectedIcon}</p>
            <p className="text-sm text-gray-600">
              {iconOptions.find(opt => opt.name === selectedIcon)?.description || 'Icono personalizado'}
            </p>
          </div>
        </div>

        {/* Buscador */}
        <div>
          <input
            type="text"
            placeholder="Buscar iconos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Grid de iconos */}
        <ScrollArea className="h-64 w-full border rounded-md">
          <div className="grid grid-cols-6 gap-2 p-4">
            {filteredIcons.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedIcon === option.name;
              
              return (
                <Button type="button"
                  key={option.name}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className={`h-16 w-16 flex flex-col items-center justify-center p-2 ${
                    isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'
                  }`}
                  onClick={() => onIconSelect(option.name)}
                  title={`${option.description} (${option.name})`}
                >
                  <IconComponent className="h-6 w-6 mb-1" />
                  <span className="text-xs truncate w-full text-center">
                    {option.name}
                  </span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Información adicional */}
        <div className="text-sm text-gray-600">
          <p>Mostrando {filteredIcons.length} iconos disponibles</p>
          {category && (
            <p>Filtrado por categoría: <span className="font-medium">{category}</span></p>
          )}
        </div>
      </div>
    </div>
  );
}

// Hook para obtener el componente de icono por nombre
export function useIcon(iconName: string): LucideIcon {
  const option = iconOptions.find(opt => opt.name === iconName);
  return option?.icon || Monitor;
}

// Componente para mostrar un icono por nombre
interface IconDisplayProps {
  iconName: string;
  className?: string;
  size?: number;
}

export function IconDisplay({ iconName, className = "", size = 24 }: IconDisplayProps) {
  const IconComponent = useIcon(iconName);
  return <IconComponent className={className} size={size} />;
}

export { iconOptions };
