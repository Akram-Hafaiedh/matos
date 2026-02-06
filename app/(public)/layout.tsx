'use client';

import Navigation from "./layout/Navigation";
import Footer from "./layout/Footer";
import GlobalCart from "../cart/GlobalCart";
import AmbientBackground from "@/components/AmbientBackground";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AmbientBackground />
      <Navigation />
      <main className="relative z-0">{children}</main>
      <GlobalCart />
      <Footer />
    </>
  );
}