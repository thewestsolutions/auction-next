export default function ItemsLayout({ children }: { children: React.ReactNode }) {
  const categories = [
    { icon: "🐾", name: "Pet Supplies" },
    { icon: "🏠", name: "Home & Kitchen" },
    { icon: "🔌", name: "Electronics & Gadgets" },
    { icon: "👶", name: "Baby Products" },
    { icon: "🌿", name: "Patio, Lawn & Garden" },
    { icon: "💄", name: "Beauty & Personal Care" },
    { icon: "🔧", name: "Tools & Home Improvement" },
    { icon: "🎮", name: "Toys & Games" },
    { icon: "🏀", name: "Sports & Outdoors" },
    { icon: "🏥", name: "Health & Household" },
    { icon: "👕", name: "Clothing, Shoes & Jewellery" },
    { icon: "📎", name: "Office Products" },
    { icon: "📱", name: "Cell Phones & Accessories" },
  ];

  return (
    <div className="flex gap-12">
      {/* Sidebar */}
      <div className={`bg-background min-h-screen w-64 dark:text-white`}>
        <h2 className="mb-4 flex items-center justify-between text-xl font-bold">
          Staff Picks
          <span className={`text-sm font-normal text-blue-600 dark:text-blue-400`}>View All</span>
        </h2>

        <h3 className="mb-2 text-lg font-medium">Category</h3>
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="mb-2">
              <a
                href="#"
                className={`text-muted-foreground hover:text-primary flex items-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <span className="mr-2 w-6">{category.icon}</span>
                <span>{category.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
