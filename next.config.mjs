/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['placeholder.svg', 'resetmultiservicios.com'],
  },
  // Para el dominio personalizado
  trailingSlash: false,
  // Compresión
  compress: true,
}

export default nextConfig
