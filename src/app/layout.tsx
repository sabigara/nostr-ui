"use client";

import "@camome/system/dist/theme.css";
import "./globals.scss";
import styles from "./layout.module.scss";

import LogInScreen from "@/app/LogInScreen";
import Header from "@/app/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head />
      <body className={styles.body}>
        <LogInScreen>
          <Header />
          {children}
        </LogInScreen>
      </body>
    </html>
  );
}
