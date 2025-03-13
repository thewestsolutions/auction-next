import SidebarLayout from "@/components/layouts/sidebar-layout";
import Link from "next/link";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      sidebar={
        <ul>
          <li>
            <span>Bids</span>
            <ul>
              <li>
                <Link href="/bids/ongoing">Current</Link>
              </li>
              <li>
                <Link href="/bids/winning">Winning</Link>
              </li>
              <li>
                <Link href="/bids/outbid">Outbid</Link>
              </li>
              <li>
                <Link href="/bids/history">History</Link>
              </li>
              <li>
                <Link href="/bids/wishlist">Wishlist</Link>
              </li>
            </ul>
          </li>
          <li>
            <span>Wins</span>
            <ul>
              <li>
                <Link href="/bids/pickup">Pickup</Link>
              </li>
              <li>
                <Link href="/bids/history">History</Link>
              </li>
            </ul>
          </li>
        </ul>
      }
    >
      {children}
    </SidebarLayout>
  );
}
