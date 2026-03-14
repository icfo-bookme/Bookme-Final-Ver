const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.bookme.com.bd',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.bookme.com.bd',
        port: '',
        pathname: '/admin/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mvaralsea.com',
        port: '',
        pathname: '/**',
      },
      
    ],
  },
};

export default nextConfig;
