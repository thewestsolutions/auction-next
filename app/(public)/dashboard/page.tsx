import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="container max-w-6xl py-10">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.name || "User"}!</CardTitle>
            <CardDescription>Your personal dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This is your protected dashboard page. You can only see this if you&apos;re logged in.
            </p>
            <Link href="/profile" className="text-primary hover:underline">
              View your profile
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bids</CardTitle>
            <CardDescription>Track your auction activity</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have no active bids at the moment.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Wins</CardTitle>
            <CardDescription>Your successful auctions</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You haven&apos;t won any auctions yet.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
