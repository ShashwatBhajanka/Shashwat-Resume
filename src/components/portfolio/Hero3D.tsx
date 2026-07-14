import { lazy, Suspense, useEffect, useState } from "react";

const Inner = lazy(() => import("./Hero3DInner"));

export function Hero3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div aria-hidden className="h-full w-full" />;
  return (
    <Suspense fallback={<div aria-hidden className="h-full w-full" />}>
      <Inner />
    </Suspense>
  );
}
