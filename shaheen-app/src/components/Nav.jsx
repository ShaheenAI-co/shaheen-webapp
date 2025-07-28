'use client'
import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Button } from "./ui/button";
import NavLinks from "./NavLinks.jsx";
import NavCTA from "./NavCTA";
import { usePathname } from "next/navigation";

export const Nav = () => {
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after / 
  const isArabic = locale === "ar";
  return (
    <nav className={`flex items-center w-full justify-between py-2   ${
        isArabic ? "flex-row-reverse" : ""
      } `}>
      <Logo />
      <NavLinks />
      <NavCTA />
    </nav>
  );
};
