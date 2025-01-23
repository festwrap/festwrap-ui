/** @type {import('next').NextConfig} */
import nextTranslate from "next-translate-plugin"

const nextConfig = nextTranslate({
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'i.scdn.co',
      port: '',
      pathname: '/image/**'
    }]
  },
})

export default nextConfig
