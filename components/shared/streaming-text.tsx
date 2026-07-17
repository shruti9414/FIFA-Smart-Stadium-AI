"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { streamTextContainer, streamTextWord } from "@/lib/motion/variants";

/** §9.6 streamText — reveals AI-generated text word-by-word so it reads as "just generated," not static copy. */
export function StreamingText({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.span
      variants={streamTextContainer(reduced)}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={streamTextWord(reduced)} className="inline-block">
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
