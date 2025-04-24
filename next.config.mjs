/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com',"storage.googleapis.com"], 
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", 
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", 
          },
        ],
      },
    ];
  },
};

export default nextConfig;
