import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-background">
        <header className="w-full px-6 py-4 flex justify-between gap-8 border-b border-border">
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

        <nav className="border-b border-border px-6">
          <div className="flex space-x-8">
            <Link href="/" className="py-4 text-sm font-medium text-muted-foreground hover:text-primary">View All</Link>
            <Link href="/staff-picks" className="py-4 text-sm font-medium text-muted-foreground hover:text-primary">Staff Picks</Link>
            <Link href="/top-deals" className="py-4 text-sm font-medium text-muted-foreground hover:text-primary">Top Deals</Link>
            <Link href="/last-chance" className="py-4 text-sm font-medium text-muted-foreground hover:text-primary">Last Chance</Link>
            <Link href="/popular" className="py-4 text-sm font-medium text-muted-foreground hover:text-primary">Popular Now</Link>
            <Link href="/recently-viewed" className="py-4 text-sm font-medium text-muted-foreground hover:text-primary">Recently Viewed</Link>
            <Link href="/for-you" className="py-4 text-sm font-medium text-muted-foreground hover:text-primary">Just for You</Link>
          </div>
        </nav>
      </div>

      <main className="flex-grow px-6 py-4">{children}</main>

      <footer className="mt-auto px-6 py-4 border-t border-border">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Footer</p>
          <p className="text-muted-foreground">Footer</p>
        </div>
      </footer>
    </div>
  );
}