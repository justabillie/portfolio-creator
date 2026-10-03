import type { Transition } from "motion/react";

export const spring: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 30,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};
