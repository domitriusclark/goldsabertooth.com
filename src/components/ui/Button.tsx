import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cx } from '../../utils/classes';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-display font-normal transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:ring-offset-2 focus:ring-offset-ink comic-border btn-psychedelic';
  
  const variants = {
    primary: 'bg-electric-blue hover:bg-electric-blue-dark text-ink',
    secondary: 'bg-neon-orange hover:bg-neon-orange-dark text-ink',
    ghost: 'bg-transparent hover:bg-ink hover:bg-opacity-20 text-paper border-paper',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cx(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed hover:rotate-0 hover:scale-100',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>LOADING...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}