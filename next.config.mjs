/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.MEME_EDITOR_STATIC_EXPORT === "1" ? { output: "export" } : {}),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
