// ===== 下拉菜单 =====
(function(){
  var OPTIONS = {
    '楼栋': ['1号楼','2号楼','3号楼','4号楼','全部'],
    '楼层': ['1层','2层','3层','全部'],
    '空间状态': ['全部','已租','空置','即将到期','停用'],
    '空间类型': ['全部','厂房','仓库','办公'],
    '企业类型': ['承租企业','合作企业','服务商'],
    '行业类型': ['全部','纺织印花','纺织','包装','科技','其他'],
    '入驻状态': ['全部','已入驻','待入驻','已退租'],
    '合同状态': ['全部','正常','即将到期','已到期','已终止'],
    '欠费状态': ['全部','正常','欠费'],
    '费用状态': ['全部','已缴清','部分缴纳','欠费'],
    '费用类型': ['全部','租金','物业费','其他费用'],
    '账期': ['2026-05','2026-04','2026-03','2026-02','2026-01'],
    '余额状态': ['全部','正常','偏低','余额不足'],
    '进出口': ['全部','南门','北门','东门'],
    '车辆类型': ['全部','小型车','货车','中型客车'],
    '进出状态': ['全部','在场','已出场'],
    '日期': ['2026-05-22','2026-05-21','2026-05-20','近7天','近30天'],
    '付款周期': ['月付','季付','半年付','年付'],
    '合同类型': ['厂房租赁合同','补充协议','服务合同'],
    '退租原因': ['合同到期不续租','协商退租','经营调整','其他'],
    '终止类型': ['协商终止','到期终止','违约终止'],
    '授权状态': ['全部','正常','即将到期','已过期','已禁用'],
    '门禁点位': ['全部','1号楼大厅','1-1-101','1-1-201','1-1-105']
  };

  var activeMenu = null;

  function getLabel(el) {
    // Return the first text node content, ignoring child elements like <i>
    var t = '';
    el.childNodes.forEach(function(n){
      if (n.nodeType === 3) t += n.textContent;
      else if (n.tagName !== 'I' && n.tagName !== 'SPAN') t += n.textContent;
    });
    return t.trim();
  }

  function getOptions(el) {
    var label = getLabel(el);
    // Try exact match
    if (OPTIONS[label]) return OPTIONS[label];
    // Try partial match
    for (var k in OPTIONS) {
      if (label.indexOf(k) !== -1 || k.indexOf(label) !== -1) return OPTIONS[k];
    }
    // Fallback: return the current text as sole option
    return [label];
  }

  function closeMenu() {
    if (activeMenu) { activeMenu.classList.remove('show'); activeMenu = null; }
  }

  document.addEventListener('click', function(e){
    var sel = e.target.closest('.select');
    if (!sel) { closeMenu(); return; }
    // Skip if .select contains a native <select> element
    if (sel.querySelector('select')) { closeMenu(); return; }

    // If clicking the same select, toggle
    var existing = sel.querySelector('.dropdown-menu');
    if (existing && existing.classList.contains('show')) {
      closeMenu();
      return;
    }

    closeMenu();

    // Create or reuse dropdown
    if (!existing) {
      var ul = document.createElement('ul');
      ul.className = 'dropdown-menu';
      var opts = getOptions(sel);
      var cur = getLabel(sel);
      opts.forEach(function(o){
        var li = document.createElement('li');
        li.className = 'dropdown-option' + (o === cur ? ' active' : '');
        li.textContent = o;
        li.addEventListener('mousedown', function(ev){
          ev.preventDefault(); // prevent blur/close before update
          // Update select text
          sel.childNodes.forEach(function(n){
            if (n.nodeType === 3) { n.textContent = o; return; }
            if (n.tagName === 'I' || n.tagName === 'SPAN') return;
            n.textContent = o;
          });
          // If text node not found, set firstChild
          var first = sel.firstChild;
          if (first && first.nodeType === 3) first.textContent = o;
          // Update active class
          ul.querySelectorAll('.dropdown-option').forEach(function(x){ x.classList.remove('active'); });
          li.classList.add('active');
          closeMenu();
        });
        ul.appendChild(li);
      });
      sel.appendChild(ul);
      existing = ul;
    }

    existing.classList.add('show');
    activeMenu = existing;
  });
})();

// ===== 优化新增：顶部提醒条 =====
function showAlert(msg, kind) {
  var wrap = document.querySelector('.workspace');
  if (!wrap) return;
  var existing = wrap.querySelector('.alert-banner');
  if (existing) existing.remove();
  var el = document.createElement('div');
  el.className = 'alert-banner';
  el.innerHTML = '<span style="color:#c00">⚠ ' + msg + '</span><button style="border:0;background:none;color:var(--muted);cursor:pointer;font-size:18px;" onclick="this.parentElement.remove()">×</button>';
  wrap.insertBefore(el, wrap.firstChild);
}

// ===== 优化新增：进度条渲染 =====
function createProgressBar(container, label, current, total, colorClass) {
  var pct = total > 0 ? Math.round(current / total * 100) : 0;
  var wrap = document.createElement('div');
  wrap.className = 'progress-bar-wrap';
  wrap.innerHTML = '<span style="min-width:80px">' + label + '</span>' +
    '<span class="bar"><span class="fill ' + (colorClass || 'green') + '" style="width:' + pct + '%"></span></span>' +
    '<span class="pct">' + current + '/' + total + ' (' + pct + '%)</span>';
  var target = document.querySelector(container);
  if (target) target.appendChild(wrap);
}

// ===== 优化新增：6月趋势柱状图 =====
function renderTrendChart(container, data, title) {
  var wrap = document.createElement('div');
  wrap.className = 'chart-container';
  wrap.innerHTML = '<div style="font-weight:800;margin-bottom:10px">' + (title || '') + '</div>';
  var maxVal = Math.max.apply(null, data.map(function(d){ return d.value; }));
  var row = document.createElement('div');
  row.className = 'chart-row';
  data.forEach(function(d){
    var col = document.createElement('div');
    col.className = 'chart-bar-col';
    var h = maxVal > 0 ? (d.value / maxVal * 140) : 0;
    col.innerHTML = '<div class="bar" style="height:' + h + 'px"></div><div class="value">' + d.value + '</div>';
    var label = document.createElement('div');
    label.className = 'label';
    label.textContent = d.label;
    col.appendChild(label);
    row.appendChild(col);
  });
  wrap.appendChild(row);
  var target = document.querySelector(container);
  if (target) target.appendChild(wrap);
}

// ===== 优化新增：文件上传模拟 =====
function simulateUpload(accept) {
  var input = document.createElement('input');
  input.type = 'file';
  if (accept) input.accept = accept;
  input.style.display = 'none';
  document.body.appendChild(input);
  input.addEventListener('change', function(){
    if (!input.files || !input.files.length) return;
    var name = input.files[0].name;
    var zone = input._zone;
    if (zone) {
      var fileRow = document.createElement('div');
      fileRow.className = 'upload-file';
      fileRow.innerHTML = '<span>📄 ' + name + '</span><span class="remove" onclick="this.parentElement.remove()">✕</span>';
      zone.parentElement.insertBefore(fileRow, zone.nextSibling);
    }
    document.body.removeChild(input);
  });
  input.click();
  return input;
}
