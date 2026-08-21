import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  async redirects() {
    return [
      // Consolidate www → non-www
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.navedsayyed.me" }],
        destination: "https://navedsayyed.me/:path*",
        permanent: true,
      },
      // Strip legacy Blogger ?m= parameter
      {
        source: "/:path*",
        has: [{ type: "query", key: "m" }],
        destination: "/:path*",
        permanent: true,
      },
      // NOTE: project slug casing is normalised inside src/app/projects/[slug]/page.tsx,
      // not here — `source` matching is case-insensitive, so a rule here would also match
      // its own destination and redirect to itself in a loop.
      // Old Blogger date-based post URLs (e.g., /2023/01/some-post.html)
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug.html",
        destination: "/blog",
        permanent: true,
      },
      // Old Blogger static page URLs (e.g., /p/random-image-generator.html)
      {
        source: "/p/:slug.html",
        destination: "/",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.github.com;",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // `immutable` belongs only on content-hashed URLs like /_next/static above, where the
        // filename changes whenever the bytes do. These are stable /public paths whose contents
        // get replaced — avatar, OG card, resume — so `immutable` told every browser to keep
        // the old file for a year and never revalidate, even on reload. Serve them fresh for an
        // hour, then revalidate in the background against the ETag.
        source: "/(.*\\.(?:webp|png|svg|jpg|jpeg|ico|woff2|woff|pdf))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
