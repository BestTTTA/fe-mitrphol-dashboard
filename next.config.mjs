/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/', // หน้าแรก
          destination: '/SB', // หน้าที่คุณต้องการ redirect ไป
          permanent: true, // ถาวรหรือไม่
        },
      ];
    },
    
    // Increase the static page generation timeout
    staticPageGenerationTimeout: 300, // Set timeout to 120 seconds (default is 60 seconds)
  };
  
  export default nextConfig;
  