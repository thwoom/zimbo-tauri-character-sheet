import React from 'react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={[
      'rounded bg-glass border border-glass shadow-glass backdrop-blur-glass p-md',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
));

Panel.displayName = 'Panel';
export default Panel;
