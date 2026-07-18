import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Inner = lazy(() => import("./HalftoneFieldInner"));

export function HalftoneField({
  strength = 1,
  interactive = false,
  className = "",
  children,
}: {
  strength?: number;
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ background: "var(--bg)" }}>
      {mounted && visible && (
        <Suspense fallback={null}>
          <Inner strength={strength} interactive={interactive} />
        </Suspense>
      )}
      {children}
    </div>
  );
}
