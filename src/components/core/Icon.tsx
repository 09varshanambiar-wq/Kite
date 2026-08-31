import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof LucideIcons;
  size?: 16 | 20 | 24;
}

export function Icon({ name, size = 20, className = '', ...props }: IconProps) {
  const LucideComponent = LucideIcons[name] as LucideIcon;
  if (!LucideComponent) return null;

  const strokeWidth = size >= 24 ? 2 : 1.75;

  return (
    <LucideComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
