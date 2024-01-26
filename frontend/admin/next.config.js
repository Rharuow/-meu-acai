/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "offloadmedia.feverup.com",
      },
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
      },
    ],
  },
};

module.exports = nextConfig;
