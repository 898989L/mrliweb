/* ============================================
 * 智慧园区员工端 · Mock 数据
 * 基于 PRD v1
 * ============================================ */

/* ---------- 园区列表 ---------- */
const PARKS = [
  { id: 'park1', name: '智慧科技园', active: true },
  { id: 'park2', name: '北区产业园' },
  { id: 'park3', name: '滨江创新园' }
];

/* ---------- 模块定义 ---------- */
const MODULES = {
  M03: { id: 'M03', name: '巡检', icon: '巡', color: 'blue', desc: '日常安全 / 维保 / 保安' },
  M04: { id: 'M04', name: '报修工单', icon: '工', color: 'red', desc: '租户报修全流程处理' },
  M05: { id: 'M05', name: '费用', icon: '¥', color: 'orange', desc: '收缴 / 催缴 / 流水' },
  M06: { id: 'M06', name: '水电', icon: '电', color: 'teal', desc: '总览 / 企业明细 / 图表' },
  M07: { id: 'M07', name: '合同', icon: '合', color: 'purple', desc: '审批 / 到期提醒' },
  M08: { id: 'M08', name: '企业入驻', icon: '企', color: 'green', desc: '入驻企业档案' },
  M09: { id: 'M09', name: 'OA', icon: 'OA', color: 'blue', desc: '请假 / 报销 / 用印' },
  M10: { id: 'M10', name: '会议管理', icon: '会', color: 'purple', desc: '预定 / 通知 / 签到' },
  M11: { id: 'M11', name: '停车记录', icon: '停', color: 'gray', desc: '车辆通行记录' }
};

/* ---------- 角色配置 ---------- */
const ROLES = {
  inspector: {
    id: 'inspector',
    name: '巡检员',
    short: '巡',
    user: '张志强',
    desc: '今日巡检路线、设备异常、待复查',
    focus: '执行巡检、处理工单',
    /* Hero 4 个快创按钮 */
    heroActions: [
      { icon: '巡', label: '发起巡检', page: 'inspection-create' },
      { icon: '异', label: '上报异常', page: 'workorder-create' },
      { icon: '⌨', label: '扫一扫', toast: '扫码功能演示中' },
      { icon: '接', label: '工单接单', page: 'workorder-list', params: { filter: 'pending' } }
    ],
    /* 数据卡 4 张 */
    stats: [
      { label: '今日巡检任务', value: 8, unit: '次', delta: '已完成 3/8', type: 'info', color: 'info' },
      { label: '异常待处理', value: 2, unit: '项', delta: '较昨日 +1', deltaType: 'down', color: 'danger' },
      { label: '待我处理工单', value: 5, unit: '单', delta: '其中 2 单超时', deltaType: 'down', color: 'warning' },
      { label: '本月完成率', value: '96', unit: '%', delta: '较上月 +3%', deltaType: 'up', color: 'success' }
    ],
    /* 业务模块卡列表(按权限) */
    modules: ['M03', 'M04', 'M08', 'M09', 'M10'],
    moduleBadges: { M04: 5, M03: 2 },
    /* 业务页分组 */
    bizGroups: [
      { title: '我的工作', items: ['M03', 'M04'] },
      { title: '查看与协同', items: ['M08'] },
      { title: '办公', items: ['M09', 'M10'] }
    ],
    /* 待办 */
    todos: [
      { icon: '巡', cls: 'danger', title: 'B 栋 3 层消防设备巡检', desc: '计划 10:00 · 已逾期 12 分钟', status: '待处理', page: 'inspection-list' },
      { icon: '工', cls: '', title: '工单 #2406003 空调维修', desc: '紫华科技 · 创建 1 小时前', status: '待处理', page: 'workorder-list' },
      { icon: '异', cls: 'warning', title: 'A 栋东门门禁异常', desc: '需上传整改照片', status: '待处理', page: 'workorder-list' }
    ],
    /* 消息 */
    messages: [
      { type: 'work', unread: true, icon: '派', cls: 'red', title: '新工单已派给您', desc: '工单 #2406003 · 紫华科技报修空调不制冷', time: '10:32' },
      { type: 'work', unread: true, icon: '巡', cls: 'blue', title: '巡检任务到点提醒', desc: 'B 栋 3 层消防设备巡检 · 计划 10:00', time: '10:00' },
      { type: 'work', unread: false, icon: '工', cls: 'red', title: '工单催办', desc: '工单 #2405998 已超 SLA 30 分钟', time: '昨天' },
      { type: 'notice', unread: false, icon: '系', cls: 'gray', title: '系统升级通知', desc: '6 月 8 日 0:00-2:00 系统维护', time: '06-01' }
    ]
  },

  finance: {
    id: 'finance',
    name: '财务',
    short: '财',
    user: '李慧敏',
    desc: '今日待收款、欠费催收、票据',
    focus: '催缴、记录流水',
    heroActions: [
      { icon: '催', label: '催费', page: 'fee-dunning-list' },
      { icon: '收', label: '录收款', page: 'fee-bill-list' },
      { icon: '析', label: '费用分析', page: 'fee-analysis' },
      { icon: '园', label: '园区分析', page: 'park-analysis' },
      { icon: '欠', label: '查欠费', page: 'fee-bill-list', params: { filter: 'owed' } }
    ],
    stats: [
      { label: '本月收缴率', value: 78, unit: '%', delta: '较上月 +5%', deltaType: 'up', color: 'success' },
      { label: '待收金额', value: '128.4', unit: '万', delta: '较上月 -8%', deltaType: 'up', color: 'info' },
      { label: '欠费单位', value: 12, unit: '家', delta: '其中 3 家催 3 次以上', deltaType: 'down', color: 'danger' },
      { label: '今日新增收款', value: '18.6', unit: '万', delta: '8 笔', deltaType: 'flat', color: 'warning' }
    ],
    modules: ['M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11'],
    moduleBadges: { M05: 12 },
    bizGroups: [
      { title: '收缴管理', items: ['M05'] },
      { title: '查看', items: ['M06', 'M07', 'M08', 'M11'] },
      { title: '办公', items: ['M09', 'M10'] }
    ],
    todos: [
      { icon: '欠', cls: 'danger', title: '紫华科技 物业费欠缴 3 期', desc: '欠 ¥86,200 · 已催 4 次未结', status: '待处理', page: 'fee-dunning-list' },
      { icon: '催', cls: 'warning', title: '联讯电子 二次催缴', desc: '上次电话未接 · 应再致电', status: '待处理', page: 'fee-dunning-list' },
      { icon: '票', cls: '', title: '宏达包装 6 月发票申请', desc: '应开 ¥42,800', status: '待处理', page: 'fee-bill-list' }
    ],
    messages: [
      { type: 'work', unread: true, icon: '回', cls: 'orange', title: '催缴回复 · 紫华科技', desc: '答应本周五前到账 · 备注查看详情', time: '14:20' },
      { type: 'audit', unread: true, icon: '到', cls: 'orange', title: '今日待收款 5 笔', desc: '合计 ¥218,400 · 涉及 5 家企业', time: '09:00' },
      { type: 'notice', unread: false, icon: '账', cls: 'blue', title: '6 月账单已生成', desc: '物业费 / 房租 / 其他 共 86 张', time: '06-01' }
    ]
  },

  manager: {
    id: 'manager',
    name: '经理',
    short: '经',
    user: '王建国',
    desc: '待我审批、园区异常、收入/满意度',
    focus: '审批、看板',
    heroActions: [
      { icon: '审', label: '待审批', page: 'form-list', params: { scope: 'pending' } },
      { icon: '析', label: '费用分析', page: 'fee-analysis' },
      { icon: '园', label: '园区分析', page: 'park-analysis' },
      { icon: '异', label: '异常工单', page: 'workorder-list', params: { filter: 'progress' } },
      { icon: '⌨', label: '扫一扫', toast: '扫码功能演示中' }
    ],
    stats: [
      { label: '待我审批', value: 14, unit: '项', delta: '其中 3 项紧急', deltaType: 'down', color: 'danger' },
      { label: '工单 SLA 异常', value: 4, unit: '单', delta: '较昨日 -2', deltaType: 'up', color: 'warning' },
      { label: '即将到期合同', value: 7, unit: '份', delta: '60 天内', deltaType: 'flat', color: 'info' },
      { label: '本月收缴率', value: 78, unit: '%', delta: '较上月 +5%', deltaType: 'up', color: 'success' }
    ],
    modules: ['M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11'],
    moduleBadges: { M07: 6, M09: 8 },
    bizGroups: [
      { title: '审批中心', items: ['M07', 'M09'] },
      { title: '园区运营', items: ['M03', 'M04', 'M05'] },
      { title: '查看与办公', items: ['M06', 'M08', 'M10', 'M11'] }
    ],
    todos: [
      { icon: '合', cls: 'danger', title: '合同审批 · 联讯电子续约', desc: '面积 380㎡ · 金额 ¥86 万/年', status: '待审批', page: 'form-list', params: { scope: 'pending' } },
      { icon: '单', cls: 'warning', title: '用印申请 · 法务部张敏', desc: '合同章 · 与新华印务签约', status: '待审批', page: 'form-list', params: { scope: 'pending' } },
      { icon: '工', cls: '', title: 'C 栋电梯故障 · 已超 SLA', desc: '工单 #2405991 · 处理中 4 小时', status: '待处理', page: 'workorder-list' }
    ],
    messages: [
      { type: 'audit', unread: true, icon: '合', cls: 'purple', title: '合同待审批 · 联讯电子续约', desc: '商务张华提交 · 已等待 2 小时', time: '11:15' },
      { type: 'audit', unread: true, icon: '单', cls: 'orange', title: '用印申请待审批', desc: '法务部张敏 · 公章 1 次', time: '10:48' },
      { type: 'work', unread: true, icon: '异', cls: 'red', title: 'C 栋电梯故障 SLA 超时', desc: '工单 #2405991 · 已超 30 分钟', time: '10:20' },
      { type: 'notice', unread: false, icon: '提', cls: 'blue', title: '合同到期提醒 60 天', desc: '宏达包装 租赁合同 8 月 5 日到期', time: '昨天' }
    ]
  },

  business: {
    id: 'business',
    name: '商务',
    short: '商',
    user: '张华',
    desc: '跟进客户、企业档案、续约提醒',
    focus: '续约、企业档案',
    heroActions: [
      { icon: '跟', label: '新跟进', page: 'company-list' },
      { icon: '合', label: '查合同', page: 'contract-list' },
      { icon: '续', label: '续约提醒', page: 'contract-renewal' },
      { icon: '企', label: '看企业', page: 'company-list' }
    ],
    stats: [
      { label: '跟进中企业', value: 18, unit: '家', delta: '本月新增 4', deltaType: 'up', color: 'info' },
      { label: '待签合同', value: 3, unit: '份', delta: '其中 1 份待客户确认', deltaType: 'flat', color: 'warning' },
      { label: '60 天内到期', value: 7, unit: '份', delta: '已联系 4 家', deltaType: 'down', color: 'danger' },
      { label: '本月续约率', value: 86, unit: '%', delta: '较上月 +12%', deltaType: 'up', color: 'success' }
    ],
    modules: ['M06', 'M07', 'M08', 'M09', 'M10'],
    moduleBadges: { M07: 7 },
    bizGroups: [
      { title: '客户与合同', items: ['M07', 'M08'] },
      { title: '查看', items: ['M06'] },
      { title: '办公', items: ['M09', 'M10'] }
    ],
    todos: [
      { icon: '续', cls: 'danger', title: '宏达包装 续约跟进', desc: '合同 8 月 5 日到期 · 客户未答复', status: '待处理', page: 'contract-renewal' },
      { icon: '签', cls: 'warning', title: '新签 · 启航软件 待客户盖章', desc: '面积 220㎡ · 已用印', status: '待处理', page: 'contract-list' },
      { icon: '跟', cls: '', title: '新跟进 · 海纳生物 意向 500㎡', desc: '约 6 月 7 日实地考察', status: '待处理', page: 'company-list' }
    ],
    messages: [
      { type: 'notice', unread: true, icon: '提', cls: 'red', title: '合同到期提醒 30 天', desc: '宏达包装 8 月 5 日到期 · 续约', time: '09:30' },
      { type: 'audit', unread: true, icon: '合', cls: 'purple', title: '合同审批结果', desc: '启航软件租赁合同 已通过', time: '昨天' },
      { type: 'notice', unread: false, icon: '提', cls: 'orange', title: '续约提醒 60 天', desc: '6 家企业合同将在 60 天内到期', time: '06-01' }
    ]
  },

  operator: {
    id: 'operator',
    name: '运营专员',
    short: '运',
    user: '陈静怡',
    desc: '园区综合视角(全只读)',
    focus: '看全局、办公协同',
    heroActions: [
      { icon: '板', label: '园区看板', toast: '园区看板功能演示中' },
      { icon: '巡', label: '巡检概览', page: 'inspection-summary' },
      { icon: '工', label: '工单概览', page: 'workorder-list' },
      { icon: '⌨', label: '扫一扫', toast: '扫码功能演示中' }
    ],
    stats: [
      { label: '今日工单', value: 23, unit: '单', delta: '已结 18 · 处理中 5', deltaType: 'flat', color: 'info' },
      { label: '今日巡检完成率', value: 94, unit: '%', delta: '较昨日 +2%', deltaType: 'up', color: 'success' },
      { label: '本月收缴率', value: 78, unit: '%', delta: '较上月 +5%', deltaType: 'up', color: 'success' },
      { label: '入驻率', value: 92, unit: '%', delta: '本月退租 1 家', deltaType: 'flat', color: 'warning' }
    ],
    modules: ['M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11'],
    moduleBadges: {},
    bizGroups: [
      { title: '园区运营(只读)', items: ['M03', 'M04', 'M05'] },
      { title: '台账查看(只读)', items: ['M06', 'M07', 'M08', 'M11'] },
      { title: '办公', items: ['M09', 'M10'] }
    ],
    /* 业务模块对运营专员标记 readonly */
    readonlyModules: ['M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M11'],
    todos: [
      { icon: '看', cls: '', title: '本周园区运营周报待发布', desc: '数据已就绪 · 待审核', status: '待处理', page: 'workorder-list' },
      { icon: '会', cls: '', title: '6 月运营例会议程草稿', desc: '6 月 5 日 14:00 · 大会议室', status: '待处理', page: 'meeting-list' }
    ],
    messages: [
      { type: 'notice', unread: true, icon: '日', cls: 'blue', title: '园区日报已生成', desc: '6 月 3 日 数据完整 · 点击查看', time: '08:00' },
      { type: 'notice', unread: false, icon: '提', cls: 'purple', title: '合同到期提醒 90 天', desc: '当月将有 12 家企业进入预警期', time: '06-01' }
    ]
  },

  staff: {
    id: 'staff',
    name: '普通员工',
    short: '员',
    user: '刘小峰',
    desc: '日常办公',
    focus: '单据 / 会议 / 自报工单',
    heroActions: [
      { icon: '单', label: '提交单据', page: 'form-new' },
      { icon: '会', label: '预定会议', page: 'meeting-book' },
      { icon: '修', label: '我的报修', page: 'workorder-list' },
      { icon: '审', label: '我的审批', page: 'form-list', params: { scope: 'mine' } }
    ],
    stats: [
      { label: '我的待办', value: 3, unit: '项', delta: '其中 1 项需审批', deltaType: 'down', color: 'danger' },
      { label: '我的会议', value: 2, unit: '场', delta: '今日 14:00 部门例会', deltaType: 'flat', color: 'info' },
      { label: '我发起单据', value: 5, unit: '单', delta: '已通过 3 · 待审 2', deltaType: 'flat', color: 'warning' },
      { label: '我的报修', value: 1, unit: '单', delta: '处理中', deltaType: 'flat', color: 'success' }
    ],
    modules: ['M08', 'M09', 'M10', 'M04'],
    moduleBadges: { M09: 2 },
    bizGroups: [
      { title: '日常办公', items: ['M09', 'M10'] },
      { title: '查看', items: ['M08', 'M04'] }
    ],
    todos: [
      { icon: '审', cls: 'danger', title: '审批 · 下属赵磊年假申请', desc: '6 月 10-12 日 · 共 3 天', status: '待审批', page: 'form-list', params: { scope: 'mine' } },
      { icon: '会', cls: '', title: '部门例会 · 今日 14:00', desc: '小会议室 · 已确认参加', status: '待处理', page: 'meeting-list' },
      { icon: '修', cls: '', title: '我报的工位灯不亮', desc: '工单 #2406008 · 处理中', status: '待处理', page: 'workorder-list' }
    ],
    messages: [
      { type: 'audit', unread: true, icon: '审', cls: 'orange', title: '请假审批 · 下属赵磊', desc: '6 月 10-12 日 年假 3 天', time: '15:08' },
      { type: 'work', unread: true, icon: '会', cls: 'purple', title: '会议邀请 · 部门例会', desc: '6 月 3 日 14:00 · 小会议室', time: '13:45' },
      { type: 'notice', unread: false, icon: '单', cls: 'blue', title: '您提交的报销已通过', desc: '差旅报销 ¥820 · 已转付款', time: '昨天' }
    ]
  }
};

/* ---------- 排序后的角色 ID 列表(用于切换器) ---------- */
const ROLE_ORDER = ['inspector', 'finance', 'manager', 'business', 'operator', 'staff'];
