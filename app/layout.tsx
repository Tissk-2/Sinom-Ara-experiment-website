import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Perfect Pour",
  description: "A symphony of sensory perfection",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased bg-[#050505] overflow-visible">
      <body className="overflow-visible">{children}</body>
    </html>
  );
}
