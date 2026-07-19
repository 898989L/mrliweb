/* ============================================
 * 智慧园区员工端 · 二级页 + 路由 + 交互
 * ============================================ */

/* ---------- 状态扩展(由 app.js 在 init 时合并) ---------- */
/* state.subPage, state.subPageParams, state.pageStack */

/* ---------- 页面渲染器注册表 ---------- */
const PAGE_RENDERERS = {};

/* ============================================
 * 工具: Toast / Action Sheet
 * ============================================ */

function showToast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 1800);
}

function openActionSheet({ title, items, onPick }) {
  const old = document.querySelector('.action-sheet');
  if (old) old.remove();
  const sheet = document.createElement('div');
  sheet.className = 'action-sheet';
  sheet.innerHTML = `
    <div class="action-sheet-mask" data-sheet-close></div>
    <div class="action-sheet-panel">
      <div class="action-sheet-title">${title || '请选择'}</div>
      <div class="action-sheet-list">
        ${items.map((it, i) => `
          <div class="action-sheet-item ${it.cls || ''}" data-sheet-pick="${i}">${it.label}</div>
        `).join('')}
        <div class="action-sheet-item cancel" data-sheet-close>取消</div>
      </div>
    </div>
  `;
  document.body.appendChild(sheet);
  sheet.addEventListener('click', (e) => {
    if (e.target.dataset.sheetClose !== undefined) { sheet.remove(); return; }
    const idx = e.target.dataset.sheetPick;
    if (idx !== undefined) {
      const picked = items[+idx];
      sheet.remove();
      onPick && onPick(picked);
    }
  });
}

function confirmAction(message) {
  return new Promise((resolve) => {
    const old = document.querySelector('.action-sheet');
    if (old) old.remove();
    const sheet = document.createElement('div');
    sheet.className = 'action-sheet';
    sheet.innerHTML = `
      <div class="action-sheet-mask" data-cancel></div>
      <div class="action-sheet-panel">
        <div class="action-sheet-title" style="margin-top:6px;">${message}</div>
        <div class="action-sheet-list">
          <div class="action-sheet-item danger" data-ok>确定</div>
          <div class="action-sheet-item cancel" data-cancel>取消</div>
        </div>
      </div>
    `;
    document.body.appendChild(sheet);
    sheet.addEventListener('click', (e) => {
      const ok = e.target.dataset.ok !== undefined;
      sheet.remove();
      resolve(ok);
    });
  });
}

function promptText({ title, placeholder, defaultValue = '' }) {
  return new Promise((resolve) => {
    const old = document.querySelector('.action-sheet');
    if (old) old.remove();
    const sheet = document.createElement('div');
    sheet.className = 'action-sheet';
    sheet.innerHTML = `
      <div class="action-sheet-mask" data-cancel></div>
      <div class="action-sheet-panel">
        <div class="action-sheet-title">${title || '请输入'}</div>
        <div style="padding: 0 0 12px;">
          <textarea class="form-textarea" data-input placeholder="${placeholder || ''}" style="min-height: 80px;">${defaultValue}</textarea>
        </div>
        <div class="action-sheet-list">
          <div class="action-sheet-item" data-ok style="background:var(--c-primary);color:#fff;">确定</div>
          <div class="action-sheet-item cancel" data-cancel>取消</div>
        </div>
      </div>
    `;
    document.body.appendChild(sheet);
    sheet.addEventListener('click', (e) => {
      if (e.target.dataset.cancel !== undefined) { sheet.remove(); resolve(null); return; }
      if (e.target.dataset.ok !== undefined) {
        const val = sheet.querySelector('[data-input]').value.trim();
        sheet.remove();
        resolve(val);
      }
    });
  });
}

/* ============================================
 * 子页通用: 头部 sub-bar + 内容
 * ============================================ */

function subPageShell(title, content, rightHtml = '') {
  return `
    <div class="sub-bar">
      <button class="sub-back" data-back aria-label="返回">‹</button>
      <div class="sub-title">${title}</div>
      <div class="sub-right">${rightHtml}</div>
    </div>
    ${content}
  `;
}

function emptyState(text) {
  return `<div class="empty-state"><div class="empty-state-icon">○</div><div class="empty-state-text">${text}</div></div>`;
}

/* ============================================
 * 路由: navigate / back
 * ============================================ */

function navigate(pageId, params = {}) {
  if (!PAGE_RENDERERS[pageId]) {
    showToast(`页面 ${pageId} 未实现`);
    return;
  }
  /* 权限校验: 运营专员 readonlyModules 不可写 */
  const role = ROLES[state.roleId];
  if (role.readonlyModules && role.readonlyModules.length) {
    /* 进入模块前对写操作页面做拦截,详情/查看型页面可进 */
    const writePages = ['workorder-create', 'form-new', 'meeting-book', 'form-leave', 'form-expense', 'form-seal'];
    if (writePages.includes(pageId)) {
      showToast('运营专员无操作权限');
      return;
    }
  }
  state.pageStack.push({ subPage: state.subPage, subPageParams: state.subPageParams });
  state.subPage = pageId;
  state.subPageParams = params;
  renderContent();
}

function back() {
  if (state.pageStack.length === 0) {
    state.subPage = null;
    state.subPageParams = null;
  } else {
    const prev = state.pageStack.pop();
    state.subPage = prev.subPage;
    state.subPageParams = prev.subPageParams;
  }
  renderContent();
}

function renderContent() {
  if (state.subPage) {
    const fn = PAGE_RENDERERS[state.subPage];
    const html = fn ? fn(state.subPageParams) : '';
    $('#screenContent').innerHTML = html;
  } else {
    renderTab();
    return;
  }
  $('#screenContent').scrollTop = 0;
}

/* ============================================
 * 工具: 获取 RUNTIME-aware 工单/合同/单据
 * ============================================ */

function getWorkorder(id) {
  return WORKORDERS.find(w => w.id === id);
}

function getContract(id) {
  return CONTRACTS.find(c => c.id === id);
}

function getForm(id) {
  return FORMS.find(f => f.id === id);
}

function getInspection(id) {
  return INSPECTIONS.find(i => i.id === id);
}

function getCompany(id) {
  return COMPANIES.find(c => c.id === id);
}

function getBill(id) {
  return BILLS.find(b => b.id === id);
}

function getMeeting(id) {
  return MEETINGS.find(m => m.id === id);
}

function getWOStatus(id) {
  return RUNTIME.workorderOverrides[id] || null;
}

function getCtStatus(id) {
  return RUNTIME.contractOverrides[id] || null;
}

function getFormStatus(id) {
  return RUNTIME.formOverrides[id] || null;
}

/* ============================================
 * M03 巡检
 * ============================================ */

PAGE_RENDERERS['inspection-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = INSPECTIONS.filter(i => {
    if (filter === 'all') return true;
    if (filter === 'pending') return i.status === 'pending';
    if (filter === 'done') return i.status === 'done';
    if (filter === 'overdue') return i.status === 'overdue';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['pending','待执行'],['overdue','已逾期'],['done','已完成']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="inspection-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-summary">共 ${list.length} 条任务</div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('暂无该类任务') : list.map(i => `
        <div class="list-card" data-page="inspection-detail" data-params='{"id":"${i.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${i.type} · ${i.location}</span>
            </div>
            <span class="list-card-status s-${i.status === 'overdue' ? 'overdue' : i.status === 'done' ? 'done' : 'inprogress'}">${i.status === 'overdue' ? '已逾期' : i.status === 'done' ? '已完成' : '待执行'}</span>
          </div>
          <div class="list-card-meta">
            <span>${i.code}</span><span>${i.planTime}</span><span>${i.points} 项</span>
          </div>
          <div class="list-card-row">巡检人: ${i.inspector} ${i.abnormalCount != null ? `· 异常 ${i.abnormalCount} 项` : ''}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('巡检任务', content, `<button class="sub-action" data-page="inspection-create">+ 新建</button>`);
};

PAGE_RENDERERS['inspection-detail'] = (params) => {
  const t = getInspection(params.id);
  if (!t) return subPageShell('任务详情', emptyState('任务不存在'));
  const wo = t.status === 'overdue' ? `<span class="list-card-status s-overdue">已逾期</span>` : t.status === 'done' ? `<span class="list-card-status s-done">已完成</span>` : `<span class="list-card-status s-inprogress">待执行</span>`;
  const actionBtn = t.status === 'done' ? '' : `<button class="btn btn-primary btn-block" data-page="inspection-execute" data-params='{"id":"${t.id}"}'>开始执行 / 录入结果</button>`;

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-title">${t.type} · ${t.location}</div>
      <div class="detail-hero-meta">${t.code} · 计划 ${t.planTime}</div>
      ${wo}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">基本信息</div>
      <div class="detail-row"><div class="detail-label">巡检人</div><div class="detail-value">${t.inspector}</div></div>
      <div class="detail-row"><div class="detail-label">巡检项数</div><div class="detail-value">${t.points} 项</div></div>
      <div class="detail-row"><div class="detail-label">完成情况</div><div class="detail-value">${t.doneCount}/${t.points} ${t.abnormalCount ? `· 异常 ${t.abnormalCount}` : ''}</div></div>
    </div>
    ${t.items.length ? `
      <div class="detail-section">
        <div class="detail-section-title">检查项</div>
        ${t.items.map((it, idx) => `
          <div class="detail-row"><div class="detail-label">${idx + 1}. ${it.name}</div><div class="detail-value">${it.need.join(' / ')}</div></div>
        `).join('')}
      </div>
    ` : ''}
    <div style="height: 76px"></div>
    <div class="footer-actions">${actionBtn}</div>
  `;
  return subPageShell('巡检任务详情', content);
};

PAGE_RENDERERS['inspection-execute'] = (params) => {
  const t = getInspection(params.id);
  if (!t) return subPageShell('执行巡检', emptyState('任务不存在'));
  const results = RUNTIME.inspectionItemResults[t.id] || {};

  const content = `
    <div class="simple-hero">
      <div class="simple-hero-title">${t.type} · ${t.location}</div>
      <div class="simple-hero-value">${t.items.length} 项检查</div>
    </div>
    <div class="form-section-title">逐项录入</div>
    ${t.items.map((it, idx) => {
      const r = results[idx] || {};
      return `
        <div class="check-item ${r.result === 'normal' ? 'done' : r.result === 'abnormal' ? 'abnormal' : ''}" data-insp-item="${idx}">
          <div class="check-item-head">
            <div class="check-item-name">${idx + 1}. ${it.name}</div>
            <div class="check-item-need">${it.need.join(' / ')}</div>
          </div>
          <div class="check-result-row">
            <div class="result-chip ${r.result === 'normal' ? 'active normal' : ''}" data-insp-result="${idx}|normal">正常</div>
            <div class="result-chip ${r.result === 'abnormal' ? 'active abnormal' : ''}" data-insp-result="${idx}|abnormal">异常</div>
          </div>
          ${it.need.includes('照片') ? `
            <div class="check-result-row">
              <div class="form-upload-slot ${r.photo ? 'filled' : ''}" data-insp-photo="${idx}">${r.photo ? '已上传' : '+'}</div>
            </div>
          ` : ''}
          <textarea class="form-textarea" data-insp-remark="${idx}" placeholder="备注(选填)" style="min-height: 48px; font-size: var(--fs-sm);">${r.remark || ''}</textarea>
        </div>
      `;
    }).join('')}
    <div style="padding: 12px;">
      <button class="btn btn-primary btn-block" data-insp-submit="${t.id}">提交巡检结果</button>
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell('执行巡检', content);
};

PAGE_RENDERERS['inspection-create'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-section-title">基本信息</div>
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">巡检类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">日常安全</div>
              <div class="form-chip">维保</div>
              <div class="form-chip">保安</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">巡检位置</div>
          <div class="form-control"><input class="form-input" placeholder="如: B 栋 3 层" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">计划时间</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-04 10:00" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">备注</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="选填"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-insp-create-submit>提交创建</button>
      </div>
    </div>
  `;
  return subPageShell('新建巡检', content);
};

/* ============================================
 * M04 报修工单
 * ============================================ */

PAGE_RENDERERS['workorder-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = WORKORDERS.filter(w => {
    const cur = getWOStatus(w.id) || w.status;
    if (filter === 'all') return true;
    if (filter === 'pending') return cur === '待派单' || cur === '待接单';
    if (filter === 'progress') return cur === '处理中';
    if (filter === 'done') return cur === '已关单';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['pending','待处理'],['progress','处理中'],['done','已关单']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="workorder-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-summary">共 ${list.length} 单</div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('暂无该类工单') : list.map(w => {
        const cur = getWOStatus(w.id) || w.status;
        const urgent = w.urgent === 'high' ? '<span class="urgent-tag urgent-high">紧急</span>' : w.urgent === 'mid' ? '<span class="urgent-tag urgent-mid">中</span>' : '';
        return `
          <div class="list-card" data-page="workorder-detail" data-params='{"id":"${w.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title">${urgent}<span class="list-card-title-text">${w.type} · ${w.company}</span></div>
              <span class="list-card-status s-${cur}">${cur}</span>
            </div>
            <div class="list-card-meta">
              <span>${w.code}</span><span>${w.location}</span><span>${w.createTime.split(' ')[1] || w.createTime}</span>
            </div>
            <div class="list-card-row">${w.desc}</div>
            <div class="list-card-footer">
              <span>${w.assignee ? '处理人: ' + w.assignee : '尚未派单'}</span>
              <span>${w.slaRemain}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return subPageShell('报修工单', content, `<button class="sub-action" data-page="workorder-create">+ 报修</button>`);
};

PAGE_RENDERERS['workorder-detail'] = (params) => {
  const w = getWorkorder(params.id);
  if (!w) return subPageShell('工单详情', emptyState('工单不存在'));
  const cur = getWOStatus(w.id) || w.status;
  const role = ROLES[state.roleId];

  /* 根据状态 + 角色计算可执行操作 */
  const actions = [];
  const isAssignee = w.assignee && w.assignee.includes(ROLES[state.roleId].user);
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M04');

  if (!isReadonly) {
    if (cur === '待派单' && (state.roleId === 'manager' || state.roleId === 'operator')) {
      actions.push({ label: '派单', act: 'assign', cls: 'btn-primary' });
    }
    if (cur === '待接单' && (isAssignee || state.roleId === 'inspector' || state.roleId === 'staff')) {
      actions.push({ label: '接单', act: 'accept', cls: 'btn-primary' });
    }
    if (cur === '处理中' && isAssignee) {
      actions.push({ label: '完成处理', act: 'finish', cls: 'btn-primary' });
      actions.push({ label: '转单', act: 'transfer', cls: 'btn-default' });
    }
    if (cur === '处理中' && state.roleId !== 'staff') {
      actions.push({ label: '催办', act: 'urge', cls: 'btn-default' });
    }
    if (cur === '已关单' && w.rating == null && state.roleId !== 'staff') {
      /* 业主侧回访才打分,这里模拟 */
    }
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-wo-action="${a.act}" data-wo-id="${w.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${w.urgent === 'high' ? '紧急' : w.urgent === 'mid' ? '中' : '一般'}</div>
      <div class="detail-hero-title">${w.type} · ${w.company}</div>
      <div class="detail-hero-meta">${w.code} · 创建于 ${w.createTime}</div>
      <div style="margin-top:10px;"><span class="list-card-status s-${cur}">${cur}</span></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">报修信息</div>
      <div class="detail-row"><div class="detail-label">报修人</div><div class="detail-value">${w.reporter} ${w.phone !== '内部' ? '· ' + w.phone : ''}</div></div>
      <div class="detail-row"><div class="detail-label">位置</div><div class="detail-value">${w.location}</div></div>
      <div class="detail-row"><div class="detail-label">来源</div><div class="detail-value">${w.source === 'tenant' ? '租户报修' : '巡检异常'}</div></div>
      <div class="detail-row"><div class="detail-label">SLA</div><div class="detail-value">${w.slaRemain}</div></div>
      <div class="detail-row"><div class="detail-label">处理人</div><div class="detail-value">${w.assignee || '尚未派单'}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">问题描述</div>
      <div class="detail-text">${w.desc}</div>
      ${w.photos ? `<div style="margin-top:10px; font-size: var(--fs-sm); color: var(--c-primary);">📷 ${w.photos} 张现场照片</div>` : ''}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">处理流水</div>
      <div class="timeline">
        ${w.history.map(h => `
          <div class="timeline-item done">
            <div class="timeline-time">${h.time}</div>
            <div class="timeline-title">${h.actor} · ${h.action}</div>
            <div class="timeline-desc">${h.desc || ''}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ${w.rating ? `
      <div class="detail-section">
        <div class="detail-section-title">回访评价</div>
        <div class="detail-text">${'★'.repeat(w.rating)}${'☆'.repeat(5 - w.rating)} · 处理及时</div>
      </div>
    ` : ''}
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('工单详情', content);
};

PAGE_RENDERERS['workorder-create'] = (params) => {
  const role = ROLES[state.roleId];
  const companies = state.roleId === 'staff' ? ['本部门'] : COMPANIES.slice(0, 4);
  const content = `
    <div class="form-page">
      <div class="form-section-title">报修信息</div>
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">报修单位</div>
          <div class="form-control">
            <div class="form-chip-group">
              ${companies.map((c, i) => `<div class="form-chip ${i === 0 ? 'active' : ''}">${typeof c === 'string' ? c : c.name}</div>`).join('')}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">位置</div>
          <div class="form-control"><input class="form-input" placeholder="如: A 栋 5 层 502" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">空调</div><div class="form-chip">水电</div><div class="form-chip">门窗</div><div class="form-chip">弱电</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label">紧急度</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip">一般</div><div class="form-chip active">中</div><div class="form-chip">紧急</div>
            </div>
          </div>
        </div>
        <div class="form-row column">
          <div class="form-label required">问题描述</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="请详细描述故障现象、影响范围..."></textarea></div>
        </div>
        <div class="form-row column">
          <div class="form-label">现场照片</div>
          <div class="form-control">
            <div class="form-uploader">
              <div class="form-upload-slot">+</div>
              <div class="form-upload-slot">+</div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-wo-create-submit>提交工单</button>
      </div>
    </div>
  `;
  return subPageShell('新建工单', content);
};

/* ============================================
 * M05 费用
 * ============================================ */

PAGE_RENDERERS['fee-dashboard'] = (params) => {
  const owed = BILLS.reduce((s, b) => s + b.owed, 0);
  const paid = BILLS.reduce((s, b) => s + b.paid, 0);
  const total = owed + paid;
  const overdueCompanies = COMPANIES.filter(c => c.feeStatus === 'overdue').length;

  const content = `
    <div class="big-stat-card orange">
      <div class="big-stat-label">本月应收</div>
      <div class="big-stat-value">${(total / 10000).toFixed(1)}<span class="big-stat-unit">万</span></div>
      <div class="big-stat-delta">已收 ¥${(paid / 10000).toFixed(1)} 万 · 待收 ¥${(owed / 10000).toFixed(1)} 万</div>
    </div>
    <div class="mini-stat-row">
      <div class="mini-stat">
        <div class="mini-stat-value success">78<span style="font-size:14px;">%</span></div>
        <div class="mini-stat-label">收缴率</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value danger">${overdueCompanies}</div>
        <div class="mini-stat-label">欠费企业</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value warning">${(owed / 10000).toFixed(1)}<span style="font-size:14px;">万</span></div>
        <div class="mini-stat-label">欠款总额</div>
      </div>
    </div>
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">催收排行</div>
      </div>
      <div style="background:#fff; border-radius:var(--r-md); padding:0 14px; box-shadow: var(--sh-sm);">
        ${COMPANIES.filter(c => c.overdueAmount > 0).sort((a, b) => b.overdueAmount - a.overdueAmount).slice(0, 5).map((c, i) => `
          <div class="mini-company-card" data-page="company-detail" data-params='{"id":"${c.id}"}'>
            <div class="mini-company-avatar">${c.name.charAt(0)}</div>
            <div class="mini-company-info">
              <div class="mini-company-name">${i + 1}. ${c.name}</div>
              <div class="mini-company-meta">${c.building} · 欠 ${c.overduePeriods} 期</div>
            </div>
            <div style="color: var(--c-danger); font-weight: 700;">¥${(c.overdueAmount / 10000).toFixed(2)} 万</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">快捷操作</div>
      </div>
      <div style="background:#fff; border-radius:var(--r-md;); box-shadow: var(--sh-sm); overflow:hidden;">
        <div class="card-row" data-page="fee-bill-list">
          <div class="card-row-icon">票</div>
          <div class="card-row-body">
            <div class="card-row-title">账单明细</div>
            <div class="card-row-desc">查看所有应收 / 已收 / 欠费</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
        <div class="card-row" data-page="fee-dunning-list">
          <div class="card-row-icon">催</div>
          <div class="card-row-body">
            <div class="card-row-title">催缴流水</div>
            <div class="card-row-desc">历史催收记录与回复</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
      </div>
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell('费用中心', content);
};

PAGE_RENDERERS['fee-bill-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = BILLS.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'owed') return b.owed > 0;
    if (filter === 'paid') return b.owed === 0;
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['owed','欠费'],['paid','已结清']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="fee-bill-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('暂无账单') : list.map(b => `
        <div class="list-card" data-page="fee-bill-detail" data-params='{"id":"${b.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title"><span class="list-card-title-text">${b.company} · ${b.type}</span></div>
            <span class="list-card-status s-${b.status}">${b.status}</span>
          </div>
          <div class="list-card-meta">
            <span>账期 ${b.period}</span><span>应收 ¥${b.shouldPay.toLocaleString()}</span>
          </div>
          ${b.owed > 0 ? `<div class="list-card-row" style="color: var(--c-danger);">欠 ¥${b.owed.toLocaleString()}</div>` : `<div class="list-card-row">已结清</div>`}
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('账单明细', content);
};

PAGE_RENDERERS['fee-bill-detail'] = (params) => {
  const b = getBill(params.id);
  if (!b) return subPageShell('账单详情', emptyState('账单不存在'));
  const role = ROLES[state.roleId];
  const isFinance = state.roleId === 'finance';
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M05');

  const actions = [];
  if (b.owed > 0 && !isReadonly) {
    actions.push({ label: '催缴', act: 'dunning', cls: 'btn-primary' });
    if (isFinance) actions.push({ label: '录收款', act: 'record', cls: 'btn-default' });
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-fee-action="${a.act}" data-fee-id="${b.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${b.status}</div>
      <div class="detail-hero-title">${b.company} · ${b.type}</div>
      <div class="detail-hero-meta">账期 ${b.period}</div>
      <div style="margin-top:12px; font-size: var(--fs-3xl); font-weight:700;">¥${b.shouldPay.toLocaleString()}</div>
      <div style="font-size:var(--fs-xs); opacity:0.85;">应收金额</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">账目明细</div>
      <div class="detail-row"><div class="detail-label">应收</div><div class="detail-value">¥${b.shouldPay.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">已收</div><div class="detail-value" style="color: var(--c-success);">¥${b.paid.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">未收</div><div class="detail-value" style="color: ${b.owed > 0 ? 'var(--c-danger)' : 'var(--c-text-sub)'};">¥${b.owed.toLocaleString()}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">催缴记录</div>
      ${DUNNING_LOGS.filter(d => d.companyId === b.companyId).length === 0
        ? `<div class="empty-state" style="padding: 20px;"><div class="empty-state-text">暂无催缴记录</div></div>`
        : DUNNING_LOGS.filter(d => d.companyId === b.companyId).map(d => `
          <div class="card-row" style="cursor:default;">
            <div class="card-row-icon" style="background:${d.method === '电话' ? '#e6f1fa' : '#fef3e6'};color:${d.method === '电话' ? 'var(--c-info)' : 'var(--c-warning)'};">${d.method === '电话' ? '话' : '信'}</div>
            <div class="card-row-body">
              <div class="card-row-title">${d.method} · ${d.response}</div>
              <div class="card-row-desc">${d.operator} · ${d.time}</div>
            </div>
            <span class="list-card-status s-${d.status}">${d.status}</span>
          </div>
        `).join('')
      }
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('账单详情', content);
};

PAGE_RENDERERS['fee-dunning-list'] = (params) => {
  const all = [...RUNTIME.newDunningLogs, ...DUNNING_LOGS].sort((a, b) => b.time.localeCompare(a.time));
  const content = `
    <div class="list-page">
      ${all.length === 0 ? emptyState('暂无催缴记录') : all.map(d => `
        <div class="list-card" style="cursor:default;">
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${d.method} · ${d.company}</span>
            </div>
            <span class="list-card-status s-${d.status}">${d.status}</span>
          </div>
          <div class="list-card-meta">
            <span>${d.time}</span><span>${d.operator}</span>
          </div>
          <div class="list-card-row">回复: ${d.response}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('催缴流水', content);
};

/* ============================================
 * M06 水电
 * ============================================ */

PAGE_RENDERERS['utility-dashboard'] = (params) => {
  const u = UTILITY;
  const maxWater = Math.max(...u.monthly.map(m => m.water));
  const maxElec = Math.max(...u.monthly.map(m => m.electric));

  const content = `
    <div class="big-stat-card teal">
      <div class="big-stat-label">本月用水</div>
      <div class="big-stat-value">${(u.summary.water.current / 1000).toFixed(1)}<span class="big-stat-unit">千吨</span></div>
      <div class="big-stat-delta">较上月 ${u.summary.water.delta > 0 ? '+' : ''}${u.summary.water.delta}%</div>
    </div>
    <div class="big-stat-card orange">
      <div class="big-stat-label">本月用电</div>
      <div class="big-stat-value">${(u.summary.electric.current / 1000).toFixed(1)}<span class="big-stat-unit">千度</span></div>
      <div class="big-stat-delta">较上月 ${u.summary.electric.delta > 0 ? '+' : ''}${u.summary.electric.delta}%</div>
    </div>
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">12 月趋势</div>
        <span class="section-more">更新于 ${u.summary.updateAt.split(' ')[1]}</span>
      </div>
      <div class="chart-card">
        <div class="chart-bars">
          ${u.monthly.map(m => `
            <div class="chart-bar-wrap">
              <div style="display:flex; gap:2px; height: 110px; align-items:flex-end; width: 100%;">
                <div class="chart-bar water" style="height: ${(m.water / maxWater) * 100}%" title="水 ${m.water}"></div>
                <div class="chart-bar electric" style="height: ${(m.electric / maxElec) * 100}%" title="电 ${m.electric}"></div>
              </div>
              <div class="chart-bar-label">${m.month.slice(5)}</div>
            </div>
          `).join('')}
        </div>
        <div class="chart-legend">
          <span><i class="water"></i>水(吨)</span>
          <span><i class="electric"></i>电(度)</span>
        </div>
      </div>
    </div>
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">企业用量 TOP 5</div>
        <span class="section-more" data-page="utility-company">全部 ›</span>
      </div>
      <div style="background:#fff; border-radius:var(--r-md); padding:0 14px; box-shadow: var(--sh-sm);">
        ${u.byCompany.slice(0, 5).map(c => `
          <div class="mini-company-card" data-page="utility-company-detail" data-params='{"id":"${c.id}"}'>
            <div class="mini-company-avatar">${c.name.charAt(0)}</div>
            <div class="mini-company-info">
              <div class="mini-company-name">${c.name}</div>
              <div class="mini-company-meta">水 ${c.water}吨 · 电 ${c.electric}度</div>
            </div>
            <div style="font-size: var(--fs-sm); color: var(--c-text-sub);">¥${((c.waterFee + c.elecFee) / 10000).toFixed(2)}万</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell('水电总览', content, `<button class="sub-action" data-page="utility-company">明细</button>`);
};

PAGE_RENDERERS['utility-company'] = (params) => {
  const filter = params.filter || 'all';
  const list = UTILITY.byCompany.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'water') return c.deltaWater > 0;
    if (filter === 'electric') return c.deltaElec > 0;
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['water','用水上涨'],['electric','用电上涨']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="utility-company" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(c => `
        <div class="list-card" data-page="utility-company-detail" data-params='{"id":"${c.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title"><span class="list-card-title-text">${c.name}</span></div>
            <span class="list-card-status s-active">¥${((c.waterFee + c.elecFee) / 10000).toFixed(2)}万</span>
          </div>
          <div class="list-card-meta">
            <span>水 ${c.water}吨</span><span>电 ${c.electric}度</span>
          </div>
          <div class="list-card-row">较上月: 水 ${c.deltaWater > 0 ? '+' : ''}${c.deltaWater}% · 电 ${c.deltaElec > 0 ? '+' : ''}${c.deltaElec}%</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('企业用量', content);
};

PAGE_RENDERERS['utility-company-detail'] = (params) => {
  const c = UTILITY.byCompany.find(x => x.id === params.id);
  if (!c) return subPageShell('企业用量详情', emptyState('企业不存在'));
  const totalFee = c.waterFee + c.elecFee;
  const waterPct = (c.waterFee / totalFee) * 100;
  const elecPct = (c.elecFee / totalFee) * 100;
  const conic = `conic-gradient(#1e6fbb 0 ${waterPct}%, #c47800 ${waterPct}% 100%)`;

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-title">${c.name}</div>
      <div class="detail-hero-meta">本月水 + 电 合计</div>
      <div style="margin-top:10px; font-size: var(--fs-3xl); font-weight:700;">¥${totalFee.toLocaleString()}</div>
    </div>
    <div class="chart-card pie-section">
      <div class="pie-chart" style="background: ${conic};">
        <div class="pie-center">
          <div class="pie-value">¥${(totalFee / 1000).toFixed(1)}k</div>
          <div class="pie-label">合计</div>
        </div>
      </div>
      <div class="pie-legend">
        <div class="pie-legend-item">
          <span><i class="dot" style="background:#1e6fbb;"></i>水费</span>
          <span>¥${c.waterFee.toLocaleString()}</span>
        </div>
        <div class="pie-legend-item">
          <span><i class="dot" style="background:#c47800;"></i>电费</span>
          <span>¥${c.elecFee.toLocaleString()}</span>
        </div>
        <div class="pie-legend-item" style="border-top:1px dashed var(--c-line-soft); padding-top:6px; margin-top:2px;">
          <span style="font-size: var(--fs-xs); color: var(--c-text-sub);">合计</span>
          <span style="font-weight:700;">¥${totalFee.toLocaleString()}</span>
        </div>
      </div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">本月用量</div>
      <div class="detail-row"><div class="detail-label">用水量</div><div class="detail-value">${c.water} 吨 <span style="color: ${c.deltaWater > 0 ? 'var(--c-danger)' : c.deltaWater < 0 ? 'var(--c-success)' : 'var(--c-text-sub)'};">${c.deltaWater > 0 ? '+' : ''}${c.deltaWater}%</span></div></div>
      <div class="detail-row"><div class="detail-label">用水费</div><div class="detail-value">¥${c.waterFee.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">用电量</div><div class="detail-value">${c.electric} 度 <span style="color: ${c.deltaElec > 0 ? 'var(--c-danger)' : c.deltaElec < 0 ? 'var(--c-success)' : 'var(--c-text-sub)'};">${c.deltaElec > 0 ? '+' : ''}${c.deltaElec}%</span></div></div>
      <div class="detail-row"><div class="detail-label">用电费</div><div class="detail-value">¥${c.elecFee.toLocaleString()}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">最近 6 月趋势</div>
      <div class="chart-card" style="margin:0; box-shadow:none; padding: 12px 8px;">
        <div class="chart-bars">
          ${UTILITY.monthly.slice(-6).map(m => {
            const maxWater = Math.max(...UTILITY.monthly.slice(-6).map(x => x.water));
            const maxElec = Math.max(...UTILITY.monthly.slice(-6).map(x => x.electric));
            return `
              <div class="chart-bar-wrap">
                <div style="display:flex; gap:2px; height: 110px; align-items:flex-end; width: 100%;">
                  <div class="chart-bar water" style="height: ${(m.water / maxWater) * 100}%"></div>
                  <div class="chart-bar electric" style="height: ${(m.electric / maxElec) * 100}%"></div>
                </div>
                <div class="chart-bar-label">${m.month.slice(5)}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell(c.name, content);
};

/* ============================================
 * M07 合同
 * ============================================ */

PAGE_RENDERERS['contract-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = CONTRACTS.filter(c => {
    const cur = getCtStatus(c.id) || c.status;
    if (filter === 'all') return true;
    if (filter === 'pending') return cur === '待审批';
    if (filter === 'active') return cur === '生效中';
    if (filter === 'expiring') return c.daysToExpire != null && c.daysToExpire < 90;
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['pending','待审批'],['active','生效中'],['expiring','即将到期']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="contract-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(c => {
        const cur = getCtStatus(c.id) || c.status;
        return `
          <div class="list-card" data-page="contract-detail" data-params='{"id":"${c.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title"><span class="list-card-title-text">${c.company} · ${c.type}</span></div>
              <span class="list-card-status s-${cur === '已驳回' ? '已到期' : cur}">${cur}</span>
            </div>
            <div class="list-card-meta">
              <span>${c.code}</span><span>${c.area}㎡</span>
            </div>
            <div class="list-card-row">${c.startDate} ~ ${c.endDate} · ¥${(c.amount / 10000).toFixed(0)}万 / ${c.payment}</div>
            ${c.daysToExpire != null ? `<div class="list-card-row" style="color: ${c.daysToExpire < 60 ? 'var(--c-danger)' : 'var(--c-warning)'};">${c.daysToExpire} 天后到期</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
  return subPageShell('合同管理', content, `<button class="sub-action" data-page="contract-create">+ 新建</button>`);
};

PAGE_RENDERERS['contract-detail'] = (params) => {
  const c = getContract(params.id);
  if (!c) return subPageShell('合同详情', emptyState('合同不存在'));
  const cur = getCtStatus(c.id) || c.status;
  const role = ROLES[state.roleId];
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M07');
  const canApprove = cur === '待审批' && state.roleId === 'manager' && !isReadonly;

  const actions = [];
  if (canApprove) {
    actions.push({ label: '审批通过', act: 'approve', cls: 'btn-primary' });
    actions.push({ label: '驳回', act: 'reject', cls: 'btn-default' });
  }
  if (cur === '生效中' && state.roleId === 'business') {
    actions.push({ label: '发起续约', act: 'renew', cls: 'btn-primary' });
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-ct-action="${a.act}" data-ct-id="${c.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${cur}</div>
      <div class="detail-hero-title">${c.company} · ${c.type}</div>
      <div class="detail-hero-meta">${c.code}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">合同信息</div>
      <div class="detail-row"><div class="detail-label">位置</div><div class="detail-value">${c.building} · ${c.area}㎡</div></div>
      <div class="detail-row"><div class="detail-label">金额</div><div class="detail-value" style="color: var(--c-danger);">¥${c.amount.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">付款方式</div><div class="detail-value">${c.payment}</div></div>
      <div class="detail-row"><div class="detail-label">签约人</div><div class="detail-value">${c.signer}</div></div>
      <div class="detail-row"><div class="detail-label">生效期</div><div class="detail-value">${c.startDate} ~ ${c.endDate}</div></div>
      ${c.daysToExpire != null ? `<div class="detail-row"><div class="detail-label">距到期</div><div class="detail-value" style="color: ${c.daysToExpire < 60 ? 'var(--c-danger)' : 'var(--c-warning)'};">${c.daysToExpire} 天</div></div>` : ''}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">审批记录</div>
      <div class="timeline">
        ${(c.history.length ? c.history : [{ time: c.submitTime, actor: c.submitBy || '商务', action: '提交审批', desc: c.type }]).map(h => `
          <div class="timeline-item done">
            <div class="timeline-time">${h.time}</div>
            <div class="timeline-title">${h.actor} · ${h.action}</div>
            <div class="timeline-desc">${h.desc || ''}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('合同详情', content);
};

PAGE_RENDERERS['contract-create'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-section-title">合同信息</div>
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">企业</div>
          <div class="form-control">
            <div class="form-chip-group">
              ${COMPANIES.slice(0, 4).map((c, i) => `<div class="form-chip ${i === 0 ? 'active' : ''}">${c.name}</div>`).join('')}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">合同类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">租赁合同</div><div class="form-chip">物业合同</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">位置</div>
          <div class="form-control"><input class="form-input" placeholder="如: A 栋 5 层" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">面积(㎡)</div>
          <div class="form-control"><input class="form-input" type="number" placeholder="0" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">年金额</div>
          <div class="form-control"><input class="form-input" type="number" placeholder="0" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">生效期</div>
          <div class="form-control"><input class="form-input" placeholder="开始 ~ 结束" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">备注</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="选填"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-ct-create-submit>提交审批</button>
      </div>
    </div>
  `;
  return subPageShell('新建合同', content);
};

/* ============================================
 * M08 企业入驻
 * ============================================ */

PAGE_RENDERERS['company-list'] = (params) => {
  const filter = params.filter || 'all';
  const kw = (params.kw || '').trim();
  const list = COMPANIES.filter(c => {
    if (kw && !c.name.includes(kw)) return false;
    if (filter === 'all') return true;
    if (filter === 'active') return c.status === 'active';
    if (filter === 'expiring') return c.status === 'expiring';
    if (filter === 'overdue') return c.feeStatus === 'overdue';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['active','正常'],['expiring','即将到期'],['overdue','欠费']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="company-list" data-params='{"filter":"${k}","kw":"${kw}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('无匹配企业') : list.map(c => `
        <div class="list-card" data-page="company-detail" data-params='{"id":"${c.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${c.name}</span>
            </div>
            <span class="list-card-status s-${c.feeStatus === 'overdue' ? '欠费' : c.status}">${c.feeStatus === 'overdue' ? '欠费' : c.status === 'expiring' ? '即将到期' : '正常'}</span>
          </div>
          <div class="list-card-meta">
            <span>${c.industry}</span><span>${c.building}</span><span>${c.area}㎡</span>
          </div>
          <div class="list-card-row">联系人: ${c.contact} · ${c.phone}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('入驻企业', content);
};

PAGE_RENDERERS['company-detail'] = (params) => {
  const c = getCompany(params.id);
  if (!c) return subPageShell('企业详情', emptyState('企业不存在'));
  const bills = BILLS.filter(b => b.companyId === c.id);
  const owed = bills.reduce((s, b) => s + b.owed, 0);
  const contracts = CONTRACTS.filter(ct => ct.company === c.name);

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${c.status === 'active' ? '正常入驻' : '即将到期'}</div>
      <div class="detail-hero-title">${c.name}</div>
      <div class="detail-hero-meta">${c.industry} · ${c.scale}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">基本信息</div>
      <div class="detail-row"><div class="detail-label">统一信用码</div><div class="detail-value">${c.credit}</div></div>
      <div class="detail-row"><div class="detail-label">法人</div><div class="detail-value">${c.legal}</div></div>
      <div class="detail-row"><div class="detail-label">联系人</div><div class="detail-value">${c.contact} · ${c.phone}</div></div>
      <div class="detail-row"><div class="detail-label">邮箱</div><div class="detail-value">${c.email}</div></div>
      <div class="detail-row"><div class="detail-label">入驻位置</div><div class="detail-value">${c.building} · ${c.area}㎡</div></div>
      <div class="detail-row"><div class="detail-label">入驻期</div><div class="detail-value">${c.startDate} ~ ${c.endDate}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">合同(${contracts.length})</div>
      ${contracts.length === 0 ? '<div class="empty-state" style="padding:16px;"><div class="empty-state-text">无</div></div>' : contracts.map(ct => `
        <div class="card-row" data-page="contract-detail" data-params='{"id":"${ct.id}"}'>
          <div class="card-row-icon">合</div>
          <div class="card-row-body">
            <div class="card-row-title">${ct.type}</div>
            <div class="card-row-desc">${ct.startDate} ~ ${ct.endDate}</div>
          </div>
          <span class="list-card-status s-${ct.status}">${ct.status}</span>
          <span class="card-row-arrow">›</span>
        </div>
      `).join('')}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">账单(${bills.length})</div>
      ${bills.length === 0 ? '<div class="empty-state" style="padding:16px;"><div class="empty-state-text">无</div></div>' : bills.slice(0, 3).map(b => `
        <div class="card-row" data-page="fee-bill-detail" data-params='{"id":"${b.id}"}'>
          <div class="card-row-icon" style="background:${b.owed > 0 ? 'var(--c-danger-soft)' : 'var(--c-success-soft)'};color:${b.owed > 0 ? 'var(--c-danger)' : 'var(--c-success)'};">${b.type.charAt(0)}</div>
          <div class="card-row-body">
            <div class="card-row-title">${b.type} · ${b.period}</div>
            <div class="card-row-desc">应收 ¥${b.shouldPay.toLocaleString()}</div>
          </div>
          <span class="list-card-status s-${b.status}">${b.status}</span>
          <span class="card-row-arrow">›</span>
        </div>
      `).join('')}
      ${owed > 0 ? `<div style="margin-top:8px; padding:8px 12px; background:var(--c-danger-soft); color:var(--c-danger); border-radius: var(--r-sm); font-size: var(--fs-sm); text-align:center;">累计欠费 ¥${owed.toLocaleString()}</div>` : ''}
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell(c.name, content);
};

/* ============================================
 * M09 OA
 * ============================================ */

PAGE_RENDERERS['form-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = FORMS.filter(f => {
    const cur = getFormStatus(f.id) || f.status;
    if (filter === 'all') return true;
    if (filter === 'pending') return cur === '待审批';
    if (filter === 'done') return cur === '已通过' || cur === '已驳回';
    if (filter === 'leave') return f.type === '请假';
    if (filter === 'expense') return f.type === '报销';
    if (filter === 'seal') return f.type === '用印';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['pending','待审批'],['done','已处理'],['leave','请假'],['expense','报销'],['seal','用印']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="form-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('暂无单据') : list.map(f => {
        const cur = getFormStatus(f.id) || f.status;
        const icon = f.type === '请假' ? '请' : f.type === '报销' ? '报' : '印';
        const color = f.type === '请假' ? 'orange' : f.type === '报销' ? 'red' : 'purple';
        return `
          <div class="list-card" data-page="form-detail" data-params='{"id":"${f.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title">
                <span class="list-card-title-text">${f.type} · ${f.applicant}</span>
              </div>
              <span class="list-card-status s-${cur}">${cur}</span>
            </div>
            <div class="list-card-meta">
              <span>${f.dept}</span><span>${f.submitTime.split(' ')[1] || f.submitTime}</span>
            </div>
            <div class="list-card-row">${f.detail.leaveType || f.detail.reimType || f.detail.sealType}${f.detail.amount ? ` · ¥${f.detail.amount}` : f.detail.days ? ` · ${f.detail.days} 天` : ''}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return subPageShell('OA', content, `<button class="sub-action" data-page="form-new">+ 新建</button>`);
};

PAGE_RENDERERS['form-detail'] = (params) => {
  const f = getForm(params.id);
  if (!f) return subPageShell('单据详情', emptyState('单据不存在'));
  const cur = getFormStatus(f.id) || f.status;
  const role = ROLES[state.roleId];

  const isCurrentNode = f.flow.find(n => n.current);
  const canApprove = cur === '待审批' && isCurrentNode && (
    (isCurrentNode.actor === role.user) ||
    (isCurrentNode.actor === '经理' && state.roleId === 'manager') ||
    (isCurrentNode.actor === '财务' && state.roleId === 'finance')
  );

  /* 详情内容 */
  let detailHtml = '';
  if (f.type === '请假') {
    detailHtml = `
      <div class="detail-row"><div class="detail-label">类型</div><div class="detail-value">${f.detail.leaveType}</div></div>
      <div class="detail-row"><div class="detail-label">开始</div><div class="detail-value">${f.detail.startDate}</div></div>
      <div class="detail-row"><div class="detail-label">结束</div><div class="detail-value">${f.detail.endDate}</div></div>
      <div class="detail-row"><div class="detail-label">天数</div><div class="detail-value">${f.detail.days} 天</div></div>
      <div class="detail-row"><div class="detail-label">原因</div><div class="detail-value">${f.detail.reason}</div></div>
    `;
  } else if (f.type === '报销') {
    detailHtml = `
      <div class="detail-row"><div class="detail-label">类型</div><div class="detail-value">${f.detail.reimType}</div></div>
      <div class="detail-row"><div class="detail-label">金额</div><div class="detail-value" style="color: var(--c-danger);">¥${f.detail.amount.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">发票</div><div class="detail-value">${f.detail.invoiceCount} 张</div></div>
      <div class="detail-row"><div class="detail-label">收款账户</div><div class="detail-value">${f.detail.account}</div></div>
      <div class="detail-row"><div class="detail-label">说明</div><div class="detail-value">${f.detail.reason}</div></div>
    `;
  } else if (f.type === '用印') {
    detailHtml = `
      <div class="detail-row"><div class="detail-label">印章</div><div class="detail-value">${f.detail.sealType}</div></div>
      <div class="detail-row"><div class="detail-label">次数</div><div class="detail-value">${f.detail.count} 次</div></div>
      <div class="detail-row"><div class="detail-label">文件</div><div class="detail-value">${f.detail.fileName}</div></div>
      <div class="detail-row"><div class="detail-label">说明</div><div class="detail-value">${f.detail.reason}</div></div>
    `;
  }

  const actions = [];
  if (canApprove) {
    actions.push({ label: '通过', act: 'approve', cls: 'btn-primary' });
    actions.push({ label: '驳回', act: 'reject', cls: 'btn-default' });
  }
  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-form-action="${a.act}" data-form-id="${f.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${cur}</div>
      <div class="detail-hero-title">${f.type}单</div>
      <div class="detail-hero-meta">${f.applicant} · ${f.dept} · 提交于 ${f.submitTime}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">单据信息</div>
      ${detailHtml}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">审批流程</div>
      <div class="timeline">
        ${f.flow.map(n => `
          <div class="timeline-item ${n.done ? 'done' : n.current ? 'current' : ''}">
            <div class="timeline-time">${n.time || '待审批'}</div>
            <div class="timeline-title">${n.node} · ${n.actor}</div>
            <div class="timeline-desc">${n.action || '审批中...'}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('单据详情', content);
};

PAGE_RENDERERS['form-new'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-section-title">选择单据类型</div>
      <div class="form-card">
        <div class="card-row" data-page="form-leave">
          <div class="card-row-icon" style="background:#fef3e6;color:var(--c-warning);">请</div>
          <div class="card-row-body">
            <div class="card-row-title">请假申请</div>
            <div class="card-row-desc">事假 / 病假 / 年假 / 调休</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
        <div class="card-row" data-page="form-expense">
          <div class="card-row-icon" style="background:var(--c-danger-soft);color:var(--c-danger);">报</div>
          <div class="card-row-body">
            <div class="card-row-title">报销申请</div>
            <div class="card-row-desc">差旅 / 日常 / 招待</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
        <div class="card-row" data-page="form-seal">
          <div class="card-row-icon" style="background:#f0e6f7;color:#7c3aed;">印</div>
          <div class="card-row-body">
            <div class="card-row-title">用印申请</div>
            <div class="card-row-desc">公章 / 合同章 / 法人章</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
      </div>
    </div>
  `;
  return subPageShell('新建单据', content);
};

PAGE_RENDERERS['form-leave'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">假别</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip">事假</div><div class="form-chip active">年假</div><div class="form-chip">病假</div><div class="form-chip">调休</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">开始</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-10 09:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">结束</div><div class="form-control"><input class="form-input" placeholder="2026-06-12 18:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label">共计</div><div class="form-value" style="color: var(--c-text-sub);">3 天</div>
        </div>
        <div class="form-row column">
          <div class="form-label required">原因</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="请说明请假原因"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-form-submit="leave">提交</button>
      </div>
    </div>
  `;
  return subPageShell('请假申请', content);
};

PAGE_RENDERERS['form-expense'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">差旅</div><div class="form-chip">日常</div><div class="form-chip">招待</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">金额</div><div class="form-control"><input class="form-input" type="number" placeholder="0.00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label">发票</div><div class="form-control"><input class="form-input" placeholder="0 张" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">收款账户</div><div class="form-control"><input class="form-input" placeholder="开户行 - 尾号" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">说明</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="出差日期/事由"></textarea></div>
        </div>
        <div class="form-row column">
          <div class="form-label">凭证</div>
          <div class="form-control">
            <div class="form-uploader">
              <div class="form-upload-slot">+</div>
              <div class="form-upload-slot">+</div>
              <div class="form-upload-slot">+</div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-form-submit="expense">提交</button>
      </div>
    </div>
  `;
  return subPageShell('报销申请', content);
};

PAGE_RENDERERS['form-seal'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">印章</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">公章</div><div class="form-chip">合同章</div><div class="form-chip">法人章</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">次数</div><div class="form-control"><input class="form-input" type="number" placeholder="1" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">文件</div><div class="form-control"><input class="form-input" placeholder="如: 合同.pdf" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">用印说明</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="用印事由"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-form-submit="seal">提交</button>
      </div>
    </div>
  `;
  return subPageShell('用印申请', content);
};

/* ============================================
 * M10 会议
 * ============================================ */

PAGE_RENDERERS['meeting-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = MEETINGS.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return m.status === '即将开始';
    if (filter === 'done') return m.status === '已结束';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['upcoming','即将开始'],['done','已结束']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="meeting-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(m => `
        <div class="list-card" data-page="meeting-detail" data-params='{"id":"${m.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${m.title}</span>
            </div>
            <span class="list-card-status s-${m.status}">${m.status}</span>
          </div>
          <div class="list-card-meta">
            <span>${m.room}</span><span>${m.attendees.length} 人</span>
          </div>
          <div class="list-card-row">${m.startTime} ~ ${m.endTime.split(' ')[1]}</div>
          <div class="list-card-row" style="color: var(--c-text-sub);">议题: ${m.agenda}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('会议管理', content, `<button class="sub-action" data-page="meeting-book">+ 预定</button>`);
};

PAGE_RENDERERS['meeting-detail'] = (params) => {
  const m = getMeeting(params.id);
  if (!m) return subPageShell('会议详情', emptyState('会议不存在'));
  const role = ROLES[state.roleId];
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M10');
  const myStatus = m.attendees.find(a => a.name === role.user);

  const actions = [];
  if (m.status === '即将开始' && !isReadonly) {
    if (myStatus && myStatus.status === '待确认') {
      actions.push({ label: '确认参加', act: 'confirm', cls: 'btn-primary' });
      actions.push({ label: '请假', act: 'leave', cls: 'btn-default' });
    }
    if (m.creator === role.user) {
      actions.push({ label: '取消会议', act: 'cancel', cls: 'btn-default' });
    }
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-meeting-action="${a.act}" data-meeting-id="${m.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${m.status}</div>
      <div class="detail-hero-title">${m.title}</div>
      <div class="detail-hero-meta">${m.startTime} ~ ${m.endTime.split(' ')[1]} · ${m.room}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">会议信息</div>
      <div class="detail-row"><div class="detail-label">创建人</div><div class="detail-value">${m.creator}</div></div>
      <div class="detail-row"><div class="detail-label">时间</div><div class="detail-value">${m.startTime} ~ ${m.endTime.split(' ')[1]}</div></div>
      <div class="detail-row"><div class="detail-label">会议室</div><div class="detail-value">${m.room}</div></div>
      <div class="detail-row"><div class="detail-label">议题</div><div class="detail-value">${m.agenda}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">参会人员(${m.attendees.length})</div>
      ${m.attendees.map(a => `
        <div class="card-row" style="cursor:default;">
          <div class="card-row-icon">${a.name.charAt(0)}</div>
          <div class="card-row-body">
            <div class="card-row-title">${a.name}</div>
          </div>
          <span class="list-card-status s-${a.status === '已确认' ? '已通过' : a.status === '请假' ? '已到期' : 'inprogress'}">${a.status}</span>
        </div>
      `).join('')}
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('会议详情', content);
};

PAGE_RENDERERS['meeting-book'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">主题</div>
          <div class="form-control"><input class="form-input" placeholder="会议主题" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">开始时间</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-04 14:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">结束时间</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-04 16:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">会议室</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">大会议室</div>
              <div class="form-chip">小会议室</div>
              <div class="form-chip">商务洽谈室</div>
            </div>
          </div>
        </div>
        <div class="form-row column">
          <div class="form-label">参会人</div>
          <div class="form-control">
            <div class="form-uploader">
              <div class="form-upload-slot filled" style="width:auto; padding:0 12px;">+ 张志强</div>
              <div class="form-upload-slot filled" style="width:auto; padding:0 12px;">+ 王芳</div>
              <div class="form-upload-slot">+</div>
            </div>
          </div>
        </div>
        <div class="form-row column">
          <div class="form-label">议题</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="会议议题"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-meeting-book-submit>提交预定</button>
      </div>
    </div>
  `;
  return subPageShell('预定会议', content);
};

/* ============================================
 * M11 停车记录
 * ============================================ */

PAGE_RENDERERS['parking-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = PARKING.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'progress') return p.payStatus === '进行中';
    if (filter === 'paid') return p.payStatus === '已缴费';
    if (filter === 'free') return p.payStatus === '免费';
    if (filter === 'owed') return p.payStatus === '欠费';
    return true;
  });

  const inCount = PARKING.filter(p => !p.leaveTime).length;
  const total = PARKING.length;

  const content = `
    <div class="mini-stat-row">
      <div class="mini-stat">
        <div class="mini-stat-value success">${inCount}</div>
        <div class="mini-stat-label">在场车辆</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value">${total}</div>
        <div class="mini-stat-label">总记录</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value warning">${PARKING.filter(p => p.payStatus === '欠费').length}</div>
        <div class="mini-stat-label">欠费</div>
      </div>
    </div>
    <div class="filter-bar">
      ${[['all','全部'],['progress','进行中'],['paid','已缴费'],['free','免费'],['owed','欠费']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="parking-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(p => `
        <div class="list-card" style="cursor:default;">
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text" style="font-family:monospace; font-size: var(--fs-md);">${p.plate}</span>
            </div>
            <span class="list-card-status s-${p.payStatus}">${p.payStatus}</span>
          </div>
          <div class="list-card-meta">
            <span>进入 ${p.enterTime.split(' ')[1]}</span>
            <span>${p.leaveTime ? '离开 ' + p.leaveTime.split(' ')[1] : '未离场'}</span>
          </div>
          <div class="list-card-row" style="color: ${p.payStatus === '进行中' ? 'var(--c-warning)' : p.payStatus === '欠费' ? 'var(--c-danger)' : 'var(--c-text-sub)'};">${p.duration}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('停车记录', content);
};

/* ============================================
 * 占位页面(用于未实现完整二级页的模块)
 * ============================================ */

PAGE_RENDERERS['coming-soon'] = (params) => {
  return subPageShell(params.title || '敬请期待', `
    <div class="coming-soon">
      <div class="coming-soon-icon">⚙</div>
      <div class="coming-soon-text">${params.title || '该功能'}正在路上</div>
      <div class="coming-soon-hint">原型阶段暂未实现完整流程</div>
    </div>
  `);
};

/* ============================================
 * 交互处理: 工单 / 合同 / 单据 / 费用 / 巡检 / 会议
 * ============================================ */

function bindSubPageEvents() {
  /* 委托全局 click */
  document.addEventListener('click', (e) => {
    /* 返回 */
    if (e.target.closest('[data-back]')) { back(); return; }

    /* 跳页 */
    const pageLink = e.target.closest('[data-page]');
    if (pageLink) {
      const pageId = pageLink.dataset.page;
      let params = {};
      try { params = JSON.parse(pageLink.dataset.params || '{}'); }
      catch (err) { params = {}; }
      navigate(pageId, params);
      return;
    }

    /* 巡检项选择 */
    const inspRes = e.target.closest('[data-insp-result]');
    if (inspRes) {
      const [idx, val] = inspRes.dataset.inspResult.split('|');
      const inspId = state.subPageParams.id;
      if (!RUNTIME.inspectionItemResults[inspId]) RUNTIME.inspectionItemResults[inspId] = {};
      if (!RUNTIME.inspectionItemResults[inspId][idx]) RUNTIME.inspectionItemResults[inspId][idx] = {};
      RUNTIME.inspectionItemResults[inspId][idx].result = val;
      renderContent();
      return;
    }
    const inspPhoto = e.target.closest('[data-insp-photo]');
    if (inspPhoto) {
      const idx = inspPhoto.dataset.inspPhoto;
      const inspId = state.subPageParams.id;
      if (!RUNTIME.inspectionItemResults[inspId]) RUNTIME.inspectionItemResults[inspId] = {};
      if (!RUNTIME.inspectionItemResults[inspId][idx]) RUNTIME.inspectionItemResults[inspId][idx] = {};
      RUNTIME.inspectionItemResults[inspId][idx].photo = '已上传';
      showToast('已模拟上传照片');
      renderContent();
      return;
    }
    /* 巡检提交 */
    const inspSubmit = e.target.closest('[data-insp-submit]');
    if (inspSubmit) {
      const inspId = inspSubmit.dataset.inspSubmit;
      const results = RUNTIME.inspectionItemResults[inspId] || {};
      const t = getInspection(inspId);
      if (Object.keys(results).length < t.items.length) {
        showToast('请完成所有检查项');
        return;
      }
      const abnormal = Object.values(results).filter(r => r.result === 'abnormal');
      /* 更新任务状态 */
      const insp = INSPECTIONS.find(x => x.id === inspId);
      if (insp) {
        insp.status = 'done';
        insp.doneCount = t.items.length;
        insp.abnormalCount = abnormal.length;
      }
      showToast(`巡检完成 · ${abnormal.length > 0 ? `发现 ${abnormal.length} 项异常` : '全部正常'}`);
      if (abnormal.length > 0) {
        /* 模拟创建工单 */
        setTimeout(() => {
          showToast('已自动生成报修工单');
          state.pageStack = [];
          state.subPage = null;
          state.subPageParams = null;
          state.tab = 'home';
          renderTab();
        }, 1500);
      } else {
        setTimeout(() => {
          state.pageStack = [];
          state.subPage = null;
          state.subPageParams = null;
          state.tab = 'home';
          renderTab();
        }, 1200);
      }
      return;
    }
    /* 巡检创建 */
    if (e.target.closest('[data-insp-create-submit]')) {
      showToast('巡检任务已创建');
      setTimeout(() => back(), 800);
      return;
    }

    /* 工单操作 */
    const woAction = e.target.closest('[data-wo-action]');
    if (woAction) {
      const act = woAction.dataset.woAction;
      const id = woAction.dataset.woId;
      handleWorkorderAction(act, id);
      return;
    }
    /* 工单创建 */
    if (e.target.closest('[data-wo-create-submit]')) {
      showToast('工单已提交,等待派单');
      setTimeout(() => {
        state.pageStack = [];
        state.subPage = null;
        state.subPageParams = null;
        state.tab = 'home';
        renderTab();
      }, 1000);
      return;
    }

    /* 费用操作 */
    const feeAction = e.target.closest('[data-fee-action]');
    if (feeAction) {
      const act = feeAction.dataset.feeAction;
      const id = feeAction.dataset.feeId;
      handleFeeAction(act, id);
      return;
    }

    /* 合同操作 */
    const ctAction = e.target.closest('[data-ct-action]');
    if (ctAction) {
      const act = ctAction.dataset.ctAction;
      const id = ctAction.dataset.ctId;
      handleContractAction(act, id);
      return;
    }
    if (e.target.closest('[data-ct-create-submit]')) {
      showToast('合同已提交审批');
      setTimeout(() => back(), 800);
      return;
    }

    /* 单据操作 */
    const formAction = e.target.closest('[data-form-action]');
    if (formAction) {
      const act = formAction.dataset.formAction;
      const id = formAction.dataset.formId;
      handleFormAction(act, id);
      return;
    }
    const formSubmit = e.target.closest('[data-form-submit]');
    if (formSubmit) {
      const type = formSubmit.dataset.formSubmit;
      const label = type === 'leave' ? '请假' : type === 'expense' ? '报销' : '用印';
      showToast(`${label}单已提交,等待审批`);
      setTimeout(() => {
        state.pageStack = [];
        state.subPage = null;
        state.subPageParams = null;
        state.tab = 'home';
        renderTab();
      }, 1000);
      return;
    }

    /* 会议操作 */
    const meetingAction = e.target.closest('[data-meeting-action]');
    if (meetingAction) {
      const act = meetingAction.dataset.meetingAction;
      const id = meetingAction.dataset.meetingId;
      handleMeetingAction(act, id);
      return;
    }
    if (e.target.closest('[data-meeting-book-submit]')) {
      showToast('会议预定已提交');
      setTimeout(() => back(), 800);
      return;
    }

    /* 底部 Tab 切换:清空 pageStack */
    if (e.target.closest('.tab-item') && state.subPage) {
      state.pageStack = [];
    }
  });
}

/* ---------- 业务操作 handler ---------- */

async function handleWorkorderAction(act, id) {
  const w = getWorkorder(id);
  if (!w) return;
  const role = ROLES[state.roleId];

  if (act === 'accept') {
    if (await confirmAction(`确认接单 ${w.code}?`)) {
      RUNTIME.workorderOverrides[id] = '处理中';
      w.history.push({ time: nowStr(), actor: role.user, action: '接单', desc: '已接单' });
      showToast('接单成功');
      renderContent();
    }
  } else if (act === 'assign') {
    openActionSheet({
      title: `派单 ${w.code}`,
      items: [
        { label: '派给张志强(巡检员)', val: 'inspector' },
        { label: '派给外部维保', val: 'external' }
      ],
      onPick: (p) => {
        RUNTIME.workorderOverrides[id] = '待接单';
        w.assignee = p.val === 'inspector' ? '张志强' : '外部维保公司';
        w.history.push({ time: nowStr(), actor: role.user, action: '派单', desc: `派给${w.assignee}` });
        showToast('已派单');
        renderContent();
      }
    });
  } else if (act === 'finish') {
    const note = await promptText({ title: '处理说明', placeholder: '请说明处理过程与结果' });
    if (note !== null) {
      RUNTIME.workorderOverrides[id] = '已关单';
      w.history.push({ time: nowStr(), actor: role.user, action: '处理完成', desc: note || '已处理' });
      showToast('工单已关单');
      renderContent();
    }
  } else if (act === 'transfer') {
    openActionSheet({
      title: '转单给',
      items: [
        { label: '外部维保公司', val: '外部维保' },
        { label: '张志强', val: '张志强' }
      ],
      onPick: (p) => {
        w.assignee = p.val;
        w.history.push({ time: nowStr(), actor: role.user, action: '转单', desc: `转给 ${p.val}` });
        showToast('已转单');
        renderContent();
      }
    });
  } else if (act === 'urge') {
    showToast('已发送催办消息');
    w.history.push({ time: nowStr(), actor: role.user, action: '催办', desc: '已催办' });
    setTimeout(() => renderContent(), 600);
  }
}

function handleContractAction(act, id) {
  const c = getContract(id);
  if (!c) return;
  const role = ROLES[state.roleId];

  if (act === 'approve') {
    RUNTIME.contractOverrides[id] = '生效中';
    c.history.push({ time: nowStr(), actor: role.user, action: '审批通过', desc: '经理审批通过' });
    showToast('合同已审批通过');
    renderContent();
  } else if (act === 'reject') {
    RUNTIME.contractOverrides[id] = '已驳回';
    c.history.push({ time: nowStr(), actor: role.user, action: '审批驳回', desc: '驳回' });
    showToast('合同已驳回');
    renderContent();
  } else if (act === 'renew') {
    showToast('续约合同已创建,待客户确认');
    setTimeout(() => back(), 1000);
  }
}

function handleFormAction(act, id) {
  const f = getForm(id);
  if (!f) return;
  const role = ROLES[state.roleId];
  const cur = getFormStatus(f.id) || f.status;
  const isCurrentNode = f.flow.find(n => n.current);

  if (act === 'approve') {
    if (isCurrentNode) {
      isCurrentNode.time = nowStr();
      isCurrentNode.action = '通过';
      isCurrentNode.done = true;
      isCurrentNode.current = false;
      /* 推进到下一节点 */
      const nextIdx = f.flow.indexOf(isCurrentNode) + 1;
      if (nextIdx < f.flow.length) {
        f.flow[nextIdx].current = true;
      } else {
        RUNTIME.formOverrides[id] = '已通过';
      }
    }
    showToast('已审批通过');
    renderContent();
  } else if (act === 'reject') {
    RUNTIME.formOverrides[id] = '已驳回';
    if (isCurrentNode) {
      isCurrentNode.time = nowStr();
      isCurrentNode.action = '驳回';
      isCurrentNode.done = true;
      isCurrentNode.current = false;
    }
    showToast('已驳回');
    renderContent();
  }
}

function handleMeetingAction(act, id) {
  const m = getMeeting(id);
  if (!m) return;
  const role = ROLES[state.roleId];
  if (act === 'confirm') {
    const me = m.attendees.find(a => a.name === role.user);
    if (me) me.status = '已确认';
    showToast('已确认参加');
    renderContent();
  } else if (act === 'leave') {
    const me = m.attendees.find(a => a.name === role.user);
    if (me) me.status = '请假';
    showToast('已请假');
    renderContent();
  } else if (act === 'cancel') {
    if (confirmAction('确认取消会议?')) {
      m.status = '已结束';
      showToast('会议已取消');
      setTimeout(() => renderContent(), 600);
    }
  }
}

function handleFeeAction(act, id) {
  const b = getBill(id);
  if (!b) return;
  const role = ROLES[state.roleId];

  if (act === 'dunning') {
    openActionSheet({
      title: `催缴 ${b.company}`,
      items: [
        { label: '📩 发送消息', val: 'msg' },
        { label: '📞 拨打电话', val: 'phone' },
        { label: '📝 仅记录流水', val: 'log' }
      ],
      onPick: (p) => {
        if (p.val === 'phone') {
          showToast(`正在呼叫 ${b.company}...`);
          setTimeout(() => {
            const ok = Math.random() > 0.3;
            RUNTIME.newDunningLogs.unshift({
              id: 'dn' + Date.now(),
              companyId: b.companyId,
              company: b.company,
              operator: role.user,
              time: nowStr(),
              method: '电话',
              response: ok ? '已联系,客户承诺尽快处理' : '未接通',
              status: ok ? '已联系' : '未接通'
            });
            showToast(ok ? '通话结束,已记录' : '未接通,已记录');
            renderContent();
          }, 1200);
        } else {
          const method = p.val === 'msg' ? '消息' : '消息';
          RUNTIME.newDunningLogs.unshift({
            id: 'dn' + Date.now(),
            companyId: b.companyId,
            company: b.company,
            operator: role.user,
            time: nowStr(),
            method,
            response: '已发送',
            status: '已发送'
          });
          showToast(p.val === 'msg' ? '催缴消息已发送' : '已记录');
          renderContent();
        }
      }
    });
  } else if (act === 'record') {
    const input = prompt('请输入本次收款金额', b.owed.toString());
    if (input && !isNaN(input)) {
      const amt = parseFloat(input);
      b.paid += amt;
      b.owed = Math.max(0, b.shouldPay - b.paid);
      b.status = b.owed === 0 ? '已结清' : '部分缴';
      showToast(`已记录收款 ¥${amt.toLocaleString()}`);
      renderContent();
    } else if (input !== null) {
      showToast('请输入有效金额');
    }
  }
}

/* ---------- 辅助: 当前时间字符串 ---------- */
function nowStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

/* ============================================
 * 模块入口绑定(由 app.js 调用)
 * ============================================ */

function bindModuleEntry() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-module]');
    if (!card) return;
    const mid = card.dataset.module;
    const m = MODULES[mid];
    if (!m) return;
    /* 顶部小卡 + 业务大卡统一入口 */
    const role = ROLES[state.roleId];
    if (role.readonlyModules && role.readonlyModules.includes(mid)) {
      showToast('运营专员 · 只读查看');
    }
    const pageId = mid === 'M03' ? 'inspection-list'
      : mid === 'M04' ? 'workorder-list'
      : mid === 'M05' ? 'fee-dashboard'
      : mid === 'M06' ? 'utility-dashboard'
      : mid === 'M07' ? 'contract-list'
      : mid === 'M08' ? 'company-list'
      : mid === 'M09' ? 'form-list'
      : mid === 'M10' ? 'meeting-list'
      : mid === 'M11' ? 'parking-list'
      : 'coming-soon';
    navigate(pageId, {});
  });
}
