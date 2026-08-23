import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SITE_URL } from "@/components/product/productContent";
import "./globals.css";
import "motion-components/preload.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const siteDescription =
  "Sinom khas Jawa dari daun asam muda, kunyit, dan gula aren. Diseduh small-batch setiap minggu di Malang, tanpa pengawet buatan.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sinom ARA — Tradition in Every Sip",
  description: siteDescription,
  openGraph: {
    title: "Sinom ARA — Tradition in Every Sip",
    description: siteDescription,
    url: SITE_URL,
    siteName: "Sinom ARA",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/images/ara-sinom-social-card.png", alt: "Sinom ARA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sinom ARA — Tradition in Every Sip",
    description: siteDescription,
    images: ["/images/ara-sinom-social-card.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${outfit.variable} antialiased bg-[#0a0a0a]`}>
      <body className="font-[family-name:var(--font-outfit)]">{children}</body>
    </html>
  );
}
