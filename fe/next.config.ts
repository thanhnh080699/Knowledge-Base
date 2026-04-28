import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
      {
        protocol: "http",
        hostname: "**"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug",
        destination: "/docs/:slug",
        permanent: true
      },
      {
        source: "/category/:cat",
        destination: "/docs?category=:cat",
        permanent: true
      },
      {
        source: "/",
        has: [{ type: "query", key: "p" }],
        destination: "/",
        permanent: true
      }
    ]
  }
}

export default nextConfig
