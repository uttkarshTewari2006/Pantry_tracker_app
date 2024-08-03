/*import { createProxyMiddleware } from "http-proxy-middleware";
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.llama-api.com/:path*", // Proxy to the API
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devServer = {
        ...config.devServer,
        proxy: {
          "/api": {
            target: "https://api.llama-api.com",
            changeOrigin: true,
            pathRewrite: { "^/api": "" },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;*/

const nextConfig = {};

export default nextConfig;
