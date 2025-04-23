/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'], // ✅ Allow GitHub avatars
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // ✅ Allows Google login postMessage
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // Optional
          },
        ],
      },
    ];
  },
};

export default nextConfig;
