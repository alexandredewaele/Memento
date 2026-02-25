import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  containerClassName?: string
  variant?: 'default' | 'error'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      variant = 'default',
      className = '',
      containerClassName = '',
      ...props
    },
    ref,
  ) => {
    const isError = variant === 'error' || !!error
    const currentVariant = isError ? 'error' : 'default'

    const baseStyles =
      'w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 text-sm transition-colors'

    const variants = {
      default: 'border-slate-200 dark:border-slate-700 focus:ring-primary',
      error: 'border-red-500 focus:ring-red-500',
    }

    return (
      <div className={containerClassName}>
        {label && (
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${variants[currentVariant]} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
