"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@camome/system/dist/theme.css";
import "./globals.scss";

import LogInScreen from "@/app/LogInScreen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en" data-theme="light">
        <head />
        <body>
          <LogInScreen>{children}</LogInScreen>
        </body>
      </html>
    </QueryClientProvider>
  );
}
