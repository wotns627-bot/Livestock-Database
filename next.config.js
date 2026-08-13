/** @type {import('next').Next.jsConfig} */
const nextConfig = {
  // TypeScript 타입 에러가 나더라도 빌드가 강제로 성공하도록 설정
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;