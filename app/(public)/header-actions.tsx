"use client";

import { Button } from "@/components/ui/button";
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
import { Bell, SquareMenu } from "lucide-react";

interface HeaderActionsProps {
  isLoggedIn: boolean;
}

export function HeaderActions({ isLoggedIn: defaultIsLoggedIn }: HeaderActionsProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(defaultIsLoggedIn);
  const supabase = createClient();

  supabase.auth.onAuthStateChange((event, session) => {
    setIsLoggedIn(!!session);
  });

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Button size={"icon"} variant={"secondary"} className="h-8 w-8 border" asChild>
            <Link href="/notifications">
              <Bell size={20} />
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <Button size={"icon"} variant={"secondary"} className="h-8 w-8">
                <SquareMenu size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
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
        <Button className="h-10" asChild variant={"outline"}>
          <Link href="/auth/login">Login</Link>
        </Button>
      )}
    </div>
  );
}
