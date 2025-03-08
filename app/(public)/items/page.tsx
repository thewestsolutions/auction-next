import ItemCard from "@/components/cards/item-card";

// Fake data generator function
const generateFakeItems = (count = 20) => {
  const categories = [
    "Electronics",
    "Home & Kitchen",
    "Toys & Games",
    "Sports",
    "Beauty",
    "Fashion",
    "Books",
    "Automotive",
    "Pet Supplies",
    "Office Products",
  ];

  const cities = [
    "Sacramento",
    "San Francisco",
    "Los Angeles",
    "San Diego",
    "Oakland",
    "San Jose",
    "Fresno",
    "Long Beach",
    "Bakersfield",
    "Anaheim",
  ];

  const neighborhoods = [
    "Downtown",
    "Midtown",
    "West Side",
    "East Side",
    "North End",
    "South Bay",
    "Mission District",
    "Commerce Circle",
    "Marina",
    "Heights",
  ];

  const timeUnits = ["m", "h", "d"];

  return Array.from({ length: count }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];

    const retailPrice = Math.floor(Math.random() * 900) + 100;
    const discountPercentage = Math.floor(Math.random() * 70) + 30;
    const price = Math.round((retailPrice * (100 - discountPercentage)) / 100);

    const timeValue = Math.floor(Math.random() * 59) + 1;
    const timeUnit = timeUnits[Math.floor(Math.random() * timeUnits.length)];
    const timeExtra =
      timeUnit === "m"
        ? `${Math.floor(Math.random() * 59)}s`
        : timeUnit === "h"
          ? `${Math.floor(Math.random() * 59)}m`
          : `${Math.floor(Math.random() * 23)}h`;

    return {
      id: (i + 1).toString(),
      title: `${["New", "Premium", "Deluxe", "Limited Edition"][Math.floor(Math.random() * 4)]} ${category} Item ${i + 1}`,
      imageUrl: `https://placehold.co/300x300.png?text=Item+${i + 1}`,
      price,
      retailPrice,
      discountPercentage,
      location: `${neighborhood}, ${city}`,
      timeLeft: `${timeValue}${timeUnit} ${timeExtra}`,
      isWishlisted: Math.random() > 0.7,
    };
  });
};

export default function ItemsPage() {
  const items = generateFakeItems();

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
