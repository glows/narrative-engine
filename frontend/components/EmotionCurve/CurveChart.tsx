"use client";

import { ScriptParagraph } from '../../types/script'
import { scoreToColor } from '../ScriptEditor/emotionKeywords'

type Props = { paragraphs: ScriptParagraph[] }

const W = 480
const H = 180
const PAD = { top: 20, right: 20, bottom: 36, left: 36 }

function toXY(paragraphs: ScriptParagraph[]) {
  const n = paragraphs.length
  if (n === 0) return []
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  return paragraphs.map((p, i) => ({
    x: PAD.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW),
    y: PAD.top + innerH - (p.emotionScore / 10) * innerH,
    score: p.emotionScore,
  }))
}

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpX = (prev.x + curr.x) / 2
    d += ` C ${cpX} ${prev.y} ${cpX} ${curr.y} ${curr.x} ${curr.y}`
  }
  return d
}

export default function CurveChart({ paragraphs }: Props) {
  const pts = toXY(paragraphs)
  if (pts.length === 0) return null

  const linePath = smoothPath(pts)
  const first = pts[0], last = pts[pts.length - 1]
  const fillPath = `${linePath} L ${last.x} ${H - PAD.bottom} L ${first.x} ${H - PAD.bottom} Z`

  const gridLines = [0, 2, 5, 7, 10].map(v => {
    const innerH = H - PAD.top - PAD.bottom
    const y = PAD.top + innerH - (v / 10) * innerH
    return { y, v }
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map(({ y, v }) => (
        <g key={v}>
          <line
            x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
            stroke="rgba(255,255,255,0.05)" strokeWidth={1}
            strokeDasharray={v === 5 ? '4 4' : undefined}
          />
          <text x={PAD.left - 6} y={y + 4} textAnchor="end"
            fill="rgba(241,245,249,0.2)" fontSize={10}>
            {v}
          </text>
        </g>
      ))}

      {/* Fill area */}
      <path d={fillPath} fill="url(#curveGrad)" />

      {/* Curve line */}
      <path d={linePath} fill="none" stroke="#818cf8" strokeWidth={2} strokeLinejoin="round" />

      {/* Data points */}
      {pts.map((pt, i) => (
        <g key={i}>
          <circle cx={pt.x} cy={pt.y} r={5} fill={scoreToColor(pt.score)} stroke="#0f1117" strokeWidth={2} />
          <text
            x={pt.x} y={H - PAD.bottom + 16}
            textAnchor="middle" fill="rgba(241,245,249,0.3)" fontSize={10}
          >
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  )
}
