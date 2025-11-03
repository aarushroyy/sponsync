/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
    NEXT_PUBLIC_MAINTENANCE_BYPASS_SECRET: process.env.NEXT_PUBLIC_MAINTENANCE_BYPASS_SECRET,
  },
  experimental: {
    missingSuspenseWithCSRError: false,
  },
};

module.exports = nextConfig;
