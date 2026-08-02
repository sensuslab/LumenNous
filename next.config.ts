import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* Standalone output for self-contained Docker/Node deployment. */
  output: "standalone",
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  /* The standalone promo landing is hand-written static HTML in
     `public/welcome/`, deliberately outside the App Router so it loads
     without any application JavaScript. Array-form rewrites are checked
     after the filesystem, so this only maps the extensionless URL. */
  async rewrites() {
    return [{ source: "/welcome", destination: "/welcome/index.html" }];
  },
};

export default nextConfig;
