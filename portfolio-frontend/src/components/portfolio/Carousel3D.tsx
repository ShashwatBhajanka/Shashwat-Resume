import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

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
    return 1 - d * 0.09;
  });
  const rotateY = useTransform(activeIdx, (a) => {
    const d = Math.max(-3, Math.min(3, index - a));
    return -d * 16;
  });
  const z = useTransform(activeIdx, (a) => {
    const d = Math.min(Math.abs(index - a), 3);
    return -d * 90;
  });
  const opacity = useTransform(activeIdx, (a) => {
    const d = Math.min(Math.abs(index - a), 4);
    return Math.max(0.35, 1 - d * 0.22);
  });
  const zIndex = useTransform(activeIdx, (a) =>
    Math.round(100 - Math.abs(index - a) * 10)
  );
  const shadow = useTransform(activeIdx, (a) => {
    const d = Math.min(Math.abs(index - a), 3);
    const blur = 40 - d * 10;
    const alpha = Math.max(0.15, 0.55 - d * 0.15);
    return `0 30px ${blur}px rgba(0,0,0,${alpha})`;
  });

  return (
    <motion.div
      className="shrink-0 overflow-hidden"
      style={{
        width: CARD_W,
        height: CARD_H,
        scale,
        rotateY,
        z,
        opacity,
        zIndex,
        boxShadow: shadow,
        borderRadius: 12,
        border: "1px solid var(--border)",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
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
      className="relative -mx-5 md:-mx-8"
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
