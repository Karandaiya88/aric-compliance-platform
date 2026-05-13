'use client'
import { cn } from '@/lib/utils'

// ─── Badge ────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline'
}
export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border',
      variant === 'outline' && 'bg-transparent',
      className
    )}>
      {children}
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}
export function Button({
  children, variant = 'secondary', size = 'md',
  loading, className, disabled, ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display font-semibold rounded-md transition-all duration-150 border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'primary': 'bg-[#00d4aa] text-black border-[#00d4aa] hover:bg-[#00bfa0]',
          'secondary': 'bg-[#161820] text-[#e8edf5] border-white/10 hover:border-white/20 hover:text-white',
          'ghost': 'bg-transparent border-transparent text-[#6b7a94] hover:text-white hover:bg-white/5',
          'danger': 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
        }[variant],
        {
          'sm': 'text-[11px] px-3 py-1.5',
          'md': 'text-[13px] px-4 py-2',
          'lg': 'text-[14px] px-5 py-2.5',
        }[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size={12} />}
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  accentColor?: string
}
export function Card({ children, className, hover, onClick, accentColor }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-[#0f1117] border border-white/7 rounded-xl p-5 relative overflow-hidden',
        hover && 'cursor-pointer transition-all duration-200 hover:border-white/12 hover:bg-[#161820]',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {accentColor && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accentColor }} />
      )}
      {children}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-block border-2 border-[#00d4aa]/30 border-t-[#00d4aa] rounded-full animate-spin flex-shrink-0"
    />
  )
}

// ─── Pulse Dot ────────────────────────────────────────────────────
export function PulseDot({ color = '#10b981' }: { color?: string }) {
  return (
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{
        background: color,
        boxShadow: `0 0 0 3px ${color}33`,
        animation: 'pulse-ring 2s ease-in-out infinite',
      }}
    />
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────
interface ProgressProps {
  value: number
  color?: string
  className?: string
}
export function ProgressBar({ value, color = '#00d4aa', className }: ProgressProps) {
  return (
    <div className={cn('h-1 bg-white/5 rounded-full overflow-hidden', className)}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${Math.min(value, 100)}%`, background: color }}
      />
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────
interface SectionHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}
export function SectionHeader({ title, subtitle, actions }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="font-display font-bold text-base text-[#e8edf5]">{title}</h2>
        {subtitle && <p className="text-xs text-[#6b7a94] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────
export function EmptyState({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="text-center py-16 text-[#6b7a94]">
      <div className="text-4xl mb-3 opacity-40">{icon}</div>
      <div className="font-display font-semibold text-sm mb-1">{title}</div>
      <div className="text-xs">{desc}</div>
    </div>
  )
}

// ─── Metric Card ─────────────────────────────────────────────────
interface MetricCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'up' | 'down' | 'neutral'
  icon: string
  accentColor: string
  delay?: number
}
export function MetricCard({ label, value, change, changeType, icon, accentColor, delay = 0 }: MetricCardProps) {
  return (
    <Card
      accentColor={accentColor}
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 } as React.CSSProperties}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-[10px] font-semibold text-[#6b7a94] uppercase tracking-widest font-display">
          {label}
        </span>
        <span className="text-2xl opacity-10">{icon}</span>
      </div>
      <div className="text-3xl font-display font-extrabold mb-1.5" style={{ color: accentColor }}>
        {value}
      </div>
      {change && (
        <div className={cn(
          'text-xs flex items-center gap-1',
          changeType === 'up' ? 'text-emerald-400' :
          changeType === 'down' ? 'text-red-400' : 'text-[#6b7a94]'
        )}>
          {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '–'} {change}
        </div>
      )}
    </Card>
  )
}

// ─── Filter Chips ─────────────────────────────────────────────────
interface FilterChipProps {
  label: string
  active?: boolean
  onClick: () => void
}
export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-150 font-display',
        active
          ? 'bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/40'
          : 'bg-[#161820] text-[#6b7a94] border-white/10 hover:text-white hover:border-white/20'
      )}
    >
      {label}
    </button>
  )
}

// ─── Tag ─────────────────────────────────────────────────────────
export function Tag({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide',
      className
    )}>
      {label}
    </span>
  )
}
