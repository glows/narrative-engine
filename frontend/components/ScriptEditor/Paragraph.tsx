"use client";

import { ScriptParagraph } from '../../types/script'
import { scoreToColor, scoreToLabel } from './emotionKeywords'

type Props = {
  para: ScriptParagraph
  index: number
  onChange: (id: string, text: string) => void
  onScoreChange: (id: string, score: number) => void
  onDelete: (id: string) => void
}

export default function Paragraph({ para, index, onChange, onScoreChange, onDelete }: Props) {
  const color = scoreToColor(para.emotionScore)
  const label = scoreToLabel(para.emotionScore)

  return (
    <div style={{
      background: color + '14',
      border: `1px solid ${color}35`,
      borderLeft: `3px solid ${color}`,
      borderRadius: 12,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(241,245,249,0.35)', letterSpacing: '0.08em' }}>
          段落 {index + 1}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color, background: color + '20',
            padding: '2px 10px', borderRadius: 10,
          }}>
            {label} · {para.emotionScore}
            {para.manualOverride && <span style={{ opacity: 0.6 }}> ✎</span>}
          </span>
          <button
            onClick={() => onDelete(para.id)}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(241,245,249,0.2)', cursor: 'pointer',
              fontSize: 15, padding: '0 2px', lineHeight: 1,
            }}
            title="删除段落"
          >×</button>
        </div>
      </div>

      <textarea
        value={para.text}
        onChange={e => onChange(para.id, e.target.value)}
        placeholder={index === 0 ? '开始写你的第一段台词...' : '继续写...'}
        rows={3}
        style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8,
          padding: '10px 12px',
          color: 'rgba(241,245,249,0.85)',
          fontSize: 14,
          lineHeight: 1.7,
          resize: 'vertical',
          fontFamily: 'inherit',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 11, color: 'rgba(241,245,249,0.3)', minWidth: 28 }}>情感</span>
        <input
          type="range"
          min={0} max={10} step={1}
          value={para.emotionScore}
          onChange={e => onScoreChange(para.id, Number(e.target.value))}
          style={{ flex: 1, accentColor: color, cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: '50%',
              background: i === para.emotionScore ? color : 'rgba(255,255,255,0.12)',
              transition: 'background 0.2s',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}
