import WeaknessHero from "@/components/weakness/WeaknessHero";
import { Suspense } from "react";


export default function WeaknessPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <WeaknessHero />
      </Suspense>

    </main>
  )
}