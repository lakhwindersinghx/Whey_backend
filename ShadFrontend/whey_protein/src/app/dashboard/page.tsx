import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProteinAnalysisClient from "./protein-analysis-client";

export default async function DashboardPage() {
  // Server-side authentication check
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Ensure email is always a valid string
  const sanitizedUser = {
    email: user?.email ?? "", // Fallback to empty string
    name: user?.name ?? "Guest", // Optional fallback
  };

  return <ProteinAnalysisClient user={sanitizedUser} />;
}
