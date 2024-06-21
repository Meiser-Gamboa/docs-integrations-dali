/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/sega',
            permanent: false, 
        },
    ];
  },
};

export default nextConfig;
