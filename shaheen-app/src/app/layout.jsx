"use client";
import useLenis from "@/Hooks/useLenis";
import { usePathname } from "next/navigation";
export default function RootLayout({ children }) {
  useLenis();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";


  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      <link rel="stylesheet" href="/fonts/inter.css" />
      <link rel="icon" href="/favicon.ico" />
      <title>Shaheen AI</title>
      <meta name="description" content="Your social media partner" />
    </head>
   
      <body>{children}</body>
    </html>
  );
}
