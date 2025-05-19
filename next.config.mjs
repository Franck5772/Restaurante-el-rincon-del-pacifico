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
    ULTRAVOX_API_KEY: process.env.ULTRAVOX_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
};

export default nextConfig;
