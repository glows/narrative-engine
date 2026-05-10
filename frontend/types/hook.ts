export type HookCategory = 'visual' | 'cognitive' | 'emotional'

export type HookTemplate = {
  id: string
  category: HookCategory
  title: string
  example: string
  tip: string
  tags: string[]
  custom?: boolean
}
