/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // All imagery is local (under /public). No external image hosts by design.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
