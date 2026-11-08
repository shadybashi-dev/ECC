'use client'

import * as React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', disabled, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none brand-navy'
  const variants = {
    primary: 'bg-brand-yellow text-brand-navy-dark hover:bg-brand-yellow-light',
    outline: 'border border-brand-light bg-transparent hover:bg-brand-light',
    ghost: 'hover:bg-brand-light/50',
    danger: 'bg-brand-navy text-white hover:bg-brand-navy-dark',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className || ''}`} disabled={disabled} {...props} />
  )
}
