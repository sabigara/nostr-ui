"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@camome/system/dist/theme.css";
import "./globals.scss";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
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
        <body>{children}</body>
      </html>
    </QueryClientProvider>
  );
}
