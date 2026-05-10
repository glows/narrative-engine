"use client";

import { HookCategory } from '../../types/hook'

type FilterValue = HookCategory | 'all'

const FILTERS: { value: FilterValue; label: string; color: string }[] = [
  { value: 'all', label: '全部', color: '#94a3b8' },
  { value: 'visual', label: '视觉钩子', color: '#3b82f6' },
  { value: 'cognitive', label: '认知钩子', color: '#f97316' },
  { value: 'emotional', label: '情感钩子', color: '#ec4899' },
]

type Props = {
  active: FilterValue
  onChange: (v: FilterValue) => void
  counts: Record<FilterValue, number>
}

export default function HookFilter({ active, onChange, counts }: Props) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {FILTERS.map(f => {
        const isActive = active === f.value
        return (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            style={{
              padding: '8px 18px',
              borderRadius: 24,
              border: isActive ? `1px solid ${f.color}` : '1px solid rgba(255,255,255,0.1)',
              background: isActive ? f.color + '20' : 'transparent',
              color: isActive ? f.color : 'rgba(241,245,249,0.45)',
              fontWeight: isActive ? 700 : 400,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {f.label}
            <span style={{
              fontSize: 11,
              padding: '1px 7px',
              borderRadius: 10,
              background: isActive ? f.color + '30' : 'rgba(255,255,255,0.07)',
              color: isActive ? f.color : 'rgba(241,245,249,0.3)',
            }}>
              {counts[f.value]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export type { FilterValue }
