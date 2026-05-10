"use client";

import { SavedScript } from '../../types/scriptManager'
import ScriptCard from './ScriptCard'

type Props = {
  scripts: SavedScript[]
  activeId: string
  onOpen: (id: string) => void
  onNew: () => void
  onRename: (id: string, title: string) => void
  onDuplicate: (id: string) => void
  onExport: (id: string) => void
  onDelete: (id: string) => void
}

export default function ScriptManager({ scripts, activeId, onOpen, onNew, onRename, onDuplicate, onExport, onDelete }: Props) {
  const sorted = [...scripts].sort((a, b) => b.updatedAt - a.updatedAt)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#818cf8', textTransform: 'uppercase' }}>
            叙事决策引擎
          </p>
          <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>
            我的脚本
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(241,245,249,0.4)' }}>
            {scripts.length} 个脚本 · 双击卡片标题可重命名
          </p>
        </div>
        <button
          onClick={onNew}
          style={{
            padding: '11px 22px', borderRadius: 12,
            border: 'none', background: '#6366f1',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          + 新建脚本
        </button>
      </div>

      {/* Grid */}
      {scripts.length === 0 ? (
        <EmptyState onNew={onNew} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {sorted.map(script => (
            <ScriptCard
              key={script.id}
              script={script}
              isActive={script.id === activeId}
              onOpen={() => onOpen(script.id)}
              onRename={title => onRename(script.id, title)}
              onDuplicate={() => onDuplicate(script.id)}
              onExport={() => onExport(script.id)}
              onDelete={() => onDelete(script.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      <div style={{ fontSize: 48, opacity: 0.15 }}>📄</div>
      <p style={{ margin: 0, fontSize: 16, color: 'rgba(241,245,249,0.3)', fontWeight: 600 }}>
        还没有脚本
      </p>
      <p style={{ margin: 0, fontSize: 13, color: 'rgba(241,245,249,0.2)' }}>
        点击下方按钮开始创作，或前往钩子实验室获取灵感
      </p>
      <button
        onClick={onNew}
        style={{
          marginTop: 8, padding: '11px 28px', borderRadius: 12,
          border: 'none', background: '#6366f1',
          color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
        }}
      >+ 新建脚本</button>
    </div>
  )
}
