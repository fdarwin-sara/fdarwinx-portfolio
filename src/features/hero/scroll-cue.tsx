"use client";

import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function ScrollCue() {
  return (
    <motion.a className="scroll-cue" href="#work" whileHover={{ opacity: 1 }} initial={false} transition={useReducedMotion() ? { duration: 0 } : undefined}>
      <ChevronDown size={16} aria-hidden="true" />
      Scroll to explore
    </motion.a>
  );
}
