import type { Metadata } from "next";
import { Overpass } from "next/font/google";
import "./globals.css";
const overpass = Overpass({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-overpass" });
export const metadata: Metadata = {
  title: "Interactive Rating | Royer Adames",
  description: "Practice a one-to-five rating with an accessible, local-only Frontend Mentor demonstration.",
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={overpass.variable}>{children}</body></html>;
}
