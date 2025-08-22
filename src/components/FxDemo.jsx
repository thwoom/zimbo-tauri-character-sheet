import React, { useState } from 'react';
import { PanelKranox, PanelOctagon } from './panels';
import { css } from '../styled-system/css';

const FxDemo = () => {
  const [hoveredPanel, setHoveredPanel] = useState(null);

  return (
    <div className={css({
      padding: '2xl',
      minHeight: '100vh',
    })}>
      <PanelKranox
        title="FX Demo"
        subtitle="Showcasing Arwes frames and animations"
        density="comfortable"
        variant="loud"
        className={css({ marginBottom: '2xl' })}
      >
        <p className={css({ color: 'text', lineHeight: 1.6 })}>
          This demo showcases the Arwes visual effects system with animated frames,
          ambient backgrounds, and staggered entry animations.
        </p>
      </PanelKranox>

      <div className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 'xl',
        marginBottom: '2xl',
      })}>
        {/* Kranox Panels */}
        <PanelKranox
          title="Kranox Panel 1"
          subtitle="Normal variant"
          density="normal"
          onMouseEnter={() => setHoveredPanel('kranox1')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={css({
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'kranox1' ? 'scale(1.02)' : 'scale(1)',
          })}
        >
          <p className={css({ color: 'text' })}>
            This is a standard Kranox panel with normal density and styling.
          </p>
        </PanelKranox>

        <PanelKranox
          title="Kranox Panel 2"
          subtitle="Compact density"
          density="compact"
          onMouseEnter={() => setHoveredPanel('kranox2')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={css({
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'kranox2' ? 'scale(1.02)' : 'scale(1)',
          })}
        >
          <p className={css({ color: 'text', fontSize: '0.875rem' })}>
            Compact panel with less padding.
          </p>
        </PanelKranox>

        <PanelKranox
          title="Kranox Panel 3"
          subtitle="Loud variant"
          density="normal"
          variant="loud"
          onMouseEnter={() => setHoveredPanel('kranox3')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={css({
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'kranox3' ? 'scale(1.02)' : 'scale(1)',
          })}
        >
          <p className={css({ color: 'text' })}>
            Loud variant with thicker borders and secondary color.
          </p>
        </PanelKranox>

        {/* Octagon Panels */}
        <PanelOctagon
          title="Octagon Panel 1"
          subtitle="Normal variant"
          density="normal"
          onMouseEnter={() => setHoveredPanel('octagon1')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={css({
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'octagon1' ? 'scale(1.02)' : 'scale(1)',
          })}
        >
          <p className={css({ color: 'text' })}>
            Standard octagonal frame with basic corner accents.
          </p>
        </PanelOctagon>

        <PanelOctagon
          title="Octagon Panel 2"
          subtitle="Comfortable density"
          density="comfortable"
          onMouseEnter={() => setHoveredPanel('octagon2')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={css({
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'octagon2' ? 'scale(1.02)' : 'scale(1)',
          })}
        >
          <p className={css({ color: 'text' })}>
            More spacious padding for comfortable reading.
          </p>
        </PanelOctagon>

        <PanelOctagon
          title="Octagon Panel 3"
          subtitle="Loud variant"
          density="normal"
          variant="loud"
          onMouseEnter={() => setHoveredPanel('octagon3')}
          onMouseLeave={() => setHoveredPanel(null)}
          className={css({
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'octagon3' ? 'scale(1.02)' : 'scale(1)',
          })}
        >
          <p className={css({ color: 'text' })}>
            Loud variant with all corner accents enabled.
          </p>
        </PanelOctagon>
      </div>

      {/* Interactive Demo */}
      <PanelOctagon
        title="Interactive Demo"
        subtitle="Click to see focus states"
        density="comfortable"
        variant="normal"
      >
        <div className={css({ display: 'flex', gap: 'md', flexWrap: 'wrap' })}>
          <button
            className={css({
              padding: 'sm md',
              backgroundColor: 'primary',
              color: 'background',
              border: 'none',
              borderRadius: 'sm',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'secondary',
                transform: 'translateY(-2px)',
              },
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'accent',
                outlineOffset: '2px',
              },
            })}
          >
            Primary Action
          </button>

          <button
            className={css({
              padding: 'sm md',
              backgroundColor: 'transparent',
              color: 'primary',
              border: '1px solid',
              borderColor: 'primary',
              borderRadius: 'sm',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary',
                color: 'background',
              },
              '&:focus': {
                outline: '2px solid',
                outlineColor: 'accent',
                outlineOffset: '2px',
              },
            })}
          >
            Secondary Action
          </button>
        </div>
      </PanelOctagon>
    </div>
  );
};

export default FxDemo;