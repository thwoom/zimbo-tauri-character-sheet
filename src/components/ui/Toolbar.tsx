import React from 'react';

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'flex items-center gap-sm rounded bg-glass border border-glass shadow-glass p-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  ),
);

Toolbar.displayName = 'Toolbar';
export default Toolbar;
