"use client";
import useLenis from "@/Hooks/useLenis";
export default function RootLayout({ children }) {
  useLenis();
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
