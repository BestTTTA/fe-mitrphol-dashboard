/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/', 
          destination: '/SB', 
          permanent: true, 
        },
      ];
    },
    
   
    staticPageGenerationTimeout: 600,
  };
  
  export default nextConfig;
  