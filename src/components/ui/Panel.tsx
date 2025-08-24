import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    style={{
      borderRadius: 'var(--radius)',
      background: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-glass)',
      backdropFilter: 'blur(var(--glass-blur))',
      WebkitBackdropFilter: 'blur(var(--glass-blur))',
      padding: 'var(--space-md)',
    }}
    className={className}
    {...props}
  />
));

Panel.displayName = 'Panel';
export default Panel;
