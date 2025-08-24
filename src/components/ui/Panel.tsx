import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={['panel', className].filter(Boolean).join(' ')}
    style={{
      background: 'transparent',
      border: 'none',
      borderRadius: '0',
      padding: 'var(--hud-spacing, 1.25rem)',
      boxShadow: 'none',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
    }}
    {...props}
  />
));

Panel.displayName = 'Panel';
export default Panel;
