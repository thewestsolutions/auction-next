// This is a simple in-memory database for demonstration purposes
// In a real application, you would use a proper database like MongoDB, PostgreSQL, etc.
import bcrypt from "bcrypt";
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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
}

// Create a singleton instance
const db = new Database();

export default db;
