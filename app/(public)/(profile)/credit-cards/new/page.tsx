import { createClient } from "@/lib/supabase-server";
import { createCustomerProfile, getCustomerProfileIdByEmail } from "@/lib/authorize-net";
import PageClient from "./page-client";
import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function CreditCardsPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();

  let customerProfileId = userData.user?.user_metadata.customer_profile_id;

  if (!userData.user?.email) {
    return redirect("/auth/login");
  }

  if (!customerProfileId) {
    customerProfileId = await getCustomerProfileIdByEmail(userData.user?.email);

    if (!customerProfileId) {
      customerProfileId = await createCustomerProfile({
        email: userData.user?.email,
        description: "Test customer profile",
      });
    }

    await supabase.auth.updateUser({
      data: {
        customer_profile_id: customerProfileId,
      },
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href="/credit-cards">Credit Cards</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <p>New Credit Card</p>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageClient customerProfileId={customerProfileId} />
    </div>
  );
}
