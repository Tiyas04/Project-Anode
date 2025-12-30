import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"thumbs.dreamstime.com",
      }
    ]
  }
};

export default nextConfig;
