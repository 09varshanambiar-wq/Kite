import React from 'react';
import './Button.css';
import { Icon } from './Icon';
import * as LucideIcons from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  tone?: 'default' | 'inverse';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof LucideIcons;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    tone = 'default',
    size = 'md', 
    icon, 
    iconPosition = 'left',
    isLoading,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    
    const baseClass = 'kite-button';
    const classes = [
      baseClass,
      `${baseClass}--${variant}`,
      `${baseClass}--${tone}`,
      `${baseClass}--${size}`,
      isLoading ? `${baseClass}--loading` : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
        {isLoading ? (
          <Icon name="Loader2" className="kite-button-spinner" size={size === 'sm' ? 16 : 20} />
        ) : (
          <>
            {icon && iconPosition === 'left' && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
            <span className="kite-button-label">{children}</span>
            {icon && iconPosition === 'right' && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
