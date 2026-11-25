import { Suspense } from "react";


export default function WeaknessPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <WeaknessPage />
      </Suspense>

    </main>
  )
}