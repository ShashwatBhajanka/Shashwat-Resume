import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

/**
 * Sticky headline where a mid-sentence word is replaced by a small
 * square image that cross-fades between 3 placeholders while pinned.
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
              <motion.div style={{ opacity: a }} className="absolute inset-0">
                <ImagePlaceholder aspect="1/1" label="code" />
              </motion.div>
              <motion.div style={{ opacity: b }} className="absolute inset-0">
                <ImagePlaceholder aspect="1/1" label="data" />
              </motion.div>
              <motion.div style={{ opacity: c }} className="absolute inset-0">
                <ImagePlaceholder aspect="1/1" label="campus" />
              </motion.div>
            </span>
            <span> data, code, and impact.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
