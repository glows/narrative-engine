"use client";

import { ScriptParagraph } from '../../types/script'
import { detectEmotion } from './emotionKeywords'
import Paragraph from './Paragraph'

type Props = {
  paragraphs: ScriptParagraph[]
  onChange: (paragraphs: ScriptParagraph[]) => void
}

function makePara(text = ''): ScriptParagraph {
  return {
    id: 'p-' + Date.now() + '-' + Math.random().toString(36).slice(2),
    text,
    emotionScore: detectEmotion(text),
    manualOverride: false,
  }
}

export default function ScriptEditor({ paragraphs, onChange }: Props) {
  function updateText(id: string, text: string) {
    onChange(paragraphs.map(p =>
      p.id === id
        ? { ...p, text, emotionScore: p.manualOverride ? p.emotionScore : detectEmotion(text) }
        : p
    ))
  }

  function updateScore(id: string, score: number) {
    onChange(paragraphs.map(p =>
      p.id === id ? { ...p, emotionScore: score, manualOverride: true } : p
    ))
  }

  function deletePara(id: string) {
    const next = paragraphs.filter(p => p.id !== id)
    onChange(next.length ? next : [makePara()])
  }

  function addPara() {
    onChange([...paragraphs, makePara()])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {paragraphs.map((para, i) => (
        <Paragraph
          key={para.id}
          para={para}
          index={i}
          onChange={updateText}
          onScoreChange={updateScore}
          onDelete={deletePara}
        />
      ))}

      <button
        onClick={addPara}
        style={{
          padding: '12px',
          borderRadius: 12,
          border: '1px dashed rgba(255,255,255,0.12)',
          background: 'transparent',
          color: 'rgba(241,245,249,0.3)',
          fontSize: 14,
          cursor: 'pointer',
          transition: 'all 0.15s',
          letterSpacing: '0.02em',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
          e.currentTarget.style.color = 'rgba(241,245,249,0.6)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.color = 'rgba(241,245,249,0.3)'
        }}
      >
        + 添加段落
      </button>
    </div>
  )
}

export { makePara }
