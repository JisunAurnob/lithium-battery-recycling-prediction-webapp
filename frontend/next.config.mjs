/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint is run separately with `npm run lint` because Next.js 15 cannot
  // serialize the flat ESLint parser configuration during `next build`.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
