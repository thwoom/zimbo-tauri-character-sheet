import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

export function useReducedMotion() {
  return useFramerReducedMotion();
}

export function useMotionTransition(duration: number, ease?: number[] | string) {
  const reduce = useFramerReducedMotion();
  return reduce ? { duration: 0 } : { duration, ...(ease ? { ease } : {}) };
}

export function useMotionVariants(variants: any) {
  const reduce = useFramerReducedMotion();
  return reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
    : variants;
}
