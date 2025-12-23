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
    // Keep Razorpay API routes on the frontend (they need frontend env keys)
    // and proxy everything else under /api/* to the backend.
    const backend = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
    return [
      {
        source: '/api/razorpay/:path*',
        destination: '/api/razorpay/:path*',
      },
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ];
  },
}

export default nextConfig
