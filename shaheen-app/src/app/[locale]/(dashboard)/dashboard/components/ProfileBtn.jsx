"use client";
import { CircleUserRoundIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserByClerkId } from "../../../../../../lib/supabase/users";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Component({ onClick }) {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && user) {
        try {
          const data = await getUserByClerkId(user.id);
          setUserData(data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Fallback to Clerk user data if Supabase fails
          setUserData({
            first_name: user.firstName || "User",
            last_name: user.lastName || "",
          });
        } finally {
          setLoading(false);
        }
      } else if (isLoaded) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="bg-[#191919] hover:bg-[#7f4af3] rounded-md border-none hover:transition-all duration-300 hover:text-white cursor-pointer"
          aria-label="Open account menu"
        >
          <CircleUserRoundIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-[#0C0C0C] border-[#272729]  text-white">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-gray-400 font-bold text-base ">
            Signed in as
          </span>
          <span className="text-white  text-sm">
            {loading
              ? "Loading..."
              : `${userData?.first_name || ""} ${userData?.last_name || ""}`.trim() ||
                user?.emailAddresses?.[0]?.emailAddress ||
                "User"}
          </span>
        </DropdownMenuLabel>
        {/* <DropdownMenuSeparator /> */}
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem className="flex !bg-transparent hover:!bg-transparent focus:!bg-transparent justify-center [&:focus]:!bg-transparent">
          <button
            className={`w-full bg-red-500 rounded-md py-2 font-bold cursor-pointer hover:bg-red-600 transition-all duration-300 hover:text-white`}
            onClick={onClick}
          >
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
