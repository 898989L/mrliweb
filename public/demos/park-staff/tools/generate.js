/* ============================================
 * 智慧园区员工端 · HTML 页面批量生成器
 * 一次性生成 33 个独立 HTML 文件
 * ============================================ */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'pages');

/* ---------- 页面清单(必须和 init.js 的 PAGE_CATALOG 一致) ---------- */
const PAGES = [
  /* 主 Tab */
  { id: 'home', title: '首页', showAppBar: true },
  { id: 'business', title: '业务', showAppBar: true },
  { id: 'message', title: '消息', showAppBar: true },
  { id: 'me', title: '我的', showAppBar: true },

  /* M03 巡检 */
  { id: 'inspection-list', title: '巡检任务', showAppBar: false },
  { id: 'inspection-detail', title: '巡检任务详情', showAppBar: false, defaultId: 'i01' },
  { id: 'inspection-execute', title: '执行巡检', showAppBar: false, defaultId: 'i01' },
  { id: 'inspection-create', title: '新建巡检', showAppBar: false },

  /* M04 工单 */
  { id: 'workorder-list', title: '报修工单', showAppBar: false },
  { id: 'workorder-detail', title: '工单详情', showAppBar: false, defaultId: 'w01' },
  { id: 'workorder-create', title: '新建工单', showAppBar: false },

  /* M05 费用 */
  { id: 'fee-dashboard', title: '费用中心', showAppBar: false },
  { id: 'fee-bill-list', title: '账单明细', showAppBar: false },
  { id: 'fee-bill-detail', title: '账单详情', showAppBar: false, defaultId: 'b01' },
  { id: 'fee-dunning-list', title: '催缴流水', showAppBar: false },

  /* M06 水电 */
  { id: 'utility-dashboard', title: '水电总览', showAppBar: false },
  { id: 'utility-company', title: '企业用量', showAppBar: false },
  { id: 'utility-company-detail', title: '企业用量详情', showAppBar: false, defaultId: 'c01' },

  /* M07 合同 */
  { id: 'contract-list', title: '合同管理', showAppBar: false },
  { id: 'contract-detail', title: '合同详情', showAppBar: false, defaultId: 'ct01' },
  { id: 'contract-create', title: '新建合同', showAppBar: false },

  /* M08 企业 */
  { id: 'company-list', title: '入驻企业', showAppBar: false },
  { id: 'company-detail', title: '企业详情', showAppBar: false, defaultId: 'c01' },

  /* M09 单据 */
  { id: 'form-list', title: 'OA', showAppBar: false },
  { id: 'form-detail', title: '单据详情', showAppBar: false, defaultId: 'f01' },
  { id: 'form-new', title: '新建单据', showAppBar: false },
  { id: 'form-leave', title: '请假申请', showAppBar: false },
  { id: 'form-expense', title: '报销申请', showAppBar: false },
  { id: 'form-seal', title: '用印申请', showAppBar: false },

  /* M10 会议 */
  { id: 'meeting-list', title: '会议管理', showAppBar: false },
  { id: 'meeting-detail', title: '会议详情', showAppBar: false, defaultId: 'm01' },
  { id: 'meeting-book', title: '预定会议', showAppBar: false },

  /* M11 停车 */
  { id: 'parking-list', title: '停车记录', showAppBar: false }
];

/* ---------- HTML 模板 ---------- */
function pageTemplate({ id, title, showAppBar }) {
  const appBarStyle = showAppBar ? '' : 'style="display:none"';
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} · 智慧园区员工端</title>
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/layout.css">
  <link rel="stylesheet" href="../css/components.css">
  <link rel="stylesheet" href="../css/pages.css">
  <link rel="stylesheet" href="../css/nav.css">
</head>
<body data-page="${id}">
  <div class="stage">
    <div class="phone-frame">
      <div class="phone-notch"></div>
      <div class="phone-screen">
        <div class="status-bar">
          <span class="status-time">9:41</span>
          <span class="status-icons">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none"><rect x="0" y="6" width="3" height="4" fill="currentColor"/><rect x="4" y="4" width="3" height="6" fill="currentColor"/><rect x="8" y="2" width="3" height="8" fill="currentColor"/><rect x="12" y="0" width="3" height="10" fill="currentColor"/></svg>
            <span class="signal-text">4G</span>
            <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="18" height="9" rx="2" stroke="currentColor"/><rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor"/><rect x="19" y="3" width="2" height="4" rx="1" fill="currentColor"/></svg>
          </span>
        </div>
        <header class="app-bar" id="appBar" ${appBarStyle}></header>
        <main class="screen-content" id="content"></main>
      </div>
    </div>
  </div>

  <script src="../js/data.js"></script>
  <script src="../js/data-detail.js"></script>
  <script src="../js/renderers.js"></script>
  <script src="../js/init.js"></script>
</body>
</html>
`;
}

/* ---------- 生成 ---------- */
if (!fs.existsSync(PAGES_DIR)) fs.mkdirSync(PAGES_DIR, { recursive: true });

let count = 0;
for (const p of PAGES) {
  const file = path.join(PAGES_DIR, p.id + '.html');
  fs.writeFileSync(file, pageTemplate(p), 'utf8');
  count++;
}

console.log(`已生成 ${count} 个 HTML 文件到 ${PAGES_DIR}`);
