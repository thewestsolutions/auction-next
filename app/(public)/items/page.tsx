"use client";

import ItemCard from "@/components/cards/item-card";

// Sample data for demonstration
const sampleItems = [
  {
    id: "1",
    title: "AODSK Beginner Digital Piano 88 Key Keyboard, Full-size Electric Piano",
    imageUrl: "https://placehold.co/300x300.png",
    price: 90,
    retailPrice: 199.99,
    discountPercentage: 57,
    location: "Commerce Cir, Sacramento",
    timeLeft: "47m 8s",
    isWishlisted: false,
  },
  {
    id: "2",
    title: "Sony WH-1000XM4 Wireless Noise Cancelling Headphones",
    imageUrl: "https://placehold.co/300x300.png",
    price: 120,
    retailPrice: 349.99,
    discountPercentage: 65,
    location: "Downtown, San Francisco",
    timeLeft: "2h 15m",
    isWishlisted: true,
  },
  {
    id: "3",
    title: "Apple iPad Pro 11-inch (2022) 256GB Wi-Fi",
    imageUrl: "https://placehold.co/300x300.png",
    price: 450,
    retailPrice: 899.99,
    discountPercentage: 50,
    location: "Mission District, San Francisco",
    timeLeft: "1d 3h",
    isWishlisted: false,
  },
];

export default function ItemsPage() {
  const handleWishlistToggle = (id: string) => {
    console.log(`Toggled wishlist for item ${id}`);
  };

  return (
    <div className="container">
      <h1 className="mb-6 text-3xl font-bold">Featured Items</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sampleItems.map((item) => (
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
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>
    </div>
  );
}
