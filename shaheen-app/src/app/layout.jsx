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
      <body>{children}</body>
    </html>
  );
}
