"use client";

import { HookTemplate } from '../../types/hook'
import { FilterValue } from './HookFilter'
import HookCard from './HookCard'

type Props = {
  hooks: HookTemplate[]
  filter: FilterValue
  onUse: (hook: HookTemplate) => void
  onDelete: (id: string) => void
}

export default function HookGrid({ hooks, filter, onUse, onDelete }: Props) {
  const filtered = filter === 'all' ? hooks : hooks.filter(h => h.category === filter)

  if (filtered.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 0',
        color: 'rgba(241,245,249,0.25)',
        fontSize: 15,
      }}>
        暂无钩子，点击右上角"+ 自定义"添加
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 16,
    }}>
      {filtered.map(hook => (
        <HookCard
          key={hook.id}
          hook={hook}
          onUse={onUse}
          onDelete={hook.custom ? onDelete : undefined}
        />
      ))}
    </div>
  )
}
