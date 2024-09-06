import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: 'nextjs-3jxnpu1ni-tranngoctien29112003gmailcoms-projects.vercel.app',
            pathname:'/**'
          },{
            hostname: 'via.placeholder.com',
            pathname:'/**'
          }
        ]
      }
};

export default withNextIntl(nextConfig)

