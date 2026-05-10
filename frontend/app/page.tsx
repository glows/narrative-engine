"use client";

import { useEffect, useState } from 'react'
import { BUILT_IN_HOOKS } from '../data/hooks'
import { HookTemplate, HookCategory } from '../types/hook'
import { ScriptParagraph } from '../types/script'
import { SavedScript } from '../types/scriptManager'
import { ScriptExample } from '../data/examples'
import HookFilter, { FilterValue } from '../components/HookLibrary/HookFilter'
import HookGrid from '../components/HookLibrary/HookGrid'
import ScriptEditor, { makePara } from '../components/ScriptEditor'
import EmotionCurve from '../components/EmotionCurve'
import ExampleModal from '../components/ExampleModal'
import ScriptManager from '../components/ScriptManager'
import {
  migrateAndLoad, loadScripts, saveScripts,
  loadActiveId, saveActiveId,
} from '../lib/scriptStorage'

const CUSTOM_KEY = 'hook_lab_custom'
function loadCustomHooks(): HookTemplate[] {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]') } catch { return [] }
}

type Tab = 'hooks' | 'editor' | 'scripts'

function makeNewScript(title: string, paras?: ScriptParagraph[]): SavedScript {
  return {
    id: 'script-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    title,
    paragraphs: paras ?? [makePara()],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export default function Home() {
  const [tab,          setTab]          = useState<Tab>('hooks')
  const [filter,       setFilter]       = useState<FilterValue>('all')
  const [custom,       setCustom]       = useState<HookTemplate[]>([])
  const [scripts,      setScripts]      = useState<SavedScript[]>([])
  const [activeId,     setActiveId]     = useState<string>('')
  const [paras,        setParas]        = useState<ScriptParagraph[]>([makePara()])
  const [showModal,    setShowModal]    = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [form, setForm] = useState({ title: '', category: 'visual' as HookCategory, example: '', tip: '', tags: '' })

  useEffect(() => {
    setCustom(loadCustomHooks())
    const loaded = migrateAndLoad()
    if (loaded.length > 0) {
      setScripts(loaded)
      const savedId = loadActiveId()
      const active = loaded.find(s => s.id === savedId) ?? loaded[0]
      setActiveId(active.id)
      setParas(active.paragraphs.length ? active.paragraphs : [makePara()])
    } else {
      const initial = makeNewScript('未命名脚本 1')
      setScripts([initial])
      setActiveId(initial.id)
      saveScripts([initial])
      saveActiveId(initial.id)
    }
  }, [])

  // ── Script state helpers ──────────────────────────────────────────────────

  function commitParas(next: ScriptParagraph[], id = activeId) {
    setParas(next)
    setScripts(prev => {
      const updated = prev.map(s =>
        s.id === id ? { ...s, paragraphs: next, updatedAt: Date.now() } : s
      )
      saveScripts(updated)
      return updated
    })
  }

  function switchActive(id: string, allScripts?: SavedScript[]) {
    const list = allScripts ?? scripts
    const script = list.find(s => s.id === id)
    if (!script) return
    setActiveId(id)
    saveActiveId(id)
    setParas(script.paragraphs.length ? script.paragraphs : [makePara()])
  }

  // ── Script management actions ──────────────────────────────────────────────

  function handleNewScript() {
    const count = scripts.length + 1
    const s = makeNewScript(`未命名脚本 ${count}`)
    setScripts(prev => { const next = [s, ...prev]; saveScripts(next); return next })
    setActiveId(s.id)
    saveActiveId(s.id)
    setParas([makePara()])
    setTab('editor')
  }

  function handleOpenScript(id: string) {
    switchActive(id)
    setTab('editor')
  }

  function handleRenameScript(id: string, title: string) {
    setScripts(prev => {
      const next = prev.map(s => s.id === id ? { ...s, title, updatedAt: Date.now() } : s)
      saveScripts(next)
      return next
    })
  }

  function handleDuplicateScript(id: string) {
    const original = scripts.find(s => s.id === id)
    if (!original) return
    const copy = makeNewScript(original.title + ' (副本)', [...original.paragraphs])
    setScripts(prev => { const next = [copy, ...prev]; saveScripts(next); return next })
  }

  function handleExportScript(id: string) {
    const script = scripts.find(s => s.id === id)
    if (!script) return
    const text = script.paragraphs
      .map((p, i) => `[段落 ${i + 1}]\n${p.text}`)
      .join('\n\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${script.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleDeleteScript(id: string) {
    if (scripts.length <= 1) {
      // Last script: clear contents, don't delete
      commitParas([makePara()], id)
      handleRenameScript(id, '未命名脚本 1')
      return
    }
    setScripts(prev => {
      const next = prev.filter(s => s.id !== id)
      saveScripts(next)
      if (activeId === id) {
        const newActive = next[0]
        setActiveId(newActive.id)
        saveActiveId(newActive.id)
        setParas(newActive.paragraphs.length ? newActive.paragraphs : [makePara()])
      }
      return next
    })
  }

  // ── Hook & example actions ─────────────────────────────────────────────────

  function handleUseHook(hook: HookTemplate) {
    const para = makePara(`【${hook.title}】${hook.example}`)
    const next = [...paras.filter(p => p.text.trim()), para]
    commitParas(next)
    setTab('editor')
  }

  function handleLoadExample(ex: ScriptExample) {
    const exParas: ScriptParagraph[] = ex.paragraphs.map((p, i) => ({
      id: 'ex-' + ex.id + '-' + i,
      text: p.text,
      emotionScore: p.emotionScore,
      manualOverride: p.manualOverride,
    }))
    const s = makeNewScript(ex.title, exParas)
    setScripts(prev => { const next = [s, ...prev]; saveScripts(next); return next })
    setActiveId(s.id)
    saveActiveId(s.id)
    setParas(exParas)
    setTab('editor')
  }

  // ── Custom hook actions ────────────────────────────────────────────────────

  function addCustomHook() {
    if (!form.title.trim() || !form.example.trim()) return
    const hook: HookTemplate = {
      id: 'custom-' + Date.now(),
      category: form.category,
      title: form.title.trim(),
      example: form.example.trim(),
      tip: form.tip.trim(),
      tags: form.tags.split(/[,，\s]+/).map(t => t.trim()).filter(Boolean),
      custom: true,
    }
    const next = [hook, ...custom]
    setCustom(next)
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(next)) } catch {}
    setForm({ title: '', category: 'visual', example: '', tip: '', tags: '' })
    setShowModal(false)
  }

  function deleteCustomHook(id: string) {
    const next = custom.filter(h => h.id !== id)
    setCustom(next)
    try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(next)) } catch {}
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  const allHooks = [...custom, ...BUILT_IN_HOOKS]
  const hookCounts: Record<FilterValue, number> = {
    all:       allHooks.length,
    visual:    allHooks.filter(h => h.category === 'visual').length,
    cognitive: allHooks.filter(h => h.category === 'cognitive').length,
    emotional: allHooks.filter(h => h.category === 'emotional').length,
  }
  const activeScript = scripts.find(s => s.id === activeId)

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#f1f5f9', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>

      {/* Top nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15,17,23,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 24px', display: 'flex', alignItems: 'center', gap: 24, height: 56,
      }}>
        <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.01em', color: '#a5b4fc', flexShrink: 0 }}>
          叙事引擎
        </span>

        <nav style={{ display: 'flex', gap: 2 }}>
          {([['hooks', '钩子实验室'], ['editor', '脚本工作台'], ['scripts', '我的脚本']] as [Tab, string][]).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '6px 14px', borderRadius: 8, border: 'none',
              background: tab === id ? 'rgba(99,102,241,0.2)' : 'transparent',
              color: tab === id ? '#a5b4fc' : 'rgba(241,245,249,0.4)',
              fontWeight: tab === id ? 700 : 400,
              fontSize: 14, cursor: 'pointer', transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </nav>

        {/* Contextual right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {tab === 'editor' && activeScript && (
            <span style={{ fontSize: 13, color: 'rgba(241,245,249,0.35)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeScript.title}
            </span>
          )}
          {tab === 'editor' && (
            <button onClick={() => setShowExamples(true)} style={navBtnStyle}>
              经典示例
            </button>
          )}
          {tab === 'hooks' && (
            <button onClick={() => setShowModal(true)} style={navBtnStyle}>
              + 自定义钩子
            </button>
          )}
          {tab === 'scripts' && (
            <button onClick={handleNewScript} style={{ ...navBtnStyle, background: '#6366f1', border: 'none', color: '#fff' }}>
              + 新建脚本
            </button>
          )}
        </div>
      </header>

      {/* ── Hooks tab ── */}
      {tab === 'hooks' && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ marginBottom: 28 }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#818cf8', textTransform: 'uppercase' }}>叙事决策引擎</p>
            <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>钩子实验室</h1>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(241,245,249,0.4)' }}>视频前 3 秒决定生死。选择钩子，点击"使用"直接送入当前脚本。</p>
          </div>
          <div style={{ marginBottom: 20 }}>
            <HookFilter active={filter} onChange={setFilter} counts={hookCounts} />
          </div>
          <HookGrid hooks={allHooks} filter={filter} onUse={handleUseHook} onDelete={deleteCustomHook} />
        </div>
      )}

      {/* ── Editor tab ── */}
      {tab === 'editor' && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>脚本工作台</h1>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(241,245,249,0.35)' }}>左侧编写台词，情感曲线实时更新。关键词自动识别，滑块可手动覆盖。</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 24, alignItems: 'start' }}>
            <ScriptEditor paragraphs={paras} onChange={commitParas} />
            <div style={{ position: 'sticky', top: 72, background: '#13151f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(241,245,249,0.35)', letterSpacing: '0.1em', marginBottom: 16 }}>
                情感曲线 · EMOTION ARC
              </div>
              <EmotionCurve paragraphs={paras} />
            </div>
          </div>
        </div>
      )}

      {/* ── Scripts tab ── */}
      {tab === 'scripts' && (
        <ScriptManager
          scripts={scripts}
          activeId={activeId}
          onOpen={handleOpenScript}
          onNew={handleNewScript}
          onRename={handleRenameScript}
          onDuplicate={handleDuplicateScript}
          onExport={handleExportScript}
          onDelete={handleDeleteScript}
        />
      )}

      {/* ── Custom hook modal ── */}
      {showModal && (
        <div style={overlayStyle} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 700 }}>添加自定义钩子</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {([
                { key: 'title',   label: '钩子名称 *',       placeholder: '如：个人经历开场',           type: 'input'    },
                { key: 'example', label: '示例文案 *',       placeholder: '写一句具体的开场示例文案...', type: 'textarea' },
                { key: 'tip',     label: '使用技巧',         placeholder: '一句话说明使用场景...',       type: 'input'    },
                { key: 'tags',    label: '标签（逗号分隔）',  placeholder: '如：悬念, 反转',              type: 'input'    },
              ] as const).map(field => (
                <label key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={labelText}>{field.label}</span>
                  {field.type === 'textarea'
                    ? <textarea style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />
                    : <input   style={inputStyle} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))} />}
                </label>
              ))}
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={labelText}>类型</span>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as HookCategory }))}>
                  <option value="visual">视觉钩子</option>
                  <option value="cognitive">认知钩子</option>
                  <option value="emotional">情感钩子</option>
                </select>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
              <button onClick={addCustomHook} disabled={!form.title.trim() || !form.example.trim()}
                style={{ flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', background: '#6366f1', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: (!form.title.trim() || !form.example.trim()) ? 0.4 : 1 }}>
                保存钩子
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(241,245,249,0.4)', fontSize: 14, cursor: 'pointer' }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Example modal ── */}
      {showExamples && <ExampleModal onLoad={handleLoadExample} onClose={() => setShowExamples(false)} />}
    </div>
  )
}

// ── Shared styles ────────────────────────────────────────────────────────────

const navBtnStyle: React.CSSProperties = {
  padding: '7px 16px', borderRadius: 10,
  border: '1px solid rgba(99,102,241,0.35)',
  background: 'rgba(99,102,241,0.12)',
  color: '#a5b4fc', fontWeight: 700, fontSize: 13, cursor: 'pointer',
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
  backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
  justifyContent: 'center', zIndex: 100, padding: 24,
}

const modalStyle: React.CSSProperties = {
  background: '#1a1d27', borderRadius: 20, padding: 32,
  width: '100%', maxWidth: 480,
  border: '1px solid rgba(255,255,255,0.08)',
}

const labelText: React.CSSProperties = {
  fontSize: 12, fontWeight: 600,
  color: 'rgba(241,245,249,0.5)', letterSpacing: '0.04em',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '10px 14px',
  color: '#f1f5f9', fontSize: 14, fontFamily: 'inherit',
  outline: 'none', width: '100%', boxSizing: 'border-box',
}
