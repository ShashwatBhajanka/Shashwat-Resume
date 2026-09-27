import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const CARD_W = 380;
const CARD_H = 460;
const GAP = 40;

export function Carousel3D<T>({
  items,
  renderCard,
  label,
  header,
}: {
  items: T[];
  renderCard: (item: T, index: number) => ReactNode;
  label?: string;
  /** Heading shown with the cards; stays visible while the carousel is pinned. */
  header?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const total = items.length;
  // Total scroll height: roughly 35vh per card + one viewport for the pin.
  const heightVh = 100 + Math.max(1, total) * 35;

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

    const onScroll = (y: number) => {
      if (Math.abs(y - lastScrollY) > 0.5) {
        // Genuine user scroll activity: release the snap lock early so the
        // next debounced snap can fire instead of being blocked.
        isSnapping = false;
        lastScrollY = y;
      }
      clearDebounce();
      debounceTimer = setTimeout(doSnap, 120);
    };

    const onResize = () => {
      if (resizeTimer !== null) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doSnap, 200);
    };

    const unsub = scrollY.on("change", onScroll);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      unsub();
      window.removeEventListener("resize", onResize);
      clearDebounce();
      if (resizeTimer !== null) clearTimeout(resizeTimer);
    };
  }, [scrollYProgress, scrollY, total, reduced]);

  // Mobile / reduced-motion: horizontal scroll-snap fallback
  return (
    <>
      {/* Desktop pinned 3D carousel */}
      <div className="hidden md:block">
        {reduced ? (
          <>
            <HeaderRow>{header}</HeaderRow>
            <SnapRow items={items} renderCard={renderCard} label={label} />
          </>
        ) : (
          <section
            ref={ref}
            className="relative"
            style={{ height: `${heightVh}vh` }}
            aria-label={label}
          >
            {/* Pinned just under the nav. The heading and cards are centred
                together as one block, so any spare height is split evenly
                above and below instead of piling up under the cards. */}
            <div className="sticky top-12 flex h-[calc(100dvh-3rem)] flex-col justify-center overflow-hidden py-6">
              <HeaderRow>{header}</HeaderRow>
              <div className="mt-6 flex shrink-0 items-start" style={{ perspective: "1400px" }}>
              <motion.div
                className="flex will-change-transform"
                style={{
                  gap: `${GAP}px`,
                  // Start the row on the page's content edge, not the viewport centre.
                  paddingLeft: "max(2rem, calc((100% - 1100px) / 2 + 2rem))",
                  paddingRight: "2rem",
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
            </div>
          </section>
        )}
      </div>

      {/* Mobile fallback */}
      <div className="md:hidden">
        <HeaderRow>{header}</HeaderRow>
        <SnapRow items={items} renderCard={renderCard} label={label} />
      </div>
    </>
  );
}

function HeaderRow({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <div className="mx-auto w-full max-w-[1100px] shrink-0 px-5 md:px-8">{children}</div>;
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

  return (
    <motion.div
      className="shrink-0 overflow-hidden relative"
      style={{
        width: CARD_W,
        // Original size; only shrinks on short viewports so the pinned
        // heading and card both fit.
        height: `min(${CARD_H}px, calc(100dvh - 11rem))`,
        scale,
        rotateY,
        opacity,
        zIndex,
        borderRadius: 2,
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
        className="flex px-5 pt-6 md:px-8"
        style={{ gap: `${GAP}px`, paddingBottom: 8 }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="relative shrink-0 overflow-hidden"
            style={{
               width: Math.min(CARD_W, 300),
               height: CARD_H,
               scrollSnapAlign: "center",
               scrollSnapStop: "always",
               borderRadius: 2,
               border: "1px solid var(--border)",
             }}
          >
            {renderCard(item, i)}
          </div>
        ))}
      </div>
    </div>
  );
}
