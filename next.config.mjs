import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            hostname: 'cyperstack.com',
            pathname:'/**'
          },{
            hostname: 'via.placeholder.com',
            pathname:'/**'
          }
        ]
      }
};

export default withNextIntl(nextConfig)

