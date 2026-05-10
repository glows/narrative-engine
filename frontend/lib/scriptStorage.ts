import { SavedScript } from '../types/scriptManager'
import { ScriptParagraph } from '../types/script'

const K = {
  SCRIPTS: 'hook_lab_scripts',
  ACTIVE:  'hook_lab_active',
  LEGACY:  'hook_lab_script',
}

export function loadScripts(): SavedScript[] {
  try { return JSON.parse(localStorage.getItem(K.SCRIPTS) || '[]') } catch { return [] }
}

export function saveScripts(scripts: SavedScript[]): void {
  try { localStorage.setItem(K.SCRIPTS, JSON.stringify(scripts)) } catch {}
}

export function loadActiveId(): string | null {
  return localStorage.getItem(K.ACTIVE)
}

export function saveActiveId(id: string): void {
  try { localStorage.setItem(K.ACTIVE, id) } catch {}
}

// Convert old single-script format on first load
export function migrateAndLoad(): SavedScript[] {
  const existing = loadScripts()
  if (existing.length > 0) return existing

  try {
    const raw = localStorage.getItem(K.LEGACY)
    if (raw) {
      const paras: ScriptParagraph[] = JSON.parse(raw)
      if (Array.isArray(paras) && paras.length > 0) {
        const script: SavedScript = {
          id: 'script-' + Date.now(),
          title: '未命名脚本 1',
          paragraphs: paras,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        saveScripts([script])
        localStorage.removeItem(K.LEGACY)
        return [script]
      }
    }
  } catch {}

  return []
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1)  return '刚刚'
  if (m < 60) return `${m}分钟前`
  if (h < 24) return `${h}小时前`
  if (d === 1) return '昨天'
  if (d < 30) return `${d}天前`
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}
