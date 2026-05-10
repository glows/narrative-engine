"use client";

import { HookTemplate } from '../../types/hook'

const CATEGORY_CONFIG = {
  visual: { label: '视觉钩子', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  cognitive: { label: '认知钩子', color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
  emotional: { label: '情感钩子', color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
}

type Props = {
  hook: HookTemplate
  onUse: (hook: HookTemplate) => void
  onDelete?: (id: string) => void
}

export default function HookCard({ hook, onUse, onDelete }: Props) {
  const config = CATEGORY_CONFIG[hook.category]

  return (
    <div style={{
      background: '#1a1d27',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'border-color 0.2s, transform 0.15s',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = config.color + '60'
      ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'
      ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          color: config.color,
          background: config.bg,
          padding: '3px 10px',
          borderRadius: 20,
        }}>
          {config.label}
          {hook.custom && ' · 自定义'}
        </span>
        {hook.custom && onDelete && (
          <button
            onClick={() => onDelete(hook.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.25)',
              cursor: 'pointer',
              fontSize: 16,
              padding: '0 4px',
              lineHeight: 1,
            }}
            title="删除"
          >×</button>
        )}
      </div>

      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9', marginBottom: 8 }}>
          {hook.title}
        </div>
        <div style={{
          fontSize: 14,
          color: 'rgba(241,245,249,0.7)',
          lineHeight: 1.65,
          fontStyle: 'italic',
          borderLeft: `2px solid ${config.color}`,
          paddingLeft: 12,
        }}>
          "{hook.example}"
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'rgba(241,245,249,0.45)', lineHeight: 1.6 }}>
        {hook.tip}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {hook.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 11,
            color: 'rgba(241,245,249,0.4)',
            background: 'rgba(255,255,255,0.05)',
            padding: '2px 8px',
            borderRadius: 8,
          }}>
            #{tag}
          </span>
        ))}
      </div>

      <button
        onClick={() => onUse(hook)}
        style={{
          marginTop: 4,
          padding: '10px 0',
          borderRadius: 10,
          border: `1px solid ${config.color}40`,
          background: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          transition: 'background 0.15s',
          letterSpacing: '0.03em',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = config.color + '25')}
        onMouseLeave={e => (e.currentTarget.style.background = config.bg)}
      >
        使用此钩子 →
      </button>
    </div>
  )
}
