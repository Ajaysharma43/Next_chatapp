/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "Cross-Origin-Opener-Policy",
              value: "same-origin-allow-popups", // Allows postMessage from Google popup
            },
            {
              key: "Cross-Origin-Embedder-Policy",
              value: "require-corp", // Optional: Keep only if needed for things like WebAssembly
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  
