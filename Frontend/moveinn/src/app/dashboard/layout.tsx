import type React from "react";
import type { Metadata } from "next";
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "MoveIn Dashboard - Your Erasmus Journey",
  description: "Manage your Erasmus experience, connect with students, and discover events and recommendations.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  console.log("🧠 Token from cookies:", token?.value)


  if (!token?.value) {
    redirect("/login");
    return null;
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
