import type { Metadata, Viewport } from "next";
import { Noto_Serif_Georgian } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

const georgianFont = Noto_Serif_Georgian({
  subsets: ["georgian"],
  variable: "--font-georgian",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "ქართული კვესტვორდი",
  description: "ქართული ენის კვესტვორდის თამაში",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={georgianFont.variable}>
      <body className="font-georgian bg-gray-50 min-h-screen antialiased">
        <Providers>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
