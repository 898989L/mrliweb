// ========== 用户端 Mock 数据中心 ==========
// 视角：单个租户企业（蓝海科技有限公司）

const MOCK = {
  // 当前登录租户（默认账号，登录时可切换）
  tenant: {
    id: 'E01',
    name: '蓝海科技有限公司',
    shortName: '蓝海科技',
    credit: '91310115MA1K3X1234',
    park: '智慧科技园 A 区',
    parkId: 'P01',
    room: 'A-301',
    area: 320,
    type: '办公',
    industry: '软件与信息技术',
    applicant: '李建国',
    role: '法定代表人',
    phone: '136****8801',
    phoneFull: '13688018801',
    email: 'li.jianguo@blueocean.com',
    moveIn: '2024-08-15',
    contractEnd: '2027-08-14',
    headcount: 45,
    avatar: '蓝',
    status: 'active'
  },

  // 当月水电用量
  utilityCurrent: {
    period: '2026-06',
    water: 128,                  // 吨
    electricity: 1850,            // 度
    waterFee: 460.80,
    electricityFee: 1295.00,
    total: 1755.80,
    waterPrev: 142,              // 上月对比
    electricityPrev: 1980,
    waterUnit: 3.60,             // 元/吨
    electricityUnit: 0.70        // 元/度
  },

  // 预存账户（余额扣减制）
  utilityAccount: {
    balance: 2580.50,            // 当前余额
    lowBalanceThreshold: 500,    // 预警阈值
    totalRecharged: 12000,       // 累计充值
    totalDeducted: 9419.50,      // 累计扣减
    lastRechargeTime: '2026-05-28 14:32',
    lastRechargeAmount: 2000
  },

  // 月度扣减记录（每月 1 日 09:00 自动从余额扣减）
  utilityDeductions: [
    { id: 'D202605', period: '2026-05', water: 142, electricity: 1980, waterFee: 511.20, electricityFee: 1386.00, total: 1897.20, deductedAt: '2026-06-01 09:00', balanceAfter: 2580.50, status: 'done' },
    { id: 'D202604', period: '2026-04', water: 138, electricity: 1920, waterFee: 496.80, electricityFee: 1344.00, total: 1840.80, deductedAt: '2026-05-01 09:00', balanceAfter: 2678.40, status: 'done' },
    { id: 'D202603', period: '2026-03', water: 124, electricity: 1750, waterFee: 446.40, electricityFee: 1225.00, total: 1671.40, deductedAt: '2026-04-01 09:00', balanceAfter: 2637.80, status: 'done' },
    { id: 'D202602', period: '2026-02', water: 118, electricity: 1620, waterFee: 424.80, electricityFee: 1134.00, total: 1558.80, deductedAt: '2026-03-01 09:00', balanceAfter: 2728.90, status: 'done' },
    { id: 'D202601', period: '2026-01', water: 136, electricity: 1820, waterFee: 489.60, electricityFee: 1274.00, total: 1763.60, deductedAt: '2026-02-01 09:00', balanceAfter: 2492.00, status: 'done' },
    { id: 'D202512', period: '2025-12', water: 110, electricity: 1580, waterFee: 396.00, electricityFee: 1106.00, total: 1502.00, deductedAt: '2026-01-01 09:00', balanceAfter: 2329.40, status: 'done' }
  ],

  // 充值记录
  rechargeHistory: [
    { id: 'R20260528', amount: 2000, time: '2026-05-28 14:32', method: '微信支付', balanceBefore: 1680.50, balanceAfter: 3680.50, status: 'success' },
    { id: 'R20260502', amount: 3000, time: '2026-05-02 10:15', method: '对公转账', balanceBefore: 1687.80, balanceAfter: 4687.80, status: 'success' },
    { id: 'R20260401', amount: 1000, time: '2026-04-01 12:08', method: '支付宝', balanceBefore: 1637.80, balanceAfter: 2637.80, status: 'success' }
  ],

  // 6 个月趋势（蓝海科技单租户）
  utilityTrend: {
    months: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'],
    water: [136, 118, 124, 138, 142, 128],
    electricity: [1820, 1620, 1750, 1920, 1980, 1850],
    waterFee: [489.60, 424.80, 446.40, 496.80, 511.20, 460.80],
    electricityFee: [1274.00, 1134.00, 1225.00, 1344.00, 1386.00, 1295.00]
  },

  // 当月每日用量（用于折线图明细）
  utilityDaily: {
    days: ['06-01','06-02','06-03','06-04','06-05','06-06','06-07','06-08','06-09','06-10',
           '06-11','06-12','06-13','06-14','06-15','06-16','06-17','06-18','06-19','06-20',
           '06-21','06-22','06-23','06-24','06-25','06-26','06-27','06-28','06-29','06-30'],
    water:       [4.2,4.5,4.1,4.3,4.6,3.8,3.5,4.4,4.7,4.5,4.2,4.0,3.9,4.3,4.6,4.5,4.4,4.2,4.0,3.8,4.1,4.3,4.5,4.7,4.4,4.2,4.0,3.9,4.1,4.3],
    electricity: [62,68,71,65,70,52,48,66,72,68,64,58,55,67,73,70,68,64,60,55,62,66,70,75,68,64,60,56,62,68]
  },

  // 当月费用账单（仅租金 + 物业，水电走预存扣减）
  feeBillsCurrent: {
    period: '2026-06',
    rent: 16000,
    property: 1920,
    other: 0,
    total: 17920,
    paid: 17920,
    unpaid: 0,
    status: 'paid',
    dueDate: '2026-06-15',
    invoicedItems: ['rent', 'property']
  },

  // 历史月度账单
  feeBillsHistory: [
    { period: '2026-06', rent: 16000, property: 1920, total: 17920, status: 'paid', paidTime: '2026-06-02 10:32', invoicedItems: ['rent'] },
    { period: '2026-05', rent: 16000, property: 1920, total: 17920, status: 'paid', paidTime: '2026-05-05 14:18', invoicedItems: ['rent', 'property'] },
    { period: '2026-04', rent: 16000, property: 1920, total: 17920, status: 'paid', paidTime: '2026-04-08 09:42', invoicedItems: [] },
    { period: '2026-03', rent: 16000, property: 1920, total: 17920, status: 'paid', paidTime: '2026-04-02 11:50', invoicedItems: ['rent', 'property'] },
    { period: '2026-02', rent: 16000, property: 1920, total: 17920, status: 'paid', paidTime: '2026-03-04 16:08', invoicedItems: [] },
    { period: '2026-01', rent: 16000, property: 1920, total: 17920, status: 'paid', paidTime: '2026-02-03 10:25', invoicedItems: ['rent'] }
  ],

  // 缴费类型分布（图表用，仅租金 + 物业）
  feeDistribution: [
    { name: '租金', value: 96000 },
    { name: '物业费', value: 11520 }
  ],

  // 开票申请记录
  invoiceApplications: [
    { id: 'INV20260505', period: '2026-05', items: ['rent', 'property'], amount: 17920, type: '专票', title: '蓝海科技有限公司', status: 'issued', applyTime: '2026-05-08 10:15' }
  ],

  // 开票科目定义
  invoiceItemMap: {
    rent: { label: '租金', key: 'rent' },
    property: { label: '物业费', key: 'property' }
  },

  // 通知（租户视角）
  notifications: [
    { id: 'N01', title: '本月消防演练将于 6 月 15 日进行', time: '2026-06-02 10:20', tag: '公告', read: false, summary: '请贵公司员工积极参与，演练前 1 小时发布撤离通知。本次演练涉及范围：A 区全栋。', content: '尊敬的园区企业：\n\n本月消防演练定于 2026 年 6 月 15 日（周一）14:00-15:30 举行，涉及 A 区全栋办公楼。\n\n请各企业员工：\n1. 接到撤离指令后按疏散路线有序撤离\n2. 前往 A 栋门口集合点集合\n3. 演练期间电梯停运\n4. 演练结束后听从指引返回办公区\n\n如有疑问请联系物业服务中心 021-12345678。\n\n智慧科技园物业管理处\n2026-06-02' },
    { id: 'N02', title: 'A 区电梯保养通知', time: '2026-06-01 17:00', tag: '提醒', read: false, summary: 'A 区客梯将于 6 月 8 日 9:00-12:00 进行月度保养，届时 1 号电梯停运。', content: '尊敬的 A 区企业：\n\nA 区 1 号客梯将于 2026 年 6 月 8 日（周日）9:00-12:00 进行月度保养，期间停运。\n2 号客梯、货梯正常运行。\n\n如对您工作造成不便，敬请谅解。' },
    { id: 'N03', title: '园区夏季用电高峰提醒', time: '2026-05-30 14:30', tag: '通知', read: true, summary: '夏季用电高峰即将到来，请贵公司错峰用电，合理控制空调温度不低于 26℃。', content: '夏季用电高峰即将到来，请各企业：\n1. 合理设置空调温度，建议不低于 26℃\n2. 下班前关闭非必要电源\n3. 错峰用电，减少 14:00-17:00 高峰段大功率设备同时运行' },
    { id: 'N04', title: '5 月物业费账单已生成', time: '2026-05-28 09:00', tag: '账单', read: true, summary: '贵公司 5 月份账单已生成，金额 ¥17,920.00，请于 6 月 15 日前完成缴费（水电已从预存账户扣减）。', content: '尊敬的蓝海科技有限公司：\n\n您的 5 月份账单已生成：\n• 租金：¥16,000.00\n• 物业费：¥1,920.00\n合计：¥17,920.00\n\n提示：水电费已从预存账户自动扣减 ¥1,897.20，余额充足。\n\n请于 6 月 15 日前完成租金物业费缴费。可在【我的费用】页面查看明细。' },
    { id: 'N05', title: 'A 区 1 楼大厅空调维护', time: '2026-05-25 16:20', tag: '提醒', read: true, summary: 'A 区 1 楼大厅空调将于本周六进行维护，预计停机 4 小时（9:00-13:00）。', content: 'A 区 1 楼大厅中央空调将于 5 月 31 日（周六）9:00-13:00 进行维护，期间停机。维护完成后立即恢复运行。给您带来不便敬请谅解。' },
    { id: 'N06', title: '园区门禁系统升级公告', time: '2026-05-20 11:00', tag: '公告', read: true, summary: '园区门禁系统将于 5 月 28 日升级，原门禁卡继续可用，新增手机扫码通行。', content: '园区门禁系统将于 5 月 28 日完成升级：\n• 原门禁卡继续有效\n• 新增手机微信扫码通行功能\n• 访客可通过员工二维码邀请入园\n\n升级过程中可能出现 30 分钟门禁不可用，请知悉。' }
  ],

  // 合同信息
  contract: {
    id: 'CT001',
    name: 'A-301 办公租赁合同',
    type: '租赁合同',
    start: '2024-08-15',
    end: '2027-08-14',
    monthlyRent: 16000,
    deposit: 48000,
    paymentTerm: '月付（每月 5 日前）',
    signTime: '2024-08-10',
    party: '智慧科技园物业管理处',
    status: 'active'
  },

  // 状态映射
  statusMap: {
    paid: { text: '已缴费', class: 'success' },
    unpaid: { text: '待缴费', class: 'warning' },
    partial: { text: '部分缴费', class: 'primary' },
    overdue: { text: '已逾期', class: 'danger' },
    active: { text: '生效中', class: 'success' },
    expiring: { text: '即将到期', class: 'warning' },
    expired: { text: '已到期', class: 'danger' }
  },

  // 通知标签颜色
  tagClassMap: {
    '公告': 'primary',
    '提醒': 'warning',
    '通知': 'info',
    '账单': 'danger'
  },

  // 注册时可选行业
  industryOptions: [
    '软件与信息技术', '电子科技制造', '生物医药', '新能源', '智能制造',
    '文化创意', '电子商务', '现代物流', '金融服务', '咨询服务', '其他'
  ],

  // 注册时可选园区
  parkOptions: [
    { id: 'P01', name: '智慧科技园 A 区' },
    { id: 'P02', name: '智慧科技园 B 区' },
    { id: 'P03', name: '智慧科技园 C 区' }
  ]
};

// 便捷函数
function getUnreadCount() {
  return MOCK.notifications.filter(n => !n.read).length;
}

function getNotificationById(id) {
  return MOCK.notifications.find(n => n.id === id);
}

function getBillByPeriod(period) {
  return MOCK.feeBillsHistory.find(b => b.period === period);
}

function getUtilityBillByPeriod(period) {
  return MOCK.utilityDeductions.find(b => b.period === period);
}

function getDeductionById(id) {
  return MOCK.utilityDeductions.find(d => d.id === id);
}

function getRechargeById(id) {
  return MOCK.rechargeHistory.find(r => r.id === id);
}

function rechargeAccount(amount, method) {
  const acc = MOCK.utilityAccount;
  const before = acc.balance;
  acc.balance = +(before + amount).toFixed(2);
  acc.totalRecharged = +(acc.totalRecharged + amount).toFixed(2);
  acc.lastRechargeAmount = amount;
  acc.lastRechargeTime = new Date().toLocaleString('zh-CN');
  MOCK.rechargeHistory.unshift({
    id: 'R' + Date.now(),
    amount,
    time: acc.lastRechargeTime,
    method,
    balanceBefore: before,
    balanceAfter: acc.balance,
    status: 'success'
  });
  return acc.balance;
}

function submitInvoice(period, items, type) {
  const bill = MOCK.feeBillsHistory.find(b => b.period === period);
  if (!bill) return null;
  const amount = items.reduce((s, k) => s + (bill[k] || 0), 0);
  const id = 'INV' + Date.now();
  const app = { id, period, items: items.slice(), amount, type, title: MOCK.tenant.name, status: 'pending', applyTime: new Date().toLocaleString('zh-CN') };
  MOCK.invoiceApplications.unshift(app);
  bill.invoicedItems = (bill.invoicedItems || []).concat(items);
  return app;
}

// 根据月度扣减总量生成每日明细（确定性 mock，含表底数累计）
function getDailyUsage(period, type) {
  const deduction = MOCK.utilityDeductions.find(d => d.period === period);
  if (!deduction) return [];
  const total = type === 'water' ? deduction.water : deduction.electricity;
  const price = type === 'water' ? MOCK.utilityCurrent.waterUnit : MOCK.utilityCurrent.electricityUnit;
  const [y, m] = period.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const seed = y * 100 + m;
  const isWater = type === 'water';
  const fixed = isWater ? 1 : 0;
  // 基准表底数（每月一个固定起点，让相邻月份也衔接得上）
  const base = isWater
    ? +(12000 + (seed % 100) + 0.1 * (seed % 10)).toFixed(1)
    : 95000 + (seed * 13 % 1000);
  const data = [];
  let sum = 0;
  let cum = base;
  for (let i = 1; i <= daysInMonth; i++) {
    const variation = Math.sin((seed + i) * 0.5) * 0.25 + Math.cos((seed + i * 2) * 0.3) * 0.15;
    const baseVal = (total / daysInMonth) * (1 + variation);
    const val = isWater ? +baseVal.toFixed(1) : Math.round(baseVal);
    const start = +cum.toFixed(fixed);
    cum += val;
    const end = +cum.toFixed(fixed);
    data.push({ day: i, start, end, value: val, fee: +(val * price).toFixed(2) });
    sum += val;
  }
  // 调整最后一天使合计精确等于月度总量
  const diff = total - sum;
  if (data.length) {
    const last = data[data.length - 1];
    last.value += diff;
    if (isWater) last.value = +last.value.toFixed(1);
    last.end = +(last.start + last.value).toFixed(fixed);
    last.fee = +(last.value * price).toFixed(2);
  }
  return data;
}
