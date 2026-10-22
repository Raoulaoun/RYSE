import type { NextConfig } from "next";

// STATIC_EXPORT=1 (set by `npm run build:static`) exports the marketing pages as
// plain files in out/, for free static hosting. Each page becomes <path>/index.html.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(staticExport ? { output: "export", trailingSlash: true, images: { unoptimized: true } } : {}),
};

export default nextConfig;
