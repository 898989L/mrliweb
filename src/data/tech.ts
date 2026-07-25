export interface SkillGroup {
  id: string
  title: string
  accent: string
  skills: { name: string; level: number; note: string }[]
}

export interface ArchSystem {
  id: string
  title: string
  subtitle: string
  layers: { name: string; nodes: string[] }[]
  flows: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: '后端工程',
    accent: '#00d4ff',
    skills: [
      { name: 'Spring Boot / Cloud', level: 92, note: '微服务拆分 · 统一鉴权 · 网关编排' },
      { name: 'MyBatis / Plus', level: 90, note: '复杂 SQL · 多数据源 · 代码生成' },
      { name: 'Flowable / Activiti', level: 82, note: 'BPMN 审批 · 抄送 · 动态表单' },
      { name: 'Redis / MQ', level: 85, note: '缓存击穿防护 · 延时取消 · 会话' },
      { name: 'PostgreSQL / MySQL', level: 88, note: '索引设计 · attr 扩展模型 · 事务' },
    ],
  },
  {
    id: 'frontend',
    title: '多端前端',
    accent: '#34d399',
    skills: [
      { name: 'Vue3 + Vite Monorepo', level: 86, note: 'Turbo · Pinia · 低代码设计器' },
      { name: 'uni-app 小程序', level: 84, note: '分包 · 角色工作台 · 支付链路' },
      { name: 'Element / Ant Design', level: 80, note: '高密度后台 · 表格联动' },
      { name: 'ECharts / DataV', level: 78, note: '态势大屏 · KPI 看板' },
      { name: 'Mars3D / Cesium', level: 68, note: '事件地图点位标注与图层联调' },
    ],
  },
  {
    id: 'platform',
    title: '平台与交付',
    accent: '#fbbf24',
    skills: [
      { name: 'JNPF 低代码二次开发', level: 88, note: 'onlineDev · 社区/事件定制模块' },
      { name: 'HC MicroCommunity', level: 86, note: 'Cmd 路由 · 三端兼容 · IoT/支付' },
      { name: 'AI Agent / Vibe Coding', level: 90, note: 'Cursor · Claude · 原型→代码加速' },
      { name: '接口与联调', level: 87, note: 'Swagger · serviceCode · 三端回归' },
      { name: '视觉 / 交互', level: 75, note: '暗色科技风 · 信息架构 · 动效节奏' },
    ],
  },
]

export const archSystems: ArchSystem[] = [
  {
    id: 'jnpf',
    title: 'JNPF 数字政务 / 智慧社区',
    subtitle: '低代码中台 + 垂直业务定制 + 多端',
    layers: [
      {
        name: '接入层',
        nodes: ['Vue3 PC Monorepo', '微信小程序', 'uni-app 移动端', 'DataV 大屏'],
      },
      {
        name: '能力层',
        nodes: ['onlineDev 表单/流程', 'Flowable BPMN', 'Sa-Token', '集成中心'],
      },
      {
        name: '业务层',
        nodes: ['jnpf-smartcommunity', 'jnpf-eventcenter', 'IoT / 摄像头', 'GIS 图层'],
      },
      {
        name: '数据层',
        nodes: ['PostgreSQL sc_*', 'Redis', 'MinIO/OSS', 'XXL-JOB'],
      },
    ],
    flows: [
      'PC 低代码维护 sc_* ↔ 小程序 /api/smartcommunity/app/** 一表互通',
      '事件受理 → 分派 → 反馈 → 归档/催办，ExternalEvent 外部接入',
      '地图展示端 + 事件/网格调度 + 图层资源后台（演示样例）',
    ],
  },
  {
    id: 'park',
    title: '智慧园区三端一体化',
    subtitle: 'MicroCommunity 统一后端 · PC / 员工 / 企业',
    layers: [
      {
        name: '三端',
        nodes: ['MicroCommunityWeb', 'PropertyApp', 'WechatOwnerService'],
      },
      {
        name: '网关',
        nodes: ['/app/{serviceCode}', '@Java110Cmd ×1550+', 'V2 平滑迁移'],
      },
      {
        name: '园区域',
        nodes: ['industrial 费用', 'SettledApplyV2', 'attr_spec 扩展', '员工聚合 API'],
      },
      {
        name: '基础设施',
        nodes: ['MySQL', 'Redis', 'Quartz', 'Activiti', 'hcIot', '9 套支付'],
      },
    ],
    flows: [
      '厂房复用 building_room(131) · 企业 attr_spec 挂载不改主表',
      'staff.getHomeStats / listTodos 驱动 6 角色工作台',
      '欠费生成、巡检任务、智能抄表由 Quartz 自动化运营',
    ],
  },
]

export const techHighlights = [
  {
    title: '命令驱动网关',
    code: '@Java110Cmd → /app/{serviceCode}',
    desc: '1550+ Cmd 按域拆分，三端共用一套后端契约。',
  },
  {
    title: '扩展字段铁律',
    code: 'attr_spec + 虚拟字段组装',
    desc: '产业园企业 10 条扩展字段，避免主表膨胀与三端回归灾难。',
  },
  {
    title: '低代码一表多端',
    code: 'sc_* ↔ ScMiniAppController',
    desc: 'PC 设计器与居民小程序共用 PostgreSQL，手机号 verifyToken 取数。',
  },
  {
    title: 'AI 加速交付',
    code: '原型 HTML → uni-app / Vue',
    desc: 'Cursor / Claude 驱动，43 页员工端原型可对齐落地。',
  },
]

