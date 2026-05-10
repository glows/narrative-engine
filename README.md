# 叙事引擎 · Narrative Engine

> 一个融合"故事技巧"的视频脚本写作平台。不只是文本编辑器，而是**叙事决策引擎**。

---

## 核心功能

### 钩子实验室
内置 20 个精选钩子模板，覆盖三种类型：
- **视觉钩子** — 反差画面、慢动作悬念、神秘道具特写
- **认知钩子** — 反常识论断、数字冲击、连环疑问
- **情感钩子** — 直切痛点、共鸣开场、幽默反转

支持自定义钩子，本地持久化。点击"使用"直接插入当前脚本。

### 脚本工作台
双栏布局：左侧逐段写台词，右侧实时情感曲线。

- **关键词自动识别** — 34 个情感关键词，自动给每段打分（0–10）
- **手动滑块覆盖** — 精细调整，覆盖状态有标记
- **情感曲线可视化** — SVG 贝塞尔曲线 + 渐变填充 + 彩色数据点
- **叙事分析建议** — 自动检测平坦段落、情感大跌反转、结尾强度

### 脚本管理
多脚本管理，所有数据存于 localStorage。

- 新建 / 打开 / 重命名（双击标题）/ 复制 / 删除
- 导出为 `.txt`
- 卡片展示迷你情感曲线预览 + 最后修改时间

### 经典示例
内置乔布斯 2005 年斯坦福毕业演讲完整脚本（13 段），情感分值手动标注，展示标准英雄之旅波形。

---

## 技术栈

| 层 | 技术 |
|---|---|
| 原生壳 | [zero-native](https://github.com/nickvdyck/zero-native) (Zig) |
| 前端框架 | Next.js 16 + React 19 + TypeScript |
| 样式 | 纯内联 CSS（无 UI 库依赖） |
| 数据持久化 | localStorage（无后端） |
| 情感分析 | 本地关键词词典（无 AI，可插件化扩展） |

---

## 快速开始

```sh
# 安装前端依赖
npm install --prefix frontend

# 开发模式（自动启动 Next.js dev server + 原生壳）
zig build dev

# 生产构建
zig build run

# 打包
zig build package
```

> 需要提前安装 [Zig](https://ziglang.org/) 和 [zero-native](https://github.com/nickvdyck/zero-native)。

---

## 项目结构

```
├── src/                   # Zig 原生壳
├── frontend/
│   ├── app/               # Next.js App Router
│   ├── components/
│   │   ├── HookLibrary/   # 钩子实验室
│   │   ├── ScriptEditor/  # 脚本编辑器 + 情感关键词
│   │   ├── EmotionCurve/  # 曲线图 + 叙事建议
│   │   ├── ScriptManager/ # 脚本管理页
│   │   └── ExampleModal/  # 经典示例弹窗
│   ├── data/              # 钩子库 + 示例脚本
│   ├── lib/               # localStorage 工具
│   └── types/             # TypeScript 类型定义
└── assets/                # 应用图标
```

---

## 路线图

- [ ] AI 钩子生成（Claude API 插件）
- [ ] 情感曲线 AI 分析
- [ ] 双栏编辑器（脚本 + 分镜提示）
- [ ] 多人协作（CRDT）
- [ ] Premiere Pro / DaVinci 插件导出
