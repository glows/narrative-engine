"use client";

import { SCRIPT_EXAMPLES, ScriptExample } from '../../data/examples'
import { scoreToColor, scoreToLabel } from '../ScriptEditor/emotionKeywords'

const CATEGORY_COLOR: Record<string, string> = {
  cognitive: '#f97316',
  visual:    '#3b82f6',
  emotional: '#ec4899',
}
const CATEGORY_LABEL: Record<string, string> = {
  cognitive: '认知钩子',
  visual:    '视觉钩子',
  emotional: '情感钩子',
}

type Props = {
  onLoad: (example: ScriptExample) => void
  onClose: () => void
}

export default function ExampleModal({ onLoad, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: 24,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#13151f',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        width: '100%', maxWidth: 780,
        maxHeight: '85vh',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#818cf8', textTransform: 'uppercase' }}>
              经典脚本参考
            </p>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>加载示例到编辑器</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'rgba(241,245,249,0.3)', fontSize: 20,
            cursor: 'pointer', padding: '0 4px', lineHeight: 1,
          }}>×</button>
        </div>

        {/* Content */}
        <div style={{ overflow: 'auto', padding: '20px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SCRIPT_EXAMPLES.map(ex => (
            <ExampleCard key={ex.id} example={ex} onLoad={() => { onLoad(ex); onClose() }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ExampleCard({ example, onLoad }: { example: ScriptExample; onLoad: () => void }) {
  const hookColor = CATEGORY_COLOR[example.hookType] ?? '#818cf8'
  const scores = example.paragraphs.map(p => p.emotionScore)
  const peak = Math.max(...scores)
  const low  = Math.min(...scores)

  // Mini curve points
  const miniW = 200, miniH = 40
  const pts = scores.map((s, i) => ({
    x: scores.length === 1 ? miniW / 2 : (i / (scores.length - 1)) * miniW,
    y: miniH - (s / 10) * miniH,
  }))
  let curvePath = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cpX = (pts[i - 1].x + pts[i].x) / 2
    curvePath += ` C ${cpX} ${pts[i - 1].y} ${cpX} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
  }

  return (
    <div style={{
      background: '#1a1d27',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      {/* Top stripe */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${hookColor}, ${hookColor}40)` }} />

      <div style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>

          {/* Left: info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                color: hookColor, background: hookColor + '18',
                padding: '2px 10px', borderRadius: 20,
              }}>
                {CATEGORY_LABEL[example.hookType]}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(241,245,249,0.3)' }}>
                {example.duration} · {example.paragraphs.length} 段
              </span>
            </div>

            <h3 style={{ margin: '0 0 3px', fontSize: 18, fontWeight: 800, letterSpacing: '-0.01em' }}>
              {example.title}
            </h3>
            <p style={{ margin: '0 0 10px', fontSize: 12, color: '#818cf8', fontWeight: 600 }}>
              {example.source}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(241,245,249,0.5)', lineHeight: 1.65 }}>
              {example.description}
            </p>
          </div>

          {/* Right: mini curve + stats */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            <div style={{
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: '8px 10px',
            }}>
              <svg viewBox={`0 0 ${miniW} ${miniH}`} style={{ width: 160, height: 32, display: 'block', overflow: 'visible' }}>
                <path d={curvePath} fill="none" stroke="#818cf8" strokeWidth={1.5} />
                {pts.map((pt, i) => (
                  <circle key={i} cx={pt.x} cy={pt.y} r={2.5}
                    fill={scoreToColor(scores[i])} stroke="#13151f" strokeWidth={1} />
                ))}
              </svg>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Stat label="峰值" value={`${peak} · ${scoreToLabel(peak)}`} color={scoreToColor(peak)} />
              <Stat label="低谷" value={`${low} · ${scoreToLabel(low)}`}  color={scoreToColor(low)} />
            </div>
          </div>
        </div>

        {/* Preview of first paragraph */}
        <div style={{
          marginTop: 16,
          padding: '12px 14px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 10,
          borderLeft: `2px solid ${hookColor}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(241,245,249,0.3)', marginBottom: 5, letterSpacing: '0.06em' }}>
            开场钩子预览
          </div>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(241,245,249,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>
            "{example.paragraphs[0].text.slice(0, 90)}{example.paragraphs[0].text.length > 90 ? '…' : ''}"
          </p>
        </div>

        <button
          onClick={onLoad}
          style={{
            marginTop: 14,
            width: '100%',
            padding: '11px',
            borderRadius: 10,
            border: `1px solid ${hookColor}40`,
            background: hookColor + '15',
            color: hookColor,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'background 0.15s',
            letterSpacing: '0.02em',
          }}
          onMouseEnter={e => e.currentTarget.style.background = hookColor + '28'}
          onMouseLeave={e => e.currentTarget.style.background = hookColor + '15'}
        >
          加载此示例到编辑器 →
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: color + '15',
      border: `1px solid ${color}30`,
      borderRadius: 8,
      padding: '4px 10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(241,245,249,0.3)', letterSpacing: '0.08em', marginBottom: 1 }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color }}>{value}</div>
    </div>
  )
}
