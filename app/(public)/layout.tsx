'use client';

import Navigation from "./layout/Navigation";
import Footer from "./layout/Footer";
import GlobalCart from "../cart/GlobalCart";
import { Providers } from "../providers";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Navigation />
      <main>{children}</main>
      <GlobalCart />
      <Footer />
    </Providers>
  );
}