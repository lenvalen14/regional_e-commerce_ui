import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // Cho phép Next/Image load ảnh từ Cloudinary
  },
};

export default nextConfig;

