import { useEffect, useState } from 'react';

export default function useModalTransition(isOpen, duration = 200) {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => setIsActive(true));
    } else if (isVisible) {
      setIsActive(false);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, isVisible]);

  return [isVisible, isActive];
}
