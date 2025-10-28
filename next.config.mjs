/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
          {
            source: '/',
            destination: '/sega/v3',
            permanent: false, 
        },
          {
            source: '/sega',
            destination: '/sega/v3',
            permanent: false, 
        },
    ];
  },
};

export default nextConfig;
