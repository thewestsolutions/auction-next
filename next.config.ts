import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "i.justbid-media.com",
      },
    ],
  },
  transpilePackages: [
    "@supabase/ssr",
    "@supabase/supabase-js",
    "@supabase/auth-helpers-shared",
    "@supabase/auth-helpers-nextjs",
    "@supabase/functions-js",
    "@supabase/storage-js",
    "@supabase/postgrest-js",
    "@supabase/gotrue-js",
    "@supabase/realtime-js",
  ],
  devIndicators: false,
};

export default nextConfig;
