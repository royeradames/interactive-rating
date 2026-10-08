import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
import { siteName, siteUrl } from "./site";

const overpass = Overpass({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-overpass", display: "swap" });

const title = "Interactive Rating | Royer Adames";
const description = "Rate your support from 1 to 5 in an accessible Frontend Mentor practice demo. The rating stays on this page.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName, title, description },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={overpass.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
