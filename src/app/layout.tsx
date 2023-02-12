"use client";

import { useHandleMessages } from "@/app/useHandleMessages";
import { useWsConnection } from "@/lib/websocket/useWsConnection";
import "@camome/system/dist/theme.css";
import "./globals.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useWsConnection("wss://relay.damus.io", { log: true });
  useHandleMessages();
  return (
    <html lang="en" data-theme="light">
      <head />
      <body>{children}</body>
    </html>
  );
}
