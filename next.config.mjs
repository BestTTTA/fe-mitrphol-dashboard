/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/', 
        destination: '/zone/sb', 
        permanent: false, 
      },
    ];
  },
};


export default nextConfig;
