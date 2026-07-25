# MrLi · 个人作品集网站

暗色系、科技感个人作品集，面向 **视觉设计 / AI 设计 / Java 后端** 求职与兼职合作展示。基于 React + Vite 构建，PC 端优先，版心约 **1700px**。

项目名：**MrLi**（npm package: `mrli`）

部署说明见：**[部署文档.md](./部署文档.md)**  
线上地址：https://898989l.github.io/mrliweb/

---

## 快速开始

### 环境要求

- Node.js 18+（推荐 20+）
- npm 或 pnpm

### 安装与运行

```bash
cd mrli
npm install
npm run dev
```

浏览器访问：**http://localhost:5173/**

### 构建与预览

```bash
npm run build      # 输出到 dist/
npm run preview    # 本地预览生产构建
```

---

## 项目结构

```
mrli/
├── public/                    # 静态资源（构建时原样复制）
│   ├── videos/                # 背景视频 video1.mp4 / video2.mp4
│   ├── avatar.jpg             # 头像 / favicon / 微信头像
│   ├── wechat-qr.jpg          # 微信二维码
│   └── project-renyixuan.jpg  # 项目截图（可选）
├── src/
│   ├── data/                  # ★ 内容数据（改内容主要在这里）
│   │   ├── profile.ts         # 个人信息、履历、统计数据
│   │   ├── projects.ts        # 精选项目列表
│   │   ├── strengths.ts       # 个人优势
│   │   └── inquiries.ts       # 咨询表单演示数据
│   ├── utils/
│   │   └── maskContact.ts     # 联系方式脱敏
│   ├── components/            # 页面组件
│   ├── App.tsx                # 根布局
│   ├── main.tsx               # 入口
│   └── index.css              # 全局样式与 CSS 变量
├── index.html                 # 页面标题、字体、meta
├── vite.config.ts
└── package.json
```

---

## 页面模块说明

| 模块 | 组件 | 说明 |
|------|------|------|
| 固定视频背景 | `VideoBackground` | 双视频淡入切换，滚动时不位移 |
| 水面交互 | `WaterRipple` | WebGL 顶层水波，跟随鼠标，可关闭 |
| 导航栏 | `Navbar` | 固定顶栏，滚动后半透明 |
| 首页 Hero | `Hero` | 全屏标题、角色、CTA |
| 个人经历 | `About` | 头像、介绍、统计、工作履历 |
| 精选项目 | `Projects` + `ProjectCarousel` | 3D 闭环卡片轮播 |
| 个人优势 | `Strengths` | 能力卡片网格 |
| 联系区 | `Contact` + `ContactForm` | 邮箱/微信 + 咨询表单 |
| 无障碍 | `SkipLink` / `MotionToggle` | 跳过导航、减少动效 |

---

## 如何修改内容

### 1. 个人信息

编辑 `src/data/profile.ts`：

```ts
export const profile = {
  name: '李龙飞',
  siteTitle: '李龙飞 | 资深Java后端 · 全栈交付 · AI开发',
  location: '江西 · 南昌',
  phone: '17679319213',
  email: '15565040817@163.com',
  // timeline、stats、intro、bio ...
}
```

浏览器标签标题在 `index.html` 的 `<title>` 与 `profile.siteTitle` 保持一致即可。

### 2. 精选项目

编辑 `src/data/projects.ts`，每个项目包含：

- `title` / `subtitle` / `description`
- `tags`：技术标签
- `device`：`windows` | `macos` | `iphone` | `android` | `wechat`（决定系统界面框架样式）
- `accent`：主题色
- `highlights`：详情弹窗亮点
- `preview`：DeviceFrame 内模拟 UI 内容

若有真实截图，在 `Projects.tsx` 或 `ProjectCarousel.tsx` 的 `projectImages` 中映射：

```ts
const projectImages: Record<string, string> = {
  renyixuan: '/project-renyixuan.jpg',
  'jnpf-community': '/your-screenshot.jpg',
}
```

图片放入 `public/` 目录。

### 3. 个人优势

编辑 `src/data/strengths.ts`，增删卡片即可。

### 4. 咨询表单演示数据

编辑 `src/data/inquiries.ts` 中的 `seedInquiries` 数组。

用户提交的表单保存在浏览器 **localStorage**（键名 `portfolio-inquiries`），列表展示时手机号/邮箱会自动脱敏。

---

## 静态资源

| 文件 | 用途 |
|------|------|
| `public/videos/video1.mp4` | 背景视频 1 |
| `public/videos/video2.mp4` | 背景视频 2 |
| `public/avatar.jpg` | 关于我头像、网站 favicon |
| `public/wechat-qr.jpg` | 微信二维码 |
| `public/wechat-avatar.jpg` | 联系区微信头像（可与 avatar 相同） |

替换视频建议压缩后使用（WebM + MP4），单文件尽量控制在 10MB 以内以提升首屏加载。

---

## 核心交互说明

### 3D 项目轮播

- **闭环**：首尾相连，左右无限切换
- **操作**：拖动、滚轮、方向键 ← →、底部箭头与圆点
- **点击卡片**：任意卡片点击后旋转至中间，居中后可「查看详情」

### 水面波纹

- 位于 **最顶层**（`z-index: 9999`），不遮挡点击（`pointer-events: none`）
- 参数在 `src/components/WaterRipple.tsx` 顶部常量（半径、强度等）
- 页脚 **「减少动效」** 或系统「减少动态效果」会关闭水波

### 联系表单

- 字段：姓名、需求描述、联系方式
- 纯前端演示，无后端；提交后写入 localStorage 并展示在「近期咨询」
- 展示号码格式：`138****5678`（见 `src/utils/maskContact.ts`）

### 微信二维码

- 悬停放大便于扫码；触屏设备默认较大尺寸

---

## 样式与主题

全局 CSS 变量定义在 `src/index.css`：

```css
:root {
  --accent: #00d4ff;
  --max-width: 1700px;
  --nav-height: 72px;
  /* ... */
}
```

暗色玻璃卡片使用 `.glass` 类，项目卡片在轮播中有额外透明样式。

---

## 无障碍（A11y）

- **跳过导航**：Tab 键第一个焦点为「跳过导航，进入主内容」
- **键盘焦点**：`:focus-visible` 青色描边
- **减少动效**：页脚按钮 + `prefers-reduced-motion` 自动适配
- 主导航带 `aria-label`，表单错误用 `role="alert"`

---

## 部署建议

### Vercel / Netlify

1. 将 `mrli` 目录作为项目根目录（或整仓部署并设置 Root Directory 为 `mrli`）
2. Build Command：`npm run build`
3. Output Directory：`dist`

### 其他静态托管

```bash
npm run build
# 将 dist/ 目录上传到任意静态服务器
```

部署后建议在 `index.html` 补充 Open Graph meta，便于微信 / LinkedIn 分享。

---

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 6 |
| 动画 | Framer Motion |
| 水波 | WebGL2 自定义 Shader |
| 样式 | 原生 CSS（无 UI 库） |

---

## 后续可优化项

- [ ] 项目模块替换为真实截图
- [ ] 背景视频压缩与 poster 封面
- [ ] 移动端汉堡菜单
- [ ] Open Graph / 简历 PDF 下载
- [ ] 表单对接邮件或 webhook 实现真实收单
- [ ] 部署公网域名写入简历

---

## 相关路径

- 项目代码：`C:\Develoment\WorkSpace\myResume\mrli`
- 原始素材（简历、视频、头像）：`C:\Develoment\WorkSpace\myResume\`
- 作品来源项目：`C:\Develoment\WorkSpace\` 下各子目录

---

## 常见问题

**Q: 修改数据后页面没变化？**  
A: 开发模式下保存即热更新；生产环境需重新 `npm run build`。

**Q: 咨询表单别人能看到吗？**  
A: 不能。当前仅存在访问者本机 localStorage，仅供演示。要真实收单需接后端或第三方表单。

**Q: 水波太亮 / 太大？**  
A: 修改 `WaterRipple.tsx` 中 `CURSOR_RADIUS_PX`、shader 内 `alpha` 相关系数，或开启「减少动效」。

**Q: 如何临时关掉水波？**  
A: 在 `App.tsx` 中注释 `<WaterRipple />`，或页脚点击「减少动效」。

---

作者：李龙飞 · 江西南昌  
最后更新：2026-06
