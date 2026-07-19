export interface StrengthItem {
  id: string
  icon: string
  title: string
  description: string
  tags: string[]
}

export const strengths: StrengthItem[] = [
  {
    id: 'visual',
    icon: '◈',
    title: '视觉设计',
    description: '暗色科技风信息架构：层级、留白、动效节奏与品牌识别统一，作品集本身即交付样例。',
    tags: ['Figma', 'UI/UX', '视觉规范', '动效'],
  },
  {
    id: 'backend',
    icon: '⬡',
    title: '后端工程',
    description: 'Spring 体系 + 工作流 + 缓存/MQ；熟悉 Cmd 网关、多数据源、事务边界与高并发读写分离思路。',
    tags: ['Spring Boot', 'Flowable', 'Redis', 'MyBatis'],
  },
  {
    id: 'ai-agent',
    icon: '◎',
    title: 'AI Agent 开发',
    description: 'Cursor / Claude 驱动原型→代码→联调；用 Agent 放大交付速度，同时守住架构与字段铁律。',
    tags: ['Cursor', 'Claude Code', 'Vibe Coding', 'Prompt'],
  },
  {
    id: 'fullstack',
    icon: '◇',
    title: '全栈交付',
    description: 'PC 管理端、uni-app 员工/企业端、接口契约与三端回归可独立闭环，缩短想法到上线路径。',
    tags: ['Vue3', 'uni-app', 'REST', '三端联调'],
  },
  {
    id: 'lowcode',
    icon: '▣',
    title: '低代码二次开发',
    description: 'JNPF onlineDev / Flowable 深度定制：智慧社区 sc_* 与事件中心垂直模块，而非停留在拖拽表单。',
    tags: ['JNPF', 'BPMN', 'PostgreSQL', '多端'],
  },
  {
    id: 'platform',
    icon: '◉',
    title: '产业园平台定制',
    description: 'HC MicroCommunity 产业园化：attr_spec 扩展、industrial Cmd、IoT/支付与 6 角色员工端。',
    tags: ['MicroCommunity', 'IoT', '支付', 'Quartz'],
  },
]
