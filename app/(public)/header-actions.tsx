"use client";

import { Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase-browser";

interface HeaderActionsProps {
  isLoggedIn: boolean;
}

export function HeaderActions({ isLoggedIn: defaultIsLoggedIn }: HeaderActionsProps) {
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(defaultIsLoggedIn);
  const supabase = createClient();

  supabase.auth.onAuthStateChange((event, session) => {
    setIsLoggedIn(!!session);
  });

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-4 whitespace-nowrap">
            <Link href="/my-bids" className="hover:text-primary text-sm font-medium">
              My Bids
            </Link>
            <Link href="/my-wins" className="hover:text-primary text-sm font-medium">
              My Wins
            </Link>
            <Link href="/wishlist" className="hover:text-primary text-sm font-medium">
              Wishlist
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <User size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">Billing</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <LogoutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button variant="outline" className="h-10" asChild>
            <Link href="/auth/register">Sign up</Link>
          </Button>
          <Button className="h-10" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </>
      )}
    </div>
  );
}
