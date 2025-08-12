import { Inter } from "next/font/google";
import "./globals.css";
import NextIntProvider from "../NextIntProvider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"], // or ['latin', 'cyrillic'] etc.
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter", // Optional: define a CSS variable
});

export const metadata = {
  title: "Shaheen AI",
  description: "Your social media partner",
};

// In your layout component or _document.js
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
/>;

export default async function LocaleLayout({ children, params }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <NextIntProvider params={params}>{children}</NextIntProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
