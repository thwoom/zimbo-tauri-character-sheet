/**
 * Framer Motion variants for consistent animations throughout the app
 * These variants define the futuristic, sci-fi aesthetic with smooth transitions
 */

// Fade and scale animations for modals and overlays
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Backdrop animations
export const backdropVariants = {
  hidden: {
    opacity: 0,
    backdropFilter: "blur(0px)"
  },
  visible: {
    opacity: 1,
    backdropFilter: "blur(8px)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    backdropFilter: "blur(0px)",
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Button hover and tap animations
export const buttonVariants = {
  idle: {
    scale: 1,
    boxShadow: "0 0 0px var(--glow-shadow)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 0 20px var(--glow-shadow-strong)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
};

// Panel slide-in animations
export const panelVariants = {
  hidden: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2
    }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
};

// Stagger animations for lists and grids
export const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.05
    }
  }
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Glowing pulse animation for status effects
export const pulseVariants = {
  idle: {
    filter: "drop-shadow(0 0 5px var(--color-accent))",
    scale: 1
  },
  pulse: {
    filter: [
      "drop-shadow(0 0 5px var(--color-accent))",
      "drop-shadow(0 0 15px var(--color-accent))",
      "drop-shadow(0 0 5px var(--color-accent))"
    ],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Floating animation for elements
export const floatVariants = {
  float: {
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Success/error feedback animations
export const feedbackVariants = {
  success: {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 0 0px var(--success-shadow)",
      "0 0 30px var(--success-shadow)",
      "0 0 0px var(--success-shadow)"
    ],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  },
  error: {
    x: [-5, 5, -5, 5, 0],
    boxShadow: [
      "0 0 0px var(--error-shadow)",
      "0 0 20px var(--error-shadow)",
      "0 0 0px var(--error-shadow)"
    ],
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

// Dice roll animation
export const diceVariants = {
  idle: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1
  },
  rolling: {
    rotateX: [0, 360, 720],
    rotateY: [0, 180, 360],
    rotateZ: [0, 90, 180],
    scale: [1, 1.2, 1],
    transition: {
      duration: 1,
      ease: "easeInOut"
    }
  },
  result: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1.1,
    boxShadow: "0 0 30px var(--glow-shadow-strong)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

// Loading shimmer effect
export const shimmerVariants = {
  shimmer: {
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// Neon text glow effect
export const neonTextVariants = {
  idle: {
    textShadow: "0 0 5px var(--text-glow)"
  },
  glow: {
    textShadow: [
      "0 0 5px var(--text-glow)",
      "0 0 15px var(--text-glow), 0 0 25px var(--text-glow)",
      "0 0 5px var(--text-glow)"
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
