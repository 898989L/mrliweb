import fs from 'fs'

const p = 'src/data/projects.ts'
let s = fs.readFileSync(p, 'utf8')
s = s.replace(/\n{3,}/g, '\n\n')

const packs = {
  'jnpf-community': `scenes: [
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
      ]`,
  'park-admin': `scenes: [
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
      ]`,
  'park-staff': `scenes: [
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
      ]`,
  'park-enterprise': `scenes: [
        { id: 'login', label: '登录', src: '/demos/park-enterprise/login.html' },
        { id: 'home', label: '企业首页', src: '/demos/park-enterprise/index.html' },
        { id: 'fees', label: '企业费用', src: '/demos/park-enterprise/company-fees.html' },
        { id: 'info', label: '入驻信息', src: '/demos/park-enterprise/company-info.html' },
        { id: 'water', label: '水电列表', src: '/demos/park-enterprise/water-list.html' },
        { id: 'chart', label: '用量图表', src: '/demos/park-enterprise/water-chart.html' },
        { id: 'notice', label: '通知公告', src: '/demos/park-enterprise/notifications.html' },
        { id: 'profile', label: '个人中心', src: '/demos/park-enterprise/profile.html' },
        { id: 'register', label: '注册绑定', src: '/demos/park-enterprise/register.html' },
      ]`,
}

for (const [id, scenes] of Object.entries(packs)) {
  const re = new RegExp(`(id: '${id}'[\\s\\S]*?)scenes: \\[[\\s\\S]*?\\]`)
  if (!re.test(s)) {
    console.log('MISS', id)
    continue
  }
  s = s.replace(re, `$1${scenes}`)
  console.log('OK', id)
}

// Add react demo scenes after hint for projects without scenes
const reactScenePacks = {
  'jnpf-gov': `scenes: [
        { id: 'flow', label: '流程待办', reactId: 'jnpf-gov' },
        { id: 'designer', label: '表单设计器', reactId: 'jnpf-gov-designer' },
        { id: 'bpmn', label: 'BPMN 流程', reactId: 'jnpf-gov-bpmn' },
        { id: 'perm', label: '权限配置', reactId: 'jnpf-gov-perm' },
        { id: 'inte', label: '集成连通', reactId: 'jnpf-gov-inte' },
      ],
`,
  'jnpf-event': `scenes: [
        { id: 'dash', label: '态势总览', reactId: 'jnpf-event' },
        { id: 'map', label: '地图模式', reactId: 'jnpf-event-map' },
        { id: 'work', label: '工单处理', reactId: 'jnpf-event-work' },
        { id: 'stats', label: '统计分析', reactId: 'jnpf-event-stats' },
      ],
`,
  'tally-book': `scenes: [
        { id: 'home', label: '账单首页', reactId: 'tally-book' },
        { id: 'add', label: '记一笔', reactId: 'tally-book-add' },
        { id: 'chart', label: '消费分析', reactId: 'tally-book-chart' },
      ],
`,
  'legal-ui': `scenes: [
        { id: 'list', label: '案件列表', reactId: 'legal-ui' },
        { id: 'detail', label: '案件详情', reactId: 'legal-ui-detail' },
        { id: 'dossier', label: '电子卷宗', reactId: 'legal-ui-dossier' },
      ],
`,
  'dossier': `scenes: [
        { id: 'query', label: '卷宗查询', reactId: 'dossier' },
        { id: 'make', label: '卷宗制作', reactId: 'dossier-make' },
        { id: 'scan', label: '扫描入库', reactId: 'dossier-scan' },
      ],
`,
  'zxzj': `scenes: [
        { id: 'proj', label: '项目群', reactId: 'zxzj' },
        { id: 'bug', label: '缺陷跟踪', reactId: 'zxzj-bug' },
        { id: 'daily', label: '日报中心', reactId: 'zxzj-daily' },
      ],
`,
  'renyixuan': `scenes: [
        { id: 'list', label: '发现民宿', reactId: 'renyixuan' },
        { id: 'detail', label: '房源详情', reactId: 'renyixuan-detail' },
        { id: 'order', label: '预约下单', reactId: 'renyixuan-order' },
      ],
`,
}

for (const [id, block] of Object.entries(reactScenePacks)) {
  // skip if already has scenes inside this project demo
  const chunkMatch = s.match(new RegExp(`id: '${id}'[\\s\\S]{0,1200}?demo: \\{[\\s\\S]{0,800}?\\}`))
  const hasScenes = new RegExp(`id: '${id}'[\\s\\S]{0,2000}?scenes:`).test(s)
  if (hasScenes && id !== 'jnpf-gov' && id !== 'jnpf-event') {
    // jnpf-gov/event currently no scenes
  }
  if (new RegExp(`id: '${id}'[\\s\\S]{0,2500}?scenes:`).test(s)) {
    console.log('skip existing scenes', id)
    continue
  }
  const re = new RegExp(`(id: '${id}'[\\s\\S]*?hint: '[^']*',\\n)`)
  if (!re.test(s)) {
    console.log('no hint for', id)
    continue
  }
  s = s.replace(re, `$1${block}`)
  console.log('inject scenes', id)
}

fs.writeFileSync(p, s)
console.log('done')
