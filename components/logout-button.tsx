"use client";

import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    // The page will not redirect, but the session will be cleared
    // and the UI will update automatically due to the session provider
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </DropdownMenuItem>
  );
}
