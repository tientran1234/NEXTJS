/** @type {import('next').NextConfig} */
const nextConfig = {
  unstable_allowDynamic: [
    '/lib/utilities.js', // allows a single file
    '/node_modules/function-bind/**', // use a glob to allow anything in the function-bind 3rd party module
  ],
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '4000',
            pathname:'/**'
          },{
            hostname: 'via.placeholder.com',
            pathname:'/**'
          }
        ]
      }
};

export default nextConfig;

