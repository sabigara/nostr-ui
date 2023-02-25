"use client";

import "@camome/system/dist/theme.css";
import "./globals.scss";

import LogInScreen from "@/app/LogInScreen";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head />
      <body>
        <LogInScreen>{children}</LogInScreen>
      </body>
    </html>
  );
}
