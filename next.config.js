/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    RECRAFT_API_KEY: process.env.RECRAFT_API_KEY,
  },
  publicRuntimeConfig: {
    RECRAFT_API_KEY: process.env.RECRAFT_API_KEY,
  },
}

module.exports = nextConfig
