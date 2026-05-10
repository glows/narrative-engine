"use client";

import { ScriptParagraph } from '../../types/script'
import { scoreToLabel } from '../ScriptEditor/emotionKeywords'
import CurveChart from './CurveChart'
import Suggestions from './Suggestions'

type Props = { paragraphs: ScriptParagraph[] }

export default function EmotionCurve({ paragraphs }: Props) {
  const avg = paragraphs.length
    ? (paragraphs.reduce((s, p) => s + p.emotionScore, 0) / paragraphs.length).toFixed(1)
    : '—'
  const peak = paragraphs.length ? Math.max(...paragraphs.map(p => p.emotionScore)) : '—'
  const low  = paragraphs.length ? Math.min(...paragraphs.map(p => p.emotionScore)) : '—'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: '段落数', value: paragraphs.length },
          { label: '平均情感', value: avg },
          { label: '最高峰', value: peak !== '—' ? `${peak} · ${scoreToLabel(peak as number)}` : '—' },
          { label: '最低谷', value: low  !== '—' ? `${low}  · ${scoreToLabel(low  as number)}` : '—' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10,
            padding: '10px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(241,245,249,0.3)', letterSpacing: '0.08em', marginBottom: 4 }}>
              {stat.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: '16px 12px 8px',
      }}>
        {paragraphs.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(241,245,249,0.2)', fontSize: 13, margin: '24px 0' }}>
            开始写脚本，情感曲线将实时出现
          </p>
        ) : (
          <CurveChart paragraphs={paragraphs} />
        )}
      </div>

      {/* Suggestions */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(241,245,249,0.35)', letterSpacing: '0.08em', marginBottom: 10 }}>
          NARRATIVE ANALYSIS
        </div>
        <Suggestions paragraphs={paragraphs} />
      </div>
    </div>
  )
}
