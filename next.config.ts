const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost'], // Blocks external access in dev
    },
  },
};

module.exports = nextConfig;