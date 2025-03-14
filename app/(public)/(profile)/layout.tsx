import SidebarLayout from "@/components/layouts/sidebar-layout";
import SidebarMenu from "@/components/layouts/sidebar-menu";
import { CreditCard, Bell, User, File } from "lucide-react";

const sidebarItems = [
  { label: "Profile", href: "/profile", icon: <User size={20} /> },
  { label: "Notifications", href: "/notifications", icon: <Bell size={20} /> },
  { label: "Credit Cards", href: "/credit-cards", icon: <CreditCard size={20} /> },
  { label: "Invoices", href: "/invoices", icon: <File size={20} /> },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout sidebar={<SidebarMenu items={sidebarItems} />}>
      <div>{children}</div>
    </SidebarLayout>
  );
}
