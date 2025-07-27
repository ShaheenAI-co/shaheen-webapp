"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitch = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Extract the locale from the pathname
  const initialLocale = pathname.split("/")[1] || "en";
  const [currentLang, setCurrentLang] = useState(initialLocale);

  const onDropdownChange = (locale) => {
    setCurrentLang(locale);
    router.replace(`/${locale}`);
  };

  //  update state if the route changes outside of this component
  useEffect(() => {
    const locale = pathname.split("/")[1] || "en";
    setCurrentLang(locale);
  }, [pathname]);

  return (
    <div className="hidden md:block outline-none focus:outline-none">
      <DropdownMenu>
        <DropdownMenuTrigger className = 'p-2'>
          <Globe strokeWidth="1px" size="20px" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onDropdownChange("en")}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDropdownChange("ar")}>
            Arabic
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSwitch;
