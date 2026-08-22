import "./globals.css";
import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { PortfolioChatbot } from "@/components/chatbot";
import RouteScrollRestoration from "@/components/layouts/route-scroll-restoration";
import SiteFooter from "@/components/layouts/site-footer";
import SiteHeader from "@/components/layouts/site-header";
import { DeveloperDetails } from "@/dev-constants/details";

const siteUrl = DeveloperDetails.portfolio.replace(/\/$/, "");
const ogImage = `${siteUrl}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: DeveloperDetails.seo.title,
    template: `%s | ${DeveloperDetails.name}`,
  },
  description: DeveloperDetails.seo.description,
  keywords: DeveloperDetails.seo.keywords,
  authors: [{ name: DeveloperDetails.name }],
  creator: DeveloperDetails.name,
  alternates: {
    canonical: siteUrl,
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
  openGraph: {
    title: DeveloperDetails.seo.title,
    description: DeveloperDetails.seo.description,
    url: siteUrl,
    siteName: DeveloperDetails.name,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `Portfolio hero image for ${DeveloperDetails.name}, Full Stack Developer from India`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DeveloperDetails.seo.title,
    description: DeveloperDetails.seo.description,
    images: [ogImage],
    creator: "@navedsayyed",
  },
};

// JSON-LD structured data for SEO
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: DeveloperDetails.name,
  url: siteUrl,
  image: `${siteUrl}${DeveloperDetails.avatar}`,
  jobTitle: DeveloperDetails.designation,
  description: DeveloperDetails.bio,
  email: DeveloperDetails.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: DeveloperDetails.location.city,
    addressCountry: DeveloperDetails.location.country,
  },
  sameAs: DeveloperDetails.socialLinks.map((link) => link.url),
  // What Google uses to understand what this person actually does. Kept in step with the
  // stack section — every entry here ships in a real project.
  knowsAbout: [
    "React Native",
    "Expo",
    "React",
    "Next.js",
    "TypeScript",
    "Supabase",
    "PostgreSQL",
    "Node.js",
    "Python",
    "FastAPI",
    "Mobile App Development",
    "Full Stack Development",
    "Web Development",
  ],
  alumniOf: DeveloperDetails.education.map((edu) => ({
    "@type": "EducationalOrganization",
    name: edu.institution,
    address: edu.location,
  })),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: DeveloperDetails.name,
  url: siteUrl,
  description: DeveloperDetails.seo.description,
  inLanguage: "en",
  author: {
    "@type": "Person",
    name: DeveloperDetails.name,
    url: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Metadata face — dates, ranges, keyboard hints. Tabular figures keep columns aligned.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/*
          Must run before first paint. `scroll-behavior: smooth` also applies to the browser's
          own scroll restoration on reload, so refreshing part-way down the page makes it paint
          high and visibly animate down to the saved offset. An inline style beats the
          stylesheet; RouteScrollRestoration removes it once restoration has settled.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.style.scrollBehavior='auto'",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${sans.variable} ${mono.variable} ${sans.className}`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-ring focus:rounded-md"
          >
            Skip to main content
          </a>
          <RouteScrollRestoration />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <PortfolioChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
