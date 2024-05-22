/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove at some point...
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
