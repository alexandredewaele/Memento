import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = "font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary hover:bg-blue-600 disabled:opacity-60 text-white shadow-lg shadow-primary/20",
    secondary: "bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700",
    danger: "bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white shadow-lg shadow-red-500/20",
    ghost: "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="material-icons-round animate-spin text-xl">refresh</span>
      ) : (
        children
      )}
    </button>
  );
};
