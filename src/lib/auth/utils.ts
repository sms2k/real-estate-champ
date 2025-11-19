import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  // @ts-ignore - custom role property
  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }
  return user;
}

export function isAdmin(user: any): boolean {
  return user?.role === "SUPER_ADMIN";
}

export function isRealtor(user: any): boolean {
  return user?.role === "REALTOR";
}
