"use client";

import "@camome/system/dist/theme.css";
import "./globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head />
      <body>{children}</body>
    </html>
  );
}
