"use client";

import { useWsConnection } from "@/lib/websocket/useWsConnection";
import "@camome/system/dist/theme.css";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useWsConnection("wss://relay.damus.io", { log: true });
  return (
    <html lang="en" data-theme="light">
      <head />
      <body>{children}</body>
    </html>
  );
}
