"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
interface SidebarMenuProps {
  items: {
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
}

export default function SidebarMenu({ items }: SidebarMenuProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-2 hover:bg-gray-100",
            pathname === item.href && "bg-gray-100"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </div>
  );
}
