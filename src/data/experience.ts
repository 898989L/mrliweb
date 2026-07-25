export interface ExperienceItem {
  id: string
  period: string
  company: string
  role: string
  summary: string
  bullets: string[]
  stack: string[]
}

export const experiences: ExperienceItem[] = [
  {
    id: 'wansi',
    period: '2023.09 — 至今',
    company: '万思信息技术有限公司',
    role: 'Java 后端 / AI 开发',
    summary:
      '负责 Java 业务落地与多端联调，参与 JNPF 数字政务 / 智慧社区、事件中心等交付；结合 Cursor / Claude 提升从需求到联调的效率。',
    bullets: [
      '参与智慧社区模块：党建、志愿、办事预约等业务与居民端 API',
      '居民端按手机号鉴权查询个人数据，与 PC 低代码共用 PostgreSQL',
      '参与事件中心受理、分派、催办等流转及大屏/地图相关联调',
      '落地 Flowable 审批、onlineDev 表单与组织权限在项目中的配置与对接',
      '负责后端接口与联调，关键路径（事务、权限、兼容）人工把关',
      '使用 AI Agent 辅助原型/需求到代码的实现，缩短迭代周期',
    ],
    stack: ['Java', 'Spring Boot', 'JNPF', 'Flowable', 'PostgreSQL', 'Cursor', 'Claude Code'],
  },
  {
    id: 'yitong',
    period: '2021.02 — 2023.09',
    company: '福建亿同世纪软件科技股份有限公司',
    role: 'Java 后端开发',
    summary: '企业级后台业务开发，夯实 Spring / MyBatis / 库表设计与前后端联调。',
    bullets: [
      '参与电子卷宗、执法办案等相关后台开发与前端协作',
      '完成权限控制、组合查询、附件与审批衔接等常见企业需求',
      '输出接口说明，配合联调与问题定位',
    ],
    stack: ['Spring MVC', 'MyBatis', 'Oracle/MySQL', 'Vue', '接口文档'],
  },
]

export interface DeliveryNote {
  id: string
  title: string
  scene: string
  problem: string
  approach: string
  result: string
  highlight: string
}

export const deliveryNotes: DeliveryNote[] = [
  {
    id: 'attr-spec',
    title: '企业入驻要加字段，又不想改坏三端共用表',
    scene: '智慧园区 · 物业 PC / 员工端 / 企业端',
    problem:
      '企业入驻要补执照、法人、经办人等信息，但业主/房间主表被 PC、员工端、企业端一起用；直接改主表，三端都容易回归翻车。',
    approach:
      '执照这类核心字段仍放主表；其它扩展信息单独挂扩展表。接口升级时保留旧版一段时间，新端走新接口，旧端慢慢切。',
    result: '主表更稳，三端可以分期上线，少做大范围联调返工。',
    highlight: '多端共用一张表时，先分清「必须进主表」和「可以挂扩展」，再谈接口升级。',
  },
  {
    id: 'one-table',
    title: '管理端与小程序的数据对齐',
    scene: 'JNPF 智慧社区',
    problem: '管理端需在线维护办件、志愿等数据，居民端又要便捷查询个人记录，需避免双表不一致。',
    approach:
      'PC 低代码维护 sc_* 业务表；小程序经统一 API 读取；个人数据结合手机号校验与网关白名单访问。',
    result: '两端共用同一套 PostgreSQL 数据，展示一致，减少同步中间层。',
    highlight: '明确写入端、读取端与鉴权边界，保证多端数据一致。',
  },
  {
    id: 'three-end',
    title: '员工打开首页，一次看清统计和待办',
    scene: '智慧园区 · 物业员工端',
    problem:
      '巡检、报修、审批等角色打开首页，都要看统计、待办和快捷入口。页面一个个接口去拉，又慢又难兼容。',
    approach:
      '后端做一个首页接口，把统计、待办、消息打包返回；前端按角色配置展示，先 Mock 再切真实接口。',
    result: '换角色主要改配置；待办能覆盖巡检、报修、审批等常见类型。',
    highlight: '首页先定好「一次返回什么」，再按角色做差异展示，联调更省事。',
  },
  {
    id: 'vibe',
    title: 'AI 辅助开发的落地方式',
    scene: '全栈交付',
    problem: '纯手写周期偏长；若完全依赖生成，易出现字段混乱、事务遗漏或破坏旧接口。',
    approach:
      '以原型/需求划定边界，AI 生成初稿，人工审查 Cmd、SQL 与三端影响，再进入联调合入。',
    result: '在保证关键路径可靠的前提下，缩短实现与返工时间。',
    highlight: 'AI 负责加速，事务、权限、兼容等关键路径由人工把关。',
  },
  {
    id: 'flow',
    title: '办事审批：从提交到办结怎么走通',
    scene: 'JNPF 数字政务 / OA',
    problem:
      '业务要能提交、待办处理、退回、会签，而且表单字段经常是后台动态配出来的，不是写死页面。',
    approach:
      '用 Flowable 配审批节点和办理人，表单走动态配置；联调按「发起 → 审批 → 退回/会签 → 办结」整条链路验一遍。',
    result: '审批主路径可跑通，常见退回、办结操作可用，不是只调通某一个审批接口。',
    highlight: '看审批要看整条链路：谁发起、谁办、能不能退、办完数据落哪。',
  },
]

export interface ServiceItem {
  title: string
  desc: string
  fit: string
}

export const services: ServiceItem[] = [
  {
    title: 'Java 后端开发',
    desc: '接口设计、库表、权限与联调；熟悉 Spring Boot / MyBatis / Redis 等企业项目常见技术栈。',
    fit: '适用：管理后台、业务模块、多端共用 API',
  },
  {
    title: '低代码与物业平台定制',
    desc: 'JNPF 业务模块扩展、MicroCommunity Cmd 定制、PC 与小程序数据对齐。',
    fit: '适用：政务社区、智慧园区、既有平台上的增量需求',
  },
  {
    title: '多端页面与高效交付',
    desc: 'Vue / uni-app 页面实现与联调；结合 AI 工具加快开发，关键逻辑人工验收。',
    fit: '适用：周期紧、有明确原型或需求的中小型交付',
  },
]
