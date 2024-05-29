/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: "/tiles/:path*",
      headers: [
        {
          key: "content-encoding",
          value: "gzip",
        },
      ],
    },
  ],
};

export default nextConfig;
