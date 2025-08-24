import React from 'react';

interface ParticleBackgroundProps {
  variant?: 'starfield' | 'nebula' | 'matrix' | 'minimal';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  // variant = 'starfield', // Unused parameter
  // intensity = 'medium', // Unused parameter
  className = '',
}) => {
  // Get particle count based on intensity
  // const getParticleCount = () => {
  //   switch (intensity) {
  //     case 'low':
  //       return 20;
  //     case 'high':
  //       return 100;
  //     default:
  //       return 50;
  //   }
  // };

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`} style={{ zIndex: -1 }}>
      {/* Direct star rendering - bypassing getBackground */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1 }}>
        {/* Bright gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/40 to-cyan-900/50" />

        {/* TEST TEXT - Should be visible */}
        <div
          style={{
            position: 'absolute',
            top: '50px',
            left: '50px',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            zIndex: -1,
            textShadow: '0 0 10px white',
          }}
        >
          STARFIELD TEST - CAN YOU SEE THIS?
        </div>

        {/* Direct test stars */}
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '100px',
            width: '100px',
            height: '100px',
            backgroundColor: '#ff0000',
            borderRadius: '50%',
            boxShadow: '0 0 100px #ff0000',
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '250px',
            left: '300px',
            width: '100px',
            height: '100px',
            backgroundColor: '#00ff00',
            borderRadius: '50%',
            boxShadow: '0 0 100px #00ff00',
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '400px',
            left: '500px',
            width: '100px',
            height: '100px',
            backgroundColor: '#0000ff',
            borderRadius: '50%',
            boxShadow: '0 0 100px #0000ff',
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );
};

export default ParticleBackground;
