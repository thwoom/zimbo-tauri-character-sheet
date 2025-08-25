import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'hero' | 'stats' | 'equipment' | 'inventory' | 'notes';
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ className = '', glow, ...props }, ref) => {
    const classes = ['hud-panel'];
    if (glow) classes.push(`glow-${glow}`);
    if (className) classes.push(className);

    return <div ref={ref} className={classes.join(' ')} {...props} />;
  },
);

Panel.displayName = 'Panel';
export default Panel;
