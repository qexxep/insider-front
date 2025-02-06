/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://your-api-server.com/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
