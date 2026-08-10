import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const CARD_W = 380;
const CARD_H = 460;
const GAP = 40;

export function Carousel3D<T>({
  items,
  renderCard,
  label,
}: {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const total = items.length;
  // Total scroll height: give roughly 60vh per card + one viewport for the pin.
  const heightVh = 100 + Math.max(1, total) * 55;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Snap logic for desktop pinned 3D carousel — ensures scroll always
  // settles with a card perfectly centered (d === 0 for exactly one card).
  useEffect(() => {
    if (reduced || total <= 1) return;
    const sectionEl = ref.current;
    if (!sectionEl) return;

    let isSnapping = false;
    let lastScrollY = window.scrollY;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const clearDebounce = () => {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    };

    const doSnap = () => {
      if (isSnapping) return;

      const sectionTop = sectionEl.getBoundingClientRect().top + window.scrollY;
      const scrollableRange = sectionEl.offsetHeight - window.innerHeight;
      if (scrollableRange <= 0) return;

      // Guard: only snap while the section is in the pinned scroll range.
      const currentScrollY = window.scrollY;
      if (currentScrollY < sectionTop - 1 || currentScrollY > sectionTop + scrollableRange + 1) return;

      const currentProgress = scrollYProgress.get();
      const nearestIndex = Math.round(currentProgress * (total - 1));
      const clampedIndex = Math.max(0, Math.min(total - 1, nearestIndex));
      const targetProgress = clampedIndex / (total - 1);

      // Already settled — skip.
      if (Math.abs(currentProgress - targetProgress) < 0.001) return;

      const targetScrollY = sectionTop + targetProgress * scrollableRange;

      isSnapping = true;
      lastScrollY = window.scrollY;
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });

      const clearSnap = () => {
        isSnapping = false;
        window.removeEventListener("scrollend", clearSnap);
      };

      window.addEventListener("scrollend", clearSnap);
      setTimeout(clearSnap, 500);
    };

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      if (delta > 0.5) {
        // Genuine user scroll activity — release snap lock early so next
        // debounced snap can fire instead of being blocked by isSnapping.
        isSnapping = false;
        lastScrollY = window.scrollY;
      }
      clearDebounce();
      debounceTimer = setTimeout(doSnap, 120);
    };

    const onResize = () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doSnap, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearDebounce();
      if (resizeTimer !== null) clearTimeout(resizeTimer);
    };
  }, [scrollYProgress, total, reduced]);

  // Mobile / reduced-motion: horizontal scroll-snap fallback
  return (
    <>
      {/* Desktop pinned 3D carousel */}
      <div className="hidden md:block">
        {reduced ? (
          <SnapRow items={items} renderCard={renderCard} label={label} />
        ) : (
          <section
            ref={ref}
            className="relative"
            style={{ height: `${heightVh}vh` }}
            aria-label={label}
          >
            <div
              className="sticky top-0 flex h-screen items-center overflow-hidden"
              style={{ perspective: "1400px" }}
            >
              <motion.div
                className="flex will-change-transform"
                style={{
                  gap: `${GAP}px`,
                  paddingLeft: `calc(50vw - ${CARD_W / 2}px)`,
                  paddingRight: `calc(50vw - ${CARD_W / 2}px)`,
                  transformStyle: "preserve-3d",
                  x: useTransform(
                    scrollYProgress,
                    [0, 1],
                    [0, -((total - 1) * (CARD_W + GAP))]
                  ),
                }}
              >
                {items.map((item, i) => (
                  <CarouselCard
                    key={i}
                    index={i}
                    total={total}
                    progress={scrollYProgress}
                  >
                    {renderCard(item, i)}
                  </CarouselCard>
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden">
        <SnapRow items={items} renderCard={renderCard} label={label} />
      </div>
    </>
  );
}

function CarouselCard({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: ReactNode;
}) {
  const activeIdx = useTransform(progress, (p) => p * Math.max(1, total - 1));

  const scale = useTransform(activeIdx, (a) => {
    const d = Math.min(Math.abs(index - a), 3);
    return 1 - d * 0.05;
  });
  const rotateY = useTransform(activeIdx, (a) => {
    const d = Math.max(-3, Math.min(3, index - a));
    return -d * 10;
  });
  const opacity = useTransform(activeIdx, (a) => {
    const d = Math.min(Math.abs(index - a), 3);
    return Math.max(0.7, 1 - d * 0.1);
  });
  const zIndex = useTransform(activeIdx, (a) =>
    Math.round(100 - Math.abs(index - a) * 5)
  );
  const shadow = useTransform(activeIdx, (a) => {
    const d = Math.min(Math.abs(index - a), 3);
    const blur = 30 - d * 8;
    const alpha = Math.max(0.2, 0.45 - d * 0.1);
    return `0 20px ${blur}px rgba(0,0,0,${alpha})`;
  });

  return (
    <motion.div
      className="shrink-0 overflow-hidden relative"
      style={{
        width: CARD_W,
        height: CARD_H,
        scale,
        rotateY,
        opacity,
        zIndex,
        boxShadow: shadow,
        borderRadius: 12,
        border: "1px solid var(--border)",
        transformStyle: "preserve-3d",
        pointerEvents: "auto",
      }}
    >
      {children}
    </motion.div>
  );
}

function SnapRow<T>({
  items,
  renderCard,
  label,
}: {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  label?: string;
}) {
  return (
    <div
      className="relative"
      style={{
        scrollSnapType: "x mandatory",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
      aria-label={label}
    >
      <div
        className="flex px-5 md:px-8"
        style={{ gap: `${GAP}px`, paddingBottom: 8 }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="shrink-0 overflow-hidden"
            style={{
               width: Math.min(CARD_W, 320),
               height: CARD_H,
               scrollSnapAlign: "center",
               scrollSnapStop: "always",
               borderRadius: 12,
               border: "1px solid var(--border)",
               boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
             }}
          >
            {renderCard(item, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
