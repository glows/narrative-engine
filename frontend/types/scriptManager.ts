import { ScriptParagraph } from './script'

export type SavedScript = {
  id: string
  title: string
  paragraphs: ScriptParagraph[]
  createdAt: number
  updatedAt: number
}
