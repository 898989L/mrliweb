/* ============================================
 * 智慧园区员工端 · 主逻辑
 * ============================================ */

const state = {
  roleId: 'inspector',
  parkId: 'park1',
  tab: 'home',
  msgTab: 'all',
  subPage: null,
  subPageParams: null,
  pageStack: []
};

/* ---------- 工具 ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function getRole() {
  return ROLES[state.roleId];
}

function getPark() {
  return PARKS.find(p => p.id === state.parkId) || PARKS[0];
}

function tagColorByStatus(s) {
  const map = { 待审批: 'danger', 待处理: 'warning', 已完成: 'success', 待派单: 'danger', 待接单: 'warning', 处理中: 'info', 待回访: 'info', 已关单: 'success', 即将到期: 'warning', 生效中: 'success', 已到期: 'gray' };
  return map[s] || 'gray';
}

/* ============================================
 * 顶部 / 左侧 / 右侧渲染
 * ============================================ */

function renderAppBar() {
  const role = getRole();
  const park = getPark();
  $('#parkName').textContent = park.name;
  $('#roleTagTop').textContent = role.short;
  $('#roleNameTop').textContent = role.name;
}

function renderInfoPanel() {
  const role = getRole();
  $('#currentRoleAvatar').textContent = role.short;
  $('#currentRoleName').textContent = role.name;
  $('#currentRoleDesc').textContent = role.desc;
}

function renderLegend() {
  const ul = $('#legendList');
  ul.innerHTML = ROLE_ORDER.map(rid => {
    const r = ROLES[rid];
    const active = rid === state.roleId ? 'active' : '';
    return `
      <li class="${active}" data-role="${rid}">
        <div class="legend-avatar">${r.short}</div>
        <div>
          <div class="legend-name">${r.name}</div>
          <div class="legend-desc">${r.focus}</div>
        </div>
      </li>
    `;
  }).join('');
}

function updateMsgBadge() {
  const role = getRole();
  const unread = role.messages.filter(m => m.unread).length;
  const badge = document.querySelector('.tab-item[data-tab="message"] .tab-badge');
  if (!badge) return;
  if (unread > 0) {
    badge.textContent = unread;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

/* ============================================
 * Tab: 首页
 * ============================================ */

function renderHome() {
  const role = getRole();
  const html = `
    <div class="hero">
      <div class="hero-greet">早上好,</div>
      <div class="hero-name">${role.user} · ${role.name}</div>
      <div class="hero-actions">
        ${role.heroActions.map(a => `
          <button class="hero-action">
            <span class="ha-icon">${a.icon}</span>
            <span class="ha-label">${a.label}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">关键数据</div>
        <span class="section-more">查看更多</span>
      </div>
      <div class="stat-grid">
        ${role.stats.map(s => {
          const deltaCls = s.deltaType === 'up' ? 'up' : s.deltaType === 'down' ? 'down' : 'flat';
          return `
            <div class="stat-card ${s.color || ''}">
              <div class="stat-label">${s.label}</div>
              <div>
                <span class="stat-value">${s.value}</span>
                ${s.unit ? `<span class="stat-unit">${s.unit}</span>` : ''}
              </div>
              <div class="stat-delta ${deltaCls}">${s.delta || ''}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">常用模块</div>
        <span class="section-more">全部</span>
      </div>
      <div class="module-grid">
        ${role.modules.slice(0, 8).map(mid => {
          const m = MODULES[mid];
          const badge = role.moduleBadges && role.moduleBadges[mid];
          return `
            <button class="module-card" data-module="${mid}">
              <div class="module-icon ${m.color}">${m.icon}</div>
              <div class="module-label">${m.name}</div>
              ${badge ? `<i class="badge-num">${badge}</i>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">待办</div>
        <span class="section-more">全部 ${role.todos.length}</span>
      </div>
      <div class="todo-list">
        ${role.todos.map(t => `
          <div class="todo-item">
            <div class="todo-icon ${t.cls || ''}">${t.icon}</div>
            <div class="todo-text">
              <div class="todo-title">${t.title}</div>
              <div class="todo-desc">${t.desc}</div>
            </div>
            <span class="todo-status ${t.status}">${t.status}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="height: 16px"></div>
  `;
  $('#screenContent').innerHTML = html;
}

/* ============================================
 * Tab: 业务
 * ============================================ */

function renderBusiness() {
  const role = getRole();
  const readonly = role.readonlyModules || [];

  const renderBizItem = (mid) => {
    const m = MODULES[mid];
    const badge = role.moduleBadges && role.moduleBadges[mid];
    const isReadonly = readonly.includes(mid);
    return `
      <button class="biz-item ${isReadonly ? 'readonly' : ''}" data-module="${mid}">
        <div class="biz-icon module-icon ${m.color}">${m.icon}</div>
        <div class="biz-name">${m.name}</div>
        <div class="biz-desc">${m.desc}</div>
        ${badge ? `<span class="biz-badge">${badge}</span>` : ''}
      </button>
    `;
  };

  const html = `
    <div style="height: 8px"></div>
    ${role.bizGroups.map(g => `
      <div class="biz-section">
        <div class="biz-section-title">${g.title}</div>
        <div class="biz-list">
          ${g.items.map(renderBizItem).join('')}
        </div>
      </div>
    `).join('')}
    <div style="height: 24px"></div>
  `;
  $('#screenContent').innerHTML = html;
}

/* ============================================
 * Tab: 消息
 * ============================================ */

const MSG_TABS = [
  { id: 'all', label: '全部' },
  { id: 'audit', label: '待审批' },
  { id: 'work', label: '待办' },
  { id: 'notice', label: '通知' }
];

function renderMessage() {
  const role = getRole();
  const all = role.messages || [];
  const list = state.msgTab === 'all' ? all : all.filter(m => m.type === state.msgTab);

  const html = `
    <div class="msg-tabs">
      ${MSG_TABS.map(t => {
        const count = t.id === 'all' ? all.length : all.filter(m => m.type === t.id).length;
        const active = state.msgTab === t.id ? 'active' : '';
        return `<button class="msg-tab ${active}" data-msgtab="${t.id}">${t.label}${count > 0 ? ` ${count}` : ''}</button>`;
      }).join('')}
    </div>
    <div class="msg-list">
      ${list.length === 0 ? `
        <div class="empty">
          <div class="empty-icon">○</div>
          <div class="empty-text">暂无该类型消息</div>
        </div>
      ` : list.map(m => `
        <div class="msg-item ${m.unread ? 'unread' : ''}">
          <div class="msg-icon module-icon ${m.cls}">${m.icon}</div>
          <div class="msg-body">
            <div class="msg-header">
              <div class="msg-title">${m.title}</div>
              <div class="msg-time">${m.time}</div>
            </div>
            <div class="msg-desc">${m.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  $('#screenContent').innerHTML = html;
}

/* ============================================
 * Tab: 我的
 * ============================================ */

function renderMe() {
  const role = getRole();
  const park = getPark();
  const html = `
    <div class="me-header">
      <div class="me-profile">
        <div class="me-avatar">${role.short}</div>
        <div>
          <div class="me-name">${role.user}</div>
          <div class="me-role-badge">${role.name} · ${park.name}</div>
        </div>
      </div>
    </div>

    <div class="me-stats">
      <div class="me-stat">
        <div class="me-stat-value">${role.todos.length}</div>
        <div class="me-stat-label">待办</div>
      </div>
      <div class="me-stat">
        <div class="me-stat-value">${role.messages.filter(m => m.unread).length}</div>
        <div class="me-stat-label">未读消息</div>
      </div>
      <div class="me-stat">
        <div class="me-stat-value">${role.modules.length}</div>
        <div class="me-stat-label">可用模块</div>
      </div>
    </div>

    <div class="me-menu-group-title">账户</div>
    <div class="me-menu">
      <div class="me-menu-item" id="meSwitchRole">
        <div class="me-menu-icon">角</div>
        <div class="me-menu-label">切换角色</div>
        <div class="me-menu-extra">${role.name}</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item" id="meSwitchPark">
        <div class="me-menu-icon">园</div>
        <div class="me-menu-label">切换园区</div>
        <div class="me-menu-extra">${park.name}</div>
        <span class="me-menu-arrow">›</span>
      </div>
    </div>

    <div class="me-menu-group-title">业务</div>
    <div class="me-menu">
      <div class="me-menu-item">
        <div class="me-menu-icon">办</div>
        <div class="me-menu-label">我发起的单据</div>
        <div class="me-menu-extra">5 单</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item">
        <div class="me-menu-icon">会</div>
        <div class="me-menu-label">我的会议</div>
        <div class="me-menu-extra">2 场</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item">
        <div class="me-menu-icon">审</div>
        <div class="me-menu-label">我的审批</div>
        <div class="me-menu-extra">待审 ${role.todos.filter(t => t.status === '待审批').length}</div>
        <span class="me-menu-arrow">›</span>
      </div>
    </div>

    <div class="me-menu-group-title">设置</div>
    <div class="me-menu">
      <div class="me-menu-item">
        <div class="me-menu-icon">免</div>
        <div class="me-menu-label">消息免打扰</div>
        <div class="me-menu-extra">关</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item">
        <div class="me-menu-icon">字</div>
        <div class="me-menu-label">字体大小</div>
        <div class="me-menu-extra">标准</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item">
        <div class="me-menu-icon">清</div>
        <div class="me-menu-label">清除缓存</div>
        <div class="me-menu-extra">12.4 MB</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item">
        <div class="me-menu-icon">关</div>
        <div class="me-menu-label">关于</div>
        <div class="me-menu-extra">v1.0.0</div>
        <span class="me-menu-arrow">›</span>
      </div>
    </div>

    <div style="padding: 20px 12px;">
      <button style="width:100%; padding:14px; background:#fff; border-radius:10px; color:var(--c-danger); font-weight:600; box-shadow: var(--sh-sm);">退出登录</button>
    </div>
    <div style="height: 16px"></div>
  `;
  $('#screenContent').innerHTML = html;

  $('#meSwitchRole')?.addEventListener('click', openRoleModal);
  $('#meSwitchPark')?.addEventListener('click', openParkModal);
}

/* ============================================
 * Tab 切换
 * ============================================ */

function renderTab() {
  const t = state.tab;
  $$('.tab-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === t);
  });
  if (t === 'home') renderHome();
  else if (t === 'business') renderBusiness();
  else if (t === 'message') renderMessage();
  else if (t === 'me') renderMe();
  $('#screenContent').scrollTop = 0;
}

/* ============================================
 * 弹窗
 * ============================================ */

function openRoleModal() {
  const ul = $('#roleModalList');
  ul.innerHTML = ROLE_ORDER.map(rid => {
    const r = ROLES[rid];
    const active = rid === state.roleId ? 'active' : '';
    return `
      <li class="${active}" data-role="${rid}">
        <div class="role-card-avatar">${r.short}</div>
        <div>
          <div class="role-card-name">${r.name}</div>
          <div class="role-card-desc">${r.desc}</div>
        </div>
      </li>
    `;
  }).join('');
  $('#roleModal').hidden = false;
}

function openParkModal() {
  const ul = $('#parkModalList');
  ul.innerHTML = PARKS.map(p => {
    const active = p.id === state.parkId ? 'active' : '';
    return `
      <li class="${active}" data-park="${p.id}">
        <div class="role-card-avatar">${p.name.charAt(0)}</div>
        <div>
          <div class="role-card-name">${p.name}</div>
          <div class="role-card-desc">切换后数据将按此园区过滤</div>
        </div>
      </li>
    `;
  }).join('');
  $('#parkModal').hidden = false;
}

function closeAllModals() {
  $('#roleModal').hidden = true;
  $('#parkModal').hidden = true;
}

/* ============================================
 * 角色/园区切换
 * ============================================ */

function switchRole(rid) {
  if (!ROLES[rid] || rid === state.roleId) {
    closeAllModals();
    return;
  }
  state.roleId = rid;
  state.msgTab = 'all';
  state.subPage = null;
  state.subPageParams = null;
  state.pageStack = [];
  renderAppBar();
  renderInfoPanel();
  renderLegend();
  updateMsgBadge();
  renderTab();
  closeAllModals();
}

function switchPark(pid) {
  if (pid === state.parkId) {
    closeAllModals();
    return;
  }
  state.parkId = pid;
  state.subPage = null;
  state.subPageParams = null;
  state.pageStack = [];
  renderAppBar();
  renderTab();
  closeAllModals();
}

/* ============================================
 * 事件绑定
 * ============================================ */

function bindEvents() {
  // Tab 切换
  $('#tabBar').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-item');
    if (!btn) return;
    state.tab = btn.dataset.tab;
    state.subPage = null;
    state.subPageParams = null;
    state.pageStack = [];
    renderTab();
  });

  // 顶部角色切换
  $('#roleSwitcher').addEventListener('click', openRoleModal);
  $('#parkSwitcher').addEventListener('click', openParkModal);

  // 顶部消息入口
  $('#msgEntry').addEventListener('click', () => {
    state.tab = 'message';
    state.subPage = null;
    state.subPageParams = null;
    state.pageStack = [];
    renderTab();
  });

  // 弹窗内点击
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) {
      closeAllModals();
      return;
    }
    const roleItem = e.target.closest('[data-role]');
    if (roleItem && roleItem.closest('#roleModalList, #legendList')) {
      switchRole(roleItem.dataset.role);
      return;
    }
    const parkItem = e.target.closest('[data-park]');
    if (parkItem && parkItem.closest('#parkModalList')) {
      switchPark(parkItem.dataset.park);
      return;
    }
  });

  // 消息子 Tab(委托)
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-msgtab]');
    if (!t) return;
    state.msgTab = t.dataset.msgtab;
    renderMessage();
  });

  // ESC 关闭弹窗
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

/* ============================================
 * 启动
 * ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  renderAppBar();
  renderInfoPanel();
  renderLegend();
  updateMsgBadge();
  renderTab();
  bindEvents();
  bindSubPageEvents();
  bindModuleEntry();
});
