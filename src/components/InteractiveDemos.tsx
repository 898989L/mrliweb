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

/* ========== 事件中心 ========== */
const EVENT_LIST = [
  { id: 'e1', title: '城管 · 占道经营', grid: '东城网格 A3', status: '已分派', level: '一般' },
  { id: 'e2', title: '环保 · 噪声投诉', grid: '西城网格 B1', status: '催办中', level: '紧急' },
  { id: 'e3', title: '市政 · 井盖破损', grid: '南城网格 C2', status: '反馈中', level: '一般' },
  { id: 'e4', title: '安监 · 施工围挡', grid: '北城网格 D4', status: '待受理', level: '紧急' },
]

export function JnpfEventDemo() {
  const { toast, show } = useToast()
  const [filter, setFilter] = useState('全部')
  const stats = [
    { label: '今日事件', value: 86 },
    { label: '已办结', value: 61 },
    { label: '催办中', value: 7 },
    { label: '网格员在线', value: 18 },
  ]

  return (
    <div className="idemo idemo--screen">
      <header className="idemo__screen-head">
        <h3>态势总览</h3>
        <div className="idemo__seg dark">
          {['全部', '紧急', '一般'].map((f) => (
            <button key={f} type="button" className={filter === f ? 'is-active' : ''} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </header>
      <div className="idemo__screen-body">
        <div className="idemo__stats dark">
          {stats.map((s) => (
            <button key={s.label} type="button" className="idemo__stat-btn" onClick={() => show(`${s.label}：下钻明细已打开`)}>
              <b>{s.value}</b><span>{s.label}</span>
            </button>
          ))}
        </div>
        <div className="idemo__chart-row">
          {[40, 72, 55, 88, 60, 75, 48].map((h, i) => (
            <button key={i} type="button" className="idemo__bar" style={{ height: `${h}%` }} onClick={() => show(`第 ${i + 1} 日：${h} 件`)} />
          ))}
        </div>
        <div className="idemo__list dark-list">
          {EVENT_LIST.filter((e) => filter === '全部' || e.level === filter).map((e) => (
            <button key={e.id} type="button" className="idemo__row" onClick={() => show(`已定位到 ${e.grid}`)}>
              <div><strong>{e.title}</strong><span>{e.grid}</span></div>
              <em className="warn">{e.status}</em>
            </button>
          ))}
        </div>
      </div>
      <ToastBar toast={toast} />
    </div>
  )
}

export function JnpfEventMapDemo() {
  const { toast, show } = useToast()
  const [picked, setPicked] = useState<string | null>(null)
  const [worker, setWorker] = useState('网格员 · 陈涛')

  return (
    <div className="idemo idemo--screen">
      <header className="idemo__screen-head"><h3>地图模式 · Mars3D</h3></header>
      <div className="idemo__map">
        <div className="idemo__map-layer">三维底图 · 点击钉点分派</div>
        {EVENT_LIST.map((e, i) => (
          <button
            key={e.id}
            type="button"
            className={`idemo__pin idemo__pin--${(i % 3) + 1} ${picked === e.id ? 'is-active' : ''}`}
            onClick={() => setPicked(e.id)}
          >
            {e.title.split(' · ')[0]}
          </button>
        ))}
      </div>
      {picked && (
        <div className="idemo__card dark-card">
          <h4>{EVENT_LIST.find((e) => e.id === picked)?.title}</h4>
          <label className="idemo__label light">分派给</label>
          <select className="idemo__input dark" value={worker} onChange={(e) => setWorker(e.target.value)}>
            <option>网格员 · 陈涛</option>
            <option>网格员 · 刘敏</option>
            <option>网格员 · 赵强</option>
          </select>
          <div className="idemo__actions">
            <button type="button" className="idemo__btn primary" onClick={() => { show(`已分派给 ${worker}`); setPicked(null) }}>确认分派</button>
            <button type="button" className="idemo__btn" onClick={() => setPicked(null)}>取消</button>
          </div>
        </div>
      )}
      <ToastBar toast={toast} />
    </div>
  )
}

export function JnpfEventWorkDemo() {
  const { toast, show } = useToast()
  const [list, setList] = useState(EVENT_LIST)
  const [id, setId] = useState<string | null>('e2')
  const [note, setNote] = useState('')
  const cur = list.find((e) => e.id === id)

  return (
    <div className="idemo idemo--screen">
      <header className="idemo__screen-head"><h3>工单处理</h3></header>
      <div className="idemo__split">
        <div className="idemo__list dark-list">
          {list.map((e) => (
            <button key={e.id} type="button" className={`idemo__row ${id === e.id ? 'selected' : ''}`} onClick={() => setId(e.id)}>
              <div><strong>{e.title}</strong><span>{e.grid}</span></div>
              <em className="warn">{e.status}</em>
            </button>
          ))}
        </div>
        <div className="idemo__card dark-card">
          <h4>{cur?.title}</h4>
          <p>状态机：受理 → 分派 → 反馈 → 归档 / 催办 / 挂起</p>
          <label className="idemo__label light">处理意见</label>
          <textarea className="idemo__textarea dark" value={note} onChange={(e) => setNote(e.target.value)} placeholder="填写现场反馈…" rows={3} />
          <div className="idemo__actions">
            <button type="button" className="idemo__btn primary" onClick={() => { setList((p) => p.map((x) => x.id === id ? { ...x, status: '已办结' } : x)); show('已办结归档') }}>办结</button>
            <button type="button" className="idemo__btn" onClick={() => { setList((p) => p.map((x) => x.id === id ? { ...x, status: '催办中' } : x)); show('已发起催办') }}>催办</button>
            <button type="button" className="idemo__btn" onClick={() => { setList((p) => p.map((x) => x.id === id ? { ...x, status: '已挂起' } : x)); show('已挂起') }}>挂起</button>
          </div>
        </div>
      </div>
      <ToastBar toast={toast} />
    </div>
  )
}

export function JnpfEventStatsDemo() {
  const { toast, show } = useToast()
  const [dim, setDim] = useState('按网格')
  const rows = dim === '按网格'
    ? [['东城 A3', '22'], ['西城 B1', '18'], ['南城 C2', '15'], ['北城 D4', '11']]
    : [['城管', '30'], ['环保', '21'], ['市政', '19'], ['安监', '16']]

  return (
    <div className="idemo idemo--screen">
      <header className="idemo__screen-head">
        <h3>统计分析</h3>
        <div className="idemo__seg dark">
          {['按网格', '按类型'].map((d) => (
            <button key={d} type="button" className={dim === d ? 'is-active' : ''} onClick={() => setDim(d)}>{d}</button>
          ))}
        </div>
      </header>
      <div className="idemo__list dark-list">
        {rows.map(([k, v]) => (
          <button key={k} type="button" className="idemo__row" onClick={() => show(`${k}：导出明细 ${v} 条`)}>
            <div><strong>{k}</strong><span>{dim}统计</span></div>
            <em className="ok">{v} 件</em>
          </button>
        ))}
      </div>
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

