import * as React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={`bg-brand-warm-white rounded-lg border border-brand-light p-6 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}
