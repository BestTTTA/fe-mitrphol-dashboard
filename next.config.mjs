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
  async exportPathMap(defaultPathMap) {
    delete defaultPathMap['/api/sb'];
    delete defaultPathMap['/api/mks'];
    delete defaultPathMap['/api/mpdc'];
    delete defaultPathMap['/api/mpk'];
    delete defaultPathMap['/api/mpl'];
    delete defaultPathMap['/api/mpv'];
    delete defaultPathMap['/api/mac'];

    return defaultPathMap;
  },
  
  staticPageGenerationTimeout: 600,
};

export default nextConfig;
