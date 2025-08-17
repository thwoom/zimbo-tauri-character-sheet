export const SCREEN_SM = 768; // token: screen.sm

export const isCompactWidth = () => typeof window !== 'undefined' && window.innerWidth < SCREEN_SM;
