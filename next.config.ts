import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* Standalone output for self-contained Docker/Node deployment. */
  output: "standalone",
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
