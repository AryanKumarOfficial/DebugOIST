const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com'
      },
      {
        hostname: 'images.unsplash.com'
      }, 
      {
        hostname: 'assets.aceternity.com'
      },
      {
        hostname: 'ui.aceternity.com'
      }
      
    ]
  }
}

module.exports = withNextIntl(nextConfig)
