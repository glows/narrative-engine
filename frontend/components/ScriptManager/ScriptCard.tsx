"use client";

import { useEffect, useRef, useState } from 'react'
import { SavedScript } from '../../types/scriptManager'
import { scoreToColor } from '../ScriptEditor/emotionKeywords'
import { relativeTime } from '../../lib/scriptStorage'

type Props = {
  script: SavedScript
  isActive: boolean
  onOpen: () => void
  onRename: (title: string) => void
  onDuplicate: () => void
  onExport: () => void
  onDelete: () => void
}

function MiniCurve({ script }: { script: SavedScript }) {
  const scores = script.paragraphs.map(p => p.emotionScore)
  if (scores.length === 0) return (
    <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 11, color: 'rgba(241,245,249,0.2)' }}>暂无段落</span>
    </div>
  )

  const W = 220, H = 40
  const pts = scores.map((s, i) => ({
    x: scores.length === 1 ? W / 2 : (i / (scores.length - 1)) * W,
    y: H - (s / 10) * H,
  }))

  let path = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cx = (pts[i - 1].x + pts[i].x) / 2
    path += ` C ${cx} ${pts[i - 1].y} ${cx} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
  }
  const fill = `${path} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 40, display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g-${script.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#g-${script.id})`} />
      <path d={path} fill="none" stroke="#818cf8" strokeWidth={1.5} />
      {pts.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={2.5}
          fill={scoreToColor(scores[i])} stroke="#1a1d27" strokeWidth={1} />
      ))}
    </svg>
  )
}

export default function ScriptCard({ script, isActive, onOpen, onRename, onDuplicate, onExport, onDelete }: Props) {
  const [renaming, setRenaming] = useState(false)
  const [titleInput, setTitleInput] = useState(script.title)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTitleInput(script.title) }, [script.title])

  useEffect(() => {
    if (renaming) inputRef.current?.focus()
  }, [renaming])

  useEffect(() => {
    if (!menuOpen) return
    function handle(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [menuOpen])

  function commitRename() {
    const trimmed = titleInput.trim()
    if (trimmed && trimmed !== script.title) onRename(trimmed)
    else setTitleInput(script.title)
    setRenaming(false)
  }

  const firstLine = script.paragraphs[0]?.text?.slice(0, 60) ?? ''
  const topColor = script.paragraphs[0]
    ? scoreToColor(script.paragraphs[0].emotionScore)
    : '#6366f1'

  return (
    <div style={{
      background: '#1a1d27',
      border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 0.2s, transform 0.15s',
    }}
    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
    >
      {/* Top color stripe */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${topColor}, ${topColor}30)` }} />

      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {renaming ? (
            <input
              ref={inputRef}
              value={titleInput}
              onChange={e => setTitleInput(e.target.value)}
              onBlur={commitRename}
              onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') { setTitleInput(script.title); setRenaming(false) } }}
              style={{
                flex: 1, background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(99,102,241,0.5)',
                borderRadius: 6, padding: '4px 8px',
                color: '#f1f5f9', fontSize: 15, fontWeight: 700,
                fontFamily: 'inherit', outline: 'none',
              }}
            />
          ) : (
            <span
              style={{ flex: 1, fontSize: 15, fontWeight: 700, color: '#f1f5f9', cursor: 'text', lineHeight: 1.3 }}
              onDoubleClick={() => setRenaming(true)}
              title="双击重命名"
            >
              {script.title}
              {isActive && (
                <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#818cf8', background: 'rgba(99,102,241,0.15)', padding: '1px 7px', borderRadius: 8, verticalAlign: 'middle' }}>
                  编辑中
                </span>
              )}
            </span>
          )}

          {/* ⋯ menu */}
          <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(241,245,249,0.35)', cursor: 'pointer',
                fontSize: 18, padding: '2px 6px', lineHeight: 1, borderRadius: 6,
              }}
              title="更多操作"
            >⋯</button>

            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 4,
                background: '#252836', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '4px 0', zIndex: 100, minWidth: 140,
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                {[
                  { label: '✎  重命名', action: () => { setRenaming(true); setMenuOpen(false) } },
                  { label: '⊕  复制脚本', action: () => { onDuplicate(); setMenuOpen(false) } },
                  { label: '↓  导出 .txt', action: () => { onExport(); setMenuOpen(false) } },
                  { label: '✕  删除', action: () => { onDelete(); setMenuOpen(false) }, danger: true },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      background: 'none', border: 'none',
                      padding: '9px 16px', fontSize: 13, cursor: 'pointer',
                      color: item.danger ? '#f87171' : 'rgba(241,245,249,0.75)',
                      letterSpacing: '0.01em',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = item.danger ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >{item.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mini curve */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 8, padding: '6px 8px',
        }}>
          <MiniCurve script={script} />
        </div>

        {/* First line preview */}
        {firstLine && (
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(241,245,249,0.35)', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{firstLine}{script.paragraphs[0]?.text?.length > 60 ? '…' : ''}"
          </p>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontSize: 11, color: 'rgba(241,245,249,0.3)' }}>
            {script.paragraphs.length} 段 · {relativeTime(script.updatedAt)}
          </span>
        </div>

        {/* Open button */}
        <button
          onClick={onOpen}
          style={{
            padding: '9px 0', borderRadius: 10, border: 'none',
            background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
            color: isActive ? '#a5b4fc' : 'rgba(241,245,249,0.6)',
            fontWeight: 700, fontSize: 13, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)'}
        >
          {isActive ? '继续编辑 →' : '打开编辑 →'}
        </button>
      </div>
    </div>
  )
}
