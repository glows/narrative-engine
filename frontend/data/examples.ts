import { ScriptParagraph } from '../types/script'

export type ScriptExample = {
  id: string
  title: string
  source: string
  description: string
  hookType: string
  duration: string
  paragraphs: Omit<ScriptParagraph, 'id'>[]
}

export const SCRIPT_EXAMPLES: ScriptExample[] = [
  {
    id: 'jobs-stanford-2005',
    title: '三个故事',
    source: '乔布斯 · 斯坦福大学毕业典礼演讲（2005）',
    description: '公认最好的演讲之一。用"认知钩子"开场，三段叙事结构，情感从低谷到高峰反复震荡，结尾留下了互联网时代最著名的一句话。',
    hookType: 'cognitive',
    duration: '约 15 分钟',
    paragraphs: [
      {
        text: '今天，我很荣幸来到全世界最好的大学之一的毕业典礼上。说实话——我从来没有从大学毕业。这是我离大学毕业最近的一次。',
        emotionScore: 5,
        manualOverride: true,
      },
      {
        text: '今天我想告诉你们三个我生命中的故事。就这样，没什么大不了的。只是三个故事。',
        emotionScore: 6,
        manualOverride: true,
      },
      {
        text: '第一个故事，是关于把生命中的点连成一条线。\n\n我在里德学院读了六个月就退学了。但之后我又以旁听生的身份在学校游荡了整整十八个月，才最终离开。那为什么我要退学？',
        emotionScore: 5,
        manualOverride: true,
      },
      {
        text: '这要从我出生之前讲起。我的亲生母亲是一个年轻的未婚研究生，她决定把我送给别人收养。她强烈希望收养我的是大学毕业生。但我未来的养父母在最后一刻告诉她，他们想要一个女孩。然后，电话打来了——我的养父母说："我们有一个意外出生的男孩，你愿意要他吗？"他们说，"当然。"',
        emotionScore: 4,
        manualOverride: true,
      },
      {
        text: '退学让我可以不再修那些我不感兴趣的必修课，开始旁听那些看起来有趣的课。\n\n我决定去学书法。我学习衬线和无衬线字体，学习如何在不同字母组合之间调整间距，学习什么让版面设计变得美丽。这一切都美丽得无法用语言形容，充满历史感，也充满艺术感。',
        emotionScore: 7,
        manualOverride: true,
      },
      {
        text: '当时，这些东西看起来和我的未来不可能有任何实际的联系。但十年之后，当我们设计第一台 Macintosh 电脑时，这一切都涌现出来了。Mac 是第一台拥有漂亮排版的电脑。\n\n你不可能预先把这些点连成线；只有在回头看的时候，你才能把它们串联起来。',
        emotionScore: 9,
        manualOverride: true,
      },
      {
        text: '第二个故事，是关于爱与失去。\n\n我很幸运，在很年轻的时候就发现了自己爱做的事。二十岁时，我和沃兹在我父母的车库里创办了苹果公司。我们拼命工作，十年后，苹果已经从我们两个人成长为一家拥有四千名员工、价值二十亿美元的公司。\n\n然后，我被开除了。被我自己创办的公司开除了。',
        emotionScore: 3,
        manualOverride: true,
      },
      {
        text: '那时候我完全不知道该怎么办。我觉得我让上一代企业家失望了。我去找了大卫·帕卡德和鲍勃·诺伊斯，想为搞砸了一切向他们道歉。我是公众眼中的失败者，我甚至想过离开硅谷。\n\n但渐渐地，有什么东西开始重新燃起——我仍然热爱我所做的一切。苹果事件没能改变这一点。我被抛弃了，但我仍然爱着它。',
        emotionScore: 2,
        manualOverride: true,
      },
      {
        text: '于是我决定重新开始。那段时间反而成了我生命中最有创造力的时期。在接下来的五年里，我创办了 NeXT，又创办了 Pixar，爱上了一位了不起的女人——她后来成为了我的妻子。\n\nPixar 制作了世界上第一部全电脑动画电影《玩具总动员》，现在已经是世界上最成功的动画工作室。\n\n我很确定，如果苹果没有开除我，这一切都不会发生。',
        emotionScore: 8,
        manualOverride: true,
      },
      {
        text: '第三个故事，是关于死亡。\n\n一年前，我被诊断出癌症。早上七点半，扫描结果显示我的胰腺上有一个肿瘤。医生告诉我，这种癌症几乎无法治愈，我的预期寿命不超过三到六个月。\n\n我的医生建议我回家，把事情料理好——医生的暗语，意思是"准备去死"。意味着把你想告诉孩子们的话浓缩成几个月的时间说完。',
        emotionScore: 1,
        manualOverride: true,
      },
      {
        text: '那天晚些时候，我做了活检。活检结果显示，那竟然是一种极罕见的、可以通过手术治愈的胰腺癌。我做了手术，现在康复了。\n\n这是我最接近死亡的一次，我希望这也是未来几十年内最近的一次。经历过这些，死亡对我而言已经是一个有用的概念，而不只是一个模糊的、纯粹概念上的东西了。',
        emotionScore: 6,
        manualOverride: true,
      },
      {
        text: '没有人愿意死。即便是那些想要上天堂的人，也不想用死亡来换。然而死亡是我们所有人共同的终点，没有人能够逃脱。\n\n你们的时间是有限的，所以不要把它浪费在重复别人的生活上。不要让他人的喧嚣淹没你内心的声音。要有勇气跟随自己内心的直觉与感受，因为它们在某种程度上已经知道你真正想成为什么。',
        emotionScore: 8,
        manualOverride: true,
      },
      {
        text: '当我还年轻的时候，有一本神奇的杂志叫《全球目录》。它是我们那一代的圣经之一。\n\n在它最后一期的封底，有一张清晨乡村公路的照片。照片下面写着：\n\n"Stay Hungry. Stay Foolish."\n\n保持饥渴。保持愚蠢。\n\n这是我对你们的祝愿。',
        emotionScore: 10,
        manualOverride: true,
      },
    ],
  },
]
