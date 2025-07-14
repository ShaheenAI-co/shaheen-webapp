import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google';

import "./globals.css";

const inter = Inter({
  subsets: ['latin'], // or ['latin', 'cyrillic'] etc.
  weight: ['100', '200', '300', '400', '500', '600', '700'], 
  variable: '--font-inter', // Optional: define a CSS variable
});

// font-thin	100
// font-extralight	200
// font-light	300
// font-normal	400
// font-medium	500
// font-semibold	600
// font-bold	700
// font-extrabold	800
// font-black	900

export const metadata = {
  title: "Kontena AI",
  description: "Your social media partner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`inter.className font-normal antialiased`}
      >
        <div className="max-sm:px-[28px] ">{children}</div>
      </body>
    </html>
  );
}
