// ========== 顶部导航栏渲染 ==========
function renderTopBar(title, opts = {}) {
  const { showBack = true, right = '' } = opts;
  return `
    <div class="topbar">
      ${showBack ? `<a href="javascript:history.back()" class="back" aria-label="返回">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </a>` : ''}
      <div class="title">${title}</div>
      <div class="right">${right}</div>
    </div>
  `;
}

// ========== 底部 TabBar 渲染（用户端：首页 / 我的）==========
const TAB_ITEMS = [
  { key: 'home', name: '首页', href: 'index.html', icon: '<path d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"></path>' },
  { key: 'me', name: '我的', href: 'profile.html', icon: '<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>' }
];

function renderTabBar(active) {
  return `
    <div class="tabbar">
      ${TAB_ITEMS.map(t => `
        <a href="${t.href}" class="tab ${t.key === active ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t.icon}</svg>
          <span>${t.name}</span>
        </a>
      `).join('')}
    </div>
  `;
}

// ========== Toast 提示 ==========
function showToast(msg, duration = 1800) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), duration);
}

// ========== Tab 切换 ==========
function bindTabs(container, onChange) {
  container.querySelectorAll('.tab-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.tab-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      onChange && onChange(item.dataset.value);
    });
  });
}

// ========== Chip 筛选切换 ==========
function bindChips(container, onChange) {
  container.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      onChange && onChange(chip.dataset.value);
    });
  });
}

// ========== 格式化金额 ==========
function formatMoney(n, withSign = true) {
  const v = Number(n) || 0;
  const s = v.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return withSign ? `¥${s}` : s;
}

// ========== 格式化日期 ==========
function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${day}`;
}

function formatDateTime(d) {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date)) return d;
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${day} ${h}:${min}`;
}

// ========== ECharts 通用配置 ==========
const CHART_COLORS = ['#1677ff', '#00b578', '#ff9500', '#ff4d4f', '#722ed1', '#13c2c2', '#eb2f96'];

function chartBaseOption() {
  return {
    textStyle: { fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif', fontSize: 12 },
    color: CHART_COLORS,
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.8)', textStyle: { color: '#fff', fontSize: 12 }, axisPointer: { type: 'shadow' } }
  };
}

// ========== 当前租户登录态 ==========
function getCurrentTenant() {
  const cached = localStorage.getItem('currentTenant');
  if (cached) {
    try { return JSON.parse(cached); } catch (e) {}
  }
  // 默认登录账号：蓝海科技 E01
  return MOCK.tenant;
}

function setCurrentTenant(t) {
  localStorage.setItem('currentTenant', JSON.stringify(t));
}

function clearTenant() {
  localStorage.removeItem('currentTenant');
}
