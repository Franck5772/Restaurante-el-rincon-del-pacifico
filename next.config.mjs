/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['cdn.vercel.com'],
    formats: ['image/webp'],
  },
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  experimental: {
    serverActions: true,
    instrumentationHook: true
  },
  publicRuntimeConfig: {
    ULTRAVOX_API_KEY: process.env.ULTRAVOX_API_KEY
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
