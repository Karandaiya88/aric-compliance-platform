'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { PulseDot } from '@/components/ui'
import { notifications } from '@/data/mock'

export default function Topbar() {
  const [showNotifs, setShowNotifs] = useState(false)
  const unread = notifications.filter(n => !n.read).length

  return (
    <header className="h-14 border-b border-white/7 flex items-center justify-between px-6 bg-[#08090c]/95 backdrop-blur-xl sticky top-0 z-50">
      {/* Left: breadcrumb / search */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a5568] text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search regulations, MAPs, departments…"
            className="bg-[#161820] border border-white/7 rounded-lg text-[12px] text-[#e8edf5] placeholder:text-[#4a5568] pl-8 pr-4 py-1.5 w-64 outline-none focus:border-[#00d4aa]/40 transition-colors font-display"
          />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161820] border border-white/7">
          <PulseDot color="#10b981" />
          <span className="text-[11px] font-mono text-[#6b7a94]">4 agents live</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-8 h-8 rounded-lg bg-[#161820] border border-white/7 flex items-center justify-center hover:border-white/15 transition-colors"
          >
            <span className="text-sm">🔔</span>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-mono font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-[#0f1117] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-3 border-b border-white/7 flex items-center justify-between">
                <span className="font-display font-bold text-[13px]">Notifications</span>
                <span className="text-[10px] text-[#00d4aa] font-mono">{unread} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      'px-4 py-3 border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer',
                      !n.read && 'bg-[#00d4aa]/3'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0 mt-0.5">
                        {n.type === 'alert' ? '🚨' : n.type === 'success' ? '✅' : n.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <div>
                        <div className="text-[12px] font-semibold font-display text-[#e8edf5]">{n.title}</div>
                        <div className="text-[11px] text-[#6b7a94] mt-0.5 leading-relaxed">{n.message}</div>
                        <div className="text-[10px] text-[#4a5568] font-mono mt-1">{n.createdAt}</div>
                      </div>
                      {!n.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-[11px] text-[#00d4aa] hover:underline font-display">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/7">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-black text-xs font-bold font-display"
            style={{ background: 'linear-gradient(135deg, #00d4aa, #0096ff)' }}>
            JT
          </div>
          <div className="hidden sm:block">
            <div className="text-[12px] font-display font-semibold">James T.</div>
            <div className="text-[10px] text-[#6b7a94]">Chief Risk Officer</div>
          </div>
        </div>
      </div>
    </header>
  )
}
