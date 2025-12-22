import HomeDashboard from "@/components/habits/HomeDashboard";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense>
      <HomeDashboard />
    </Suspense>
  );
}
