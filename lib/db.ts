// This is a simple in-memory database for demonstration purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.
import bcrypt from "bcrypt";
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Category {
  icon: string;
  name: string;
}

export interface Item {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  retailPrice: number;
  discountPercentage: number;
  location: string;
  timeLeft: string;
  categoryId?: string;
}

// Our mock database
class Database {
  private users: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@doe.com",
      password: bcrypt.hashSync("password123", 10),
    },
  ];

  private categories: Category[] = [
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

  constructor() {
    // Add a test user in development
    if (process.env.NODE_ENV === "development") {
      // We'll add a test user in the NextAuth config
    }
  }

  // User methods
  findUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  // Category methods
  getAllCategories(): Category[] {
    return [...this.categories];
  }

  // Item methods
  getItems(count = 20): Item[] {
    return this.generateFakeItems(count);
  }

  private generateFakeItems(count = 20): Item[] {
    const categories = this.categories.map((c) => c.name);

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
      };
    });
  }
}

// Create a singleton instance
const db = new Database();

export default db;
