import { useMemo, useState } from 'react'
import './InteractiveDemos.css'

type Toast = string | null

function useToast() {
  const [toast, setToast] = useState<Toast>(null)
  const show = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 1800)
  }
  return { toast, show }
}

function ToastBar({ toast }: { toast: Toast }) {
  if (!toast) return null
  return <div className="idemo__toast-bar">{toast}</div>
}

/* ========== JNPF 政务：流程待办 ========== */
export function JnpfGovDemo() {
  const { toast, show } = useToast()
  const [tab, setTab] = useState<'todo' | 'done' | 'cc'>('todo')
  const [todoId, setTodoId] = useState<string | null>(null)
  const [comment, setComment] = useState('同意，材料齐全。')
  const [todos, setTodos] = useState([
    { id: 't1', title: '社区事项 · 居住证续签审批', node: '社区主任审核', status: '待办', applicant: '张晓明', phone: '已验真' },
    { id: 't2', title: '志愿者活动 · 场地使用申请', node: '综合办会签', status: '待办', applicant: '李华', phone: '已验真' },
    { id: 't3', title: '政民互动 · 答复内容复核', node: '办结归档', status: '已办', applicant: '王芳', phone: '已验真' },
  ])
  const filtered = todos.filter((t) =>
    tab === 'todo' ? t.status === '待办' : tab === 'done' ? t.status === '已办' : t.id === 't2',
  )
  const cur = todos.find((t) => t.id === todoId)

  return (
    <div className="idemo idemo--admin">
      <aside className="idemo__side">
        <div className="idemo__brand">JNPF 政务</div>
        <div className="idemo__nav is-active">流程中心</div>
        <div className="idemo__nav muted">在线开发</div>
        <div className="idemo__nav muted">权限管理</div>
        <div className="idemo__nav muted">集成中心</div>
      </aside>
      <main className="idemo__main">
        {!todoId ? (
          <>
            <div className="idemo__toolbar">
              <h3>工作流</h3>
              <div className="idemo__seg">
                {(['todo', 'done', 'cc'] as const).map((k) => (
                  <button key={k} type="button" className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>
                    {k === 'todo' ? '待办' : k === 'done' ? '已办' : '抄送'}
                  </button>
                ))}
              </div>
            </div>
            <div className="idemo__list">
              {filtered.map((t) => (
                <button key={t.id} type="button" className="idemo__row" onClick={() => setTodoId(t.id)}>
                  <div>
                    <strong>{t.title}</strong>
                    <span>{t.node} · {t.applicant}</span>
                  </div>
                  <em className={t.status === '待办' ? 'warn' : 'ok'}>{t.status}</em>
                </button>
              ))}
              {filtered.length === 0 && <p className="idemo__tip">暂无数据，切换 Tab 试试</p>}
            </div>
          </>
        ) : (
          <>
            <button type="button" className="idemo__back" onClick={() => setTodoId(null)}>← 返回列表</button>
            <h3>审批详情 · {cur?.title}</h3>
            <div className="idemo__card">
              <p><b>当前节点：</b>{cur?.node}</p>
              <p><b>申请人：</b>{cur?.applicant} · 手机{cur?.phone}</p>
              <p><b>动态表单：</b>onlineDev 渲染（事项类型 / 附件 / 承诺书）</p>
              <div className="idemo__steps">
                {['发起', '网格员初审', '主任审核', '办结'].map((s, i) => (
                  <span key={s} className={i <= 2 ? 'on' : ''}>{s}</span>
                ))}
              </div>
              <label className="idemo__label">审批意见</label>
              <textarea className="idemo__textarea" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
              <div className="idemo__actions">
                <button
                  type="button"
                  className="idemo__btn primary"
                  onClick={() => {
                    setTodos((prev) => prev.map((t) => (t.id === todoId ? { ...t, status: '已办', node: '已办结' } : t)))
                    show('已同意并流转')
                    setTodoId(null)
                    setTab('done')
                  }}
                >
                  同意并流转
                </button>
                <button
                  type="button"
                  className="idemo__btn"
                  onClick={() => {
                    show('已退回上一节点')
                    setTodoId(null)
                  }}
                >
                  退回
                </button>
                <button type="button" className="idemo__btn" onClick={() => show('已加签给综合办')}>加签</button>
              </div>
            </div>
          </>
        )}
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function JnpfGovDesignerDemo() {
  const { toast, show } = useToast()
  const widgets = ['单行文本', '手机号', '下拉选择', '日期', '附件上传', '子表']
  const [canvas, setCanvas] = useState(['申请人', '事项类型'])
  const [selected, setSelected] = useState('申请人')

  return (
    <div className="idemo idemo--admin">
      <aside className="idemo__side">
        <div className="idemo__brand">表单设计器</div>
        {widgets.map((w) => (
          <button
            key={w}
            type="button"
            className="idemo__nav"
            onClick={() => {
              setCanvas((c) => [...c, w])
              setSelected(w)
              show(`已添加控件：${w}`)
            }}
          >
            ＋ {w}
          </button>
        ))}
      </aside>
      <main className="idemo__main">
        <div className="idemo__toolbar">
          <h3>可视化画布</h3>
          <button type="button" className="idemo__btn primary" onClick={() => show('已发布表单版本 v1.3')}>发布</button>
        </div>
        <div className="idemo__designer">
          {canvas.map((f) => (
            <button
              key={f}
              type="button"
              className={`idemo__field ${selected === f ? 'is-active' : ''}`}
              onClick={() => setSelected(f)}
            >
              <span>{f}</span>
              <em>点击配置</em>
            </button>
          ))}
        </div>
        <div className="idemo__card">
          <p><b>当前控件：</b>{selected}</p>
          <div className="idemo__actions">
            <button type="button" className="idemo__btn" onClick={() => show(`${selected} · 必填已开启`)}>设为必填</button>
            <button
              type="button"
              className="idemo__btn"
              onClick={() => {
                setCanvas((c) => c.filter((x) => x !== selected))
                show('已删除控件')
              }}
            >
              删除控件
            </button>
            <button type="button" className="idemo__btn primary" onClick={() => show('已生成 Java/Vue 代码')}>代码生成</button>
          </div>
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function JnpfGovBpmnDemo() {
  const { toast, show } = useToast()
  const nodes = [
    { id: 'start', name: '开始', type: '事件' },
    { id: 'grid', name: '网格员初审', type: '用户任务' },
    { id: 'chief', name: '主任审核', type: '用户任务' },
    { id: 'end', name: '结束', type: '事件' },
  ]
  const [active, setActive] = useState('chief')
  const [assignee, setAssignee] = useState('角色：社区主任')

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <div className="idemo__toolbar">
          <h3>BPMN 流程设计</h3>
          <button type="button" className="idemo__btn primary" onClick={() => show('流程定义已部署')}>部署</button>
        </div>
        <div className="idemo__bpmn">
          {nodes.map((n, i) => (
            <div key={n.id} className="idemo__bpmn-item">
              <button
                type="button"
                className={`idemo__bpmn-node ${active === n.id ? 'is-active' : ''}`}
                onClick={() => setActive(n.id)}
              >
                <b>{n.name}</b>
                <span>{n.type}</span>
              </button>
              {i < nodes.length - 1 && <span className="idemo__bpmn-arrow">→</span>}
            </div>
          ))}
        </div>
        <div className="idemo__card">
          <p><b>选中节点：</b>{nodes.find((n) => n.id === active)?.name}</p>
          <label className="idemo__label">办理人</label>
          <input className="idemo__input" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
          <div className="idemo__actions">
            <button type="button" className="idemo__btn" onClick={() => show('已配置超时催办 24h')}>超时催办</button>
            <button type="button" className="idemo__btn" onClick={() => show('已开启会签')}>会签</button>
            <button type="button" className="idemo__btn primary" onClick={() => show(`已保存：${assignee}`)}>保存节点</button>
          </div>
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function JnpfGovPermDemo() {
  const { toast, show } = useToast()
  const [roles, setRoles] = useState([
    { name: '超级管理员', on: true },
    { name: '社区运营', on: true },
    { name: '网格员', on: true },
    { name: '只读审计', on: false },
  ])

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>角色权限</h3>
        <div className="idemo__stats">
          <div><b>28</b><span>组织</span></div>
          <div><b>{roles.filter((r) => r.on).length}</b><span>已启用角色</span></div>
          <div><b>3</b><span>租户</span></div>
        </div>
        <div className="idemo__list">
          {roles.map((r) => (
            <button
              key={r.name}
              type="button"
              className="idemo__row"
              onClick={() => {
                setRoles((prev) => prev.map((x) => (x.name === r.name ? { ...x, on: !x.on } : x)))
                show(`${r.name} 已${r.on ? '停用' : '启用'}`)
              }}
            >
              <div><strong>{r.name}</strong><span>点击切换启用状态</span></div>
              <em className={r.on ? 'ok' : 'warn'}>{r.on ? '已启用' : '已停用'}</em>
            </button>
          ))}
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function JnpfGovInteDemo() {
  const { toast, show } = useToast()
  const [apps, setApps] = useState([
    { name: '钉钉', on: true },
    { name: '企业微信', on: true },
    { name: '短信网关', on: false },
    { name: 'AI 模型', on: false },
  ])

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>集成中心</h3>
        <div className="idemo__grid4">
          {apps.map((a) => (
            <button
              key={a.name}
              type="button"
              className={`idemo__tile ${a.on ? 'on' : ''}`}
              onClick={() => {
                setApps((prev) => prev.map((x) => (x.name === a.name ? { ...x, on: !x.on } : x)))
                show(`${a.name} ${a.on ? '已断开' : '连通测试通过'}`)
              }}
            >
              <b>{a.name}</b>
              <span>{a.on ? '已连通 · 点击断开' : '未连通 · 点击测试'}</span>
            </button>
          ))}
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

/* ========== 城市事件中心 GIS（虚构演示数据，已脱敏） ========== */
const ASSET_PARCELS = [
  { id: 'a1', name: '示范区厂房组团 A', type: '经营性资产', area: '2.4 万㎡', value: '¥1,280 万', cls: 'gold', style: { left: '18%', top: '28%', width: '22%', height: '18%' } },
  { id: 'a2', name: '中心农贸市场', type: '商铺资产', area: '0.8 万㎡', value: '¥620 万', cls: 'green', style: { left: '48%', top: '36%', width: '18%', height: '14%' } },
  { id: 'a3', name: '滨河生态林地', type: '资源林地', area: '5.1 万㎡', value: '¥960 万', cls: 'cyan', style: { left: '36%', top: '54%', width: '26%', height: '16%' } },
  { id: 'a4', name: '社区光伏电站', type: '能源资产', area: '1.2 万㎡', value: '¥410 万', cls: 'purple', style: { left: '62%', top: '22%', width: '16%', height: '12%' } },
]

const VIEW_LAYERS = [
  { id: 'l1', name: '影像底图', on: true },
  { id: 'l2', name: '行政区划', on: true },
  { id: 'l3', name: '资产标绘', on: true },
  { id: 'l4', name: '网格边界', on: true },
  { id: 'l5', name: '在建工程', on: false },
  { id: 'l6', name: '视频点位', on: false },
]

const EVENT_ROWS = [
  { id: 'EV-2401', name: '占道经营劝导', type: '城管', time: '2026-07-25 09:12', status: '已分派', handler: '陈涛', level: '一般', grid: '东区 A3' },
  { id: 'EV-2402', name: '夜间噪声投诉', type: '环保', time: '2026-07-25 08:40', status: '催办中', handler: '刘敏', level: '紧急', grid: '西区 B1' },
  { id: 'EV-2403', name: '井盖破损上报', type: '市政', time: '2026-07-24 17:22', status: '反馈中', handler: '赵强', level: '一般', grid: '南区 C2' },
  { id: 'EV-2404', name: '施工围挡倾倒', type: '安监', time: '2026-07-24 15:05', status: '待受理', handler: '—', level: '紧急', grid: '北区 D4' },
  { id: 'EV-2405', name: '河道漂浮物清理', type: '水务', time: '2026-07-24 11:30', status: '已办结', handler: '陈涛', level: '一般', grid: '东区 A1' },
]

const GRID_WORKERS = [
  { id: 'w1', name: '陈涛', grid: '东区网格 A3', phone: '138****6210', status: '在岗', tasks: 3 },
  { id: 'w2', name: '刘敏', grid: '西区网格 B1', phone: '139****8842', status: '处置中', tasks: 5 },
  { id: 'w3', name: '赵强', grid: '南区网格 C2', phone: '137****1056', status: '在岗', tasks: 2 },
  { id: 'w4', name: '周倩', grid: '北区网格 D4', phone: '136****3391', status: '休假', tasks: 0 },
]

const LAYER_ROWS = [
  { id: '1', name: '示范区 2024 影像', cat: '基础地理', path: '/tiles/demo-2024/{z}/{x}/{y}', owner: '运维', time: '2024-11-02', on: true },
  { id: '2', name: '资产标绘矢量', cat: '专题数据', path: '/geojson/asset-parcels', owner: '运维', time: '2025-03-18', on: true },
  { id: '3', name: '综治网格边界', cat: '行政区划', path: '/geojson/grid-boundary', owner: '系统', time: '2025-01-09', on: true },
  { id: '4', name: '历史影像 2019', cat: '基础地理', path: '/tiles/demo-2019/{z}/{x}/{y}', owner: '运维', time: '2023-08-21', on: false },
  { id: '5', name: '在建工程单体', cat: '专题数据', path: '/geojson/construction', owner: '工程办', time: '2026-02-14', on: false },
]

const SCENE_PAGES = [
  { id: 's1', name: '资产统览页', scene: '资产云图', pages: 3 },
  { id: 's2', name: '社区概况-网格', scene: '示范城区', pages: 4 },
  { id: 's3', name: '民生监测', scene: '示范城区', pages: 2 },
]

/** 地图展示端（虚构色块 + 图层树） */
export function JnpfEventDemo() {
  const { toast, show } = useToast()
  const [theme, setTheme] = useState('资产云图')
  const [layers, setLayers] = useState(VIEW_LAYERS)
  const [picked, setPicked] = useState<string | null>('a1')
  const [tool, setTool] = useState('漫游')
  const asset = ASSET_PARCELS.find((a) => a.id === picked)
  const showParcels = layers.find((l) => l.id === 'l3')?.on

  return (
    <div className="idemo idemo--yitu">
      <header className="idemo__yitu-head">
        <div className="idemo__yitu-brand">
          <span className="idemo__yitu-logo" />
          <div>
            <strong>示范城区 · 事件中心</strong>
            <em>地图展示（演示）</em>
          </div>
        </div>
        <nav className="idemo__yitu-nav">
          {['资产云图', '社区概况', '民生监测', '党建服务', '治安巡防'].map((t) => (
            <button key={t} type="button" className={theme === t ? 'is-active' : ''} onClick={() => { setTheme(t); show(`已切换专题：${t}`) }}>{t}</button>
          ))}
        </nav>
        <time>演示时间 · 脱敏样例</time>
      </header>

      <div className="idemo__yitu-body">
        <aside className="idemo__yitu-side">
          <h4>图层区</h4>
          {layers.map((l) => (
            <label key={l.id} className="idemo__yitu-layer">
              <input
                type="checkbox"
                checked={l.on}
                onChange={() => {
                  setLayers((prev) => prev.map((x) => (x.id === l.id ? { ...x, on: !x.on } : x)))
                  show(`${l.name} 已${l.on ? '关闭' : '开启'}`)
                }}
              />
              <span>{l.name}</span>
            </label>
          ))}
          <h4>工具区</h4>
          <div className="idemo__yitu-tools">
            {['漫游', '测量', '标注', '对比'].map((t) => (
              <button key={t} type="button" className={tool === t ? 'is-active' : ''} onClick={() => { setTool(t); show(`工具：${t}`) }}>{t}</button>
            ))}
          </div>
        </aside>

        <div className="idemo__yitu-map">
          <div className="idemo__yitu-sat" aria-hidden="true" />
          {showParcels && ASSET_PARCELS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`idemo__parcel idemo__parcel--${p.cls} ${picked === p.id ? 'is-active' : ''}`}
              style={p.style}
              onClick={() => { setPicked(p.id); show(`已定位：${p.name}`) }}
              title={p.name}
            />
          ))}
          <div className="idemo__yitu-foot">
            {['资产详情', '资源详情', '资产分布'].map((b) => (
              <button key={b} type="button" onClick={() => show(`${b}面板已打开`)}>{b}</button>
            ))}
          </div>
        </div>

        <aside className="idemo__yitu-panel">
          <div className="idemo__yitu-kpi">
            <button type="button" onClick={() => show('资产总数下钻')}>
              <b>128</b><span>标绘资产</span>
            </button>
            <button type="button" onClick={() => show('本月新增下钻')}>
              <b>16</b><span>本月新增</span>
            </button>
          </div>
          <h4>{theme} · 列表</h4>
          <div className="idemo__yitu-list">
            {ASSET_PARCELS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`idemo__yitu-item ${picked === p.id ? 'is-active' : ''}`}
                onClick={() => setPicked(p.id)}
              >
                <i className={`dot ${p.cls}`} />
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.type} · {p.area}</span>
                </div>
              </button>
            ))}
          </div>
          {asset && (
            <div className="idemo__yitu-detail">
              <h5>{asset.name}</h5>
              <p>类别：{asset.type}</p>
              <p>面积：{asset.area}</p>
              <p>估值：{asset.value}</p>
              <p className="muted">虚构示意色块 · 按资产类别区分</p>
              <button type="button" className="idemo__btn primary" onClick={() => show(`已打开 ${asset.name} 档案`)}>查看档案</button>
            </div>
          )}
        </aside>
      </div>
      <ToastBar toast={toast} />
    </div>
  )
}

/** 网格员 / 网格化管理（演示） */
export function JnpfEventMapDemo() {
  const { toast, show } = useToast()
  const [workers, setWorkers] = useState(GRID_WORKERS)
  const [picked, setPicked] = useState('w1')
  const [task, setTask] = useState('井盖巡查复核')
  const cur = workers.find((w) => w.id === picked)

  return (
    <div className="idemo idemo--admin idemo--gov">
      <aside className="idemo__side">
        <div className="idemo__brand">事件中心</div>
        <div className="idemo__nav">事件大厅</div>
        <div className="idemo__nav is-active">网格化管理</div>
        <div className="idemo__nav is-active soft">网格员管理</div>
        <div className="idemo__nav muted">指挥调度</div>
        <div className="idemo__nav muted">地图展示</div>
      </aside>
      <main className="idemo__main">
        <div className="idemo__toolbar">
          <h3>网格员管理</h3>
          <span className="idemo__badge">在岗 {workers.filter((w) => w.status !== '休假').length}</span>
        </div>
        <div className="idemo__split idemo__split--grid">
          <div className="idemo__map idemo__map--grid">
            <div className="idemo__map-layer">综治网格 · 点击网格员定位</div>
            {workers.map((w, i) => (
              <button
                key={w.id}
                type="button"
                className={`idemo__pin idemo__pin--${(i % 3) + 1} ${picked === w.id ? 'is-active' : ''}`}
                onClick={() => { setPicked(w.id); show(`已定位 ${w.name} · ${w.grid}`) }}
              >
                {w.name}
              </button>
            ))}
          </div>
          <div className="idemo__card">
            <table className="idemo__table">
              <thead>
                <tr>
                  <th>姓名</th><th>网格</th><th>状态</th><th>在办</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w.id} className={picked === w.id ? 'is-active' : ''} onClick={() => setPicked(w.id)}>
                    <td>{w.name}</td>
                    <td>{w.grid}</td>
                    <td><em className={w.status === '休假' ? 'muted' : w.status === '处置中' ? 'warn' : 'ok'}>{w.status}</em></td>
                    <td>{w.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cur && (
              <div className="idemo__dispatch">
                <h4>调度 · {cur.name}</h4>
                <p>{cur.grid} · {cur.phone}</p>
                <label className="idemo__label">下发任务</label>
                <input className="idemo__input" value={task} onChange={(e) => setTask(e.target.value)} />
                <div className="idemo__actions">
                  <button
                    type="button"
                    className="idemo__btn primary"
                    onClick={() => {
                      setWorkers((p) => p.map((x) => (x.id === picked ? { ...x, status: '处置中', tasks: x.tasks + 1 } : x)))
                      show(`已向 ${cur.name} 下发：${task}`)
                    }}
                  >
                    确认调度
                  </button>
                  <button type="button" className="idemo__btn" onClick={() => show(`已呼叫 ${cur.phone}`)}>一键呼叫</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <ToastBar toast={toast} />
    </div>
  )
}

/** 事件管理 / 事件详情（演示） */
export function JnpfEventWorkDemo() {
  const { toast, show } = useToast()
  const [list, setList] = useState(EVENT_ROWS)
  const [filter, setFilter] = useState('全部')
  const [id, setId] = useState<string | null>(null)
  const [worker, setWorker] = useState('陈涛')
  const [note, setNote] = useState('')
  const filtered = list.filter((e) => filter === '全部' || e.status === filter || e.level === filter)
  const cur = list.find((e) => e.id === id)

  if (cur) {
    return (
      <div className="idemo idemo--admin idemo--gov">
        <aside className="idemo__side">
          <div className="idemo__brand">事件中心</div>
          <div className="idemo__nav is-active">事件大厅</div>
          <div className="idemo__nav muted">数据面板</div>
          <div className="idemo__nav muted">智能调度</div>
          <div className="idemo__nav muted">系统设置</div>
        </aside>
        <main className="idemo__main">
          <button type="button" className="idemo__back" onClick={() => setId(null)}>← 返回事件列表</button>
          <h3>事件详情 · {cur.id}</h3>
          <div className="idemo__card">
            <div className="idemo__kv">
              <p><b>事件名称</b>{cur.name}</p>
              <p><b>类型</b>{cur.type}</p>
              <p><b>发生时间</b>{cur.time}</p>
              <p><b>所属网格</b>{cur.grid}</p>
              <p><b>紧急程度</b>{cur.level}</p>
              <p><b>当前状态</b>{cur.status}</p>
            </div>
            <label className="idemo__label">分派网格员</label>
            <select className="idemo__input" value={worker} onChange={(e) => setWorker(e.target.value)}>
              {GRID_WORKERS.map((w) => <option key={w.id}>{w.name}</option>)}
            </select>
            <label className="idemo__label">处理意见</label>
            <textarea className="idemo__textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="填写现场核查与处置说明…" />
            <div className="idemo__actions">
              <button type="button" className="idemo__btn primary" onClick={() => { setList((p) => p.map((x) => x.id === id ? { ...x, status: '已分派', handler: worker } : x)); show(`已分派给 ${worker}`); setId(null) }}>确认分派</button>
              <button type="button" className="idemo__btn" onClick={() => { setList((p) => p.map((x) => x.id === id ? { ...x, status: '催办中' } : x)); show('已发起催办') }}>催办</button>
              <button type="button" className="idemo__btn" onClick={() => { setList((p) => p.map((x) => x.id === id ? { ...x, status: '已办结' } : x)); show('已办结归档'); setId(null) }}>办结</button>
            </div>
          </div>
        </main>
        <ToastBar toast={toast} />
      </div>
    )
  }

  return (
    <div className="idemo idemo--admin idemo--gov">
      <aside className="idemo__side">
        <div className="idemo__brand">事件中心</div>
        <div className="idemo__nav is-active">事件大厅</div>
        <div className="idemo__nav muted">数据面板</div>
        <div className="idemo__nav muted">智能调度</div>
        <div className="idemo__nav muted">系统设置</div>
      </aside>
      <main className="idemo__main">
        <div className="idemo__topnav">
          {['首页', '工作台', '数据统计', '智能调度', '系统设置'].map((n, i) => (
            <span key={n} className={i === 1 ? 'is-active' : ''}>{n}</span>
          ))}
        </div>
        <div className="idemo__toolbar">
          <h3>事件管理</h3>
          <div className="idemo__seg">
            {['全部', '紧急', '待受理', '催办中', '已办结'].map((f) => (
              <button key={f} type="button" className={filter === f ? 'is-active' : ''} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="idemo__table-wrap">
          <table className="idemo__table">
            <thead>
              <tr>
                <th>编号</th><th>事件名称</th><th>类型</th><th>发生时间</th><th>状态</th><th>处理人</th><th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{e.type}</td>
                  <td>{e.time}</td>
                  <td><em className={e.status === '已办结' ? 'ok' : e.status === '催办中' || e.level === '紧急' ? 'warn' : 'muted'}>{e.status}</em></td>
                  <td>{e.handler}</td>
                  <td>
                    <button type="button" className="idemo__link" onClick={() => setId(e.id)}>查看</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="idemo__tip">共 {filtered.length} 条 · 虚构演示数据</p>
      </main>
      <ToastBar toast={toast} />
    </div>
  )
}

/** 图层资源 + 场景页面（演示） */
export function JnpfEventStatsDemo() {
  const { toast, show } = useToast()
  const [tab, setTab] = useState<'layer' | 'scene'>('layer')
  const [layers, setLayers] = useState(LAYER_ROWS)
  const [q, setQ] = useState('')
  const rows = layers.filter((l) => !q || l.name.includes(q) || l.cat.includes(q))

  return (
    <div className="idemo idemo--admin idemo--gov">
      <aside className="idemo__side">
        <div className="idemo__brand">图层后台</div>
        <button type="button" className={`idemo__nav ${tab === 'layer' ? 'is-active' : ''}`} onClick={() => setTab('layer')}>图层资源管理</button>
        <button type="button" className={`idemo__nav ${tab === 'scene' ? 'is-active' : ''}`} onClick={() => setTab('scene')}>场景页面设计</button>
        <div className="idemo__nav muted">标绘图层管理</div>
        <div className="idemo__nav muted">大文件图层</div>
        <div className="idemo__nav muted">样式配置</div>
      </aside>
      <main className="idemo__main">
        <div className="idemo__toolbar">
          <h3>{tab === 'layer' ? '图层资源管理' : '场景页面设计'}</h3>
          {tab === 'layer' && (
            <input
              className="idemo__input compact"
              placeholder="搜索图层 / 分类"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          )}
          <button
            type="button"
            className="idemo__btn primary"
            onClick={() => show(tab === 'layer' ? '打开：新增图层资源（大/小文件）' : '打开：创建场景向导')}
          >
            {tab === 'layer' ? '新增图层' : '创建场景'}
          </button>
        </div>

        {tab === 'layer' ? (
          <div className="idemo__table-wrap">
            <table className="idemo__table">
              <thead>
                <tr>
                  <th>序号</th><th>图层名称</th><th>内容分类</th><th>资源路径</th><th>创建人</th><th>创建时间</th><th>状态</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id}>
                    <td>{l.id}</td>
                    <td>{l.name}</td>
                    <td>{l.cat}</td>
                    <td className="mono">{l.path}</td>
                    <td>{l.owner}</td>
                    <td>{l.time}</td>
                    <td>
                      <button
                        type="button"
                        className={`idemo__switch ${l.on ? 'on' : ''}`}
                        onClick={() => {
                          setLayers((p) => p.map((x) => (x.id === l.id ? { ...x, on: !x.on } : x)))
                          show(`${l.name} 已${l.on ? '停用' : '启用'}`)
                        }}
                      >
                        {l.on ? '启用' : '停用'}
                      </button>
                    </td>
                    <td>
                      <button type="button" className="idemo__link" onClick={() => show(`编辑：${l.name}`)}>编辑</button>
                      {' · '}
                      <button type="button" className="idemo__link" onClick={() => show(`预览：${l.path}`)}>预览</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="idemo__scene-grid">
            {SCENE_PAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                className="idemo__scene-card"
                onClick={() => show(`进入场景设计：${s.name}（支持多页面与图层交互）`)}
              >
                <strong>{s.name}</strong>
                <span>所属场景 · {s.scene}</span>
                <em>{s.pages} 个页面编排</em>
              </button>
            ))}
            <button type="button" className="idemo__scene-card add" onClick={() => show('复制页面 / 页面命名 / 图层交互事件')}>
              <strong>+ 添加页面</strong>
              <span>一场景多页面 · 图层交互</span>
            </button>
          </div>
        )}
        <p className="idemo__tip">虚构演示：图层资源、场景编排与样式配置能力示意</p>
      </main>
      <ToastBar toast={toast} />
    </div>
  )
}

/* ========== 记账 ========== */
const CATS = ['餐饮', '交通', '购物', '居住', '娱乐', '其他'] as const

export function TallyBookDemo() {
  const { toast, show } = useToast()
  const [items, setItems] = useState([
    { id: 1, cat: '餐饮', amount: -86, note: '午饭' },
    { id: 2, cat: '交通', amount: -24, note: '地铁' },
    { id: 3, cat: '购物', amount: -320, note: '日用品' },
  ])
  const expense = items.reduce((s, i) => s + (i.amount < 0 ? -i.amount : 0), 0)

  return (
    <div className="idemo idemo--mobile-app">
      <div className="idemo__hero-green">
        <span>本月支出</span>
        <b>¥{expense.toLocaleString()}</b>
        <span>点击条目可删除</span>
      </div>
      <div className="idemo__list pad">
        {items.map((i) => (
          <button
            key={i.id}
            type="button"
            className="idemo__row"
            onClick={() => {
              setItems((p) => p.filter((x) => x.id !== i.id))
              show(`已删除：${i.cat}`)
            }}
          >
            <div><strong>{i.cat}</strong><span>{i.note}</span></div>
            <em className="warn">¥{i.amount}</em>
          </button>
        ))}
      </div>
      <ToastBar toast={toast} />
    </div>
  )
}

export function TallyBookAddDemo() {
  const { toast, show } = useToast()
  const [cat, setCat] = useState<(typeof CATS)[number]>('餐饮')
  const [amount, setAmount] = useState('36')
  const [note, setNote] = useState('')

  return (
    <div className="idemo idemo--mobile-app pad-form">
      <h3 className="idemo__mobile-title">记一笔</h3>
      <div className="idemo__chips">
        {CATS.map((c) => (
          <button key={c} type="button" className={cat === c ? 'is-active green' : ''} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <label className="idemo__label">金额</label>
      <input className="idemo__input" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} />
      <label className="idemo__label">备注</label>
      <input className="idemo__input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="写点什么" />
      <button
        type="button"
        className="idemo__btn primary block"
        onClick={() => show(`已记账：${cat} -¥${amount || 0}${note ? `（${note}）` : ''}`)}
      >
        保存账单
      </button>
      <ToastBar toast={toast} />
    </div>
  )
}

export function TallyBookChartDemo() {
  const { toast, show } = useToast()
  const [month, setMonth] = useState('本月')
  const data = month === '本月'
    ? [['餐饮', 42], ['购物', 28], ['交通', 12], ['其他', 18]]
    : [['餐饮', 35], ['购物', 40], ['交通', 10], ['其他', 15]]

  return (
    <div className="idemo idemo--mobile-app pad-form">
      <div className="idemo__toolbar">
        <h3 className="idemo__mobile-title">消费分析</h3>
        <div className="idemo__seg">
          {['本月', '上月'].map((m) => (
            <button key={m} type="button" className={month === m ? 'is-active' : ''} onClick={() => setMonth(m)}>{m}</button>
          ))}
        </div>
      </div>
      <div className="idemo__bars-h">
        {data.map(([name, pct]) => (
          <button key={name} type="button" className="idemo__bar-h" onClick={() => show(`${name}占比 ${pct}%`)}>
            <span>{name}</span>
            <div><i style={{ width: `${pct}%` }} /></div>
            <b>{pct}%</b>
          </button>
        ))}
      </div>
      <ToastBar toast={toast} />
    </div>
  )
}

/* ========== 执法 ========== */
const CASES = [
  { id: '2025-0892', title: '市容违规占道', status: '调查中', officer: '周警官' },
  { id: '2025-0761', title: '食品安全抽检', status: '待审批', officer: '吴警官' },
  { id: '2025-0703', title: '噪音扰民投诉', status: '已办结', officer: '郑警官' },
]

export function LegalUiDemo() {
  const { toast, show } = useToast()
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('全部')
  const list = CASES.filter((c) => (status === '全部' || c.status === status) && (!q || c.id.includes(q) || c.title.includes(q)))

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>案件列表</h3>
        <div className="idemo__filters">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="案号 / 标题" />
          <select className="idemo__input compact" value={status} onChange={(e) => setStatus(e.target.value)}>
            {['全部', '调查中', '待审批', '已办结'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="idemo__list">
          {list.map((c) => (
            <button key={c.id} type="button" className="idemo__row" onClick={() => show(`打开案件 ${c.id}（请切到「案件详情」场景）`)}>
              <div><strong>案号 {c.id}</strong><span>{c.title} · {c.officer}</span></div>
              <em className={c.status === '已办结' ? 'ok' : 'warn'}>{c.status}</em>
            </button>
          ))}
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function LegalUiDetailDemo() {
  const { toast, show } = useToast()
  const [status, setStatus] = useState('调查中')
  const [note, setNote] = useState('')

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>案件详情 · 2025-0892</h3>
        <div className="idemo__card">
          <p><b>案由：</b>市容违规占道</p>
          <p><b>承办人：</b>周警官</p>
          <p><b>当前状态：</b>{status}</p>
          <label className="idemo__label">调查备注</label>
          <textarea className="idemo__textarea" value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          <div className="idemo__actions">
            <button type="button" className="idemo__btn" onClick={() => { setStatus('待审批'); show('已提交审批') }}>提交审批</button>
            <button type="button" className="idemo__btn primary" onClick={() => { setStatus('已办结'); show('案件已办结') }}>办结</button>
          </div>
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function LegalUiDossierDemo() {
  const { toast, show } = useToast()
  const pages = ['封面', '立案审批表', '现场照片', '询问笔录', '结案报告']
  const [page, setPage] = useState(0)
  const [mark, setMark] = useState('')

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <div className="idemo__toolbar">
          <h3>电子卷宗</h3>
          <span className="idemo__badge">{page + 1} / {pages.length}</span>
        </div>
        <div className="idemo__dossier-view">
          <h4>{pages[page]}</h4>
          <p>卷宗页内容预览区（案号 2025-0892）</p>
        </div>
        <label className="idemo__label">页内批注</label>
        <input className="idemo__input" value={mark} onChange={(e) => setMark(e.target.value)} placeholder="添加批注…" />
        <div className="idemo__actions">
          <button type="button" className="idemo__btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>上一页</button>
          <button type="button" className="idemo__btn" disabled={page === pages.length - 1} onClick={() => setPage((p) => p + 1)}>下一页</button>
          <button type="button" className="idemo__btn primary" onClick={() => show(mark ? `批注已保存：${mark}` : '请输入批注')}>保存批注</button>
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

/* ========== 电子卷宗 ========== */
export function DossierDemo() {
  const { toast, show } = useToast()
  const all = [
    { no: 'A2025-001', status: '已归档', court: '中院' },
    { no: 'A2025-002', status: '制作中', court: '基层院' },
    { no: 'A2025-003', status: '待扫描', court: '中院' },
    { no: 'B2024-118', status: '已归档', court: '高院' },
  ]
  const [no, setNo] = useState('')
  const [st, setSt] = useState('全部')
  const [picked, setPicked] = useState<string | null>(null)
  const filtered = useMemo(
    () => all.filter((x) => (st === '全部' || x.status === st) && (!no || x.no.includes(no))),
    [no, st],
  )

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>卷宗查询</h3>
        <div className="idemo__filters">
          <input value={no} onChange={(e) => setNo(e.target.value)} placeholder="卷宗号" />
          <select className="idemo__input compact" value={st} onChange={(e) => setSt(e.target.value)}>
            {['全部', '已归档', '制作中', '待扫描'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button type="button" className="idemo__btn" onClick={() => { setNo(''); setSt('全部') }}>重置</button>
        </div>
        <div className="idemo__list">
          {filtered.map((x) => (
            <button key={x.no} type="button" className="idemo__row" onClick={() => { setPicked(x.no); show(`选中 ${x.no}`) }}>
              <div><strong>{x.no}</strong><span>{x.court}</span></div>
              <em className={x.status === '已归档' ? 'ok' : 'warn'}>{x.status}</em>
            </button>
          ))}
        </div>
        {picked && <div className="idemo__card">当前卷宗 <b>{picked}</b> · 可切到「制作 / 扫描」场景继续</div>}
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function DossierMakeDemo() {
  const { toast, show } = useToast()
  const [dirs, setDirs] = useState(['封面', '目录', '正卷'])
  const [name, setName] = useState('')

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>卷宗制作向导</h3>
        <div className="idemo__steps">
          {['基本信息', '目录结构', '材料挂接', '生成'].map((s, i) => (
            <span key={s} className={i <= 1 ? 'on' : ''}>{s}</span>
          ))}
        </div>
        <div className="idemo__list">
          {dirs.map((d, i) => (
            <div key={d} className="idemo__row static"><strong>{i + 1}. {d}</strong><em className="ok">已添加</em></div>
          ))}
        </div>
        <div className="idemo__filters">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="新目录名称" />
          <button
            type="button"
            className="idemo__btn primary"
            onClick={() => {
              if (!name.trim()) return show('请输入目录名')
              setDirs((d) => [...d, name.trim()])
              setName('')
              show('目录已添加')
            }}
          >
            添加目录
          </button>
        </div>
        <button type="button" className="idemo__btn block" onClick={() => show('卷宗草稿已生成')}>生成卷宗草稿</button>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function DossierScanDemo() {
  const { toast, show } = useToast()
  const [progress, setProgress] = useState(0)
  const [scanning, setScanning] = useState(false)

  const start = () => {
    if (scanning) return
    setScanning(true)
    setProgress(0)
    let p = 0
    const t = window.setInterval(() => {
      p += 10
      setProgress(p)
      if (p >= 100) {
        window.clearInterval(t)
        setScanning(false)
        show('扫描入库完成 · 已挂接卷宗 A2025-003')
      }
    }, 200)
  }

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>扫描入库</h3>
        <div className="idemo__card">
          <p>设备：高速扫描仪 #02 · 批次 36 页</p>
          <div className="idemo__progress"><i style={{ width: `${progress}%` }} /></div>
          <p>{progress}%</p>
          <div className="idemo__actions">
            <button type="button" className="idemo__btn primary" disabled={scanning} onClick={start}>
              {scanning ? '扫描中…' : '开始扫描'}
            </button>
            <button type="button" className="idemo__btn" onClick={() => { setProgress(0); show('已清空批次') }}>清空</button>
          </div>
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

/* ========== 研发管控 ========== */
export function ZxzjDemo() {
  const { toast, show } = useToast()
  const [picked, setPicked] = useState<string | null>(null)
  const projects = [
    { name: '智慧社区迭代', risk: '按期', detail: '需求 18 · 缺陷 3 · 燃尽正常' },
    { name: '园区费用模块', risk: '有延期风险', detail: '催缴推送未完成 · 阻塞 2' },
    { name: '事件中心大屏', risk: '按期', detail: '地图模式已联调 · 剩统计页' },
  ]

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <div className="idemo__stats">
          <div><b>42</b><span>进行中</span></div>
          <div><b>3</b><span>延期</span></div>
          <div><b>8</b><span>本周交付</span></div>
        </div>
        <div className="idemo__list">
          {projects.map((p) => (
            <button key={p.name} type="button" className="idemo__row" onClick={() => { setPicked(p.name); show(p.detail) }}>
              <div><strong>{p.name}</strong><span>点击查看风险明细</span></div>
              <em className={p.risk.includes('延期') ? 'warn' : 'ok'}>{p.risk}</em>
            </button>
          ))}
        </div>
        {picked && <div className="idemo__card">{projects.find((p) => p.name === picked)?.detail}</div>}
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function ZxzjBugDemo() {
  const { toast, show } = useToast()
  const [bugs, setBugs] = useState([
    { id: 1, title: '登录互踢偶发失败', status: 'Open' },
    { id: 2, title: '催缴短信模板缺失', status: 'Open' },
    { id: 3, title: '大屏图层加载慢', status: 'Fixed' },
  ])

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>缺陷跟踪</h3>
        <div className="idemo__list">
          {bugs.map((b) => (
            <button
              key={b.id}
              type="button"
              className="idemo__row"
              onClick={() => {
                setBugs((prev) => prev.map((x) => x.id === b.id ? { ...x, status: x.status === 'Open' ? 'Fixed' : 'Open' } : x))
                show(`${b.title} → ${b.status === 'Open' ? 'Fixed' : 'Open'}`)
              }}
            >
              <div><strong>{b.title}</strong><span>点击切换 Open / Fixed</span></div>
              <em className={b.status === 'Open' ? 'warn' : 'ok'}>{b.status}</em>
            </button>
          ))}
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

export function ZxzjDailyDemo() {
  const { toast, show } = useToast()
  const [done, setDone] = useState('完成园区费用 KPI 接口联调')
  const [plan, setPlan] = useState('推进催缴推送')
  const [block, setBlock] = useState('')

  return (
    <div className="idemo idemo--admin single">
      <main className="idemo__main">
        <h3>日报提交</h3>
        <div className="idemo__card">
          <p>今日进度：86 / 92 人已提交</p>
          <label className="idemo__label">今日完成</label>
          <textarea className="idemo__textarea" value={done} onChange={(e) => setDone(e.target.value)} rows={2} />
          <label className="idemo__label">明日计划</label>
          <textarea className="idemo__textarea" value={plan} onChange={(e) => setPlan(e.target.value)} rows={2} />
          <label className="idemo__label">阻塞项</label>
          <input className="idemo__input" value={block} onChange={(e) => setBlock(e.target.value)} placeholder="可选" />
          <button type="button" className="idemo__btn primary block" onClick={() => show('日报已提交并汇总到项目群')}>提交日报</button>
        </div>
        <ToastBar toast={toast} />
      </main>
    </div>
  )
}

/* ========== 任逸选 ========== */
const HOMES = [
  { id: 1, name: '东海听潮民宿', style: '海景房', price: 528, stock: 2 },
  { id: 2, name: '云上小院', style: '山景院', price: 468, stock: 1 },
  { id: 3, name: '古城青砖宿', style: '古城宿', price: 398, stock: 4 },
  { id: 4, name: '稻香田园', style: '田园居', price: 328, stock: 0 },
]

export function RenyixuanDemo() {
  const { toast, show } = useToast()
  const styles = ['全部', '海景房', '山景院', '古城宿', '田园居'] as const
  const [style, setStyle] = useState<(typeof styles)[number]>('全部')
  const [fav, setFav] = useState<number[]>([])
  const list = HOMES.filter((h) => style === '全部' || h.style === style)

  return (
    <div className="idemo idemo--mobile-app">
      <div className="idemo__chips">
        {styles.map((s) => (
          <button key={s} type="button" className={style === s ? 'is-active' : ''} onClick={() => setStyle(s)}>{s}</button>
        ))}
      </div>
      <div className="idemo__cards-col">
        {list.map((h) => (
          <div key={h.id} className="idemo__stay row">
            <div className="idemo__stay-cover" />
            <div className="idemo__stay-body">
              <strong>{h.name}</strong>
              <span>{h.style} · ¥{h.price}/晚 · 库存 {h.stock}</span>
              <div className="idemo__actions tight">
                <button
                  type="button"
                  className="idemo__btn"
                  onClick={() => {
                    setFav((f) => (f.includes(h.id) ? f.filter((x) => x !== h.id) : [...f, h.id]))
                    show(fav.includes(h.id) ? '已取消收藏' : '已收藏')
                  }}
                >
                  {fav.includes(h.id) ? '已收藏' : '收藏'}
                </button>
                <button type="button" className="idemo__btn primary" onClick={() => show(`请切到「房源详情」查看 ${h.name}`)}>详情</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastBar toast={toast} />
    </div>
  )
}

export function RenyixuanDetailDemo() {
  const { toast, show } = useToast()
  const home = HOMES[0]
  const [nights, setNights] = useState(2)
  const [guests, setGuests] = useState(2)

  return (
    <div className="idemo idemo--mobile-app pad-form">
      <div className="idemo__stay-cover lg" />
      <h3 className="idemo__mobile-title">{home.name}</h3>
      <p className="idemo__tip">ES 检索命中 · MinIO 图床 · 库存 {home.stock}</p>
      <label className="idemo__label">入住晚数</label>
      <div className="idemo__stepper">
        <button type="button" onClick={() => setNights((n) => Math.max(1, n - 1))}>−</button>
        <b>{nights}</b>
        <button type="button" onClick={() => setNights((n) => n + 1)}>＋</button>
      </div>
      <label className="idemo__label">入住人数</label>
      <div className="idemo__stepper">
        <button type="button" onClick={() => setGuests((n) => Math.max(1, n - 1))}>−</button>
        <b>{guests}</b>
        <button type="button" onClick={() => setGuests((n) => n + 1)}>＋</button>
      </div>
      <p><b>预估：</b>¥{home.price * nights}</p>
      <button type="button" className="idemo__btn primary block" onClick={() => show('已加入预约，请切到「预约下单」')}>去下单</button>
      <ToastBar toast={toast} />
    </div>
  )
}

export function RenyixuanOrderDemo() {
  const { toast, show } = useToast()
  const [agree, setAgree] = useState(false)

  return (
    <div className="idemo idemo--mobile-app pad-form">
      <h3 className="idemo__mobile-title">预约下单</h3>
      <div className="idemo__card">
        <p><b>房源：</b>东海听潮民宿</p>
        <p><b>校验：</b>Redis 库存锁 · RabbitMQ 延时取消</p>
        <p><b>安全：</b>多设备登录互踢（Sa-Token）</p>
        <label className="idemo__check">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          已阅读取消规则与入住须知
        </label>
        <div className="idemo__actions">
          <button
            type="button"
            className="idemo__btn primary"
            onClick={() => {
              if (!agree) return show('请先勾选须知')
              show('下单成功 · 已踢掉其他端登录会话')
            }}
          >
            确认支付预订
          </button>
          <button type="button" className="idemo__btn" onClick={() => show('已触发延时取消消息入队')}>模拟取消</button>
        </div>
      </div>
      <ToastBar toast={toast} />
    </div>
  )
}

export function renderReactDemo(reactId: string) {
  switch (reactId) {
    case 'jnpf-gov':
      return <JnpfGovDemo />
    case 'jnpf-gov-designer':
      return <JnpfGovDesignerDemo />
    case 'jnpf-gov-bpmn':
      return <JnpfGovBpmnDemo />
    case 'jnpf-gov-perm':
      return <JnpfGovPermDemo />
    case 'jnpf-gov-inte':
      return <JnpfGovInteDemo />
    case 'jnpf-event':
      return <JnpfEventDemo />
    case 'jnpf-event-map':
      return <JnpfEventMapDemo />
    case 'jnpf-event-work':
      return <JnpfEventWorkDemo />
    case 'jnpf-event-stats':
      return <JnpfEventStatsDemo />
    case 'tally-book':
      return <TallyBookDemo />
    case 'tally-book-add':
      return <TallyBookAddDemo />
    case 'tally-book-chart':
      return <TallyBookChartDemo />
    case 'legal-ui':
      return <LegalUiDemo />
    case 'legal-ui-detail':
      return <LegalUiDetailDemo />
    case 'legal-ui-dossier':
      return <LegalUiDossierDemo />
    case 'dossier':
      return <DossierDemo />
    case 'dossier-make':
      return <DossierMakeDemo />
    case 'dossier-scan':
      return <DossierScanDemo />
    case 'zxzj':
      return <ZxzjDemo />
    case 'zxzj-bug':
      return <ZxzjBugDemo />
    case 'zxzj-daily':
      return <ZxzjDailyDemo />
    case 'renyixuan':
      return <RenyixuanDemo />
    case 'renyixuan-detail':
      return <RenyixuanDetailDemo />
    case 'renyixuan-order':
      return <RenyixuanOrderDemo />
    default:
      return <div className="idemo__empty">暂无演示：{reactId}</div>
  }
}

