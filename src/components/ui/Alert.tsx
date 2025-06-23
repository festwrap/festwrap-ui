import type React from 'react';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, type LucideIcon } from 'lucide-react';

export interface CustomAlertProps {
  variant: 'info' | 'warning';
  title?: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

const variantStyles = {
  info: {
    container: 'bg-slate-100 border-tertiary text-tertiary',
    icon: 'text-tertiary',
  },
  warning: {
    container: 'bg-yellow-100 border-yellow-200 text-yellow-700',
    icon: 'text-yellow-700',
  },
};

const defaultIcons = {
  info: Info,
  warning: AlertTriangle,
};

export function Alert({
  variant,
  title,
  description,
  icon,
  action,
  className,
}: CustomAlertProps) {
  const IconComponent = icon || defaultIcons[variant];
  const styles = variantStyles[variant];

  const content = title || description;

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start md:items-center gap-3 rounded-lg border-2 p-4',
        styles.container,
        className
      )}
    >
      <IconComponent className={cn('h-6 w-6 flex-shrink-0', styles.icon)} />
      <div className="flex flex-1 flex-col md:flex-row items-end md:items-center gap-2">
        <div className="flex-1 min-w-0">
          {title && <div className="font-medium text-sm">{title}</div>}
          {description && (
            <div className={cn('text-sm', title ? 'mt-1' : '')}>
              {description}
            </div>
          )}
          {!title && !description && content && (
            <div className="text-sm">{content}</div>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
