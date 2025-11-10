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
  env: {
    // Reduce console noise in local dev when AI Gateway is not configured
    AI_FALLBACK_WARN: process.env.AI_FALLBACK_WARN ?? 'off',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@/components/ui'],
  },
  webpack: (config, { isServer }) => {
    // Ensure imports of `punycode` resolve to the npm package instead of the deprecated Node core module
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Force server-only import of Supabase SSR utilities to avoid bundling browser/realtime code
      // Try multiple fallbacks for the server-only entry point so builds don't fail when package layout differs
    };

    // Optionally alias `punycode` to the npm package if it's installed. We do this in a try/catch
    // so removing the npm package doesn't break builds; Node's builtin `punycode` may still be
    // loaded at runtime (that triggers deprecation warnings), but this prevents build-time
    // require.resolve errors when the user chooses to remove the dependency.
    try {
      const punycodePath = require.resolve('punycode/')
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        punycode: punycodePath,
        'node:punycode': punycodePath,
      }
    } catch (e) {
      // npm punycode not installed — skip aliasing
    }

    let supabaseSsrPath = null;
    try {
      supabaseSsrPath = require.resolve('@supabase/ssr/dist/module/createServerClient');
    } catch (e1) {
      try {
        supabaseSsrPath = require.resolve('@supabase/ssr/dist/module/index.mjs');
      } catch (e2) {
        try {
          supabaseSsrPath = require.resolve('@supabase/ssr');
        } catch (e3) {
          // Leave supabaseSsrPath null — don't alias if we can't resolve
        }
      }
    }

    if (supabaseSsrPath) {
      config.resolve.alias['@supabase/ssr$'] = supabaseSsrPath;
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
