import React, { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export type ChipVariant = 'primary' | 'secondary' | 'tertiary';
export type ChipSize = 'sm' | 'md' | 'lg';

interface ChipProps {
  children: ReactNode;
  color?: ChipVariant;
  size?: ChipSize;
}

const colorClasses: Record<ChipVariant, string> = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-dark',
  tertiary: 'bg-tertiary text-dark',
};

const sizeClasses: Record<ChipSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export default function Chip({
  children,
  color = 'primary',
  size = 'md',
}: ChipProps) {
  return (
    <div
      className={twMerge(
        'inline-flex items-center rounded-full font-medium',
        colorClasses[color],
        sizeClasses[size]
      )}
    >
      {children}
    </div>
  );
}
