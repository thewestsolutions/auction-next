import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-background sticky top-0 z-10">
        <header className="border-border flex w-full justify-between gap-8 border-b px-6 py-4">
          <Image
            src="https://placehold.co/300x150.png"
            alt="logo"
            className="h-10"
            width={150}
            height={300}
          />

          <Input placeholder="Search" className="h-10" />

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button className="h-10">Login</Button>
          </div>
        </header>

        <nav className="border-border border-b px-6">
          <div className="flex space-x-8">
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary py-4 text-sm font-medium"
            >
              View All
            </Link>
            <Link
              href="/staff-picks"
              className="text-muted-foreground hover:text-primary py-4 text-sm font-medium"
            >
              Staff Picks
            </Link>
            <Link
              href="/top-deals"
              className="text-muted-foreground hover:text-primary py-4 text-sm font-medium"
            >
              Top Deals
            </Link>
            <Link
              href="/last-chance"
              className="text-muted-foreground hover:text-primary py-4 text-sm font-medium"
            >
              Last Chance
            </Link>
            <Link
              href="/popular"
              className="text-muted-foreground hover:text-primary py-4 text-sm font-medium"
            >
              Popular Now
            </Link>
            <Link
              href="/recently-viewed"
              className="text-muted-foreground hover:text-primary py-4 text-sm font-medium"
            >
              Recently Viewed
            </Link>
            <Link
              href="/for-you"
              className="text-muted-foreground hover:text-primary py-4 text-sm font-medium"
            >
              Just for You
            </Link>
          </div>
        </nav>
      </div>

      <main className="flex-grow px-6 py-4">{children}</main>

      <footer className="border-border mt-auto border-t px-6 py-4">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Footer</p>
          <p className="text-muted-foreground">Footer</p>
        </div>
      </footer>
    </div>
  );
}
