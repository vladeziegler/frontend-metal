import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    return config;
  },

  async rewrites() {
    return [
      {
        source: '/__/auth/iframe',
        destination: '/__/auth/iframe.html',
      },
      {
        // ✅ passthrough any Firebase Auth dynamic handler calls
        source: '/__/auth/:path*',
        destination: '/__/auth/:path*',
      },
    ];
  },
};

export default nextConfig;
