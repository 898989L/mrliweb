export type DeviceType = 'windows' | 'macos' | 'iphone' | 'android' | 'wechat'
export type DemoKind = 'iframe' | 'react'
export type DemoFrame = 'desktop' | 'mobile' | 'wechat' | 'bare'

export interface DemoScene {
  id: string
  label: string
  src?: string
  reactId?: string
}

export interface ProjectDemo {
  kind: DemoKind
  src?: string
  reactId?: string
  frame: DemoFrame
  hint: string
  scenes?: DemoScene[]
  architecture?: { name: string; nodes: string[] }[]
  capabilities?: string[]
}

export interface PreviewBlock {
  type: 'header' | 'stats' | 'chart' | 'list' | 'grid' | 'form' | 'map'
  label?: string
  items?: string[]
  value?: string
}

export interface ProjectItem {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  device: DeviceType
  accent: string
  /** 工程模块范围（客户内网仓库路径，非公网可访问） */
  path: string
  /** 默认 intranet：无公网外链，本站演示即交付证明 */
  access?: 'intranet' | 'public'
  highlights: string[]
  demo: ProjectDemo
  preview: {
    urlBar: string
    sidebar?: string[]
    content: PreviewBlock[]
  }
}

/** 项目区统一说明：面试官侧不必再找 GitHub / 线上环境 */
export const projectsAccessNote =
  '所列项目多为客户内网交付，无法提供公网外链或线上环境。本站「交互实验室」为脱敏可操作演示，用于说明业务场景、技术栈与工程分层。'

export const projects: ProjectItem[] = [
  {
    id: 'jnpf-gov',
    title: 'JNPF 数字政务低代码平台',
    subtitle: 'JNPF v6.1 · 企业级政务中台',
    description:
      '基于 JNPF v6.1 二次开发的数字政务管理系统：Vue3 Monorepo + Spring Boot，覆盖表单/流程设计、Flowable 审批、权限与集成中心。',
    tags: ['Vue3', 'Vite', 'Flowable', 'Sa-Token', 'MyBatis-Plus', 'PostgreSQL'],
    device: 'windows',
    accent: '#4f46e5',
    path: 'jnpf/jnpf-qianduan/jnpf-web-monorepo-v6x',
    highlights: ['onlineDev 一体化设计', 'Flowable 审批全链路', '钉钉/企微集成中心'],
    demo: {
      kind: 'react',
      reactId: 'jnpf-gov',
      frame: 'desktop',
      hint: '切换场景：待办审批可填写意见；表单设计器可拖控件；BPMN 可点节点；集成可开关连通',
      scenes: [
        { id: 'flow', label: '流程待办', reactId: 'jnpf-gov' },
        { id: 'designer', label: '表单设计器', reactId: 'jnpf-gov-designer' },
        { id: 'bpmn', label: 'BPMN 流程', reactId: 'jnpf-gov-bpmn' },
        { id: 'perm', label: '权限配置', reactId: 'jnpf-gov-perm' },
        { id: 'inte', label: '集成连通', reactId: 'jnpf-gov-inte' },
      ],
      architecture: [
        { name: '前端', nodes: ['Vue3 Monorepo', 'Pinia', '@jnpf/bpmn'] },
        { name: '引擎', nodes: ['onlineDev', 'Flowable', 'Sa-Token'] },
        { name: '后端', nodes: ['jnpf-admin', 'oauth', 'permission'] },
      ],
      capabilities: ['待办审批写意见', '表单拖拽设计', 'BPMN 节点配置', '角色授权开关', '第三方连通测试'],
    },
    preview: {
      urlBar: '数字政务平台 / 流程中心',
      sidebar: ['在线开发', '流程中心', '权限管理', '集成中心'],
      content: [
        { type: 'header', label: '我的待办' },
        { type: 'list', items: ['居住证续签 · 待审', '场地申请 · 会签中'] },
        { type: 'stats', items: ['今日待办 12', '本周办结 48'] },
      ],
    },
  },
  {
    id: 'jnpf-community',
    title: '智慧社区综合治理',
    subtitle: 'PC 低代码 · 居民微信小程序',
    description:
      'jnpf-smartcommunity + sc_* 表：PC 低代码与居民端一表互通，办事/志愿/党建全流程可点。',
    tags: ['uni-app', 'Vue3', '微信小程序', 'JNPF', 'PostgreSQL'],
    device: 'wechat',
    accent: '#6366f1',
    path: 'jnpf/jnpf-miniprogram/cunity-app-vue3-v6x',
    highlights: ['一表互通', 'verifyToken', '21 页原型落地'],
    demo: {
      kind: 'iframe',
      src: '/demos/jnpf-community/index.html',
      frame: 'bare',
      hint: '12 个真实原型页可切换；页内九宫格、列表、表单均可继续点击',
      scenes: [
        { id: 'home', label: '首页', src: '/demos/jnpf-community/index.html' },
        { id: 'affairs', label: '办事大厅', src: '/demos/jnpf-community/affairs.html' },
        { id: 'guide', label: '办事指南', src: '/demos/jnpf-community/affairs-guide.html' },
        { id: 'appoint', label: '我要预约', src: '/demos/jnpf-community/affairs-appointment.html' },
        { id: 'my', label: '我的办件', src: '/demos/jnpf-community/affairs-my.html' },
        { id: 'volunteer', label: '志愿活动', src: '/demos/jnpf-community/volunteer.html' },
        { id: 'vapply', label: '志愿申请', src: '/demos/jnpf-community/volunteer-apply.html' },
        { id: 'party', label: '党建', src: '/demos/jnpf-community/party.html' },
        { id: 'activity', label: '活动列表', src: '/demos/jnpf-community/activity-list.html' },
        { id: 'notice', label: '通告', src: '/demos/jnpf-community/notice-list.html' },
        { id: 'msg', label: '消息', src: '/demos/jnpf-community/message.html' },
        { id: 'profile', label: '我的', src: '/demos/jnpf-community/profile.html' },
      ],
      architecture: [
        { name: '居民端', nodes: ['uni-app', '分包', 'Pinia'] },
        { name: 'API', nodes: ['ScMiniAppController', 'verifyToken'] },
        { name: '数据', nodes: ['sc_matterhandling', 'sc_volunteer_*', 'sc_party_*'] },
      ],
      capabilities: ['办事预约', '我的办件', '志愿报名', '党建活动', '通告消息'],
    },
    preview: {
      urlBar: '智慧社区',
      content: [
        { type: 'header', label: '社区服务' },
        { type: 'grid', items: ['党建', '志愿', '办事', '政民互动'] },
        { type: 'list', items: ['居住证续签 · 审核中', '志愿清洁 · 可报名'] },
      ],
    },
  },
  {
    id: 'jnpf-event',
    title: '城市事件中心 · GIS 大屏',
    subtitle: '网格治理 · 地图展示 · 图层管理',
    description:
      '演示用脱敏样例：地图展示端（资产色块标绘）、事件与网格调度、图层资源与场景编排。界面与数据均为虚构示意，不对应任何真实客户系统。',
    tags: ['Vue3', 'Mars3D', 'Cesium', 'ECharts', 'DataV'],
    device: 'windows',
    accent: '#06b6d4',
    path: 'jnpf/jnpf-qianduan/jnpf-web-datascreen-vue3-v6x',
    highlights: ['地图展示端', '事件调度', '图层资源后台'],
    demo: {
      kind: 'react',
      reactId: 'jnpf-event',
      frame: 'desktop',
      hint: '演示数据已脱敏；可点选资产色块、分派事件、调度网格员、启停图层',
      scenes: [
        { id: 'view', label: '地图展示', reactId: 'jnpf-event' },
        { id: 'event', label: '事件管理', reactId: 'jnpf-event-work' },
        { id: 'grid', label: '网格管理', reactId: 'jnpf-event-map' },
        { id: 'admin', label: '图层后台', reactId: 'jnpf-event-stats' },
      ],
      architecture: [
        { name: '展示端', nodes: ['Mars3D', '图层树', '标绘色块'] },
        { name: '业务', nodes: ['事件大厅', '网格员', '指挥调度'] },
        { name: '后台', nodes: ['图层资源', '场景编排', 'event-center'] },
      ],
      capabilities: ['资产色块点选', '事件分派', '网格调度', '图层启停', '场景页面'],
    },
    preview: {
      urlBar: '事件中心 / 地图展示（演示）',
      sidebar: ['地图', '事件', '网格', '图层'],
      content: [
        { type: 'stats', items: ['资产 128', '事件 24', '图层 36'] },
        { type: 'map', label: '网格热力' },
      ],
    },
  },
  {
    id: 'park-admin',
    title: '智慧园区运营管理平台',
    subtitle: 'MicroCommunity · 统一 API',
    description: '产业园 PC：厂房、入驻、费用、巡检、合同；attr_spec + industrial Cmd。',
    tags: ['Spring Boot', 'MyBatis', 'Vue2', 'Element UI', 'IoT'],
    device: 'macos',
    accent: '#0d9488',
    path: 'pinganxiaoqu/MicroCommunityWeb',
    highlights: ['attr_spec 扩展', 'SettledApplyV2', '费用 KPI'],
    demo: {
      kind: 'iframe',
      src: '/demos/park-admin/index.html',
      frame: 'desktop',
      hint: '14 个业务场景；页内可点侧栏、色块厂房、弹窗新增、办理入驻',
      scenes: [
        { id: 'hub', label: '场景枢纽', src: '/demos/park-admin/index.html' },
        { id: 'space', label: '厂房空间', src: '/demos/park-admin/01-space.html' },
        { id: 'settle', label: '企业入驻', src: '/demos/park-admin/02-settled-info.html' },
        { id: 'bind', label: '绑定厂房', src: '/demos/park-admin/03-bind-room.html' },
        { id: 'contract', label: '上传合同', src: '/demos/park-admin/04-upload-contract.html' },
        { id: 'company', label: '企业管理', src: '/demos/park-admin/05-company-list.html' },
        { id: 'detail', label: '企业详情', src: '/demos/park-admin/06-company-detail.html' },
        { id: 'biz', label: '业务办理', src: '/demos/park-admin/07-business.html' },
        { id: 'fee', label: '费用收缴', src: '/demos/park-admin/08-fee-overview.html' },
        { id: 'utility', label: '水电明细', src: '/demos/park-admin/08-utility.html' },
        { id: 'inspect', label: '巡检点', src: '/demos/park-admin/11-inspection.html' },
        { id: 'plan', label: '巡检计划', src: '/demos/park-admin/12-inspect-plan.html' },
        { id: 'ctype', label: '合同类型', src: '/demos/park-admin/16-contract-type.html' },
        { id: 'archive', label: '历史归档', src: '/demos/park-admin/10-archive.html' },
      ],
      architecture: [
        { name: 'PC', nodes: ['factoryRouter', 'tenantIndustrial'] },
        { name: 'Cmd', nodes: ['SettledApplyV2', 'IndustrialFee*'] },
        { name: '数据', nodes: ['building_room', 'attr_spec'] },
      ],
      capabilities: ['厂房色块', '入驻流程', '费用 KPI', '巡检计划', '合同类型'],
    },
    preview: {
      urlBar: '智慧园区 / 企业运营',
      sidebar: ['厂房', '入驻', '费用', '业务'],
      content: [
        { type: 'stats', items: ['企业 128', '收缴率 86%'] },
        { type: 'chart', label: '收缴趋势' },
      ],
    },
  },
  {
    id: 'park-staff',
    title: '智慧园区物业员工端',
    subtitle: 'uni-app · 6 角色 × 11 模块',
    description: '角色工作台 + 巡检/催缴/合同/OA，对齐员工端原型全页。',
    tags: ['uni-app', 'Vue', 'Vuex', '角色权限'],
    device: 'iphone',
    accent: '#ea580c',
    path: 'pinganxiaoqu/PropertyApp',
    highlights: ['6 角色差异化', '待办聚合', 'OA 表单'],
    demo: {
      kind: 'iframe',
      src: '/demos/park-staff/pages/home.html',
      frame: 'bare',
      hint: '14 个场景；左侧可切角色，页内可巡检打卡、催缴、请假报销',
      scenes: [
        { id: 'home', label: '首页工作台', src: '/demos/park-staff/pages/home.html' },
        { id: 'biz', label: '业务中心', src: '/demos/park-staff/pages/business.html' },
        { id: 'msg', label: '消息待办', src: '/demos/park-staff/pages/message.html' },
        { id: 'insp', label: '巡检列表', src: '/demos/park-staff/pages/inspection-list.html' },
        { id: 'inspExe', label: '巡检执行', src: '/demos/park-staff/pages/inspection-execute.html' },
        { id: 'feeDash', label: '费用看板', src: '/demos/park-staff/pages/fee-dashboard.html' },
        { id: 'fee', label: '费用分析', src: '/demos/park-staff/pages/fee-analysis.html' },
        { id: 'dunning', label: '催缴流水', src: '/demos/park-staff/pages/fee-dunning-list.html' },
        { id: 'contract', label: '合同列表', src: '/demos/park-staff/pages/contract-list.html' },
        { id: 'renew', label: '合同续期', src: '/demos/park-staff/pages/contract-renewal.html' },
        { id: 'company', label: '企业列表', src: '/demos/park-staff/pages/company-list.html' },
        { id: 'leave', label: '请假申请', src: '/demos/park-staff/pages/form-leave.html' },
        { id: 'expense', label: '报销申请', src: '/demos/park-staff/pages/form-expense.html' },
        { id: 'me', label: '我的', src: '/demos/park-staff/pages/me.html' },
      ],
      architecture: [
        { name: '端', nodes: ['uni-app', 'role-data'] },
        { name: 'API', nodes: ['getHomeStats', 'listTodos'] },
        { name: '模块', nodes: ['巡检', '催缴', '合同', 'OA'] },
      ],
      capabilities: ['角色切换', '巡检执行', '催缴费', '合同续期', '请假报销'],
    },
    preview: {
      urlBar: '智慧园区 · 员工端',
      content: [
        { type: 'stats', items: ['收缴率 78%', '待收 ¥128 万'] },
        { type: 'grid', items: ['催费', '巡检', '合同', 'OA'] },
      ],
    },
  },
  {
    id: 'park-enterprise',
    title: '智慧园区企业服务端',
    subtitle: '企业小程序 · 账单与办理',
    description: '企业端首页四卡、费用、水电、合同信息与注册绑定。',
    tags: ['微信小程序', 'uni-app', 'vant-weapp', '支付'],
    device: 'wechat',
    accent: '#2563eb',
    path: 'pinganxiaoqu/WechatOwnerService',
    highlights: ['账单四卡', '合同预览', '水电预存'],
    demo: {
      kind: 'iframe',
      src: '/demos/park-enterprise/index.html',
      frame: 'wechat',
      hint: '9 个场景：登录→首页→缴费→水电图表→个人中心全链路',
      scenes: [
        { id: 'login', label: '登录', src: '/demos/park-enterprise/login.html' },
        { id: 'home', label: '企业首页', src: '/demos/park-enterprise/index.html' },
        { id: 'fees', label: '企业费用', src: '/demos/park-enterprise/company-fees.html' },
        { id: 'info', label: '入驻信息', src: '/demos/park-enterprise/company-info.html' },
        { id: 'water', label: '水电列表', src: '/demos/park-enterprise/water-list.html' },
        { id: 'chart', label: '用量图表', src: '/demos/park-enterprise/water-chart.html' },
        { id: 'notice', label: '通知公告', src: '/demos/park-enterprise/notifications.html' },
        { id: 'profile', label: '个人中心', src: '/demos/park-enterprise/profile.html' },
        { id: 'register', label: '注册绑定', src: '/demos/park-enterprise/register.html' },
      ],
      architecture: [
        { name: '小程序', nodes: ['vant-weapp', 'roomContext'] },
        { name: '接口', nodes: ['SettledCompany', 'IndustrialFeeBill'] },
      ],
      capabilities: ['登录绑定', '账单缴费', '水电图表', '入驻信息', '通知中心'],
    },
    preview: {
      urlBar: '智慧园区 · 企业服务',
      content: [
        { type: 'stats', items: ['用水 86 吨', '待缴 ¥8,620'] },
        { type: 'grid', items: ['费用', '水电', '合同', '通知'] },
      ],
    },
  },
  {
    id: 'tally-book',
    title: '记账小程序',
    subtitle: '多端记账 · 运营后台',
    description: 'uni-app 记账：分类记账、消费分析、WebSocket 通知。',
    tags: ['Spring Boot 3', 'Sa-Token', 'uni-app', 'Redis', 'WebSocket'],
    device: 'iphone',
    accent: '#22c55e',
    path: 'tally-book',
    highlights: ['记一笔', '分类统计', '实时推送'],
    demo: {
      kind: 'react',
      reactId: 'tally-book',
      frame: 'mobile',
      hint: '首页可删改；记一笔可选分类金额；分析页可切月查看占比',
      scenes: [
        { id: 'home', label: '账单首页', reactId: 'tally-book' },
        { id: 'add', label: '记一笔', reactId: 'tally-book-add' },
        { id: 'chart', label: '消费分析', reactId: 'tally-book-chart' },
      ],
      capabilities: ['增删账单', '分类记账', '月度分析'],
    },
    preview: {
      urlBar: '记账本',
      content: [
        { type: 'stats', items: ['本月支出 ¥3,280'] },
        { type: 'list', items: ['餐饮 -¥86', '交通 -¥24'] },
      ],
    },
  },
  {
    id: 'legal-ui',
    title: '执法办案 UI',
    subtitle: '政务执法 · 案件管理',
    description: '案件列表、详情流转、电子卷宗翻页。',
    tags: ['Vue3', 'TypeScript', 'Element Plus'],
    device: 'windows',
    accent: '#0ea5e9',
    path: 'legal-ui-case',
    highlights: ['列表详情联动', '卷宗翻页', '状态流转'],
    demo: {
      kind: 'react',
      reactId: 'legal-ui',
      frame: 'desktop',
      hint: '可筛选案件、推进状态、填写调查备注；卷宗可翻页批注',
      scenes: [
        { id: 'list', label: '案件列表', reactId: 'legal-ui' },
        { id: 'detail', label: '案件详情', reactId: 'legal-ui-detail' },
        { id: 'dossier', label: '电子卷宗', reactId: 'legal-ui-dossier' },
      ],
      capabilities: ['筛选排序', '状态流转', '卷宗批注'],
    },
    preview: {
      urlBar: '执法办案 / 案件管理',
      sidebar: ['工作台', '案件', '卷宗'],
      content: [
        { type: 'list', items: ['2025-0892 · 调查中', '2025-0761 · 待审批'] },
      ],
    },
  },
  {
    id: 'dossier',
    title: '电子卷宗系统',
    subtitle: '司法档案 · 卷宗管理',
    description: '查询、制作、扫描入库全流程。',
    tags: ['Spring MVC', 'MyBatis', 'Oracle'],
    device: 'windows',
    accent: '#8b5cf6',
    path: 'dossier',
    highlights: ['多维查询', '制作向导', '扫描入库'],
    demo: {
      kind: 'react',
      reactId: 'dossier',
      frame: 'desktop',
      hint: '查询可组合条件；制作可逐步添加目录；扫描可模拟入库进度',
      scenes: [
        { id: 'query', label: '卷宗查询', reactId: 'dossier' },
        { id: 'make', label: '卷宗制作', reactId: 'dossier-make' },
        { id: 'scan', label: '扫描入库', reactId: 'dossier-scan' },
      ],
      capabilities: ['组合检索', '目录制作', '扫描进度'],
    },
    preview: {
      urlBar: '电子卷宗 / 查询',
      content: [
        { type: 'form', label: '查询条件' },
        { type: 'list', items: ['A2025-001 · 已归档', 'A2025-002 · 制作中'] },
      ],
    },
  },
  {
    id: 'zxzj',
    title: '研发统一管控平台',
    subtitle: '研发效能 · 项目管控',
    description: '项目群、缺陷、日报多维管控。',
    tags: ['Spring Boot', 'MyBatis-Plus', 'PostgreSQL'],
    device: 'macos',
    accent: '#f59e0b',
    path: 'zxzjGS',
    highlights: ['项目看板', '缺陷流转', '日报提交'],
    demo: {
      kind: 'react',
      reactId: 'zxzj',
      frame: 'desktop',
      hint: '项目可下钻风险；缺陷可改状态；日报可填写提交',
      scenes: [
        { id: 'proj', label: '项目群', reactId: 'zxzj' },
        { id: 'bug', label: '缺陷跟踪', reactId: 'zxzj-bug' },
        { id: 'daily', label: '日报中心', reactId: 'zxzj-daily' },
      ],
      capabilities: ['风险下钻', '缺陷状态', '日报提交'],
    },
    preview: {
      urlBar: '研发管控 / 项目看板',
      content: [
        { type: 'stats', items: ['进行中 42', '延期 3'] },
        { type: 'chart', label: '燃尽' },
      ],
    },
  },
  {
    id: 'renyixuan',
    title: '任逸选旅游平台',
    subtitle: '民宿预订 · 微服务',
    description: '筛选、详情、预约下单；演示登录互踢与库存校验提示。',
    tags: ['Spring Cloud', 'Elasticsearch', 'RabbitMQ', 'MongoDB'],
    device: 'android',
    accent: '#ec4899',
    path: '任逸选（简历项目）',
    highlights: ['风格筛选', '预约下单', '互踢提示'],
    demo: {
      kind: 'react',
      reactId: 'renyixuan',
      frame: 'mobile',
      hint: '可筛选收藏；详情选日期人数；下单模拟库存与多端登录互踢',
      scenes: [
        { id: 'list', label: '发现民宿', reactId: 'renyixuan' },
        { id: 'detail', label: '房源详情', reactId: 'renyixuan-detail' },
        { id: 'order', label: '预约下单', reactId: 'renyixuan-order' },
      ],
      capabilities: ['筛选收藏', '日期库存', '下单互踢'],
    },
    preview: {
      urlBar: '任逸选',
      content: [
        { type: 'grid', items: ['海景房', '山景院', '古城宿', '田园居'] },
      ],
    },
  },
]

