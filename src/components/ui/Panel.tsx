import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(({ className = '', ...props }, ref) => (
  <div ref={ref} className={['hud-panel', className].filter(Boolean).join(' ')} {...props} />
));

Panel.displayName = 'Panel';
export default Panel;
