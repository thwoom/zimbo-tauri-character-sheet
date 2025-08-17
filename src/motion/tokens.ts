export const durations = {
  xs: 0.12,
  sm: 0.16,
  md: 0.22,
  lg: 0.32,
} as const;

export const easings = {
  standard: [0.4, 0, 0.2, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
} as const;

export const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};
