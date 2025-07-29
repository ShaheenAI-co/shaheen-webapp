"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ScrollRevealText({
  text,
  delay = 0,
  duration = 0.6,
  className = "",
  splitBy = "sentence",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  // Split text based on the splitBy prop
  const splitText = (text, method) => {
    switch (method) {
      case "sentence":
        return text
          .split(/(?<=[.!?])\s+/)
          .filter((sentence) => sentence.trim().length > 0);
      case "line":
        return text.split("\n").filter((line) => line.trim().length > 0);
      case "word":
        return text.split(" ").filter((word) => word.trim().length > 0);
      default:
        return [text];
    }
  };

  const textParts = splitText(text, splitBy);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="space-y-2"
      >
        {textParts.map((part, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`${splitBy === "word" ? "inline-block mr-2" : "block"}`}
          >
            {splitBy === "word" ? (
              <span className="inline-block">{part}</span>
            ) : (
              <p className="leading-relaxed">{part}</p>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
