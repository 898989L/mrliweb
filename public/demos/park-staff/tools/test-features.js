/* 验证停车详情/水电预缴/首页 hero 三个新功能 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const stub = `
  const document = { body: { dataset: {} }, addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ classList: { add: () => {} }, addEventListener: () => {}, remove: () => {}, style: {}, dataset: {}, innerHTML: '', appendChild: () => {} }) };
  const window = { location: { href: '', search: '' }, localStorage: { getItem: () => null, setItem: () => {} } };
  const localStorage = window.localStorage;
  const URLSearchParams = class { toString() { return ''; } };
  const state = { roleId: 'inspector', parkId: 'park1', subPage: null, subPageParams: {}, pageStack: [] };
`;

const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8') + '\n' +
             fs.readFileSync(path.join(__dirname, '..', 'js', 'data-detail.js'), 'utf8') + '\n' +
             fs.readFileSync(path.join(__dirname, '..', 'js', 'renderers.js'), 'utf8');

const fn = new Function(stub + '\n' + code + '\nreturn { PAGE_RENDERERS, state };');
const { PAGE_RENDERERS, state } = fn();

let pass = 0, fail = 0;
function check(name, ok) { (ok ? pass++ : fail++); console.log((ok ? '✓ ' : '✗ ') + name); }
function section(name) { console.log('\n--- ' + name + ' ---'); }

/* ============ 1. 停车详情 ============ */
section('停车详情(parking-detail)');
{
  const html = PAGE_RENDERERS['parking-detail']({ id: 'p01' });
  check('月卡车辆显示免停车费', html.includes('月卡状态') && html.includes('免停车费'));
  check('显示车位号', html.includes('A-012'));
  check('显示关联企业', html.includes('紫华科技'));
  check('显示状态 进行中', html.includes('进行中'));
}
{
  const html = PAGE_RENDERERS['parking-detail']({ id: 'p02' });
  check('临时车显示应付费用', html.includes('应付费用') && html.includes('¥19'));
  check('未关联企业显示外来访客', html.includes('外来访客'));
  check('进行中状态有预付按钮', html.includes('预付 / 登记'));
}
{
  const html = PAGE_RENDERERS['parking-detail']({ id: 'p06' });
  check('欠费状态有催办+收款按钮', html.includes('登记收款') && html.includes('提醒车主'));
}

/* ============ 2. 停车列表点击 ============ */
section('停车列表卡片可点击');
{
  const html = PAGE_RENDERERS['parking-list']({ filter: 'all' });
  const cardCount = (html.match(/data-page="parking-detail"/g) || []).length;
  check('每条记录都有跳转链接', cardCount >= 10);
  check('列表展示车辆类型标签', html.includes('月卡') && html.includes('临时') && html.includes('免费'));
  check('列表展示关联企业', html.includes('紫华科技') && html.includes('联讯电子'));
}

/* ============ 3. 水电预缴 ============ */
section('水电预缴展示(全部预缴)');
{
  const html = PAGE_RENDERERS['utility-company']({ filter: 'all' });
  check('列表有 预缴 标签', html.includes('预缴'));
  /* 新模型:不出现"后付"二字 */
  check('不应出现 后付 字样', !html.includes('后付'));
  check('出现 待充值 (c06 余额为 0)', html.includes('待充值'));
  check('预缴余额展示(联讯电子 ¥12,480)', html.includes('¥12,480'));
}
{
  const html = PAGE_RENDERERS['utility-company-detail']({ id: 'c02' });
  check('企业详情显示付费模式 预缴', html.includes('预缴'));
  check('企业详情显示余额 ¥12,480', html.includes('¥12,480'));
  check('企业详情显示上次充值时间', html.includes('2026-05-15'));
  /* c02 余额 12480 < 本月 20130:既不显示"提醒"也不显示"预计可用" */
  check('c02 余额不足时不显示 提醒 行', !html.includes('>提醒<'));
  check('c02 余额不足时不显示 预计可用 行', !html.includes('预计可用'));
}
{
  const html = PAGE_RENDERERS['utility-company-detail']({ id: 'c06' });
  /* c06 余额 0,显示"待充值" */
  check('余额 0 企业显示 待充值', html.includes('待充值'));
  check('余额 0 企业提示尽快充值', html.includes('尽快充值'));
}
{
  const html = PAGE_RENDERERS['utility-company-detail']({ id: 'c01' });
  /* c01 余额 3260 < 本月 16925:同样不显示"提醒"行 */
  check('c01 余额不足时不显示 提醒 行', !html.includes('>提醒<'));
}
{
  /* 通用清理:删除饼图、本月预估、提醒 */
  const htmlAll = ['c01', 'c02', 'c05', 'c06'].map(id => PAGE_RENDERERS['utility-company-detail']({ id })).join('');
  check('utility-company-detail 不再有 pie-section 饼图', !htmlAll.includes('pie-section'));
  check('utility-company-detail 不再有 pie-chart', !htmlAll.includes('pie-chart'));
  check('utility-company-detail 不再有 本月预估', !htmlAll.includes('本月预估'));
}
{
  const html = PAGE_RENDERERS['utility-dashboard']({});
  check('dashboard 已删除"预缴总余额"', !html.includes('预缴总余额'));
  check('dashboard 不再出现"后付企业"', !html.includes('后付企业'));
}

/* ============ 4. 首页 hero 按钮可点击 ============ */
/* ============ 4b. 费用中心新设计(fee-dashboard) ============ */
section('费用中心 · 重做(fee-dashboard)');
{
  const html = PAGE_RENDERERS['fee-dashboard']({});
  /* 1. 月份切换器(默认当前月) */
  check('含月份下拉触发器', /id="monthPickerTrigger"/.test(html));
  check('触发器默认显示 2026 年 6 月', /2026 年 6 月/.test(html));
  /* 2. 应收/已收/待收 3 列总览 */
  check('含 fee-balance-card 总览卡', html.includes('fee-balance-card'));
  check('显示本月应收(数字 ¥457,200)', html.includes('¥457,200'));
  check('显示已收(¥329,400)', html.includes('¥329,400'));
  check('显示待收(¥127,800)', html.includes('¥127,800'));
  check('显示收缴率(72%)', html.includes('72%'));
  /* 3 列改为 收缴率(原来是欠款企业数) */
  check('3 列布局含"收缴率"标签', /fee-balance-col-label">收缴率/.test(html));
  check('收缴率列显示百分比', /fee-balance-col-val">\d+<span class="fee-balance-col-unit">%<\/span>/.test(html));
  /* 3. 催收优先级已删除 */
  check('催收优先级 标题已删除', !html.includes('催收优先级'));
  check('dunning-card 容器已删除', !html.includes('dunning-card'));
  /* 4. 各企业缴费情况(进度条 + 状态标签) */
  check('含"各企业缴费情况"标题', html.includes('各企业缴费情况'));
  check('含 fee-company-card 列表项(>=5)', (html.match(/fee-company-card/g) || []).length >= 5);
  check('含已结清/部分缴/欠费 状态标签',
    html.includes('已结清') && html.includes('部分缴') && html.includes('欠费'));
  check('进度条按收缴率展示',
    /fee-company-bar" style="width: \d+%/.test(html));
  /* 5. 公司卡点击应跳到 fee-bill-detail?id=b04(联讯电子房租) */
  check('公司卡跳转到 fee-bill-detail?id=b04',
    (html.match(/data-page="fee-bill-detail" data-params='\{"id":"b04"\}'/g) || []).length >= 5);
  check('公司卡不再跳 company-detail',
    !/data-page="company-detail" data-params='\{"id":"c\d{2}"\}'/.test(html));
  /* 6. 催缴流水 section 已从中间删除 */
  check('催缴流水 section 已删除', !/section-title">催缴流水/.test(html));
  check('不再有 dunning-list card-row 列表(3 条)',
    !/<div class="card-row" data-page="fee-dunning-list">/.test(html));
  check('快捷操作 section 已删除', !/section-title">快捷操作/.test(html));
  /* 6.1 各企业缴费情况 section-more 改为"催缴记录",点击进入 fee-dunning-list */
  check('各企业缴费情况 section-more 改为"催缴记录"',
    /section-more" data-page="fee-dunning-list">催缴记录/.test(html));
  /* 7. 跳到费用分析 */
  check('sub-action 跳到费用分析',
    /<button class="sub-action" data-page="fee-analysis">分析<\/button>/.test(html));
}

section('企业详情(company-detail) · 基础信息字段');
{
  const html = PAGE_RENDERERS['company-detail']({ id: 'c01' });
  /* 基本信息 */
  check('含统一信用码', /统一信用码/.test(html));
  check('含企业类型', /企业类型/.test(html));
  check('含行业类型', /行业类型/.test(html));
  check('含企业规模', /企业规模/.test(html));
  check('含入驻位置', /入驻位置/.test(html));
  check('含入驻期', /入驻期/.test(html));
  /* 联系人 */
  check('含法定代表人', /法定代表人/.test(html));
  check('含企业负责人', /企业负责人/.test(html));
  check('含园区经办人', /园区经办人/.test(html));
  check('含财务联系人', /财务联系人/.test(html));
  check('含业务联系人', /业务联系人/.test(html));
  check('含邮箱字段', /邮箱/.test(html));
  /* c01 实际数据 */
  check('c01:展示统一信用码 91110108MA0Y2X3K8L', html.includes('91110108MA0Y2X3K8L'));
  check('c01:展示法人 吴志伟', html.includes('吴志伟'));
  check('c01:展示法人电话 138-0001-2345', html.includes('138-0001-2345'));
  check('c01:展示园区经办人 罗主管', html.includes('罗主管'));
  check('c01:展示财务联系人 肖会计', html.includes('肖会计'));
  check('c01:展示企业类型 承租企业', html.includes('承租企业'));
  check('c01:展示企业备注', html.includes('企业备注'));
  /* 合同 + 账单 仍然存在 */
  check('保留合同 section', /detail-section-title">合同/.test(html));
  check('保留账单 section', /detail-section-title">账单/.test(html));
}

section('合同 PDF 附件 + 预览');
{
  const html = PAGE_RENDERERS['contract-detail']({ id: 'ct01' });
  /* 合同附件 section */
  check('含"合同附件"section', /detail-section-title">合同附件/.test(html));
  check('含 PDF 卡片(可点击)', /class="contract-pdf-card" data-ct-pdf=/.test(html));
  check('PDF 卡片含文件名 联讯电子-租赁合同',
    html.includes('联讯电子-租赁合同-HT-2026-0603-001.pdf'));
  check('PDF 卡片含文件大小 1.2 MB', html.includes('1.2 MB'));
  check('PDF 卡片含 4 页', html.includes('4 页'));
  check('查看按钮存在', /contract-pdf-btn">查看<\/button>/.test(html));
  /* 其他 5 个合同也都有 PDF 字段 */
  ['ct02', 'ct03', 'ct04', 'ct05', 'ct06'].forEach(id => {
    const h = PAGE_RENDERERS['contract-detail']({ id });
    check(`${id}:含 PDF 卡片`, /class="contract-pdf-card"/.test(h));
  });

  /* PDF 预览弹层函数存在性 */
  const rendererCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'renderers.js'), 'utf8');
  check('openContractPdf 函数已定义', /function openContractPdf\(/.test(rendererCode));
  check('buildPdfPage 函数已定义', /function buildPdfPage\(/.test(rendererCode));
  check('data-ct-pdf 点击事件已绑定', /data-ct-pdf.*?openContractPdf/s.test(rendererCode));

  /* CSS 检查 */
  const cssText3 = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  check('contract-pdf-card CSS', /\.contract-pdf-card\s*\{/.test(cssText3));
  check('contract-pdf-icon CSS', /\.contract-pdf-icon\s*\{/.test(cssText3));
  check('contract-pdf-btn CSS', /\.contract-pdf-btn\s*\{/.test(cssText3));
  check('pdf-viewer CSS', /\.pdf-viewer\s*\{/.test(cssText3));
  check('pdf-viewer-panel CSS', /\.pdf-viewer-panel\s*\{/.test(cssText3));
  check('pdf-page CSS', /\.pdf-page\s*\{/.test(cssText3));
  check('pdf-page-title CSS', /\.pdf-page-title\s*\{/.test(cssText3));
  check('pdf-page-clause CSS', /\.pdf-page-clause\s*\{/.test(cssText3));
  check('pdf-page-sign CSS', /\.pdf-page-sign\s*\{/.test(cssText3));
}

section('费用中心 · 各企业 filter(全部/欠费/已结清)');
{
  /* filter=all(默认) */
  const all = PAGE_RENDERERS['fee-dashboard']({});
  const owed = PAGE_RENDERERS['fee-dashboard']({ filter: 'owed' });
  const paid = PAGE_RENDERERS['fee-dashboard']({ filter: 'paid' });

  check('filter-bar 包含 全部/欠费/已结清 三项',
    /filter-item[^"]*"[^>]*>全部<\/button>/.test(all)
    && /filter-item[^"]*"[^>]*>欠费<\/button>/.test(all)
    && /filter-item[^"]*"[^>]*>已结清<\/button>/.test(all));
  check('filter=all 时 5 家企业全展示',
    ((all.match(/fee-company-card/g) || []).length) === 5);

  /* 取出"各企业缴费情况"section 后的子串(避免催缴流水 section 干扰) */
  const sliceFrom = (html) => {
    const i = html.indexOf('各企业缴费情况');
    return i < 0 ? '' : html.slice(i);
  };
  const sliceAll = sliceFrom(all);
  const sliceOwed = sliceFrom(owed);
  const slicePaid = sliceFrom(paid);

  /* filter=owed */
  check('filter=owed 紫华科技(欠款)展示', sliceOwed.includes('紫华科技'));
  check('filter=owed 联讯电子(部分缴)展示', sliceOwed.includes('联讯电子'));
  check('filter=owed 正方咨询(欠款)展示', sliceOwed.includes('正方咨询'));
  check('filter=owed 宏达包装(已结清)不展示', !sliceOwed.includes('宏达包装'));
  check('filter=owed 启航软件(已结清)不展示', !sliceOwed.includes('启航软件'));

  /* filter=paid */
  check('filter=paid 宏达包装(已结清)展示', slicePaid.includes('宏达包装'));
  check('filter=paid 启航软件(已结清)展示', slicePaid.includes('启航软件'));
  check('filter=paid 紫华科技(欠款)不展示', !slicePaid.includes('紫华科技'));
  check('filter=paid 联讯电子(部分缴)不展示', !slicePaid.includes('联讯电子'));

  /* filter bar 携带 month 参数 */
  check('filter 链接保留 month 参数(防止切 filter 后丢月份)',
    /data-page="fee-dashboard" data-params='\{"filter":"owed","month":"\d{4}-\d{2}"\}'/.test(all));
  check('filter=owed 高亮', /filter-item active"[^>]*>欠费/.test(owed));
  check('filter=paid 高亮', /filter-item active"[^>]*>已结清/.test(paid));
  check('filter=all 高亮', /filter-item active"[^>]*>全部/.test(all));
}

section('费用中心 · 月份切换(历史月)');
{
  const may = PAGE_RENDERERS['fee-dashboard']({ month: '2026-05' });
  check('5 月:触发器显示 2026 年 5 月', /2026 年 5 月/.test(may));
  check('5 月:总览卡改为历史月份样式(应收 ¥450,000)',
    may.includes('¥450,000'));
  check('5 月:已收 ¥350,000', may.includes('¥350,000'));
  check('5 月:待收 ¥100,000', may.includes('¥100,000'));
  check('5 月:不展示各企业明细(历史月无细数据)',
    /历史月份仅展示汇总数据/.test(may) || !may.includes('fee-company-card'));
  check('5 月:hero 不含 fee-company-card', !may.includes('fee-company-card'));

  const old = PAGE_RENDERERS['fee-dashboard']({ month: '2025-07' });
  check('跨年:2025 年 7 月 触发器', /2025 年 7 月/.test(old));
  check('跨年:7 月应收 ¥380,000', old.includes('¥380,000'));
}

section('费用分析(fee-analysis)');
{
  const html = PAGE_RENDERERS['fee-analysis']({});
  check('页面存在', html.length > 100);
  /* 顶部月份下拉触发器已去掉(由 fee-dashboard 跳来时自带 month 参数) */
  check('不含月份下拉触发器', !/id="monthPickerTrigger"/.test(html));
  check('含收缴率大盘卡', html.includes('fee-stat-card'));
  check('收缴率卡片显示百分比', /fee-stat-card-value">\d+/.test(html));
  /* 不再展示近 12 月收缴率趋势 */
  check('不含"近 N 月收缴率"标题', !/近\s*\d+\s*月收缴率/.test(html));
  check('不含 chart-bar-wrap(趋势已删除)', (html.match(/chart-bar-wrap/g) || []).length === 0);
  /* 已收/待收 环形图 */
  check('含"已收 / 待收 占比"section', /section-title">已收 \/ 待收 占比/.test(html));
  check('含 2 个 donut svg', (html.match(/<svg class="fee-donut"/g) || []).length === 2);
  /* 费用类型占比 环形图 */
  check('含"费用类型占比"section', html.includes('费用类型占比'));
  check('含物业费/房租 类型', html.includes('物业费') && html.includes('房租'));
  /* 各企业收缴率 横向条形图 */
  check('含"各企业收缴率"section', html.includes('各企业收缴率'));
  check('含 5 行 fee-rate-row', (html.match(/fee-rate-row/g) || []).length === 5);
  check('各企业行跳转到 fee-bill-detail?id=b04',
    (html.match(/fee-rate-row" data-page="fee-bill-detail" data-params='\{"id":"b04"\}'/g) || []).length === 5);
  check('图例每项金额正常展示(无省略号)',
    html.includes('¥329,400') && html.includes('¥127,800'));

  /* 催缴流水入口已删除(分析页) */
  check('费用分析不含"快捷操作"section', !/section-title">快捷操作/.test(html));
  check('费用分析不含 dunning-list 入口(已删除催缴流水快捷入口)',
    !/data-page="fee-dunning-list"/.test(html));

  /* 月份切换:历史月(由 fee-dashboard 跳转带入 month 参数) */
  const mar = PAGE_RENDERERS['fee-analysis']({ month: '2026-03' });
  check('切到 3 月:大盘卡标签为 "2026-03"',
    /fee-stat-card-label">2026-03 收缴率/.test(mar));
  check('切到 3 月:应收 ¥380,000', mar.includes('¥380,000'));
  check('切到 3 月:仍含 2 个环形 svg', (mar.match(/<svg class="fee-donut"/g) || []).length === 2);
  check('切到 3 月:仍含各企业收缴率 5 行', (mar.match(/fee-rate-row/g) || []).length === 5);

  /* 页面文件存在性 */
  const pageFile = path.join(__dirname, '..', 'pages', 'fee-analysis.html');
  check('pages/fee-analysis.html 文件存在', fs.existsSync(pageFile));

  /* CSS 检查 */
  const cssText = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  check('fee-balance-card CSS', /\.fee-balance-card\s*\{/.test(cssText));
  check('fee-company-card CSS', /\.fee-company-card\s*\{/.test(cssText));
  check('fee-stat-card CSS', /\.fee-stat-card\s*\{/.test(cssText));
  check('fee-donut CSS', /\.fee-donut\s*\{/.test(cssText));
  check('fee-rate-row CSS', /\.fee-rate-row\s*\{/.test(cssText));
  /* 饼图旁文字改为"下置"布局(不容忍省略号) */
  check('fee-chart-row 改为垂直 flex(column)',
    /\.fee-chart-row\s*\{[^}]*flex-direction:\s*column/.test(cssText));
  check('fee-chart-legend-val 不再使用 text-overflow:ellipsis',
    !/\.fee-chart-legend-val\s*\{[^}]*text-overflow:\s*ellipsis/.test(cssText));
  /* dunning 相关 CSS 已不再使用(可保留但不应被 fee-dashboard 渲染) */
}

section('园区整体分析(park-analysis)');
{
  const html = PAGE_RENDERERS['park-analysis']({});
  check('页面存在', html.length > 100);
  /* 顶部无月份下拉(整体分析,不切月) */
  check('不含月份下拉触发器', !/id="monthPickerTrigger"/.test(html));
  /* 总览 */
  check('含"2026 年园区整体"标题', /2026 年园区整体/.test(html));
  check('总览含水+电用量 + 费用应收',
    /park-analysis-stat-label">水\+电用量/.test(html)
    && /park-analysis-stat-label">费用应收/.test(html));
  /* 水电分布 */
  check('含"用水量 / 用电量"两个 stat',
    /park-analysis-stat-label">用水量/.test(html)
    && /park-analysis-stat-label">用电量/.test(html));
  /* 费用 */
  check('费用三列(应收/已收/待收)',
    /park-analysis-stat-label">应收/.test(html)
    && /park-analysis-stat-label">已收/.test(html)
    && /park-analysis-stat-label">待收/.test(html));
  /* 关键指标(本年 + 月均) */
  check('关键指标含月均应收/年累计收缴率/月均水+电用量',
    html.includes('月均应收')
    && html.includes('年累计收缴率')
    && html.includes('月均水+电用量'));
  /* 快捷入口(顶部紧凑 chip,2 个:水电总览 / 费用中心) */
  check('含 park-analysis-quick 紧凑入口容器',
    /class="park-analysis-quick"/.test(html));
  check('快捷入口含水电总览 / 费用中心',
    html.includes('水电总览') && html.includes('费用中心'));
  check('快捷入口可点击跳 utility-dashboard',
    /data-page="utility-dashboard"/.test(html));
  check('快捷入口可点击跳 fee-dashboard',
    /data-page="fee-dashboard"/.test(html));
  /* 不再用"快捷入口"section + card-row 旧样式 */
  check('不再使用"快捷入口"section 标题',
    !/section-title">快捷入口/.test(html));
  /* 趋势:今年 1-6 月(水电 6 + 费用 6) */
  check('含 12 个 trend 列(水电 6 + 费用 6)',
    (html.match(/park-analysis-trend-col/g) || []).length === 12);
  /* 全部趋势列均为 .sel(均为今年) */
  check('12 个 .sel 标签(今年 6 月 × 2 组)',
    (html.match(/park-analysis-trend-col sel/g) || []).length === 12);
  check('今年 1-6 月用量趋势文字', html.includes('今年 1-6 月用量趋势'));
  check('今年 1-6 月已收 / 待收文字', html.includes('今年 1-6 月已收 / 待收'));

  /* 月份参数被忽略(无月份切换) */
  const jan = PAGE_RENDERERS['park-analysis']({ month: '2026-01' });
  check('传 month 参数也只展示今年整体,无月份切换',
    jan.includes('2026 年园区整体') && !/2026 年 1 月/.test(jan));

  /* 页面文件存在性 */
  const parkPageFile = path.join(__dirname, '..', 'pages', 'park-analysis.html');
  check('pages/park-analysis.html 文件存在', fs.existsSync(parkPageFile));

  /* CSS 检查 */
  const cssText = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  check('park-analysis-card CSS', /\.park-analysis-card\s*\{/.test(cssText));
  check('park-analysis-stat-value 大数字不溢出(word-break)',
    /\.park-analysis-stat-value\s*\{[^}]*word-break:\s*break-all/.test(cssText));
  check('park-analysis-total-row 上下结构',
    /\.park-analysis-total-row\s*\{/.test(cssText));
  check('park-analysis-bar CSS', /\.park-analysis-bar\s*\{/.test(cssText));
  check('park-analysis-kpi-row CSS', /\.park-analysis-kpi-row\s*\{/.test(cssText));
}

section('fee-bill-list · 删除 view=company');
{
  const html = PAGE_RENDERERS['fee-bill-list']({});
  check('fee-bill-list 不再含 view=company 链接',
    !/data-page="fee-bill-list" data-params='\{"view":"company"/.test(html));
  check('fee-bill-list 不再含"按账单/按企业"切换',
    !/按账单|按企业/.test(html));
  check('fee-bill-list 仅含 filter 切换(全部/欠费/已结清)',
    /data-page="fee-bill-list" data-params='\{"filter":"all"\}'/.test(html)
    && /data-page="fee-bill-list" data-params='\{"filter":"owed"\}'/.test(html)
    && /data-page="fee-bill-list" data-params='\{"filter":"paid"\}'/.test(html));
}

section('录收款弹层 · 改为自定义 action sheet');
{
  const renderersSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'renderers.js'), 'utf8');
  /* 不再使用浏览器原生 prompt(避免与 app 风格不一致) */
  check('act === \'record\' 已不再用 prompt()',
    !/act === 'record'[\s\S]{0,200}prompt\(/.test(renderersSrc));
  check('含 openRecordSheet 工具函数', /function openRecordSheet\(/.test(renderersSrc));
  check('openRecordSheet 含账单概要区(企业/类型/账期)',
    /record-sheet-bill[\s\S]{0,500}company[\s\S]{0,200}type[\s\S]{0,200}period/.test(renderersSrc));
  check('openRecordSheet 含快捷金额选项',
    /quickAmounts/.test(renderersSrc) && /data-amount/.test(renderersSrc));
  check('openRecordSheet 含自定义金额输入',
    /data-input[\s\S]{0,200}placeholder="0\.00"/.test(renderersSrc));

  const cssText = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  check('record-sheet-bill CSS', /\.record-sheet-bill\s*\{/.test(cssText));
  check('record-sheet-amounts 2 列 grid', /\.record-sheet-amounts\s*\{[\s\S]{0,200}grid-template-columns:\s*1fr 1fr/.test(cssText));
  check('record-sheet-chip CSS', /\.record-sheet-chip\s*\{/.test(cssText));
  check('record-sheet-custom-input CSS', /\.record-sheet-custom-input\s*\{/.test(cssText));
}

section('首页 · 财务/经理 增加费用分析入口');
{
  const homeFor = (rid) => {
    const saved = state.roleId;
    state.roleId = rid;
    const h = PAGE_RENDERERS['home']();
    state.roleId = saved;
    return h;
  };
  const finance = homeFor('finance');
  const manager = homeFor('manager');
  check('财务首页有"费用分析"按钮指向 fee-analysis',
    /<button[^>]*data-page="fee-analysis"[^>]*>[\s\S]{0,200}?ha-label">费用分析/.test(finance));
  check('经理首页有"费用分析"按钮指向 fee-analysis',
    /<button[^>]*data-page="fee-analysis"[^>]*>[\s\S]{0,200}?ha-label">费用分析/.test(manager));
  /* "查欠费"应使用 filter=owed(不再用 view=company) */
  check('财务"查欠费"用 filter=owed(不再 view=company)',
    /data-page="fee-bill-list" data-params='\{"filter":"owed"\}'/.test(finance));
  /* 其他角色(巡检员/运营专员)不应看到 fee-analysis 入口 */
  const inspector = homeFor('inspector');
  const operator = homeFor('operator');
  check('巡检员首页无费用分析入口', !/data-page="fee-analysis"/.test(inspector));
  check('运营专员首页无费用分析入口', !/data-page="fee-analysis"/.test(operator));
}

section('首页 · 财务/经理 增加园区分析入口');
{
  const homeFor = (rid) => {
    const saved = state.roleId;
    state.roleId = rid;
    const h = PAGE_RENDERERS['home']();
    state.roleId = saved;
    return h;
  };
  const finance = homeFor('finance');
  const manager = homeFor('manager');
  check('财务首页有"园区分析"按钮指向 park-analysis',
    /<button[^>]*data-page="park-analysis"[^>]*>[\s\S]{0,200}?ha-label">园区分析/.test(finance));
  check('经理首页有"园区分析"按钮指向 park-analysis',
    /<button[^>]*data-page="park-analysis"[^>]*>[\s\S]{0,200}?ha-label">园区分析/.test(manager));
  /* 其他角色(巡检员/运营专员/普通员工/企业业务)不应看到 park-analysis 入口 */
  const inspector = homeFor('inspector');
  const operator = homeFor('operator');
  const staff = homeFor('staff');
  const business = homeFor('business');
  check('巡检员首页无园区分析入口', !/data-page="park-analysis"/.test(inspector));
  check('运营专员首页无园区分析入口', !/data-page="park-analysis"/.test(operator));
  check('普通员工首页无园区分析入口', !/data-page="park-analysis"/.test(staff));
  check('企业业务首页无园区分析入口', !/data-page="park-analysis"/.test(business));
}

/* ============ 5. 预缴管理独立页 ============ */
section('预缴管理独立页(utility-prepaid)');
{
  const html = PAGE_RENDERERS['utility-prepaid']();
  check('页面存在', html.length > 100);
  check('不出现 后付 字样(新模型)', !html.includes('后付'));
  check('显示本月总用量', html.includes('本月总用量'));
  check('展示 8 家企业', (html.match(/data-page="utility-company-detail"/g) || []).length >= 8);
  check('每家企业展示水/电使用', html.includes('吨') && html.includes('度'));
  check('每家企业展示余额或待充值', html.includes('余额') || html.includes('待充值'));
  check('显示 hero-card 容器', html.includes('hero-card prepaid-hero'));
  /* hero-card CSS 校验 */
  const cssText = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  const heroCardCss = cssText.match(/\.hero-card\s*\{[^}]+\}/);
  check('.hero-card CSS 规则存在', !!heroCardCss);
  const prepaidHeroCss = cssText.match(/\.hero-card\.prepaid-hero\s*\{[^}]+\}/);
  check('.hero-card.prepaid-hero 渐变背景 CSS 存在', !!prepaidHeroCss);
}

/* ============ 6. 水电总览的预缴入口 ============ */
section('水电总览 预缴入口');
{
  const html = PAGE_RENDERERS['utility-dashboard']({});
  check('hero 卡可点击跳预缴管理', /<div class="util-balance-card"[^>]*data-page="utility-prepaid"/.test(html));
  check('dashboard 不再出现"后付企业"', !html.includes('后付企业'));
}

/* ============ 7. 水电总览新设计 ============ */
section('水电总览 · 拆分后(看当月)');
{
  const html = PAGE_RENDERERS['utility-dashboard']({});
  /* 1. 园区总体分析(当月 Hero) */
  check('hero 已删除"预缴总余额"', !html.includes('预缴总余额'));
  check('hero 已删除"余额可支撑"', !html.includes('余额可支撑'));
  check('hero 仍含 "本月预缴"', html.includes('本月预缴'));
  check('hero 仍含 "本月实际"', html.includes('本月实际'));
  check('hero 仍可跳预缴', /<div class="util-balance-card"[^>]*data-page="utility-prepaid"/.test(html));
  check('hero 含水/电色块(预缴 + 实际,各 2 条)', (html.match(/util-balance-bar water/g) || []).length >= 2 && (html.match(/util-balance-bar elec/g) || []).length >= 2);
  /* 2. 当月企业用量排名(8家全展示,数字前缀) */
  const companyRankCards = (html.match(/data-page="utility-company-detail"/g) || []).length;
  check('当月企业排名展示 8 家', companyRankCards >= 8);
  check('排名用 1./2./3. 数字前缀', html.includes('1.') && html.includes('2.') && html.includes('3.'));
  check('各企业使用情况标题', /各企业使用情况/.test(html));
  check('当月排名前 3 详细已删除', !html.includes('当月排名前 3'));
  /* 3. 数据导航已删除 */
  check('数据导航 区块已删除', !html.includes('数据导航'));
  check('每日明细入口已删除', !/<div class="card-row" data-page="utility-daily"/.test(html));
  check('企业用量入口已删除', !/<div class="card-row" data-page="utility-company"/.test(html));
  check('预缴管理 card-row 入口已删除', !/<div class="card-row" data-page="utility-prepaid"/.test(html));
  check('分析 card-row 入口已删除', !/<div class="card-row" data-page="utility-analysis"/.test(html));
  /* 但 hero 仍可跳预缴, sub-action 仍可跳分析 */
  check('hero 仍可跳预缴', html.includes('data-page="utility-prepaid"'));
  check('sub-action 仍可跳分析', html.includes('data-page="utility-analysis"'));
  /* 4. 12 月分析已移到 analysis 页面 */
  check('dashboard 不再含 12 月预缴 vs 实际', !html.includes('12 月 · 预缴 vs 实际'));
  check('dashboard 不再含 chart-bar prepaid/actual', !html.includes('chart-bar prepaid') && !html.includes('chart-bar actual'));
  check('顶部 mini-stat 导航已删除', !html.includes('每日明细 ›') || !html.includes('企业用量 ›'));
  /* CSS 校验 */
  const cssText = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  check('chart-bar.prepaid CSS', /\.chart-bar\.prepaid\s*\{/.test(cssText));
  check('chart-bar.actual CSS', /\.chart-bar\.actual\s*\{/.test(cssText));
  check('util-progress CSS', /\.util-progress\s*\{/.test(cssText));
  check('rank-badge CSS', /\.rank-badge\s*\{/.test(cssText));
  check('util-balance-card CSS', /\.util-balance-card\s*\{/.test(cssText));
  check('util-balance-bar.water CSS', /\.util-balance-bar\.water\s*\{/.test(cssText));
  check('util-balance-bar.elec CSS', /\.util-balance-bar\.elec\s*\{/.test(cssText));
  check('util-month-trigger CSS', /\.util-month-trigger\s*\{/.test(cssText));
  check('util-month-popup CSS', /\.util-month-popup\s*\{/.test(cssText));
  check('util-month-popup-item.active CSS', /\.util-month-popup-item\.active\s*\{/.test(cssText));
}

/* ============ 6b. 月份切换(utility-dashboard + utility-company-detail) ============ */
section('月份切换(utility-dashboard · 下拉触发器)');
{
  const defaultHtml = PAGE_RENDERERS['utility-dashboard']({});
  check('默认显示月份下拉触发器', /id="monthPickerTrigger"/.test(defaultHtml));
  check('触发器默认显示当前月(2026 年 6 月)', /2026 年 6 月/.test(defaultHtml));
  check('触发器含 ▾ 三角', defaultHtml.includes('util-month-trigger-caret'));

  /* 切到 2026-05 */
  const mayHtml = PAGE_RENDERERS['utility-dashboard']({ month: '2026-05' });
  check('5 月数据:水费按 24500 吨计算', mayHtml.includes('¥98,000'));
  check('5 月数据:电费按 151000 度计算', mayHtml.includes('¥113,250'));
  check('5 月数据:企业卡带 month 参数',
    /data-page="utility-company-detail" data-params='\{"id":"c\d{2}","month":"2026-05"\}'/.test(mayHtml));
  check('5 月数据:触发器显示 2026 年 5 月', /2026 年 5 月/.test(mayHtml));
  check('5 月数据:hero 标题显示月份', /2026年05月 水\/电收支/.test(mayHtml));

  /* 切到 2025-07(跨年) */
  const oldHtml = PAGE_RENDERERS['utility-dashboard']({ month: '2025-07' });
  check('跨年:触发器显示 2025 年 7 月', /2025 年 7 月/.test(oldHtml));
}

section('openMonthPicker 弹层(单元级)');
{
  /* 通过源码静态校验:openMonthPicker 函数存在、按年分组、含关闭、含 data-month-pick、含当前月 active 判断 */
  const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'renderers.js'), 'utf8');
  const cssText = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  const initSrc = fs.readFileSync(path.join(__dirname, '..', 'js', 'init.js'), 'utf8');
  check('openMonthPicker 函数已定义', /function openMonthPicker\s*\(/.test(src));
  check('openMonthPicker 按年分组', /monthsByYear|yearKeys/.test(src));
  check('openMonthPicker 含关闭按钮', /data-month-close/.test(src));
  check('openMonthPicker 含 data-month-pick', /data-month-pick=/.test(src));
  check('openMonthPicker 含当前月 active 判断', /active.*month === current/.test(src));
  check('util-month-popup-grid 4 列 CSS', /\.util-month-popup-grid[^}]*repeat\(4, 1fr\)/.test(cssText));
  /* 触发器绑定必须在内容渲染之后(否则 getElementById 拿不到元素) */
  const idxRender = initSrc.indexOf('contentEl.innerHTML = fn');
  const idxBind = initSrc.indexOf("getElementById('monthPickerTrigger')");
  check('月份触发器绑定在内容渲染之后(顺序正确)',
    idxRender > 0 && idxBind > 0 && idxBind > idxRender);
}

section('月份切换(utility-company-detail)');
{
  /* 当前月(c01) */
  const curHtml = PAGE_RENDERERS['utility-company-detail']({ id: 'c01' });
  check('当前月:hero 显示"本月水 + 电 合计"', curHtml.includes('本月水 + 电 合计'));
  check('当前月:含完整预缴信息(当前余额/上次充值)', curHtml.includes('当前余额') && curHtml.includes('上次充值'));

  /* 历史月(c01, 2026-05) */
  const mayHtml = PAGE_RENDERERS['utility-company-detail']({ id: 'c01', month: '2026-05' });
  check('5 月:hero 显示 2026-05', mayHtml.includes('2026-05'));
  check('5 月:显示"历史月份"标记', mayHtml.includes('历史月份'));
  check('5 月:水量被缩放(1820 * 24500/23800 ≈ 1874)', mayHtml.includes('1,874'));
  check('5 月:含提示"按园区总量等比换算"', mayHtml.includes('按园区总量等比换算'));
  check('5 月:预缴情况用"— 历史月份 —"', mayHtml.includes('— 历史月份 —'));
  check('5 月:detail 月度明细 tab 携带 month+trend 参数',
    /data-params='\{"id":"c01","month":"2026-05","trend":"daily"\}'/.test(mayHtml));
  check('5 月:近 6 月趋势 tab 携带 month+trend 参数',
    /data-params='\{"id":"c01","month":"2026-05","trend":"month"\}'/.test(mayHtml));

  /* 6 月趋势高亮选中月 */
  const mayTrendHtml = PAGE_RENDERERS['utility-company-detail']({ id: 'c01', month: '2026-05', trend: 'month' });
  check('5 月 + 6月趋势:含 chart-bar-wrap.sel', mayTrendHtml.includes('chart-bar-wrap sel'));

  /* 5 月 + 月度明细 tab:无日级数据,显示占位 */
  const mayDailyHtml = PAGE_RENDERERS['utility-company-detail']({ id: 'c01', month: '2026-05', trend: 'daily' });
  check('5 月 + 月度明细:显示"暂无日级明细"', mayDailyHtml.includes('暂无日级明细数据'));
  check('5 月 + 月度明细:含月合计', mayDailyHtml.includes('月合计'));
}

/* ============ 7b. 水电分析(近 6 月) ============ */
section('水电分析(utility-analysis)');
{
  /* 默认水页签 */
  const html = PAGE_RENDERERS['utility-analysis']({});
  check('页面存在', html.length > 100);
  check('水/电 页签在最顶部', html.indexOf('util-trend-tabs') < html.indexOf('hero-card'));
  check('水/电 页签存在', html.includes('💧 水') && html.includes('⚡ 电'));
  check('默认水页签激活', /util-trend-tab active[^"]*"[^>]*>💧 水/.test(html));
  check('水 hero 显示近 6 月累计水用量', html.includes('近 6 月累计水用量'));
  check('hero 显示日期范围', html.includes('2026-01 ~ 2026-06'));
  check('水 hero 显示累计水费', html.includes('累计水费'));
  check('水 hero 显示累计预缴', html.includes('累计预缴'));
  check('水 hero 显示差额', html.includes('差额'));
  check('6 月水预缴 vs 实际 柱图', html.includes('6 月 · 水预缴 vs 实际') && html.includes('chart-bar prepaid') && html.includes('chart-bar actual'));
  check('柱图带数字(千)', html.includes('chart-bar-num'));
  check('6 月水用量趋势', html.includes('6 月 · 水用量趋势'));
  check('水用量极值', html.includes('水用量极值') && html.includes('水用量最高') && html.includes('水用量最低'));
  check('水页签不出现电相关内容', !html.includes('电预缴 vs 实际') && !html.includes('电用量最高'));
  check('不再出现 12 月字样', !html.includes('12 月') && !html.includes('近 12'));
  /* 柱图条数 = 6 */
  const barCount = (html.match(/class="chart-bar water"/g) || []).length;
  check('用量趋势柱图 6 条', barCount === 6);
  const prepaidBarCount = (html.match(/class="chart-bar prepaid"/g) || []).length;
  check('预缴柱图 6 条', prepaidBarCount === 6);
  check('页面可跳回总览', html.includes('data-page="utility-dashboard"'));
}
{
  /* 切到电页签 */
  const html = PAGE_RENDERERS['utility-analysis']({ tab: 'electric' });
  check('电页签激活', /util-trend-tab active[^"]*"[^>]*>⚡ 电/.test(html));
  check('电 hero 显示近 6 月累计电用量', html.includes('近 6 月累计电用量'));
  check('电 hero 显示累计电费', html.includes('累计电费'));
  check('6 月电预缴 vs 实际 柱图', html.includes('6 月 · 电预缴 vs 实际'));
  check('6 月电用量趋势', html.includes('6 月 · 电用量趋势'));
  check('电用量极值', html.includes('电用量极值') && html.includes('电用量最高') && html.includes('电用量最低'));
  check('电页签不出现水相关内容', !html.includes('水预缴 vs 实际') && !html.includes('水用量最高'));
  check('电页签不再出现 12 月字样', !html.includes('12 月'));
}

/* ============ 8. 每日使用明细 ============ */
section('每日使用明细(utility-daily)');
{
  const html = PAGE_RENDERERS['utility-daily']({});
  check('页面存在', html.length > 100);
  check('显示日期 2026-06-03', html.includes('2026-06-03'));
  check('显示当日用水', html.includes('当日用水'));
  check('显示当日用电', html.includes('当日用电'));
  check('显示当日费用', html.includes('当日费用'));
  check('30 天柱图已删除(不再出现 近 30 天 标题)', !html.includes('近 30 天 · 水/电日用量'));
  check('不再出现 chart-bars 容器', !html.includes('chart-bars'));
  check('日期选择器(7 天)', (html.match(/data-page="utility-daily" data-params/g) || []).length >= 7);
  check('展示当日各企业用量', html.includes('当日各企业用量'));
  check('展示 8 家企业', (html.match(/data-page="utility-company-detail"/g) || []).length >= 8);
  check('当日费用构成已删除', !html.includes('当日费用构成'));
}
{
  /* 指定日期 */
  const html = PAGE_RENDERERS['utility-daily']({ date: '2026-06-01' });
  check('指定日期 2026-06-01', html.includes('2026-06-01'));
}
{
  const html = PAGE_RENDERERS['utility-daily']({ date: 'invalid-date' });
  check('非法日期回退到最后一天', html.includes('2026-06-03'));
}

/* ============ 9. 企业用量增强(6月趋势+预缴vs实际) ============ */
section('企业用量增强');
{
  const html = PAGE_RENDERERS['utility-company']({ filter: 'all' });
  check('每张企业卡含 6 月趋势柱图', (html.match(/title="水 \d+"/g) || []).length >= 8);
  check('预缴 vs 实际 进度条', html.includes('util-progress'));
  check('预缴金额标签', (html.match(/预缴 ¥/g) || []).length >= 8);
  check('缺额/OK 标识', html.includes('缺口') || html.includes('OK') || html.includes('待充值'));
}

/* ============ 10. 企业用量详情增强(页签切换) ============ */
section('企业用量详情 · 用量趋势页签');
{
  const html = PAGE_RENDERERS['utility-company-detail']({ id: 'c01' });
  check('含用量趋势标题', html.includes('用量趋势'));
  check('含 util-trend-tabs 页签容器', html.includes('util-trend-tabs'));
  check('两个页签(月度明细/近6月趋势)', html.includes('月度明细') && html.includes('近 6 月趋势'));
  check('页签可点击跳转 detail 带 trend', /data-page="utility-company-detail" data-params='\{"id":"c01","month":"\d{4}-\d{2}","trend":"daily"\}'/.test(html));
  check('页签可点击 6 月', /data-params='\{"id":"c01","month":"\d{4}-\d{2}","trend":"month"\}'/.test(html));
  /* 默认(daily)展示 30 天列表 */
  check('默认展示 30 天列表', html.includes('util-daily-list'));
  check('30 天数据行(30 行)', (html.match(/util-daily-list-row/g) || []).length >= 30);
}
{
  /* 切到 month */
  const html = PAGE_RENDERERS['utility-company-detail']({ id: 'c01', trend: 'month' });
  check('month tab 默认显示 6 月柱图', html.includes('chart-bar-num'));
  check('month tab 显示 千吨/千度 图例', html.includes('水(千吨)') && html.includes('电(千度)'));
  check('month tab 不再显示 30 天列表', !html.includes('util-daily-list'));
  check('month tab 是激活状态', html.includes('util-trend-tab active') && /trend":"month[^"]*"[^>]*>近 6 月趋势/.test(html));
}

/* ============ 11. UTILITY.daily 数据校验 ============ */
section('UTILITY.daily 数据结构');
{
  const stub2 = `
    const document = { body: { dataset: {} }, addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ classList: { add: () => {} }, addEventListener: () => {}, remove: () => {}, style: {}, dataset: {}, innerHTML: '', appendChild: () => {} }) };
    const window = { location: { href: '', search: '' }, localStorage: { getItem: () => null, setItem: () => {} } };
    const localStorage = window.localStorage;
  `;
  const fn2 = new Function(stub2 + '\n' +
    fs.readFileSync(path.join(__dirname, '..', 'js', 'data-detail.js'), 'utf8') + '\n' +
    'return UTILITY;');
  const u = fn2();
  check('UTILITY.daily 是数组', Array.isArray(u.daily));
  check('UTILITY.daily 长度 = 30', u.daily.length === 30);
  check('第一条日期 2026-05-05', u.daily[0].date === '2026-05-05');
  check('最后一条日期 2026-06-03', u.daily[u.daily.length - 1].date === '2026-06-03');
  check('每条包含 water/electric/companies', u.daily.every(d => d.water > 0 && d.electric > 0 && Array.isArray(d.companies) && d.companies.length === 8));
  check('monthly 含 prepaid 字段', u.monthly.every(m => typeof m.prepaid === 'number'));
}

/* ============ 12. 不再显示"余额不足/缺口/需关注"等文字 ============ */
section('文字清理:不再显示 余额不足/缺口');
{
  const pages = [
    'utility-dashboard', 'utility-daily', 'utility-prepaid',
    'utility-company', 'utility-company-detail'
  ];
  for (const pid of pages) {
    const html = pid.includes('detail') || pid === 'utility-company'
      ? PAGE_RENDERERS[pid]({ id: pid.includes('detail') ? 'c01' : 'all' })
      : PAGE_RENDERERS[pid]({});
    check(`[${pid}] 不显示 余额不足`, !html.includes('余额不足'));
    check(`[${pid}] 不显示 缺口`, !html.includes('缺口'));
  }
  /* utility-prepaid 不再展示"需关注"独立区 */
  const prepaidHtml = PAGE_RENDERERS['utility-prepaid']();
  check('utility-prepaid 不再有"需关注"独立区', !/需关注\(\d+\)/.test(prepaidHtml) && !/需关注<\/div>/.test(prepaidHtml));
  check('utility-prepaid 用 util-attn-icon 表示预警', prepaidHtml.includes('util-attn-icon'));
}

section('首页 hero 按钮可点击');
function checkRole(roleId, expectedPages, expectedToasts, expectedTodoMore) {
  state.roleId = roleId;
  const html = PAGE_RENDERERS['home']();
  /* 只数 hero 内的 data-page / data-toast(section-more 不算) */
  const heroBlock = html.match(/<div class="hero-actions">[\s\S]*?<\/div>\s*<\/div>/);
  const heroHtml = heroBlock ? heroBlock[0] : '';
  const pageMatches = heroHtml.match(/data-page="[^"]+"/g) || [];
  const toastMatches = heroHtml.match(/data-toast="[^"]+"/g) || [];
  const pagesInHtml = new Set(pageMatches.map(b => b.match(/"([^"]+)"/)[1]));

  expectedPages.forEach(p => {
    check(`[${roleId}] 包含跳转 ${p}`, pagesInHtml.has(p));
  });
  check(`[${roleId}] page 按钮数 = ${expectedPages.length}`, pageMatches.length === expectedPages.length);
  if (expectedToasts) {
    check(`[${roleId}] toast 按钮数 = ${expectedToasts}`, toastMatches.length === expectedToasts);
  }
  /* 关键数据 / 常用模块 都不再显示"查看更多/全部"section-more */
  check(`[${roleId}] 关键数据无"查看更多"`, !html.includes('查看更多'));
  check(`[${roleId}] 常用模块无"全部"section-more`, !/section-more[^>]*>全部\s*</.test(html));
  /* 待办"全部 N"跳到 todo-center */
  check(`[${roleId}] 待办"全部"跳 todo-center`,
    /section-more" data-page="todo-center"[^>]*>全部/.test(html));
}
checkRole('inspector', ['inspection-create', 'workorder-create', 'workorder-list'], 1, 'todo-center');
checkRole('finance', ['fee-dunning-list', 'fee-bill-list', 'fee-analysis', 'park-analysis', 'fee-bill-list'], 0, 'todo-center');
checkRole('manager', ['form-list', 'fee-analysis', 'park-analysis', 'workorder-list'], 1, 'todo-center');
checkRole('business', ['company-list', 'contract-list', 'contract-renewal', 'company-list'], 0, 'todo-center');
checkRole('operator', ['inspection-summary', 'workorder-list'], 2, 'todo-center');
checkRole('staff', ['form-new', 'meeting-book', 'workorder-list', 'form-list'], 0, 'todo-center');

section('统一待办页(todo-center)');
{
  /* 页面文件存在性 */
  const todoPageFile = path.join(__dirname, '..', 'pages', 'todo-center.html');
  check('pages/todo-center.html 文件存在', fs.existsSync(todoPageFile));

  /* 巡检员:有巡检 + 工单两组 tab */
  state.roleId = 'inspector';
  const inspHtml = PAGE_RENDERERS['todo-center']({});
  check('巡检员:页面渲染', inspHtml.length > 100);
  check('巡检员:含"共 3 项待办"', /共 3 项待办/.test(inspHtml));
  check('巡检员:含巡检/工单 tab 标签',
    inspHtml.includes('>巡检<') && inspHtml.includes('>工单<'));
  check('巡检员:tab 含计数(巡检 1 + 工单 2)',
    /todo-center-tab-count">1</.test(inspHtml) && (inspHtml.match(/todo-center-tab-count">2</g) || []).length >= 1);
  check('巡检员:tab 可点击切换', /data-page="todo-center" data-params='\{"tab":\d\}'/.test(inspHtml));
  check('巡检员:默认 tab 的 todo 项可点击直达 inspection-list',
    /data-page="inspection-list"/.test(inspHtml));
  /* 切到 tab=1(工单)后,todo 项 data-page=workorder-list */
  const inspTab1 = PAGE_RENDERERS['todo-center']({ tab: 1 });
  check('巡检员:tab=1(工单)的 todo 项可点击直达 workorder-list',
    /data-page="workorder-list"/.test(inspTab1));
  check('巡检员:默认 tab 为 0(巡检)',
    inspHtml.includes('todo-center-tab active'));

  /* 财务:有催缴 + 开票两组 tab */
  state.roleId = 'finance';
  const finHtml = PAGE_RENDERERS['todo-center']({});
  check('财务:含"共 3 项待办"', /共 3 项待办/.test(finHtml));
  check('财务:含催缴/开票 tab 标签',
    finHtml.includes('>催缴<') && finHtml.includes('>开票<'));
  check('财务:催缴 tab 计数 = 2,开票 tab 计数 = 1',
    /todo-center-tab-count">2</.test(finHtml) && /todo-center-tab-count">1</.test(finHtml));

  /* 经理:form-list 2 + workorder 1 → 2 组 tab(form scope 不同时也分 2 组) */
  state.roleId = 'manager';
  const mgrHtml = PAGE_RENDERERS['todo-center']({});
  check('经理:含"共 3 项待办"', /共 3 项待办/.test(mgrHtml));
  check('经理:含审批/工单 tab 标签',
    mgrHtml.includes('>审批<') && mgrHtml.includes('>工单<'));
  check('经理:tab=1 切换到工单组',
    /data-page="todo-center" data-params='\{"tab":1\}'/.test(mgrHtml));

  /* tab 切换渲染 */
  const tab1 = PAGE_RENDERERS['todo-center']({ tab: 1 });
  check('tab=1 渲染 active 在第二个 tab',
    (tab1.match(/todo-center-tab active/g) || []).length === 1);

  /* CSS 检查 */
  const cssText2 = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
  check('todo-center-head CSS', /\.todo-center-head\s*\{/.test(cssText2));
  check('todo-center-tabs CSS', /\.todo-center-tabs\s*\{/.test(cssText2));
  check('todo-center-tab CSS', /\.todo-center-tab\s*\{/.test(cssText2));
  check('todo-center-tab.active CSS', /\.todo-center-tab\.active\s*\{/.test(cssText2));
}

console.log('\nPassed: ' + pass + ' / Failed: ' + fail);
process.exit(fail === 0 ? 0 : 1);
