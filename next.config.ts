// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Any empty webpack callback disables Turbopack in dev, keeps Webpack
  webpack: (config) => config,

  async rewrites() {
    return [
      // Silent session-management iframe
      { source: '/__/auth/iframe',  destination: '/__/auth/iframe.html' },

      // Redirect-completion page
      { source: '/__/auth/handler', destination: '/__/auth/handler.html' },
    ];
  },
};

export default nextConfig;
