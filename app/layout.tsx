import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "motion-components/preload.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sinom ARA — Tradition in Every Sip",
  description: "Traditional Javanese sinom brewed with young tamarind leaves, turmeric, and natural spices. Made in Malang.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased bg-[#0a0a0a] overflow-visible`}>
      <body className="overflow-visible font-[family-name:var(--font-outfit)]">{children}</body>
    </html>
  );
}
