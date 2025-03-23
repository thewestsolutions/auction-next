import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/src/lib/supabase-server";
import { getBidHistory, getItemById, isFavorite } from "@/src/lib/db-items";
import { getCategoryById } from "@/src/lib/db-categories";
import { Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import ItemGallery from "./item-gallery";
import FavoriteButton from "./favorite-button";
import CopyButton from "./copy-button";
import BidPanel from "./bid-panel";

interface ItemPageProps {
  params: Promise<{ id: string }>;
}

export default async function ItemPage({ params }: ItemPageProps) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: item, error } = await getItemById(supabase, parseInt(id));

  if (error || !item) {
    notFound();
  }

  const { data: category } = await getCategoryById(supabase, item.category_id);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const favorite = user ? await isFavorite(supabase, item.id, user.id) : false;

  const { data: bidHistory } = await getBidHistory(supabase, item.id);

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink href="/components">{category.title}</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>
              {item.title.length > 50 ? item.title.slice(0, 50) + "..." : item.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-[3fr_2fr] gap-4">
        <div className="flex flex-col gap-4">
          <ItemGallery images={item.images} title={item.title} />

          <h2 className="text-xl font-medium">{item.title}</h2>

          <div className="flex items-start justify-between gap-2">
            <Badge>
              Condition: <span className="capitalize">{item.condition}</span>
            </Badge>

            <div className="flex gap-2">
              <FavoriteButton itemId={item.id} isFavorite={favorite} userId={user?.id} />

              <CopyButton />

              <Button variant="outline">
                <Search className="h-4 w-4" />
                <span>Find on Google</span>
              </Button>
            </div>
          </div>

          <Link href="/terms-and-conditions">
            <span>View Terms and conditions</span>
          </Link>
        </div>

        <BidPanel item={item} history={bidHistory || []} userId={user?.id} />
      </div>
    </div>
  );
}
