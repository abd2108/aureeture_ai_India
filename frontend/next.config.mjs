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
  },
  async rewrites() {
    // Proxy all frontend calls to /api/* to the backend server.
    // Uses NEXT_PUBLIC_API_BASE_URL if provided; otherwise defaults to localhost:5001
    const backend = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ];
  },
}

export default nextConfig
