/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Cross-Origin-Opener-Policy",
              value: "same-origin-allow-popups", // FIX: Allows Google login postMessage
            },
            {
              key: "Cross-Origin-Embedder-Policy",
              value: "require-corp", // Optional: Keep only if needed
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  