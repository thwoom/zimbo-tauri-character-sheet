import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={['rounded bg-card text-fg shadow p-md', className].filter(Boolean).join(' ')}
    {...props}
  />
));

Card.displayName = 'Card';
export default Card;
