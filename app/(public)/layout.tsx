import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  FacebookIcon,
  Flame,
  Hammer,
  Heart,
  Instagram,
  List,
  SquareMenu,
  Trophy,
} from "lucide-react";
import { HeaderActions } from "./header-actions";
import { createClient } from "@/lib/supabase-server";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-background sticky top-0 z-10 shadow-md">
        <header className="grid grid-cols-[3fr_1fr] px-8 py-2">
          <div className="flex items-center gap-8">
            <Link href="/">
              <Image
                src="https://placehold.co/300x150.png"
                alt="logo"
                className="h-8 w-auto"
                width={150}
                height={300}
              />
            </Link>

            <div className="flex items-center text-sm font-semibold">
              <Link
                href="/"
                className="flex items-center gap-1 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <List size={20} className="text-orange-500" />
                <span>Categories</span>
              </Link>

              <Link
                href="/"
                className="flex items-center gap-1 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <Flame size={20} className="text-orange-500" />
                <span>Top deals</span>
              </Link>
              <Link
                href="/bids/ongoing"
                className="flex items-center gap-1 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <Hammer size={20} className="text-blue-500" />
                <span>My bids</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <Trophy size={20} className="text-yellow-500" />
                <span>My wins</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-1 rounded-md px-4 py-2 hover:bg-gray-100"
              >
                <Heart size={20} className="text-red-500" />
                <span>Wishlist</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              className="h-8 rounded-full px-4 text-sm placeholder:text-sm"
            />

            <Button size={"icon"} variant={"secondary"} className="h-8 w-8 border">
              <Bell size={20} />
            </Button>

            <Button size={"icon"} variant={"secondary"} className="h-8 w-8">
              <SquareMenu size={20} />
            </Button>
          </div>
        </header>

        <header className="border-border flex hidden w-full items-center justify-between gap-8 border-b px-8 py-3">
          <Link href="/">
            <Image
              src="https://placehold.co/300x150.png"
              alt="logo"
              className="h-10"
              width={150}
              height={300}
            />
          </Link>

          <Input placeholder="Search" variant="primary" inputSize="lg" />

          <HeaderActions isLoggedIn={!!data?.user} />
        </header>
      </div>

      <main className="z-0 flex-grow p-8 dark:bg-neutral-950">{children}</main>

      <footer className="border-border border-t py-12">
        <div>
          <div className="grid grid-cols-1 gap-8 px-8 md:grid-cols-3">
            {/* Information Column */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Information</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/condition" className="text-muted-foreground hover:text-primary">
                    Condition Notation
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-primary">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="/articles" className="text-muted-foreground hover:text-primary">
                    Articles
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Contact us</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-muted-foreground">+1(123) 456-7890</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span className="text-muted-foreground">john@doe.com</span>
                </li>
              </ul>
            </div>

            {/* Locations Column */}
            <div>
              <h3 className="mb-4 text-lg font-medium">Locations</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground mt-1"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-muted-foreground">
                    123 Fake Street, Fake City, CA 12345
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground mt-1"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-muted-foreground">
                    456 Fake Avenue, Fake County, CA 12345
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-muted-foreground mt-1"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span className="text-muted-foreground">
                    789 Fake Road, Fake Village, CA 12345
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-border mt-12 border-t pt-8">
            <div className="px-8">
              <h3 className="mb-2 text-lg font-medium">Subscribe to our newsletter</h3>
              <p className="text-muted-foreground mb-4">
                The latest news, articles, and resources, sent to your inbox weekly.
              </p>
              <div className="flex max-w-md gap-2">
                <Input placeholder="Enter your email" className="h-10" />
                <Button className="h-10">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Copyright and Social */}
          <div className="border-border mt-12 border-t pt-12">
            <div className="flex flex-col items-center justify-between px-8 md:flex-row">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-muted-foreground text-sm">
                  © 2025 Prime Auctions LLC. All rights reserved.
                </p>
                <div className="mt-2 flex gap-4 text-sm">
                  <Link
                    href="/terms-and-conditions"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Terms & Conditions
                  </Link>
                </div>
              </div>
              <div className="mt-4 flex gap-4 md:mt-0">
                <a href="https://facebook.com" className="text-muted-foreground hover:text-primary">
                  <FacebookIcon size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
