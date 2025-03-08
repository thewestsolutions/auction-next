import ItemCard from "@/components/cards/item-card";
import db from "@/lib/db";

export default function ItemsPage() {
  const items = db.getItems();

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl}
            price={item.price}
            retailPrice={item.retailPrice}
            discountPercentage={item.discountPercentage}
            location={item.location}
            timeLeft={item.timeLeft}
            isWishlisted={item.isWishlisted}
          />
        ))}
      </div>
    </div>
  );
}
