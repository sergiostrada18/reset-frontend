# RESET Multiservicios - Frontend

Frontend de la aplicación web de RESET Multiservicios desarrollado con Next.js 15.

## 🚀 Características

- ⚡ Next.js 15 con App Router
- 🎨 Tailwind CSS para estilos
- 🌙 Modo claro/oscuro
- 📱 Diseño responsivo
- 🎭 Animaciones con Framer Motion
- 🎯 TypeScript para type safety
- 📊 Componentes UI con shadcn/ui

## 🏗️ Tecnologías

- **Framework**: Next.js 15.2.4
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx          # Página de inicio
│   ├── admin/            # Panel de administración
│   └── login/            # Página de login
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de shadcn/ui
│   ├── carousel-client.tsx
│   ├── reset-logo.tsx
│   └── ...
├── hooks/               # Custom hooks
├── lib/                 # Utilidades y configuración
├── types/              # Definiciones de tipos TypeScript
└── public/             # Archivos estáticos
```

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Crear build de producción
- `npm run start` - Ejecutar build de producción
- `npm run lint` - Ejecutar linter

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NODE_ENV=production
```

## 📝 Licencia

© 2024 RESET Multiservicios. Todos los derechos reservados.
