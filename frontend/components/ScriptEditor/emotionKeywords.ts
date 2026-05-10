type KeywordMap = { words: string[]; score: number }[]

export const EMOTION_KEYWORDS: KeywordMap = [
  { score: 10, words: ['沸腾', '爆发', '巅峰', '震撼', '惊天', '奇迹', '狂喜', '热血', '史诗'] },
  { score: 9,  words: ['成功', '胜利', '突破', '惊喜', '兴奋', '感动', '喜悦', '振奋', '高光', '爱'] },
  { score: 8,  words: ['希望', '期待', '开心', '快乐', '幸福', '满足', '骄傲', '自信', '温暖'] },
  { score: 7,  words: ['轻松', '愉快', '满意', '感谢', '平静中有力', '坚定', '释然'] },
  { score: 4,  words: ['困惑', '疑惑', '担心', '不安', '迷茫', '犹豫', '纠结', '后悔'] },
  { score: 3,  words: ['失望', '疲惫', '沮丧', '压抑', '孤独', '无助', '难受', '委屈'] },
  { score: 2,  words: ['崩溃', '绝望', '痛苦', '愤怒', '恐惧', '悲伤', '哭泣', '撕裂'] },
  { score: 1,  words: ['死亡', '毁灭', '彻底失败', '一无所有', '最黑暗', '深渊'] },
]

export function detectEmotion(text: string): number {
  if (!text.trim()) return 5
  let best = { score: 5, found: false }
  for (const { score, words } of EMOTION_KEYWORDS) {
    for (const word of words) {
      if (text.includes(word)) {
        if (!best.found || Math.abs(score - 5) > Math.abs(best.score - 5)) {
          best = { score, found: true }
        }
      }
    }
  }
  return best.score
}

export function scoreToColor(score: number): string {
  if (score <= 1) return '#1e40af'
  if (score <= 2) return '#3b3b9e'
  if (score <= 3) return '#7c3aed'
  if (score <= 4) return '#9333ea'
  if (score <= 5) return '#64748b'
  if (score <= 6) return '#b45309'
  if (score <= 7) return '#d97706'
  if (score <= 8) return '#ea580c'
  if (score <= 9) return '#dc2626'
  return '#b91c1c'
}

export function scoreToLabel(score: number): string {
  if (score <= 1) return '深渊'
  if (score <= 2) return '崩溃'
  if (score <= 3) return '低落'
  if (score <= 4) return '压抑'
  if (score <= 5) return '平静'
  if (score <= 6) return '温暖'
  if (score <= 7) return '积极'
  if (score <= 8) return '兴奋'
  if (score <= 9) return '高潮'
  return '沸腾'
}
