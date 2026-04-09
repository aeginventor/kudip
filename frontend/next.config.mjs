/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // API_BASE_URL: 서버사이드 환경변수 (NEXT_PUBLIC_ 불필요)
    // Vercel: Settings → Environment Variables → API_BASE_URL = http://EC2_IP:8080
    const apiBase = process.env.API_BASE_URL;
    if (!apiBase) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
