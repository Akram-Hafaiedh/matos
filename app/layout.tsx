import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mato's - Restaurant & Fast Food",
  description: "Pizza, Burgers, Tacos et plus encore!",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Mato's - Restaurant & Fast Food",
    description: "L'alliance parfaite entre tradition artisanale et innovation culinaire.",
    url: "https://matos-psi.vercel.app",
    siteName: "Mato's",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mato's Culinary Experience",
      },
    ],
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mato's - Restaurant & Fast Food",
    description: "Pizza, Burgers, Tacos et plus encore!",
    images: ["/og-image.png"],
  },
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
