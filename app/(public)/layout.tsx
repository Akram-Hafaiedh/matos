'use client';

import Navigation from "./layout/Navigation";
import Footer from "./layout/Footer";
import GlobalCart from "../cart/GlobalCart";
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
      <GlobalCart />
      <Footer />
    </>
  );
}