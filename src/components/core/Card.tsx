import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'glass' | 'outline';
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'solid', interactive = false, className = '', ...props }, ref) => {
    
    const baseClass = 'kite-card';
    const classes = [
      baseClass,
      `${baseClass}--${variant}`,
      interactive ? `${baseClass}--interactive` : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
