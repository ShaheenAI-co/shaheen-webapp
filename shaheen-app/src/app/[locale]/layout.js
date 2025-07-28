import { Inter } from "next/font/google";
import "./globals.css";
import NextIntProvider from "../NextIntProvider";


const inter = Inter({
  subsets: ["latin"], // or ['latin', 'cyrillic'] etc.
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter", // Optional: define a CSS variable
});

export const metadata = {
  title: "Shaheen AI",
  description: "Your social media partner",
};

export default function LocaleLayout({ children, params }) {

  return (
    <NextIntProvider params={params}>
      {children}
    </NextIntProvider>
  );
}
