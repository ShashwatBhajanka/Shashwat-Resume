import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Counter({ to, suffix = "", duration = 1500 }: { to: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-20% 0px" });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    // ease-out-expo: fast start, soft landing, never overshoots the real value
    const easeOutExpo = (p: number) => (p === 1 ? 1 : 1 - Math.pow(2, -10 * p));
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = easeOutExpo(p);
      setN(Math.round(to * eased));
      if (p < 1) requestAnimationFrame(tick);
      else setN(to);
    };
    requestAnimationFrame(tick);
  }, [inView, to, duration]);

  return (
    <motion.span
      ref={wrapRef}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="inline-block"
    >
      {n.toLocaleString("en-US")}{suffix}
    </motion.span>
  );
}
