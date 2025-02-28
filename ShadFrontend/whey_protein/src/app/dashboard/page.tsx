// src/app/dashboard/page.tsx (Server Component: no "use client")
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardClient from "@/components/dashboard/dashboardclient";
export default async function Page() {
  // This call runs on the server and uses cookies from the request.
  const user = await getCurrentUser();

  if (!user) {
    // If there is no session, redirect to the sign-in page.
    redirect("/auth/sign-in");
  }

  // If authenticated, render the interactive dashboard.
  return <DashboardClient user={user} />; 
}
