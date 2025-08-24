import React, { useState } from 'react';
import { PanelKranox, PanelOctagon } from './panels';

const FxDemo = () => {
  const [hoveredPanel, setHoveredPanel] = useState(null);

  return (
    <div
      style={{
        padding: '3rem',
        minHeight: '100vh',
      }}
    >
      <PanelKranox
        title="FX Demo"
        subtitle="Showcasing Arwes frames and animations"
        density="comfortable"
        variant="loud"
        style={{ marginBottom: '3rem' }}
      >
        <p style={{ color: '#7efcf6', lineHeight: 1.6 }}>
          This demo showcases the Arwes visual effects system with animated frames, ambient
          backgrounds, and staggered entry animations.
        </p>
      </PanelKranox>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}
      >
        {/* Kranox Panels */}
        <PanelKranox
          title="Kranox Panel 1"
          subtitle="Normal variant"
          density="normal"
          onMouseEnter={() => setHoveredPanel('kranox1')}
          onMouseLeave={() => setHoveredPanel(null)}
          style={{
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'kranox1' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <p style={{ color: '#7efcf6' }}>
            This is a standard Kranox panel with normal density and styling.
          </p>
        </PanelKranox>

        <PanelKranox
          title="Kranox Panel 2"
          subtitle="Compact density"
          density="compact"
          onMouseEnter={() => setHoveredPanel('kranox2')}
          onMouseLeave={() => setHoveredPanel(null)}
          style={{
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'kranox2' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <p style={{ color: '#7efcf6', fontSize: '0.875rem' }}>Compact panel with less padding.</p>
        </PanelKranox>

        <PanelKranox
          title="Kranox Panel 3"
          subtitle="Loud variant"
          density="normal"
          variant="loud"
          onMouseEnter={() => setHoveredPanel('kranox3')}
          onMouseLeave={() => setHoveredPanel(null)}
          style={{
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'kranox3' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <p style={{ color: '#7efcf6' }}>Loud variant with thicker borders and secondary color.</p>
        </PanelKranox>

        {/* Octagon Panels */}
        <PanelOctagon
          title="Octagon Panel 1"
          subtitle="Normal variant"
          density="normal"
          onMouseEnter={() => setHoveredPanel('octagon1')}
          onMouseLeave={() => setHoveredPanel(null)}
          style={{
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'octagon1' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <p style={{ color: '#7efcf6' }}>Standard octagonal frame with basic corner accents.</p>
        </PanelOctagon>

        <PanelOctagon
          title="Octagon Panel 2"
          subtitle="Comfortable density"
          density="comfortable"
          onMouseEnter={() => setHoveredPanel('octagon2')}
          onMouseLeave={() => setHoveredPanel(null)}
          style={{
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'octagon2' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <p style={{ color: '#7efcf6' }}>More spacious padding for comfortable reading.</p>
        </PanelOctagon>

        <PanelOctagon
          title="Octagon Panel 3"
          subtitle="Loud variant"
          density="normal"
          variant="loud"
          onMouseEnter={() => setHoveredPanel('octagon3')}
          onMouseLeave={() => setHoveredPanel(null)}
          style={{
            transition: 'transform 0.3s ease',
            transform: hoveredPanel === 'octagon3' ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <p style={{ color: '#7efcf6' }}>Loud variant with all corner accents enabled.</p>
        </PanelOctagon>
      </div>

      {/* Interactive Demo */}
      <PanelOctagon
        title="Interactive Demo"
        subtitle="Click to see focus states"
        density="comfortable"
        variant="normal"
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#00d9ff',
              color: '#001114',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff0080';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#00d9ff';
              e.target.style.transform = 'translateY(0)';
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #ffa726';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none';
            }}
          >
            Primary Action
          </button>

          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#00d9ff',
              border: '1px solid #00d9ff',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#00d9ff';
              e.target.style.color = '#001114';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#00d9ff';
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid #ffa726';
              e.target.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none';
            }}
          >
            Secondary Action
          </button>
        </div>
      </PanelOctagon>
    </div>
  );
};

export default FxDemo;
