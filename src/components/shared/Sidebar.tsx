'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { PulseDot } from '@/components/ui'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈', badge: null },
  { href: '/regulations', label: 'Regulations', icon: '📡', badge: 3 },
  { href: '/maps', label: 'MAPs Engine', icon: '⚡', badge: 18 },
  { href: '/departments', label: 'Departments', icon: '🏛️', badge: null },
  { href: '/validation', label: 'Validation', icon: '✅', badge: 6 },
  { href: '/audit', label: 'Audit Trail', icon: '📔', badge: null },
  { href: '/settings', label: 'Settings', icon: '⚙️', badge: null },
]

const sourceItems = [
  { label: 'Basel Committee', count: 1, color: '#f59e0b' },
  { label: 'Federal Reserve', count: 2, color: '#ef4444' },
  { label: 'FinCEN / AML', count: 0, color: '#6b7a94' },
  { label: 'EBA / ECB', count: 0, color: '#6b7a94' },
  { label: 'DORA / GDPR', count: 1, color: '#a855f7' },
  { label: 'SEC / CFTC', count: 0, color: '#6b7a94' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] min-w-[240px] border-r border-white/7 flex flex-col overflow-y-auto bg-[#08090c]">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/7">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-black text-sm"
            style={{ background: 'linear-gradient(135deg, #00d4aa, #0096ff)' }}>
            A
          </div>
          <div>
            <div className="font-display font-bold text-[13px] text-white leading-none">
              ARIC <span className="text-[#00d4aa]">Intelligence</span>
            </div>
            <div className="text-[10px] text-[#4a5568] font-mono mt-0.5">v1.0.0 · Production</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="mb-1">
          <div className="text-[10px] font-bold text-[#4a5568] uppercase tracking-widest font-display px-2 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-display font-medium transition-all duration-150 mb-0.5 group',
                  active
                    ? 'bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/15'
                    : 'text-[#6b7a94] hover:text-white hover:bg-white/5 border border-transparent'
                )}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span className={cn(
                    'text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center',
                    active ? 'bg-[#00d4aa]/20 text-[#00d4aa]' : 'bg-red-500/15 text-red-400'
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Sources */}
        <div className="mt-5">
          <div className="text-[10px] font-bold text-[#4a5568] uppercase tracking-widest font-display px-2 mb-2">
            Regulatory Sources
          </div>
          {sourceItems.map((src) => (
            <div key={src.label}
              className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-[#6b7a94] hover:text-white cursor-pointer transition-colors duration-150 rounded-lg hover:bg-white/4"
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: src.color }} />
              <span className="flex-1 truncate">{src.label}</span>
              {src.count > 0 && (
                <span className="text-[10px] font-mono text-red-400 font-bold">{src.count}</span>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-5">
          <div className="text-[10px] font-bold text-[#4a5568] uppercase tracking-widest font-display px-2 mb-2">
            Quick Stats
          </div>
          <div className="px-3 space-y-2">
            {[
              { label: 'Open MAPs', value: '34', color: '#e8edf5' },
              { label: 'Overdue', value: '7', color: '#ef4444' },
              { label: 'Validated', value: '89%', color: '#10b981' },
              { label: 'Avg resolution', value: '14.2d', color: '#e8edf5' },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-[11px] text-[#6b7a94]">{stat.label}</span>
                <span className="text-[11px] font-mono font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Agent Status Footer */}
      <div className="px-4 py-3 border-t border-white/7">
        <div className="text-[10px] font-bold text-[#4a5568] uppercase tracking-widest font-display mb-2">
          Agent Status
        </div>
        <div className="space-y-1.5">
          {[
            { name: 'Monitor', status: 'active' as const },
            { name: 'Parser', status: 'active' as const },
            { name: 'Assigner', status: 'active' as const },
            { name: 'Validator', status: 'idle' as const },
          ].map((agent) => (
            <div key={agent.name} className="flex items-center justify-between">
              <span className="text-[11px] text-[#6b7a94]">{agent.name} Agent</span>
              <div className="flex items-center gap-1.5">
                <PulseDot color={agent.status === 'active' ? '#10b981' : '#4a5568'} />
                <span className="text-[10px] font-mono" style={{ color: agent.status === 'active' ? '#10b981' : '#4a5568' }}>
                  {agent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
