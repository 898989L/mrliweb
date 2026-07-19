/* ============================================
 * 智慧园区员工端 · 多页模式初始化 + 顶部导航
 * ============================================ */

/* ---------- 全局 state(从 localStorage 恢复) ---------- */
const state = {
  roleId: localStorage.getItem('roleId') || 'inspector',
  parkId: localStorage.getItem('parkId') || 'park1',
  subPage: null,
  subPageParams: null,
  pageStack: [],
  tab: 'home',
  msgTab: 'all'
};

/* ---------- 页面清单(用于顶部导航下拉) ---------- */
const PAGE_CATALOG = [
  { group: '主 Tab', items: [
    { id: 'home', name: '首页' },
    { id: 'business', name: '业务' },
    { id: 'message', name: '消息' },
    { id: 'me', name: '我的' }
  ]},
  { group: 'M03 巡检', items: [
    { id: 'inspection-list', name: '巡检任务列表' },
    { id: 'inspection-detail?id=i01', name: '巡检任务详情' },
    { id: 'inspection-execute?id=i01', name: '执行巡检' },
    { id: 'inspection-create', name: '新建巡检' },
    { id: 'inspection-summary', name: '巡检结果汇总' }
  ]},
  { group: 'M04 报修工单', items: [
    { id: 'workorder-list', name: '工单列表' },
    { id: 'workorder-detail?id=w01', name: '工单详情' },
    { id: 'workorder-create', name: '新建工单' }
  ]},
  { group: 'M05 费用', items: [
    { id: 'fee-dashboard', name: '费用中心' },
    { id: 'fee-analysis', name: '费用分析' },
    { id: 'fee-bill-list', name: '账单明细' },
    { id: 'fee-bill-detail?id=b01', name: '账单详情' },
    { id: 'fee-dunning-list', name: '催缴流水' }
  ]},
  { group: '园区分析', items: [
    { id: 'park-analysis', name: '园区周期分析(水电+费用)' }
  ]},
  { group: 'M06 水电', items: [
    { id: 'utility-dashboard', name: '水电总览' },
    { id: 'utility-analysis', name: '水电分析' },
    { id: 'utility-daily', name: '每日使用明细' },
    { id: 'utility-prepaid', name: '预缴管理' },
    { id: 'utility-company', name: '企业用量' },
    { id: 'utility-company-detail?id=c01', name: '企业用量详情' }
  ]},
  { group: 'M07 合同', items: [
    { id: 'contract-list', name: '合同列表' },
    { id: 'contract-detail?id=ct01', name: '合同详情' },
    { id: 'contract-create', name: '新建合同' },
    { id: 'contract-renewal', name: '续约提醒' }
  ]},
  { group: 'M08 企业入驻', items: [
    { id: 'company-list', name: '企业列表' },
    { id: 'company-detail?id=c01', name: '企业详情' }
  ]},
  { group: 'M09 OA', items: [
    { id: 'form-list', name: '单据列表' },
    { id: 'form-detail?id=f01', name: '单据详情' },
    { id: 'form-new', name: '新建单据' },
    { id: 'form-leave', name: '请假申请' },
    { id: 'form-expense', name: '报销申请' },
    { id: 'form-seal', name: '用印申请' }
  ]},
  { group: 'M10 会议', items: [
    { id: 'meeting-list', name: '会议列表' },
    { id: 'meeting-detail?id=m01', name: '会议详情' },
    { id: 'meeting-book', name: '预定会议' }
  ]},
  { group: 'M11 停车记录', items: [
    { id: 'parking-list', name: '停车记录' },
    { id: 'parking-detail?id=p01', name: '停车详情' }
  ]}
];

/* ---------- URL 解析 ---------- */
function parseUrlParams() {
  const out = {};
  const qs = new URLSearchParams(window.location.search);
  for (const [k, v] of qs) out[k] = v;
  return out;
}

/* ---------- 顶部导航注入 ---------- */
function injectTopNav() {
  const cur = (document.body.dataset.page || 'home') + (window.location.search || '');
  const roleId = state.roleId;
  const parkId = state.parkId;

  const nav = document.createElement('div');
  nav.className = 'top-nav';
  nav.innerHTML = `
    <div class="top-nav-inner">
      <a class="top-nav-brand" href="../index.html" title="回到主页">
        <span class="brand-mark">智</span>
        <span class="brand-text">智慧园区员工端 · 原型</span>
      </a>
      <div class="top-nav-controls">
        <label class="top-nav-field">
          <span>页面</span>
          <select class="top-nav-select" id="pageSelect">
            ${PAGE_CATALOG.map(g => `
              <optgroup label="${g.group}">
                ${g.items.map(it => {
                  const sel = it.id + (it.id.includes('?') ? '' : '') === cur.split('?')[0] ? 'selected' : '';
                  return `<option value="${it.id}" ${sel}>${it.name}</option>`;
                }).join('')}
              </optgroup>
            `).join('')}
          </select>
        </label>
        <label class="top-nav-field">
          <span>角色</span>
          <select class="top-nav-select" id="roleSelect">
            ${ROLE_ORDER.map(rid => `
              <option value="${rid}" ${rid === roleId ? 'selected' : ''}>${ROLES[rid].name} · ${ROLES[rid].user}</option>
            `).join('')}
          </select>
        </label>
        <label class="top-nav-field">
          <span>园区</span>
          <select class="top-nav-select" id="parkSelect">
            ${PARKS.map(p => `
              <option value="${p.id}" ${p.id === parkId ? 'selected' : ''}>${p.name}</option>
            `).join('')}
          </select>
        </label>
      </div>
    </div>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  /* 绑定选择事件 */
  document.getElementById('pageSelect').addEventListener('change', (e) => {
    const v = e.target.value;
    window.location.href = v.includes('?') ? v : (v + '.html');
  });
  document.getElementById('roleSelect').addEventListener('change', (e) => {
    localStorage.setItem('roleId', e.target.value);
    window.location.reload();
  });
  document.getElementById('parkSelect').addEventListener('change', (e) => {
    localStorage.setItem('parkId', e.target.value);
    window.location.reload();
  });
}

/* ---------- 同步当前 page 下拉项 ---------- */
function syncPageSelect() {
  const sel = document.getElementById('pageSelect');
  if (!sel) return;
  const cur = document.body.dataset.page;
  /* 设置 selected */
  for (const opt of sel.querySelectorAll('option')) {
    const optBase = opt.value.split('?')[0];
    if (optBase === cur) { opt.selected = true; break; }
  }
}

/* ---------- 渲染 App Bar(主 Tab 页面) ---------- */
function renderAppBar() {
  const bar = document.getElementById('appBar');
  if (!bar) return;
  const role = ROLES[state.roleId];
  const park = PARKS.find(p => p.id === state.parkId) || PARKS[0];
  const unread = role.messages.filter(m => m.unread).length;
  const showParkSwitcher = PARKS.length > 1;
  bar.innerHTML = `
    ${showParkSwitcher ? `
      <button class="park-switcher" type="button" id="parkSwitcher" title="切换园区">
        <span class="park-name">${park.name}</span>
        <span class="caret">▾</span>
      </button>
    ` : `
      <div class="park-switcher readonly" title="仅授权 1 个园区">
        <span class="park-name">${park.name}</span>
      </div>
    `}
    <button class="role-switcher" id="roleSwitcher" type="button" title="切换角色">
      <span class="role-tag">${role.short}</span>
      <span class="role-name-top">${role.name}</span>
    </button>
    <div class="app-bar-right">
      <button class="icon-btn" data-page="message" aria-label="消息">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C7 2 4 5 4 9v4l-2 3h20l-2-3V9c0-4-3-7-8-7z" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M9 19a3 3 0 0 0 6 0" stroke="currentColor" stroke-width="1.5"/></svg>
        ${unread > 0 ? '<i class="badge-dot"></i>' : ''}
      </button>
    </div>
  `;
}

/* ---------- 园区切换弹层 ---------- */

function injectParkModal() {
  if (document.getElementById('parkModal')) return;
  const div = document.createElement('div');
  div.className = 'modal';
  div.id = 'parkModal';
  div.hidden = true;
  div.innerHTML = `
    <div class="modal-mask" data-close></div>
    <div class="modal-panel">
      <div class="modal-header">
        <div class="modal-title">切换园区</div>
        <div class="modal-x" data-close>×</div>
      </div>
      <ul class="park-modal-list" id="parkModalList"></ul>
      <div class="modal-hint">切换后全端数据按新园区过滤</div>
    </div>
  `;
  document.body.appendChild(div);
}

function openParkSwitcher() {
  const ul = document.getElementById('parkModalList');
  if (!ul) return;
  ul.innerHTML = PARKS.map(p => {
    const active = p.id === state.parkId ? 'active' : '';
    return `
      <li class="${active}" data-park-pick="${p.id}">
        <div class="role-card-avatar">${p.name.charAt(0)}</div>
        <div>
          <div class="role-card-name">${p.name}</div>
          <div class="legend-desc">${p.id === state.parkId ? '当前园区' : '点击切换'}</div>
        </div>
      </li>
    `;
  }).join('');
  document.getElementById('parkModal').hidden = false;
}

function logParkSwitch(fromId, toId) {
  try {
    const raw = localStorage.getItem('parkSwitchLog') || '[]';
    const log = JSON.parse(raw);
    log.unshift({
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      from: fromId,
      to: toId
    });
    localStorage.setItem('parkSwitchLog', JSON.stringify(log.slice(0, 50)));
  } catch (e) { /* ignore */ }
}

function pickPark(pid) {
  if (!pid || pid === state.parkId) {
    document.getElementById('parkModal').hidden = true;
    return;
  }
  logParkSwitch(state.parkId, pid);
  localStorage.setItem('parkId', pid);
  document.getElementById('parkModal').hidden = true;
  showToast('已切换园区');
  setTimeout(() => window.location.reload(), 600);
}

/* ---------- 页面初始化入口 ---------- */
function initPage() {
  const page = document.body.dataset.page || 'home';
  const params = parseUrlParams();

  state.subPage = page;
  state.subPageParams = params;

  /* 注入顶部导航 */
  injectTopNav();
  syncPageSelect();

  /* 主 Tab 页面: 渲染 App Bar;子页面: 已有 sub-bar */
  renderAppBar();

  /* 注入园区切换弹层并绑定 click */
  if (PARKS.length > 1) {
    injectParkModal();
    const ps = document.getElementById('parkSwitcher');
    if (ps) ps.addEventListener('click', openParkSwitcher);
  }

  /* 渲染内容 */
  const fn = PAGE_RENDERERS[page];
  const contentEl = document.getElementById('content');
  if (contentEl) {
    if (fn) {
      contentEl.innerHTML = fn(params);
    } else {
      contentEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚙</div><div class="empty-state-text">页面 ${page} 未实现</div></div>`;
    }
  }

  /* 月份下拉触发器(支持 utility-dashboard / fee-dashboard / fee-analysis / park-analysis)— 必须在内容渲染后绑定 */
  const monthTrigger = document.getElementById('monthPickerTrigger');
  if (monthTrigger) {
    /* 根据当前页选择数据源 + 目标页 */
    let months, targetPage, defaultMonth;
    if (state.subPage === 'fee-dashboard' || state.subPage === 'fee-analysis' || state.subPage === 'park-analysis') {
      months = FEE.monthly;
      targetPage = state.subPage;
      defaultMonth = FEE.monthly[FEE.monthly.length - 1].month;
    } else {
      months = UTILITY.monthly;
      targetPage = 'utility-dashboard';
      defaultMonth = UTILITY.monthly[UTILITY.monthly.length - 1].month;
    }
    monthTrigger.addEventListener('click', () => {
      const cur = (state.subPageParams && state.subPageParams.month) || defaultMonth;
      openMonthPicker({
        months,
        current: cur,
        onPick: (picked) => {
          const params = Object.assign({}, state.subPageParams || {}, { month: picked });
          navigate(targetPage, params);
        }
      });
    });
  }

  /* 绑定交互 */
  bindSubPageEvents();
  bindModuleEntry();
}

document.addEventListener('DOMContentLoaded', initPage);
