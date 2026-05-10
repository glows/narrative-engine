"use client";

import { ScriptParagraph } from '../../types/script'

type Suggestion = { type: 'flat' | 'drop' | 'peak' | 'rise'; para: number; message: string }

function analyze(paragraphs: ScriptParagraph[]): Suggestion[] {
  const results: Suggestion[] = []
  if (paragraphs.length < 2) return results

  const scores = paragraphs.map(p => p.emotionScore)

  // Flat section: 3+ consecutive paragraphs within ±1.5 range
  for (let i = 0; i <= scores.length - 3; i++) {
    const window = scores.slice(i, i + 3)
    const max = Math.max(...window), min = Math.min(...window)
    if (max - min <= 1.5) {
      results.push({
        type: 'flat',
        para: i + 1,
        message: `段落 ${i + 1}–${i + 3} 情感持续平稳，建议在第 ${i + 2} 段加入意外阻碍或转折。`,
      })
      i += 2
    }
  }

  // Sharp drop: score drops > 4 in one step → reversal point
  for (let i = 1; i < scores.length; i++) {
    const drop = scores[i - 1] - scores[i]
    if (drop >= 4) {
      results.push({
        type: 'drop',
        para: i + 1,
        message: `段落 ${i + 1} 出现情感大跌（−${drop}），这是一个强力反转点，确保铺垫充分。`,
      })
    }
  }

  // Strong rise: score rises > 4 in one step
  for (let i = 1; i < scores.length; i++) {
    const rise = scores[i] - scores[i - 1]
    if (rise >= 4) {
      results.push({
        type: 'rise',
        para: i + 1,
        message: `段落 ${i + 1} 情感急升（+${rise}），这是情绪爆发点，配合视觉或音效会更有力。`,
      })
    }
  }

  // Peak ending
  const last = scores[scores.length - 1]
  if (last >= 8) {
    results.push({
      type: 'peak',
      para: scores.length,
      message: `结尾情感强劲（${last}/10），是放置行动号召（CTA）的绝佳时机。`,
    })
  } else if (last <= 3) {
    results.push({
      type: 'flat',
      para: scores.length,
      message: `结尾情感偏低（${last}/10），观众容易带着负面情绪离开，考虑以希望或行动收尾。`,
    })
  }

  return results
}

const TYPE_CONFIG = {
  flat:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: '⚠️' },
  drop:  { color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  icon: '↘️' },
  rise:  { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  icon: '↗️' },
  peak:  { color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  icon: '🎯' },
}

type Props = { paragraphs: ScriptParagraph[] }

export default function Suggestions({ paragraphs }: Props) {
  const suggestions = analyze(paragraphs)

  if (paragraphs.length < 2) {
    return (
      <p style={{ fontSize: 13, color: 'rgba(241,245,249,0.25)', margin: 0, padding: '8px 0' }}>
        至少写两段台词，系统将开始分析情感节奏…
      </p>
    )
  }

  if (suggestions.length === 0) {
    return (
      <p style={{ fontSize: 13, color: 'rgba(16,185,129,0.7)', margin: 0, padding: '8px 0' }}>
        ✓ 情感节奏良好，未发现明显问题。
      </p>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {suggestions.map((s, i) => {
        const cfg = TYPE_CONFIG[s.type]
        return (
          <div key={i} style={{
            padding: '12px 14px',
            borderRadius: 10,
            background: cfg.bg,
            border: `1px solid ${cfg.color}30`,
            fontSize: 13,
            color: 'rgba(241,245,249,0.75)',
            lineHeight: 1.6,
            display: 'flex',
            gap: 8,
          }}>
            <span style={{ flexShrink: 0 }}>{cfg.icon}</span>
            <span>{s.message}</span>
          </div>
        )
      })}
    </div>
  )
}
