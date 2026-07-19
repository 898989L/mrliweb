/* ============================================
 * 智慧园区员工端 · Mock 数据 (各模块详细列表)
 * ============================================ */

/* ---------- 入驻企业 ---------- */
const COMPANIES = [
  { id: 'c01', name: '紫华科技', industry: '互联网科技', credit: '91110108MA0Y2X3K8L',
    legal: '吴志伟', legalPhone: '138-0001-2345',
    principal: '吴志伟', principalPhone: '138-0001-2345',
    parkAgent: '罗主管', parkAgentPhone: '138-7000-9876',
    financeContact: '肖会计', financeContactPhone: '136-7000-0713',
    companyType: '承租企业', remark: '主营互联网科技、软件开发与服务,拟 2026 年 8 月合同到期续签。',
    scale: '100-200人',
    contact: '王经理', phone: '138-0000-1234', email: 'wang@zihua.com',
    building: 'A 栋 5 层', area: 480, startDate: '2023-08-15', endDate: '2026-08-14',
    status: 'active', feeStatus: 'overdue', overdueAmount: 86200, overduePeriods: 3 },

  { id: 'c02', name: '联讯电子', industry: '电子制造', credit: '91110108MA0X9K2J6T',
    legal: '李建华', scale: '50-100人',
    contact: '李总', phone: '139-0000-2345', email: 'li@lianxun.com',
    building: 'B 栋 7-8 层', area: 380, startDate: '2023-09-01', endDate: '2026-08-31',
    status: 'expiring', feeStatus: 'partial', overdueAmount: 22800, overduePeriods: 1 },

  { id: 'c03', name: '宏达包装', industry: '包装印刷', credit: '91110108MA0Z3L5N9P',
    legal: '陈宏达', scale: '20-50人',
    contact: '陈总', phone: '136-0000-3456', email: 'chen@hongda.com',
    building: 'C 栋 2 层', area: 220, startDate: '2023-08-05', endDate: '2026-08-04',
    status: 'expiring', feeStatus: 'ok', overdueAmount: 0, overduePeriods: 0 },

  { id: 'c04', name: '启航软件', industry: '软件开发', credit: '91110108MA0Y8M1Q4R',
    legal: '周启航', scale: '20-50人',
    contact: '周经理', phone: '137-0000-4567', email: 'zhou@qihang.com',
    building: 'A 栋 8 层', area: 220, startDate: '2024-03-01', endDate: '2027-02-28',
    status: 'active', feeStatus: 'ok', overdueAmount: 0, overduePeriods: 0 },

  { id: 'c05', name: '海纳生物', industry: '生物科技', credit: '91110108MA1A2B3C4D',
    legal: '黄海纳', scale: '50-100人',
    contact: '黄总', phone: '135-0000-5678', email: 'huang@haina.com',
    building: 'B 栋 4 层', area: 320, startDate: '2024-06-01', endDate: '2027-05-31',
    status: 'active', feeStatus: 'ok', overdueAmount: 0, overduePeriods: 0 },

  { id: 'c06', name: '正方咨询', industry: '管理咨询', credit: '91110108MA1E5F6G7H',
    legal: '方正', scale: '少于20人',
    contact: '方总', phone: '188-0000-6789', email: 'fang@zhengfang.com',
    building: 'A 栋 6 层 601', area: 120, startDate: '2024-12-01', endDate: '2026-11-30',
    status: 'expiring', feeStatus: 'overdue', overdueAmount: 18600, overduePeriods: 2 },

  { id: 'c07', name: '蓝海贸易', industry: '国际贸易', credit: '91110108MA1H8I9J0K',
    legal: '蓝海', scale: '20-50人',
    contact: '蓝经理', phone: '186-0000-7890', email: 'lan@lanhai.com',
    building: 'C 栋 3 层', area: 280, startDate: '2024-01-15', endDate: '2027-01-14',
    status: 'active', feeStatus: 'ok', overdueAmount: 0, overduePeriods: 0 },

  { id: 'c08', name: '云图设计', industry: '设计咨询', credit: '91110108MA2L1M2N3O',
    legal: '图云', scale: '少于20人',
    contact: '图总', phone: '185-0000-8901', email: 'tu@yuntu.com',
    building: 'A 栋 7 层 705', area: 90, startDate: '2025-03-01', endDate: '2027-02-28',
    status: 'active', feeStatus: 'ok', overdueAmount: 0, overduePeriods: 0 }
];

/* ---------- 巡检任务 ---------- */
const INSPECTIONS = [
  { id: 'i01', code: 'XJ-20260603-001', type: '日常安全',
    planTime: '2026-06-03 10:00', status: 'overdue', points: 8, doneCount: 0,
    location: 'B 栋 3 层', inspector: '张志强',
    items: [
      { name: '消防栓压力检查', need: ['结果', '照片'], result: null, photo: null, remark: '' },
      { name: '安全出口指示灯', need: ['结果', '照片'], result: null, photo: null, remark: '' },
      { name: '应急照明灯', need: ['结果'], result: null, photo: null, remark: '' },
      { name: '灭火器有效期', need: ['结果', '照片'], result: null, photo: null, remark: '' },
      { name: '消防通道畅通', need: ['结果', '照片'], result: null, photo: null, remark: '' },
      { name: '配电箱标识', need: ['结果'], result: null, photo: null, remark: '' },
      { name: '楼层门禁系统', need: ['结果'], result: null, photo: null, remark: '' },
      { name: '监控摄像头', need: ['结果'], result: null, photo: null, remark: '' }
    ] },

  { id: 'i02', code: 'XJ-20260603-002', type: '维保',
    planTime: '2026-06-03 14:00', status: 'pending', points: 6, doneCount: 0,
    location: 'A 栋设备机房', inspector: '张志强',
    items: [
      { name: '空调主机运行', need: ['结果', '照片'], result: null, photo: null, remark: '' },
      { name: '水泵压力表', need: ['结果'], result: null, photo: null, remark: '' },
      { name: '电梯机房温度', need: ['结果'], result: null, photo: null, remark: '' },
      { name: '配电系统', need: ['结果', '照片'], result: null, photo: null, remark: '' },
      { name: '弱电井缆线', need: ['结果'], result: null, photo: null, remark: '' },
      { name: '排水系统', need: ['结果'], result: null, photo: null, remark: '' }
    ] },

  { id: 'i03', code: 'XJ-20260603-003', type: '保安',
    planTime: '2026-06-03 22:00', status: 'pending', points: 12, doneCount: 0,
    location: '园区夜间巡逻', inspector: '保安队',
    items: [] },

  { id: 'i04', code: 'XJ-20260602-008', type: '日常安全',
    planTime: '2026-06-02 10:00', status: 'done', points: 8, doneCount: 8,
    location: 'A 栋 1-2 层', inspector: '张志强',
    abnormalCount: 1, items: [] },

  { id: 'i05', code: 'XJ-20260602-009', type: '维保',
    planTime: '2026-06-02 15:00', status: 'done', points: 5, doneCount: 5,
    location: 'C 栋设备', inspector: '张志强',
    abnormalCount: 0, items: [] },

  { id: 'i06', code: 'XJ-20260601-007', type: '日常安全',
    planTime: '2026-06-01 10:00', status: 'done', points: 8, doneCount: 8,
    location: 'B 栋 1-2 层', inspector: '张志强',
    abnormalCount: 2, items: [] }
];

/* ---------- 报修工单 ---------- */
const WORKORDERS = [
  { id: 'w01', code: 'GD-2406003', type: '空调',
    status: '处理中', urgent: 'high',
    company: '紫华科技', reporter: '王经理', phone: '138-0000-1234',
    location: 'A 栋 5 层 502', desc: '会议室空调不制冷已 2 天,影响开会',
    photos: 2, createTime: '2026-06-03 09:32',
    slaRemain: '已超 32 分', assignee: '张志强',
    source: 'tenant',
    history: [
      { time: '2026-06-03 09:32', actor: '王经理', action: '创建工单', desc: '会议室空调不制冷已 2 天' },
      { time: '2026-06-03 09:45', actor: '王建国', action: '派单', desc: '派给巡检员张志强' },
      { time: '2026-06-03 10:10', actor: '张志强', action: '接单', desc: '已接单,预计 30 分钟到达' }
    ] },

  { id: 'w02', code: 'GD-2406002', type: '水电',
    status: '待派单', urgent: 'mid',
    company: '联讯电子', reporter: '李工', phone: '139-0000-2345',
    location: 'B 栋 8 层 805', desc: '茶水间水龙头漏水',
    photos: 1, createTime: '2026-06-03 08:45',
    slaRemain: '3 小时 15 分', assignee: null,
    source: 'tenant',
    history: [{ time: '2026-06-03 08:45', actor: '李工', action: '创建工单', desc: '茶水间水龙头漏水' }] },

  { id: 'w03', code: 'GD-2406001', type: '弱电',
    status: '待接单', urgent: 'mid',
    company: '宏达包装', reporter: '陈总', phone: '136-0000-3456',
    location: 'C 栋 2 层 203', desc: '办公室网络断断续续',
    photos: 0, createTime: '2026-06-03 08:10',
    slaRemain: '3 小时 50 分', assignee: '张志强',
    source: 'tenant',
    history: [
      { time: '2026-06-03 08:10', actor: '陈总', action: '创建工单', desc: '办公室网络断断续续' },
      { time: '2026-06-03 08:20', actor: '王建国', action: '派单', desc: '派给巡检员张志强' }
    ] },

  { id: 'w04', code: 'GD-2405998', type: '门窗',
    status: '处理中', urgent: 'low',
    company: '启航软件', reporter: '周经理', phone: '137-0000-4567',
    location: 'A 栋 8 层 803', desc: '门把手松动',
    photos: 1, createTime: '2026-06-02 14:30',
    slaRemain: '已超 1 小时', assignee: '张志强',
    source: 'tenant',
    history: [
      { time: '2026-06-02 14:30', actor: '周经理', action: '创建工单', desc: '门把手松动' },
      { time: '2026-06-02 15:00', actor: '王建国', action: '派单', desc: '派给巡检员张志强' },
      { time: '2026-06-02 15:30', actor: '张志强', action: '接单', desc: '已接单' }
    ] },

  { id: 'w05', code: 'GD-2405991', type: '电梯',
    status: '处理中', urgent: 'high',
    company: '园区共用', reporter: '李慧敏', phone: '内部',
    location: 'C 栋 1 号电梯', desc: '电梯运行有异响,频繁停层',
    photos: 0, createTime: '2026-06-02 11:00',
    slaRemain: '已超 4 小时', assignee: '外部维保公司',
    source: 'inspection',
    history: [
      { time: '2026-06-02 11:00', actor: '巡检系统', action: '异常工单(巡检)', desc: '巡检发现电梯异响' },
      { time: '2026-06-02 11:15', actor: '王建国', action: '派单', desc: '派给外部维保公司' }
    ] },

  { id: 'w06', code: 'GD-2405987', type: '空调',
    status: '已关单', urgent: 'mid',
    company: '蓝海贸易', reporter: '蓝经理', phone: '186-0000-7890',
    location: 'C 栋 3 层 302', desc: '空调出风口异响',
    photos: 2, createTime: '2026-06-01 09:20',
    slaRemain: '-', assignee: '张志强',
    source: 'tenant', rating: 5,
    history: [
      { time: '2026-06-01 09:20', actor: '蓝经理', action: '创建工单', desc: '空调出风口异响' },
      { time: '2026-06-01 09:40', actor: '王建国', action: '派单', desc: '派给张志强' },
      { time: '2026-06-01 10:30', actor: '张志强', action: '接单' },
      { time: '2026-06-01 14:20', actor: '张志强', action: '处理完成', desc: '更换出风口滤网' },
      { time: '2026-06-01 16:30', actor: '蓝经理', action: '回访打分', desc: '5 星 · 处理及时' }
    ] }
];

/* ---------- 费用账单 ---------- */
const BILLS = [
  { id: 'b01', companyId: 'c01', company: '紫华科技', period: '2026-04', type: '物业费', shouldPay: 28800, paid: 0, owed: 28800, status: '欠费' },
  { id: 'b02', companyId: 'c01', company: '紫华科技', period: '2026-05', type: '物业费', shouldPay: 28800, paid: 0, owed: 28800, status: '欠费' },
  { id: 'b03', companyId: 'c01', company: '紫华科技', period: '2026-06', type: '物业费', shouldPay: 28800, paid: 0, owed: 28800, status: '欠费' },
  { id: 'b04', companyId: 'c02', company: '联讯电子', period: '2026-Q2', type: '房租', shouldPay: 215000, paid: 192200, owed: 22800, status: '部分缴' },
  { id: 'b05', companyId: 'c03', company: '宏达包装', period: '2026-06', type: '物业费', shouldPay: 13200, paid: 13200, owed: 0, status: '已结清' },
  { id: 'b06', companyId: 'c04', company: '启航软件', period: '2026-Q2', type: '房租', shouldPay: 124000, paid: 124000, owed: 0, status: '已结清' },
  { id: 'b07', companyId: 'c06', company: '正方咨询', period: '2026-05', type: '物业费', shouldPay: 7200, paid: 0, owed: 7200, status: '欠费' },
  { id: 'b08', companyId: 'c06', company: '正方咨询', period: '2026-06', type: '其他', shouldPay: 11400, paid: 0, owed: 11400, status: '欠费' }
];

/* ---------- 费用月度汇总(2025-07 ~ 2026-06,12 月) ----------
   2026-06 与 BILLS 总额一致(应收 457,200 / 已收 329,400 / 待收 127,800)
   其余月份为历史参考值(收缴率在 70%~82% 区间) */
const FEE = {
  monthly: [
    { month: '2025-07', shouldPay: 380000, paid: 280000, owed: 100000 },
    { month: '2025-08', shouldPay: 410000, paid: 320000, owed: 90000 },
    { month: '2025-09', shouldPay: 395000, paid: 305000, owed: 90000 },
    { month: '2025-10', shouldPay: 380000, paid: 295000, owed: 85000 },
    { month: '2025-11', shouldPay: 370000, paid: 290000, owed: 80000 },
    { month: '2025-12', shouldPay: 360000, paid: 285000, owed: 75000 },
    { month: '2026-01', shouldPay: 350000, paid: 280000, owed: 70000 },
    { month: '2026-02', shouldPay: 345000, paid: 275000, owed: 70000 },
    { month: '2026-03', shouldPay: 380000, paid: 300000, owed: 80000 },
    { month: '2026-04', shouldPay: 420000, paid: 330000, owed: 90000 },
    { month: '2026-05', shouldPay: 450000, paid: 350000, owed: 100000 },
    { month: '2026-06', shouldPay: 457200, paid: 329400, owed: 127800 }
  ]
};

/* ---------- 合同 ---------- */
const CONTRACTS = [
  { id: 'ct01', code: 'HT-2026-0603-001',
    company: '联讯电子', type: '租赁合同',
    startDate: '2026-09-01', endDate: '2029-08-31',
    amount: 860000, payment: '季付',
    status: '待审批',
    building: 'B 栋 7-8 层', area: 380,
    signer: '李建华',
    submitBy: '张华', submitTime: '2026-06-03 11:15',
    daysToExpire: null,
    pdf: { fileName: '联讯电子-租赁合同-HT-2026-0603-001.pdf', size: '1.2 MB', pages: 4 },
    history: [
      { time: '2026-06-03 11:15', actor: '张华', action: '提交审批', desc: '续约合同,租期 3 年' }
    ] },

  { id: 'ct02', code: 'HT-2023-0815-001',
    company: '紫华科技', type: '租赁合同',
    startDate: '2023-08-15', endDate: '2026-08-14',
    amount: 720000, payment: '季付',
    status: '即将到期',
    building: 'A 栋 5 层', area: 480,
    signer: '吴志伟', daysToExpire: 72,
    submitBy: '张华', submitTime: '2023-08-10',
    pdf: { fileName: '紫华科技-租赁合同-HT-2023-0815-001.pdf', size: '986 KB', pages: 4 },
    history: [
      { time: '2023-08-10', actor: '张华', action: '提交审批' },
      { time: '2023-08-12', actor: '王建国', action: '审批通过' },
      { time: '2023-08-15', actor: '吴志伟', action: '签约' }
    ] },

  { id: 'ct03', code: 'HT-2023-0805-002',
    company: '宏达包装', type: '租赁合同',
    startDate: '2023-08-05', endDate: '2026-08-04',
    amount: 264000, payment: '季付',
    status: '即将到期',
    building: 'C 栋 2 层', area: 220,
    signer: '陈宏达', daysToExpire: 62,
    submitBy: '张华', submitTime: '2023-07-30',
    pdf: { fileName: '宏达包装-租赁合同-HT-2023-0805-002.pdf', size: '754 KB', pages: 3 },
    history: [] },

  { id: 'ct04', code: 'HT-2024-0301-003',
    company: '启航软件', type: '租赁合同',
    startDate: '2024-03-01', endDate: '2027-02-28',
    amount: 660000, payment: '季付',
    status: '生效中',
    building: 'A 栋 8 层', area: 220,
    signer: '周启航', daysToExpire: 270,
    pdf: { fileName: '启航软件-租赁合同-HT-2024-0301-003.pdf', size: '1.1 MB', pages: 4 },
    history: [] },

  { id: 'ct05', code: 'HT-2024-1201-005',
    company: '正方咨询', type: '租赁合同',
    startDate: '2024-12-01', endDate: '2026-11-30',
    amount: 144000, payment: '半年付',
    status: '即将到期',
    building: 'A 栋 6 层 601', area: 120,
    signer: '方正', daysToExpire: 180,
    pdf: { fileName: '正方咨询-租赁合同-HT-2024-1201-005.pdf', size: '622 KB', pages: 3 },
    history: [] },

  { id: 'ct06', code: 'HT-2024-0115-004',
    company: '蓝海贸易', type: '租赁合同',
    startDate: '2024-01-15', endDate: '2027-01-14',
    amount: 336000, payment: '季付',
    status: '生效中',
    building: 'C 栋 3 层', area: 280,
    signer: '蓝海', daysToExpire: 225,
    pdf: { fileName: '蓝海贸易-租赁合同-HT-2024-0115-004.pdf', size: '880 KB', pages: 3 },
    history: [] }
];

/* ---------- OA ---------- */
const FORMS = [
  { id: 'f01', type: '请假', applicant: '赵磊', dept: '客服部',
    submitTime: '2026-06-03 15:08', status: '待审批',
    detail: { leaveType: '年假', startDate: '2026-06-10 09:00', endDate: '2026-06-12 18:00', days: 3, reason: '家中有事处理' },
    flow: [
      { node: '申请人', actor: '赵磊', time: '2026-06-03 15:08', action: '提交', done: true },
      { node: '直属上级', actor: '刘小峰', time: null, action: null, done: false, current: true }
    ] },

  { id: 'f02', type: '报销', applicant: '王芳', dept: '商务部',
    submitTime: '2026-06-03 11:20', status: '待审批',
    detail: { reimType: '差旅报销', amount: 1820, invoiceCount: 5, reason: '客户拜访 - 上海 6 月 1-2 日', account: '招商银行尾号 8801' },
    flow: [
      { node: '申请人', actor: '王芳', time: '2026-06-03 11:20', action: '提交', done: true },
      { node: '直属上级', actor: '张华', time: '2026-06-03 13:00', action: '通过', done: true },
      { node: '财务', actor: '李慧敏', time: null, action: null, done: false, current: true }
    ] },

  { id: 'f03', type: '用印', applicant: '张敏', dept: '法务部',
    submitTime: '2026-06-03 10:48', status: '待审批',
    detail: { sealType: '合同章', count: 1, fileName: '与新华印务合作合同.pdf', reason: '与新华印务签订年度合作合同' },
    flow: [
      { node: '申请人', actor: '张敏', time: '2026-06-03 10:48', action: '提交', done: true },
      { node: '直属上级', actor: '法务总监', time: '2026-06-03 11:00', action: '通过', done: true },
      { node: '经理', actor: '王建国', time: null, action: null, done: false, current: true }
    ] },

  { id: 'f04', type: '请假', applicant: '刘小峰', dept: '运营部',
    submitTime: '2026-06-01 14:00', status: '已通过',
    detail: { leaveType: '病假', startDate: '2026-06-02 09:00', endDate: '2026-06-02 18:00', days: 1, reason: '感冒发烧' },
    flow: [
      { node: '申请人', actor: '刘小峰', time: '2026-06-01 14:00', action: '提交', done: true },
      { node: '直属上级', actor: '陈静怡', time: '2026-06-01 14:30', action: '通过', done: true }
    ] },

  { id: 'f05', type: '报销', applicant: '刘小峰', dept: '运营部',
    submitTime: '2026-05-30 17:00', status: '已通过',
    detail: { reimType: '日常报销', amount: 820, invoiceCount: 3, reason: '部门活动物料', account: '招商银行尾号 6012' },
    flow: [] }
];

/* ---------- 会议 ---------- */
const MEETINGS = [
  { id: 'm01', title: '部门例会', creator: '刘小峰',
    startTime: '2026-06-03 14:00', endTime: '2026-06-03 15:00',
    room: '小会议室', agenda: '本周工作汇报与下周计划',
    status: '即将开始',
    attendees: [
      { name: '刘小峰', status: '已确认' },
      { name: '张志强', status: '已确认' },
      { name: '赵磊', status: '请假' },
      { name: '王芳', status: '待确认' }
    ] },

  { id: 'm02', title: '6 月运营例会', creator: '陈静怡',
    startTime: '2026-06-05 14:00', endTime: '2026-06-05 16:00',
    room: '大会议室', agenda: '5 月运营数据复盘 / 6 月重点工作',
    status: '即将开始',
    attendees: [
      { name: '陈静怡', status: '已确认' },
      { name: '王建国', status: '已确认' },
      { name: '李慧敏', status: '已确认' },
      { name: '张华', status: '待确认' },
      { name: '刘小峰', status: '待确认' }
    ] },

  { id: 'm03', title: '联讯电子续约谈判', creator: '张华',
    startTime: '2026-06-04 10:00', endTime: '2026-06-04 11:30',
    room: '商务洽谈室', agenda: '续约价格 / 期限 / 增项',
    status: '即将开始',
    attendees: [
      { name: '张华', status: '已确认' },
      { name: '王建国', status: '已确认' }
    ] },

  { id: 'm04', title: '5 月月会', creator: '王建国',
    startTime: '2026-05-30 14:00', endTime: '2026-05-30 16:00',
    room: '大会议室', agenda: '月度复盘',
    status: '已结束',
    attendees: [] }
];

/* ---------- 停车记录 ---------- */
const PARKING = [
  { id: 'p01', plate: '京A·12345', type: '月卡', companyId: 'c01', company: '紫华科技',
    space: 'A-012', enterTime: '2026-06-03 08:23', leaveTime: null,
    duration: '进行中 4h12m', payStatus: '进行中', fee: 0, paid: 0 },
  { id: 'p02', plate: '京B·N3826', type: '临时', companyId: null, company: '外来访客',
    space: 'B-031', enterTime: '2026-06-03 08:45', leaveTime: null,
    duration: '进行中 3h50m', payStatus: '进行中', fee: 19, paid: 0 },
  { id: 'p03', plate: '京C·8H218', type: '月卡', companyId: 'c02', company: '联讯电子',
    space: 'A-005', enterTime: '2026-06-03 09:02', leaveTime: '2026-06-03 11:30',
    duration: '2h28m', payStatus: '已缴费', fee: 0, paid: 0 },
  { id: 'p04', plate: '京A·77S62', type: '临时', companyId: null, company: '外来访客',
    space: 'B-042', enterTime: '2026-06-03 09:15', leaveTime: null,
    duration: '进行中 3h20m', payStatus: '进行中', fee: 17, paid: 0 },
  { id: 'p05', plate: '京E·K2381', type: '免费', companyId: 'c08', company: '云图设计',
    space: 'C-018', enterTime: '2026-06-03 10:00', leaveTime: '2026-06-03 12:15',
    duration: '2h15m', payStatus: '免费', fee: 0, paid: 0 },
  { id: 'p06', plate: '京F·V5829', type: '临时', companyId: null, company: '外来访客',
    space: 'B-055', enterTime: '2026-06-03 10:32', leaveTime: '2026-06-03 14:20',
    duration: '3h48m', payStatus: '欠费', fee: 19, paid: 0 },
  { id: 'p07', plate: '京A·52138', type: '月卡', companyId: 'c04', company: '启航软件',
    space: 'A-021', enterTime: '2026-06-03 11:10', leaveTime: null,
    duration: '进行中 1h25m', payStatus: '进行中', fee: 0, paid: 0 },
  { id: 'p08', plate: '京G·86Q21', type: '临时', companyId: 'c07', company: '蓝海贸易',
    space: 'B-066', enterTime: '2026-06-03 11:45', leaveTime: '2026-06-03 13:00',
    duration: '1h15m', payStatus: '已缴费', fee: 8, paid: 8 },
  { id: 'p09', plate: '京A·12345', type: '月卡', companyId: 'c01', company: '紫华科技',
    space: 'A-012', enterTime: '2026-06-02 08:20', leaveTime: '2026-06-02 18:40',
    duration: '10h20m', payStatus: '已缴费', fee: 0, paid: 0 },
  { id: 'p10', plate: '京B·N3826', type: '月卡', companyId: 'c02', company: '联讯电子',
    space: 'B-031', enterTime: '2026-06-02 08:55', leaveTime: '2026-06-02 18:30',
    duration: '9h35m', payStatus: '已缴费', fee: 0, paid: 0 }
];

/* ---------- 水电数据 ---------- */
const UTILITY = {
  summary: {
    water: { current: 23800, delta: -3, unit: '吨' },
    electric: { current: 158600, delta: 5, unit: '度' },
    updateAt: '2026-06-03 02:00'
  },
  monthly: [
    { month: '2025-07', water: 19800, electric: 138000, prepaid: 142000 },
    { month: '2025-08', water: 21200, electric: 152000, prepaid: 156000 },
    { month: '2025-09', water: 20100, electric: 142000, prepaid: 148000 },
    { month: '2025-10', water: 19500, electric: 136000, prepaid: 140000 },
    { month: '2025-11', water: 18800, electric: 132000, prepaid: 138000 },
    { month: '2025-12', water: 18200, electric: 138000, prepaid: 142000 },
    { month: '2026-01', water: 17600, electric: 144000, prepaid: 146000 },
    { month: '2026-02', water: 16800, electric: 128000, prepaid: 134000 },
    { month: '2026-03', water: 19500, electric: 141000, prepaid: 148000 },
    { month: '2026-04', water: 21800, electric: 149000, prepaid: 162000 },
    { month: '2026-05', water: 24500, electric: 151000, prepaid: 165000 },
    { month: '2026-06', water: 23800, electric: 158600, prepaid: 168000 }
  ],
  byCompany: [
    { id: 'c01', name: '紫华科技', water: 1820, electric: 12860, waterFee: 7280, elecFee: 9645, deltaWater: 5, deltaElec: -2, prepaidBalance: 3260, prepaidAt: '2026-05-08' },
    { id: 'c02', name: '联讯电子', water: 1620, electric: 18200, waterFee: 6480, elecFee: 13650, deltaWater: 2, deltaElec: 8, prepaidBalance: 12480, prepaidAt: '2026-05-15' },
    { id: 'c03', name: '宏达包装', water: 980, electric: 22800, waterFee: 3920, elecFee: 17100, deltaWater: -3, deltaElec: 12, prepaidBalance: 820, prepaidAt: '2026-05-20' },
    { id: 'c04', name: '启航软件', water: 720, electric: 6800, waterFee: 2880, elecFee: 5100, deltaWater: 0, deltaElec: -5, prepaidBalance: 5460, prepaidAt: '2026-05-22' },
    { id: 'c05', name: '海纳生物', water: 2200, electric: 24000, waterFee: 8800, elecFee: 18000, deltaWater: 8, deltaElec: 15, prepaidBalance: 6400, prepaidAt: '2026-05-28' },
    { id: 'c06', name: '正方咨询', water: 320, electric: 2800, waterFee: 1280, elecFee: 2100, deltaWater: -2, deltaElec: 0, prepaidBalance: 0, prepaidAt: '2026-04-30' },
    { id: 'c07', name: '蓝海贸易', water: 850, electric: 8200, waterFee: 3400, elecFee: 6150, deltaWater: 1, deltaElec: -1, prepaidBalance: 2850, prepaidAt: '2026-05-10' },
    { id: 'c08', name: '云图设计', water: 280, electric: 2200, waterFee: 1120, elecFee: 1650, deltaWater: 0, deltaElec: 3, prepaidBalance: 1820, prepaidAt: '2026-05-25' }
  ],
  /* 每日明细:近 30 天(2026-05-05 ~ 2026-06-03),每条含园区总量 + 8 家企业用量 */
  daily: (() => {
    const out = [];
    /* 以本月(2026-06)前 2 天的累计水 23800、电 158600 倒推得到每日均值 */
    const startDate = new Date('2026-05-05');
    const today = new Date('2026-06-03');
    /* 简单确定性伪随机(基于公司 id + dayIndex)避免每次刷新都变 */
    const seed = (n) => {
      let x = Math.sin(n * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    /* 各公司月总量,按 30 天分摊(简单分摊) */
    const companies = [
      { id: 'c01', name: '紫华科技', water: 1820, electric: 12860 },
      { id: 'c02', name: '联讯电子', water: 1620, electric: 18200 },
      { id: 'c03', name: '宏达包装', water: 980, electric: 22800 },
      { id: 'c04', name: '启航软件', water: 720, electric: 6800 },
      { id: 'c05', name: '海纳生物', water: 2200, electric: 24000 },
      { id: 'c06', name: '正方咨询', water: 320, electric: 2800 },
      { id: 'c07', name: '蓝海贸易', water: 850, electric: 8200 },
      { id: 'c08', name: '云图设计', water: 280, electric: 2200 }
    ];
    let i = 0;
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dayStr = d.toISOString().slice(0, 10);
      /* 周末整体使用量更高一些 */
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      const weekendFactor = isWeekend ? 1.15 : 1;
      const cList = companies.map(c => {
        const factor = 0.7 + seed(i * 11 + c.id.charCodeAt(1) * 7) * 0.6;
        return {
          id: c.id,
          name: c.name,
          water: Math.round(c.water / 30 * weekendFactor * factor * 10) / 10,
          electric: Math.round(c.electric / 30 * weekendFactor * factor * 10) / 10
        };
      });
      const totalWater = cList.reduce((s, x) => s + x.water, 0);
      const totalElec = cList.reduce((s, x) => s + x.electric, 0);
      out.push({
        date: dayStr,
        weekday: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        water: Math.round(totalWater * 10) / 10,
        electric: Math.round(totalElec * 10) / 10,
        waterFee: Math.round(totalWater * 4 * 100) / 100,
        elecFee: Math.round(totalElec * 0.75 * 100) / 100,
        companies: cList
      });
      i++;
    }
    return out;
  })()
};

/* ---------- 催缴流水 ---------- */
const DUNNING_LOGS = [
  { id: 'd01', companyId: 'c01', company: '紫华科技', operator: '李慧敏',
    time: '2026-06-02 14:30', method: '电话', response: '答应本周内', status: '已联系' },
  { id: 'd02', companyId: 'c01', company: '紫华科技', operator: '李慧敏',
    time: '2026-05-25 10:15', method: '消息', response: '未回应', status: '已发送' },
  { id: 'd03', companyId: 'c01', company: '紫华科技', operator: '李慧敏',
    time: '2026-05-18 09:20', method: '电话', response: '接通,推说资金紧张', status: '已联系' },
  { id: 'd04', companyId: 'c02', company: '联讯电子', operator: '李慧敏',
    time: '2026-05-30 16:00', method: '电话', response: '未接', status: '未接通' },
  { id: 'd05', companyId: 'c06', company: '正方咨询', operator: '李慧敏',
    time: '2026-05-28 11:10', method: '消息', response: '答应处理', status: '已发送' }
];

/* ---------- 全局可变状态(用于演示状态变更) ---------- */
const RUNTIME = {
  toast: null,
  /* 已变更的工单状态(本会话内) */
  workorderOverrides: {},
  /* 已审批合同 */
  contractOverrides: {},
  /* 已审批单据 */
  formOverrides: {},
  /* 新增催缴流水 */
  newDunningLogs: [],
  /* 已完成巡检项 */
  inspectionItemResults: {}
};
