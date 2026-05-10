"use client";

import { useState } from 'react'
import { HookTemplate } from '../../types/hook'

type Props = {
  entries: HookTemplate[]
  onClear: () => void
}

export default function ScriptDraft({ entries, onClear }: Props) {
  const [open, setOpen] = useState(true)
  const [copied, setCopied] = useState(false)

  const text = entries.map(h => `【${h.title}】\n${h.example}`).join('\n\n')

  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div style={{
      background: '#13151f',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, color: 'rgba(241,245,249,0.6)', fontWeight: 600 }}>
            脚本草稿区
          </span>
          {entries.length > 0 && (
            <span style={{
              fontSize: 11,
              background: 'rgba(99,102,241,0.2)',
              color: '#818cf8',
              padding: '2px 8px',
              borderRadius: 10,
              fontWeight: 600,
            }}>
              {entries.length} 个钩子
            </span>
          )}
        </div>
        <span style={{ color: 'rgba(241,245,249,0.3)', fontSize: 12 }}>
          {open ? '▲ 收起' : '▼ 展开'}
        </span>
      </div>

      {open && (
        <div style={{ padding: '0 20px 20px' }}>
          {entries.length === 0 ? (
            <p style={{ color: 'rgba(241,245,249,0.2)', fontSize: 14, margin: 0 }}>
              点击任意钩子卡片的"使用此钩子"，内容将出现在这里...
            </p>
          ) : (
            <>
              <textarea
                readOnly
                value={text}
                style={{
                  width: '100%',
                  minHeight: 140,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  padding: '14px',
                  color: 'rgba(241,245,249,0.8)',
                  fontSize: 14,
                  lineHeight: 1.7,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <button
                  onClick={copy}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 10,
                    border: '1px solid rgba(99,102,241,0.4)',
                    background: 'rgba(99,102,241,0.12)',
                    color: '#818cf8',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '已复制 ✓' : '复制全文'}
                </button>
                <button
                  onClick={onClear}
                  style={{
                    padding: '9px 20px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'transparent',
                    color: 'rgba(241,245,249,0.3)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  清空草稿
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
