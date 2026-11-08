import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  allowedDevOrigins: ['3000-i3uu3bogyayzfa0sq8in7.e2b.app', 'localhost'],
}

export default nextConfig
