/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // All imagery is local (under /public). No external image hosts by design.
    formats: ["image/avif", "image/webp"],
  },
  // The How I Think page became How I Work. Old links still land on it.
  async redirects() {
    return [
      { source: "/how-i-think", destination: "/how-i-work", permanent: true },
    ];
  },
};

export default nextConfig;
