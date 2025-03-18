import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCustomerPaymentProfiles } from "@/lib/authorize-net";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CreditCardsPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user?.email) {
    return redirect("/auth/login");
  }

  const paymentProfiles = await getCustomerPaymentProfiles(
    userData.user?.user_metadata.customer_profile_id
  );

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>Credit Cards</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/credit-cards/new" className="h-full">
          <Card className="h-full hover:bg-gray-100">
            <CardContent className="flex flex-1 items-center justify-center">
              <p>Add Credit Card</p>
            </CardContent>
          </Card>
        </Link>

        {paymentProfiles.map((profile) => (
          <Card key={profile.customerPaymentProfileId}>
            <CardHeader>
              <CardTitle className="text-right uppercase">
                {profile.payment.creditCard.cardType}
              </CardTitle>
              <CardDescription>{profile.customerType}</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-lg font-bold">
                **** **** **** {profile.payment.creditCard.cardNumber.slice(-4)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
