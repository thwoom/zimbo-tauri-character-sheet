import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Animator } from '@arwes/react-animator';
import { GridLines, Dots } from '@arwes/react-bgs';
import { css } from '../styled-system/css';
import Navigation from './Navigation';

const ArwesWrapper = ({ children }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Check for low performance indicators
    const checkPerformance = () => {
      const dpr = window.devicePixelRatio || 1;
      const screenWidth = window.innerWidth;

      // Consider low performance on mobile or low DPR
      setIsLowPerformance(dpr < 1.5 || screenWidth < 768);
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', checkPerformance);
    };
  }, []);

  // Disable animations if reduced motion is preferred
  const animatorEnabled = !prefersReducedMotion;

  // Reduce background opacity on low performance devices
  const backgroundOpacity = isLowPerformance ? 0.05 : 0.1;
  const dotsOpacity = isLowPerformance ? 0.025 : 0.05;

  return (
    <Animator
      duration={{
        enter: prefersReducedMotion ? 0 : 1000,
        exit: prefersReducedMotion ? 0 : 1000,
        stagger: prefersReducedMotion ? 0 : 50,
      }}
      enabled={animatorEnabled}
    >
      <div
        className={css({
          position: 'relative',
          minHeight: '100vh',
          overflow: 'hidden',
          backgroundColor: 'background',
          isolation: 'isolate',
        })}
      >
        {/* Background layers with performance-aware opacity */}
        {!prefersReducedMotion && (
          <>
            <div
              className={css({
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                opacity: backgroundOpacity,
              })}
            >
              <GridLines lineColor="rgb(0, 217, 255)" lineWidth={1} distance={30} />
            </div>

            <div
              className={css({
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 1,
                opacity: dotsOpacity,
              })}
            >
              <Dots color="rgb(0, 217, 255)" size={2} distance={30} />
            </div>
          </>
        )}

        {/* Main content layer */}
        <div
          className={css({
            position: 'relative',
            zIndex: 10,
            width: '100%',
            minHeight: '100vh',
          })}
        >
          <Navigation />
          {children}
        </div>
      </div>
    </Animator>
  );
};

ArwesWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ArwesWrapper;
