import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid';
}

const variantClasses: Record<NonNullable<CardProps['variant']>, string> = {
  glass: 'bg-glass border border-glass shadow-glass backdrop-blur-glass',
  solid: 'bg-card text-fg shadow',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'solid', className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={['rounded p-md', variantClasses[variant], className].filter(Boolean).join(' ')}
      {...props}
    />
  ),
);

Card.displayName = 'Card';
export default Card;
