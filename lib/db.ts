// This is a simple in-memory database for demonstration purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.
import fs from "fs";
import path from "path";
import itemsData from "./data/items.json";
import categoriesData from "./data/categories.json";
import usersData from "./data/users.json";

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
  private users: User[] = usersData;
  private categories: Category[] = categoriesData;
  private items: Item[] = itemsData;

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
    // Add user to in-memory array
    this.users.push(user);

    // Also update the JSON file to persist the data
    try {
      const filePath = path.join(process.cwd(), "lib/data/users.json");
      fs.writeFileSync(filePath, JSON.stringify(this.users, null, 2));
    } catch (error) {
      console.error("Error writing to users.json:", error);
      // In a real app, you might want to handle this error differently
    }

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
    // Return all items or limit by count if specified
    return count ? this.items.slice(0, count) : [...this.items];
  }
}

// Create a singleton instance
const db = new Database();

export default db;
