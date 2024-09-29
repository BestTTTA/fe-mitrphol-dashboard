/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/', // หน้าแรก
          destination: '/SB', // หน้าที่คุณต้องการ redirect ไป
          permanent: true, // ถาวรหรือไม่
        },
      ]
    },
  };
  
  export default nextConfig;
  