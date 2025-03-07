import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// Check if user is authenticated (for server components)
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}
