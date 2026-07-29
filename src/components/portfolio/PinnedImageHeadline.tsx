import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

/**
 * Sticky headline where a mid-sentence word is replaced by a small
 * square image that cross-fades between 3 real images while pinned.
 */
export function PinnedImageHeadline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const a = useTransform(scrollYProgress, [0, 0.33, 0.5], [1, 1, 0]);
  const b = useTransform(scrollYProgress, [0.33, 0.5, 0.66, 0.83], [0, 1, 1, 0]);
  const c = useTransform(scrollYProgress, [0.66, 0.83, 1], [0, 1, 1]);

const images = [
    { src: "/Code.png", alt: "Code" },
    { src: "/data.png", alt: "Data" },
    { src: "/ashoka.png", alt: "Campus" },
  ];

  return (
    <section ref={ref} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8 w-full">
          <div
            className="text-text display-tight"
            style={{ fontSize: "clamp(36px, 6.5vw, 88px)" }}
          >
            <span>Built at the intersection of </span>
            <span className="relative inline-block align-middle mx-2" style={{ width: "1.05em", height: "1.05em" }}>
              {images.map((img, i) => {
                const opacity = i === 0 ? a : i === 1 ? b : c;
                return (
                  <motion.div
                    key={img.src}
                    style={{ opacity }}
                    className="absolute inset-0"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: "8px" }}
                    />
                  </motion.div>
                );
              })}
            </span>
            <span> data, code, and impact.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
