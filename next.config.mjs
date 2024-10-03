/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/', 
        destination: '/zone/sb', 
        permanent: true, 
      },
    ];
  },
  
  staticPageGenerationTimeout: 600,
};

export default nextConfig;
