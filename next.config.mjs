import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
  webpack: (config, { isServer }) => {
    // Ensure imports of `punycode` resolve to the npm package instead of the deprecated Node core module
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Force any imports of core 'punycode' or 'node:punycode' to the userland package
      punycode: require.resolve('punycode/'),
      'node:punycode': require.resolve('punycode/'),
      // Force server-only import of Supabase SSR utilities to avoid bundling browser/realtime code
      // Any `import { createServerClient } from "@supabase/ssr"` will be redirected to the server subpath
      '@supabase/ssr$': require.resolve('@supabase/ssr/dist/module/createServerClient'),
    }

    // Prefer in-memory caching to avoid webpack PackFileCacheStrategy serializing
    // very large strings to disk which triggers warnings and can slow deserialization.
    try {
      config.cache = { type: 'memory' }
    } catch (e) {
      // if config is frozen or unsupported in this Next.js version, ignore.
    }

    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default nextConfig
