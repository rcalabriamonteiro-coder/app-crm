import React, { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

const RED = '#C0272D'
const RED_DARK = '#8B1A1E'
const RED_LIGHT = '#F9E8E8'
const BLACK = '#111111'

const styles = `
* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
body { background: #F5F5F4; color: #111; font-size: 15px; }
.nav { background: ${BLACK}; display: flex; overflow-x: auto; scrollbar-width: none; border-bottom: 2px solid ${RED}; position: sticky; top: 0; z-index: 100; }
.nav::-webkit-scrollbar { display: none; }
.nav-tab { color: #777; font-size: 11px; padding: 10px 12px; white-space: nowrap; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; text-align: center; min-width: 60px; }
.nav-tab.active { color: #fff; border-bottom-color: ${RED}; }
.nav-tab i { display: block; font-size: 20px; margin: 0 auto 2px; }
.screen { display: none; padding: 14px; padding-bottom: 80px; }
.screen.active { display: block; }
.card { background: #fff; border-radius: 12px; border: 0.5px solid rgba(0,0,0,0.1); padding: 14px 16px; margin-bottom: 10px; }
.section-header { font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin: 16px 0 8px; }
.badge { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 20px; font-weight: 500; }
.badge-red { background: ${RED_LIGHT}; color: ${RED_DARK}; }
.badge-gray { background: #eee; color: #555; }
.badge-green { background: #e8f5e9; color: #2e7d32; }
.badge-orange { background: #fff3e0; color: #e65100; }
.badge-blue { background: #e3f2fd; color: #1565c0; }
.resumo-card { background: ${BLACK}; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
.resumo-ola { color: white; font-size: 17px; font-weight: 600; margin-bottom: 6px; }
.resumo-text { color: #aaa; font-size: 13px; line-height: 1.6; }
.alerta { background: rgba(192,39,45,0.15); border-left: 3px solid ${RED}; border-radius: 0 8px 8px 0; padding: 8px 12px; margin-top: 8px; color: #f99; font-size: 13px; }
.dever-card { background: ${BLACK}; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; }
.dever-label { color: #E05055; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 10px; text-transform: uppercase; }
.dever-item { display: flex; align-items: center; gap: 10px; padding: 6px 0; border-bottom: 0.5px solid rgba(255,255,255,0.08); }
.dever-item:last-child { border-bottom: none; }
.dever-check { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid #E05055; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.dever-check.done { background: ${RED}; border-color: ${RED}; }
.dever-text { color: #ddd; font-size: 14px; }
.dever-text.done { text-decoration: line-through; color: #555; }
.dever-input-row { display: flex; gap: 8px; margin-top: 10px; }
.dever-input { background: rgba(255,255,255,0.07); border: 0.5px solid rgba(255,255,255,0.15); border-radius: 8px; color: white; font-size: 13px; padding: 8px 10px; flex: 1; outline: none; }
.dever-input::placeholder { color: #555; }
.dever-btn { background: ${RED}; border: none; border-radius: 8px; color: white; font-size: 18px; padding: 8px 14px; cursor: pointer; }
.tarefa-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; border-bottom: 0.5px solid rgba(0,0,0,0.08); }
.tarefa-item:last-child { border-bottom: none; }
.tarefa-check { width: 20px; height: 20px; border-radius: 4px; border: 1.5px solid #ccc; cursor: pointer; flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; }
.tarefa-check.done { background: ${RED}; border-color: ${RED}; }
.tarefa-titulo { font-size: 14px; font-weight: 500; margin-bottom: 3px; }
.tarefa-titulo.done { text-decoration: line-through; color: #aaa; }
.tarefa-meta { font-size: 12px; color: #777; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-top: 3px; }
.prazo-vermelho { color: ${RED}; font-size: 12px; }
.subtabs { display: flex; gap: 6px; margin-bottom: 14px; overflow-x: auto; scrollbar-width: none; }
.subtabs::-webkit-scrollbar { display: none; }
.subtab { font-size: 13px; padding: 6px 14px; border-radius: 20px; cursor: pointer; border: 0.5px solid rgba(0,0,0,0.12); background: #fff; color: #777; white-space: nowrap; flex-shrink: 0; }
.subtab.active { background: ${BLACK}; color: white; border-color: ${BLACK}; }
.form-group { margin-bottom: 14px; }
.form-label { font-size: 12px; color: #777; margin-bottom: 5px; display: block; }
.form-input { width: 100%; background: #fff; border: 0.5px solid rgba(0,0,0,0.15); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #111; outline: none; }
.form-input:focus { border-color: ${RED}; }
.form-select { width: 100%; background: #fff; border: 0.5px solid rgba(0,0,0,0.15); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #111; outline: none; appearance: none; }
.form-textarea { width: 100%; background: #fff; border: 0.5px solid rgba(0,0,0,0.15); border-radius: 8px; padding: 10px 12px; font-size: 14px; color: #111; outline: none; resize: none; min-height: 80px; line-height: 1.5; }
.btn-primary { background: ${RED}; color: white; border: none; border-radius: 8px; padding: 12px 18px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; }
.btn-secondary { background: transparent; color: ${RED}; border: 1px solid ${RED}; border-radius: 8px; padding: 10px 14px; font-size: 13px; cursor: pointer; width: 100%; margin-top: 8px; }
.btn-danger { background: transparent; color: #999; border: none; font-size: 12px; cursor: pointer; padding: 4px 8px; }
.pessoa-avatar { width: 38px; height: 38px; border-radius: 50%; background: ${RED_LIGHT}; color: ${RED_DARK}; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pessoa-row { display: flex; align-items: center; gap: 12px; }
.pessoa-nome { font-size: 15px; font-weight: 600; }
.pessoa-grupo { font-size: 12px; color: #777; }
.pessoa-prox { font-size: 13px; color: #777; margin-top: 8px; padding-top: 8px; border-top: 0.5px solid rgba(0,0,0,0.08); }
.pessoa-prox span { color: ${RED}; font-weight: 500; }
.reuniao-data { font-size: 11px; color: #999; margin-bottom: 4px; }
.reuniao-titulo { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
.reuniao-pendente { background: ${RED_LIGHT}; border-radius: 8px; padding: 8px 10px; font-size: 13px; color: ${RED_DARK}; margin-top: 8px; }
.reuniao-pendente-label { font-size: 11px; font-weight: 600; color: ${RED}; margin-bottom: 3px; }
.nota-titulo { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.nota-preview { font-size: 13px; color: #777; line-height: 1.5; }
.nota-meta { font-size: 11px; color: #bbb; margin-top: 8px; }
.metricas-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
.metrica-card { background: #fff; border-radius: 12px; border: 0.5px solid rgba(0,0,0,0.1); padding: 14px; }
.metrica-label { font-size: 12px; color: #777; margin-bottom: 4px; }
.metrica-valor { font-size: 28px; font-weight: 600; color: ${RED}; }
.metrica-sub { font-size: 11px; color: #999; margin-top: 2px; }
.fab { position: fixed; bottom: 24px; right: 20px; width: 52px; height: 52px; border-radius: 50%; background: ${RED}; color: white; font-size: 28px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 14px rgba(192,39,45,0.4); z-index: 200; }
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 300; align-items: flex-end; }
.modal-overlay.open { display: flex; }
.modal { background: #F5F5F4; border-radius: 20px 20px 0 0; padding: 20px 16px 36px; width: 100%; max-height: 88vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.modal-titulo { font-size: 16px; font-weight: 600; }
.modal-close { background: #e0e0e0; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; color: #666; }
.captura-textarea { width: 100%; border: none; outline: none; font-size: 15px; color: #111; background: transparent; resize: none; min-height: 100px; line-height: 1.6; }
.captura-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; padding-top: 10px; border-top: 0.5px solid rgba(0,0,0,0.1); }
.captura-btn { font-size: 12px; padding: 6px 12px; border-radius: 8px; border: 0.5px solid rgba(0,0,0,0.12); background: #F5F5F4; color: #555; cursor: pointer; }
.login-container { min-height: 100vh; background: ${BLACK}; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
.login-logo { color: ${RED}; font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
.login-sub { color: #666; font-size: 13px; margin-bottom: 36px; }
.login-card { background: #1a1a1a; border-radius: 16px; padding: 24px; width: 100%; max-width: 360px; border: 0.5px solid rgba(255,255,255,0.08); }
.login-input { width: 100%; background: rgba(255,255,255,0.07); border: 0.5px solid rgba(255,255,255,0.12); border-radius: 8px; color: white; font-size: 14px; padding: 12px 14px; outline: none; margin-bottom: 12px; }
.login-input::placeholder { color: #555; }
.login-btn { background: ${RED}; color: white; border: none; border-radius: 8px; padding: 13px; font-size: 14px; font-weight: 600; cursor: pointer; width: 100%; margin-top: 4px; }
.login-error { color: #f88; font-size: 13px; margin-top: 10px; text-align: center; }
.login-toggle { color: #777; font-size: 13px; margin-top: 16px; text-align: center; cursor: pointer; }
.login-toggle span { color: ${RED}; }
.top-bar { background: ${BLACK}; padding: 10px 16px; display: flex; align-items: center; justify-content: space-between; }
.top-bar-title { color: white; font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
.top-bar-title span { color: ${RED}; }
.logout-btn { background: transparent; border: 0.5px solid #444; border-radius: 8px; color: #888; font-size: 12px; padding: 5px 10px; cursor: pointer; }
.delete-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 18px; padding: 4px; flex-shrink: 0; }
.delete-btn:hover { color: ${RED}; }
.empty-state { text-align: center; color: #bbb; font-size: 14px; padding: 32px 0; }
`

function getInitials(nome) {
  return nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diff = Math.round((d - hoje) / 86400000)
  if (diff < 0) return { label: `${Math.abs(diff)}d atrasada`, tipo: 'vermelho' }
  if (diff === 0) return { label: 'Hoje', tipo: 'red' }
  if (diff === 1) return { label: 'Amanhã', tipo: 'orange' }
  return { label: d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), tipo: 'gray' }
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPass, setAuthPass] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('hoje')
  const [modal, setModal] = useState(null)
  const [data, setData] = useState({ deveres: [], tarefas: [], pessoas: [], reunioes: [], notas: [], capturas: [], metricas: {} })
  const [subtab, setSubtab] = useState({})

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadData = useCallback(async () => {
    if (!user) return
    const { data: d } = await supabase.from('crm_data').select('*').eq('user_id', user.id).single()
    if (d?.payload) setData(d.payload)
  }, [user])

  useEffect(() => { loadData() }, [loadData])

  const saveData = useCallback(async (newData) => {
    if (!user) return
    const { data: existing } = await supabase.from('crm_data').select('id').eq('user_id', user.id).single()
    if (existing) {
      await supabase.from('crm_data').update({ payload: newData }).eq('user_id', user.id)
    } else {
      await supabase.from('crm_data').insert({ user_id: user.id, payload: newData })
    }
  }, [user])

  const update = useCallback((newData) => {
    setData(newData)
    saveData(newData)
  }, [saveData])

  const handleAuth = async (e) => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPass })
      if (error) setAuthError('E-mail ou senha incorretos.')
    } else {
      const { error } = await supabase.auth.signUp({ email: authEmail, password: authPass })
      if (error) setAuthError('Erro ao criar conta. Tente outro e-mail.')
      else setAuthError('Conta criada! Verifique seu e-mail para confirmar.')
    }
    setAuthLoading(false)
  }

  const logout = async () => { await supabase.auth.signOut() }

  if (loading) return <div style={{ minHeight: '100vh', background: BLACK, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Carregando...</div>

  if (!user) return (
    <div className="login-container">
      <style>{styles}</style>
      <div className="login-logo">APP<span style={{ color: 'white' }}>CRM</span></div>
      <div className="login-sub">Organização pessoal do coordenador</div>
      <div className="login-card">
        <form onSubmit={handleAuth}>
          <input className="login-input" type="email" placeholder="E-mail" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required />
          <input className="login-input" type="password" placeholder="Senha" value={authPass} onChange={e => setAuthPass(e.target.value)} required />
          <button className="login-btn" type="submit" disabled={authLoading}>{authLoading ? 'Aguarde...' : authMode === 'login' ? 'Entrar' : 'Criar conta'}</button>
        </form>
        {authError && <div className="login-error">{authError}</div>}
        <div className="login-toggle" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
          {authMode === 'login' ? <>Não tem conta? <span>Criar conta</span></> : <>Já tem conta? <span>Entrar</span></>}
        </div>
      </div>
    </div>
  )

  const hora = new Date().getHours()
  const saudacao = hora < 12 ? 'Bom dia 👋' : hora < 18 ? 'Boa tarde 👋' : 'Boa noite 👋'
  const hoje = new Date().toISOString().split('T')[0]
  const tarefasHoje = data.tarefas.filter(t => !t.feita && t.prazo === hoje)
  const tarefasAtrasadas = data.tarefas.filter(t => !t.feita && t.prazo && t.prazo < hoje)
  const pessoasPendentes = data.pessoas.filter(p => p.status === 'Pendente')
  const getSubtab = (key, def) => subtab[key] || def

  const openModal = (tipo, item = null) => setModal({ tipo, item })
  const closeModal = () => setModal(null)

  const saveTarefa = (t) => {
    const list = modal.item
      ? data.tarefas.map(x => x.id === modal.item.id ? { ...x, ...t } : x)
      : [...data.tarefas, { ...t, id: Date.now(), feita: false, criadaEm: new Date().toISOString() }]
    update({ ...data, tarefas: list })
    closeModal()
  }

  const toggleTarefa = (id) => {
    update({ ...data, tarefas: data.tarefas.map(t => t.id === id ? { ...t, feita: !t.feita } : t) })
  }

  const deleteTarefa = (id) => update({ ...data, tarefas: data.tarefas.filter(t => t.id !== id) })

  const savePessoa = (p) => {
    const list = modal.item
      ? data.pessoas.map(x => x.id === modal.item.id ? { ...x, ...p } : x)
      : [...data.pessoas, { ...p, id: Date.now() }]
    update({ ...data, pessoas: list })
    closeModal()
  }

  const deletePessoa = (id) => update({ ...data, pessoas: data.pessoas.filter(p => p.id !== id) })

  const saveReuniao = (r) => {
    const list = modal.item
      ? data.reunioes.map(x => x.id === modal.item.id ? { ...x, ...r } : x)
      : [...data.reunioes, { ...r, id: Date.now(), criadaEm: new Date().toISOString() }]
    update({ ...data, reunioes: list })
    closeModal()
  }

  const deleteReuniao = (id) => update({ ...data, reunioes: data.reunioes.filter(r => r.id !== id) })

  const saveNota = (n) => {
    const list = modal.item
      ? data.notas.map(x => x.id === modal.item.id ? { ...x, ...n, editadaEm: new Date().toISOString() } : x)
      : [...data.notas, { ...n, id: Date.now(), criadaEm: new Date().toISOString(), editadaEm: new Date().toISOString() }]
    update({ ...data, notas: list })
    closeModal()
  }

  const deleteNota = (id) => update({ ...data, notas: data.notas.filter(n => n.id !== id) })

  const addDever = (texto) => {
    const itens = texto.split(',').map(s => s.trim()).filter(Boolean)
    const novos = itens.map(t => ({ id: Date.now() + Math.random(), texto: t, feito: false }))
    update({ ...data, deveres: [...data.deveres, ...novos] })
  }

  const toggleDever = (id) => {
    update({ ...data, deveres: data.deveres.map(d => d.id === id ? { ...d, feito: !d.feito } : d) })
  }

  const guardarCaptura = (texto, destino) => {
    if (!texto.trim()) return
    if (destino === 'guardar') {
      update({ ...data, capturas: [{ id: Date.now(), texto, criadaEm: new Date().toISOString() }, ...data.capturas] })
    } else if (destino === 'tarefa') {
      update({ ...data, tarefas: [...data.tarefas, { id: Date.now(), titulo: texto, categoria: 'Outro', feita: false, criadaEm: new Date().toISOString() }] })
      setActiveTab('tarefas')
    } else if (destino === 'nota') {
      update({ ...data, notas: [{ id: Date.now(), titulo: texto, conteudo: '', criadaEm: new Date().toISOString(), editadaEm: new Date().toISOString() }, ...data.notas] })
      setActiveTab('notas')
    }
  }

  const deleteCaptura = (id) => update({ ...data, capturas: data.capturas.filter(c => c.id !== id) })

  const updateMetrica = (key, val) => {
    update({ ...data, metricas: { ...data.metricas, [key]: val } })
  }

  const renderBadgePrazo = (prazo) => {
    if (!prazo) return <span className="badge badge-gray">Sem prazo</span>
    const f = formatDate(prazo)
    const cls = f.tipo === 'vermelho' || f.tipo === 'red' ? 'badge-red' : f.tipo === 'orange' ? 'badge-orange' : 'badge-gray'
    return <span className={`badge ${cls}`}>{f.tipo === 'vermelho' ? `⏰ ${f.label}` : `📅 ${f.label}`}</span>
  }

  const catColor = { CRM: 'badge-blue', WhatsApp: 'badge-green', Relatório: 'badge-orange', Reunião: 'badge-gray', Outro: 'badge-gray' }

  const tarefasFiltradas = (cat) => {
    const sub = getSubtab('tarefas', 'Ativas')
    if (sub === 'Feitas') return data.tarefas.filter(t => t.feita && (!cat || t.categoria === cat))
    return data.tarefas.filter(t => !t.feita && (!cat || t.categoria === cat))
  }

  const renderTarefaItem = (t) => (
    <div className="tarefa-item" key={t.id}>
      <div className={`tarefa-check ${t.feita ? 'done' : ''}`} onClick={() => toggleTarefa(t.id)}>
        {t.feita && <span style={{ color: 'white', fontSize: 11 }}>✓</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div className={`tarefa-titulo ${t.feita ? 'done' : ''}`}>{t.titulo}</div>
        <div className="tarefa-meta">
          {renderBadgePrazo(t.prazo)}
          <span className={`badge ${catColor[t.categoria] || 'badge-gray'}`}>{t.categoria}</span>
          {t.prioridade === 'Alta' && <span className="badge badge-red">Alta</span>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="delete-btn" onClick={() => openModal('tarefa', t)}>
          <i className="ti ti-edit" style={{ fontSize: 16 }} />
        </button>
        <button className="delete-btn" onClick={() => deleteTarefa(t.id)}>
          <i className="ti ti-trash" style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <style>{styles}</style>

      <div className="top-bar">
        <div className="top-bar-title">APP<span>CRM</span></div>
        <button className="logout-btn" onClick={logout}>Sair</button>
      </div>

      <nav className="nav">
        {[
          { id: 'hoje', icon: 'ti-home', label: 'Hoje' },
          { id: 'captura', icon: 'ti-bolt', label: 'Captura' },
          { id: 'tarefas', icon: 'ti-list-check', label: 'Tarefas' },
          { id: 'pessoas', icon: 'ti-users', label: 'Pessoas' },
          { id: 'reunioes', icon: 'ti-calendar-event', label: 'Reuniões' },
          { id: 'notas', icon: 'ti-notes', label: 'Notas' },
          { id: 'metricas', icon: 'ti-chart-bar', label: 'Métricas' },
        ].map(t => (
          <div key={t.id} className={`nav-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            <i className={`ti ${t.icon}`} />
            {t.label}
          </div>
        ))}
      </nav>

      {/* HOJE */}
      <div className={`screen ${activeTab === 'hoje' ? 'active' : ''}`}>
        <div className="resumo-card">
          <div className="resumo-ola">{saudacao}</div>
          <div className="resumo-text">
            {tarefasAtrasadas.length > 0 && <><strong style={{ color: 'white' }}>{tarefasAtrasadas.length} tarefa{tarefasAtrasadas.length > 1 ? 's' : ''} atrasada{tarefasAtrasadas.length > 1 ? 's' : ''}</strong> · </>}
            {tarefasHoje.length > 0 ? <><strong style={{ color: 'white' }}>{tarefasHoje.length} para hoje</strong></> : 'Nenhuma tarefa para hoje'}
            {pessoasPendentes.length > 0 && <> · <strong style={{ color: '#f99' }}>{pessoasPendentes.length} pessoa{pessoasPendentes.length > 1 ? 's' : ''} pendente{pessoasPendentes.length > 1 ? 's' : ''}</strong></>}
          </div>
          {pessoasPendentes.slice(0, 2).map(p => (
            <div className="alerta" key={p.id}>⚡ Follow-up pendente: {p.nome}</div>
          ))}
        </div>

        <div className="dever-card">
          <div className="dever-label">🎯 Dever do dia</div>
          {data.deveres.map(d => (
            <div className="dever-item" key={d.id}>
              <div className={`dever-check ${d.feito ? 'done' : ''}`} onClick={() => toggleDever(d.id)}>
                {d.feito && <span style={{ color: 'white', fontSize: 11 }}>✓</span>}
              </div>
              <span className={`dever-text ${d.feito ? 'done' : ''}`}>{d.texto}</span>
              <button className="delete-btn" style={{ color: '#444' }} onClick={() => update({ ...data, deveres: data.deveres.filter(x => x.id !== d.id) })}>×</button>
            </div>
          ))}
          <DeverInput onAdd={addDever} />
        </div>

        {tarefasHoje.length > 0 && <>
          <div className="section-header">Vencendo hoje</div>
          <div className="card" style={{ padding: '0 16px' }}>{tarefasHoje.map(renderTarefaItem)}</div>
        </>}

        {tarefasAtrasadas.length > 0 && <>
          <div className="section-header">Atrasadas</div>
          <div className="card" style={{ padding: '0 16px' }}>{tarefasAtrasadas.map(renderTarefaItem)}</div>
        </>}

        {tarefasHoje.length === 0 && tarefasAtrasadas.length === 0 && (
          <div className="empty-state">Tudo em dia! ✅</div>
        )}
      </div>

      {/* CAPTURA */}
      <div className={`screen ${activeTab === 'captura' ? 'active' : ''}`}>
        <CapturaBox onSave={guardarCaptura} />
        <div className="section-header">Guardados recentes</div>
        {data.capturas.length === 0 && <div className="empty-state">Nada guardado ainda</div>}
        {data.capturas.map(c => (
          <div className="card" key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: '#555' }}>{c.texto}</div>
              <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>{new Date(c.criadaEm).toLocaleString('pt-BR')}</div>
            </div>
            <button className="delete-btn" onClick={() => deleteCaptura(c.id)}><i className="ti ti-trash" style={{ fontSize: 16 }} /></button>
          </div>
        ))}
      </div>

      {/* TAREFAS */}
      <div className={`screen ${activeTab === 'tarefas' ? 'active' : ''}`}>
        <div className="subtabs">
          {['Ativas', 'Feitas'].map(s => (
            <div key={s} className={`subtab ${getSubtab('tarefas', 'Ativas') === s ? 'active' : ''}`} onClick={() => setSubtab({ ...subtab, tarefas: s })}>{s}</div>
          ))}
        </div>
        {['CRM', 'WhatsApp', 'Relatório', 'Reunião', 'Outro'].map(cat => {
          const items = tarefasFiltradas(cat)
          if (items.length === 0) return null
          return (
            <div key={cat}>
              <div className="section-header">{cat}</div>
              <div className="card" style={{ padding: '0 16px' }}>{items.map(renderTarefaItem)}</div>
            </div>
          )
        })}
        {data.tarefas.filter(t => getSubtab('tarefas', 'Ativas') === 'Ativas' ? !t.feita : t.feita).length === 0 && (
          <div className="empty-state">{getSubtab('tarefas', 'Ativas') === 'Ativas' ? 'Nenhuma tarefa ativa' : 'Nenhuma tarefa concluída'}</div>
        )}
      </div>

      {/* PESSOAS */}
      <div className={`screen ${activeTab === 'pessoas' ? 'active' : ''}`}>
        <div className="subtabs">
          {['Todos', 'Aliados', 'Equipe', 'Imprensa', 'Outros'].map(s => (
            <div key={s} className={`subtab ${getSubtab('pessoas', 'Todos') === s ? 'active' : ''}`} onClick={() => setSubtab({ ...subtab, pessoas: s })}>{s}</div>
          ))}
        </div>
        {data.pessoas.filter(p => {
          const s = getSubtab('pessoas', 'Todos')
          return s === 'Todos' || p.grupo === s
        }).map(p => (
          <div className="card" key={p.id}>
            <div className="pessoa-row">
              <div className="pessoa-avatar">{getInitials(p.nome)}</div>
              <div style={{ flex: 1 }}>
                <div className="pessoa-nome">{p.nome}</div>
                <div className="pessoa-grupo">{p.grupo} {p.local ? `· ${p.local}` : ''}</div>
              </div>
              <span className={`badge ${p.status === 'Pendente' ? 'badge-red' : p.status === 'OK' ? 'badge-green' : 'badge-gray'}`}>{p.status || 'Normal'}</span>
              <div style={{ display: 'flex', gap: 2 }}>
                <button className="delete-btn" onClick={() => openModal('pessoa', p)}><i className="ti ti-edit" style={{ fontSize: 16 }} /></button>
                <button className="delete-btn" onClick={() => deletePessoa(p.id)}><i className="ti ti-trash" style={{ fontSize: 16 }} /></button>
              </div>
            </div>
            {p.proximo && <div className="pessoa-prox">Próximo passo: <span>{p.proximo}</span></div>}
            {p.notas && <div style={{ fontSize: 13, color: '#999', marginTop: 6 }}>{p.notas}</div>}
          </div>
        ))}
        {data.pessoas.length === 0 && <div className="empty-state">Nenhuma pessoa cadastrada</div>}
      </div>

      {/* REUNIOES */}
      <div className={`screen ${activeTab === 'reunioes' ? 'active' : ''}`}>
        {data.reunioes.map(r => (
          <div className="card" key={r.id}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div className="reuniao-data">{r.data ? new Date(r.data + 'T00:00:00').toLocaleDateString('pt-BR') : ''} {r.horario ? `· ${r.horario}` : ''} {r.participantes ? `· ${r.participantes}` : ''}</div>
                <div className="reuniao-titulo">{r.titulo}</div>
                {r.resumo && <div style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>{r.resumo}</div>}
                {r.pendencias && (
                  <div className="reuniao-pendente">
                    <div className="reuniao-pendente-label">⚡ Pendências</div>
                    {r.pendencias}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 2 }}>
                <button className="delete-btn" onClick={() => openModal('reuniao', r)}><i className="ti ti-edit" style={{ fontSize: 16 }} /></button>
                <button className="delete-btn" onClick={() => deleteReuniao(r.id)}><i className="ti ti-trash" style={{ fontSize: 16 }} /></button>
              </div>
            </div>
          </div>
        ))}
        {data.reunioes.length === 0 && <div className="empty-state">Nenhuma reunião registrada</div>}
      </div>

      {/* NOTAS */}
      <div className={`screen ${activeTab === 'notas' ? 'active' : ''}`}>
        {data.notas.map(n => (
          <div className="card" key={n.id} style={{ cursor: 'pointer' }} onClick={() => openModal('nota', n)}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div className="nota-titulo">{n.titulo || 'Sem título'}</div>
                {n.conteudo && <div className="nota-preview">{n.conteudo.slice(0, 100)}{n.conteudo.length > 100 ? '...' : ''}</div>}
                <div className="nota-meta">Editada {new Date(n.editadaEm).toLocaleString('pt-BR')}</div>
              </div>
              <button className="delete-btn" onClick={e => { e.stopPropagation(); deleteNota(n.id) }}><i className="ti ti-trash" style={{ fontSize: 16 }} /></button>
            </div>
          </div>
        ))}
        {data.notas.length === 0 && <div className="empty-state">Nenhuma anotação ainda</div>}
      </div>

      {/* METRICAS */}
      <div className={`screen ${activeTab === 'metricas' ? 'active' : ''}`}>
        <div className="metricas-grid">
          {[
            { key: 'disparos', label: 'Disparos feitos', sub: 'esta semana' },
            { key: 'grupos', label: 'Grupos ativos', sub: 'WhatsApp' },
            { key: 'contatos', label: 'Novos contatos', sub: 'no CRM' },
            { key: 'liderancas', label: 'Lideranças', sub: 'com follow-up ok' },
          ].map(m => (
            <div className="metrica-card" key={m.key}>
              <div className="metrica-label">{m.label}</div>
              <div className="metrica-valor">{data.metricas[m.key] || 0}</div>
              <div className="metrica-sub">{m.sub}</div>
            </div>
          ))}
        </div>
        <div className="section-header">Atualizar</div>
        <div className="card">
          {[
            { key: 'disparos', label: 'Disparos feitos esta semana' },
            { key: 'grupos', label: 'Grupos WhatsApp ativos' },
            { key: 'contatos', label: 'Novos contatos no CRM' },
            { key: 'liderancas', label: 'Lideranças com follow-up feito' },
          ].map(m => (
            <div className="form-group" key={m.key}>
              <label className="form-label">{m.label}</label>
              <input className="form-input" type="number" value={data.metricas[m.key] || ''} placeholder="0" onChange={e => updateMetrica(m.key, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="section-header">Observações da semana</div>
        <div className="card">
          <textarea className="form-textarea" placeholder="Anotações livres sobre os números..." value={data.metricas.obs || ''} onChange={e => updateMetrica('obs', e.target.value)} />
        </div>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => openModal(activeTab === 'hoje' ? 'tarefa' : activeTab === 'tarefas' ? 'tarefa' : activeTab === 'pessoas' ? 'pessoa' : activeTab === 'reunioes' ? 'reuniao' : 'nota')}>
        <i className="ti ti-plus" />
      </button>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay open" onClick={e => e.target.className.includes('modal-overlay') && closeModal()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-titulo">
                {modal.tipo === 'tarefa' ? (modal.item ? 'Editar tarefa' : 'Nova tarefa') :
                  modal.tipo === 'pessoa' ? (modal.item ? 'Editar pessoa' : 'Nova pessoa') :
                    modal.tipo === 'reuniao' ? (modal.item ? 'Editar reunião' : 'Nova reunião') :
                      modal.item ? 'Editar nota' : 'Nova nota'}
              </div>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            {modal.tipo === 'tarefa' && <TarefaForm item={modal.item} onSave={saveTarefa} />}
            {modal.tipo === 'pessoa' && <PessoaForm item={modal.item} onSave={savePessoa} />}
            {modal.tipo === 'reuniao' && <ReuniaoForm item={modal.item} onSave={saveReuniao} />}
            {modal.tipo === 'nota' && <NotaForm item={modal.item} onSave={saveNota} />}
          </div>
        </div>
      )}
    </div>
  )
}

function DeverInput({ onAdd }) {
  const [val, setVal] = useState('')
  const submit = () => { if (val.trim()) { onAdd(val); setVal('') } }
  return (
    <div className="dever-input-row">
      <input className="dever-input" value={val} onChange={e => setVal(e.target.value)} placeholder="Adicionar (vírgula = vários)..." onKeyDown={e => e.key === 'Enter' && submit()} />
      <button className="dever-btn" onClick={submit}>+</button>
    </div>
  )
}

function CapturaBox({ onSave }) {
  const [val, setVal] = useState('')
  return (
    <div className="card">
      <textarea className="captura-textarea" value={val} onChange={e => setVal(e.target.value)} placeholder="Jogue aqui qualquer ideia, recado ou pendência..." />
      <div className="captura-actions">
        <button className="captura-btn" onClick={() => { onSave(val, 'tarefa'); setVal('') }}>→ Tarefa</button>
        <button className="captura-btn" onClick={() => { onSave(val, 'nota'); setVal('') }}>→ Nota</button>
        <button className="captura-btn" style={{ background: RED, color: 'white', border: `1px solid ${RED}` }} onClick={() => { onSave(val, 'guardar'); setVal('') }}>Guardar</button>
      </div>
    </div>
  )
}

function TarefaForm({ item, onSave }) {
  const [f, setF] = useState({ titulo: '', categoria: 'CRM', prazo: '', prioridade: 'Média', ...item })
  return (
    <div>
      <div className="form-group"><label className="form-label">Título</label><input className="form-input" value={f.titulo} onChange={e => setF({ ...f, titulo: e.target.value })} placeholder="O que precisa ser feito?" /></div>
      <div className="form-group"><label className="form-label">Categoria</label>
        <select className="form-select" value={f.categoria} onChange={e => setF({ ...f, categoria: e.target.value })}>
          {['CRM', 'WhatsApp', 'Relatório', 'Reunião', 'Outro'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-group"><label className="form-label">Prazo</label><input className="form-input" type="date" value={f.prazo} onChange={e => setF({ ...f, prazo: e.target.value })} /></div>
      <div className="form-group"><label className="form-label">Prioridade</label>
        <select className="form-select" value={f.prioridade} onChange={e => setF({ ...f, prioridade: e.target.value })}>
          {['Alta', 'Média', 'Baixa'].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <button className="btn-primary" onClick={() => onSave(f)} disabled={!f.titulo.trim()}>Salvar</button>
    </div>
  )
}

function PessoaForm({ item, onSave }) {
  const [f, setF] = useState({ nome: '', grupo: 'Aliados', local: '', status: 'Normal', proximo: '', notas: '', ...item })
  return (
    <div>
      <div className="form-group"><label className="form-label">Nome</label><input className="form-input" value={f.nome} onChange={e => setF({ ...f, nome: e.target.value })} placeholder="Nome completo" /></div>
      <div className="form-group"><label className="form-label">Grupo</label>
        <select className="form-select" value={f.grupo} onChange={e => setF({ ...f, grupo: e.target.value })}>
          {['Aliados', 'Equipe', 'Imprensa', 'Outros'].map(g => <option key={g}>{g}</option>)}
        </select>
      </div>
      <div className="form-group"><label className="form-label">Bairro / Local</label><input className="form-input" value={f.local} onChange={e => setF({ ...f, local: e.target.value })} placeholder="Ex: Méier, Tijuca..." /></div>
      <div className="form-group"><label className="form-label">Status</label>
        <select className="form-select" value={f.status} onChange={e => setF({ ...f, status: e.target.value })}>
          {['Normal', 'Pendente', 'OK', 'Aguardando'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="form-group"><label className="form-label">Próximo passo</label><input className="form-input" value={f.proximo} onChange={e => setF({ ...f, proximo: e.target.value })} placeholder="O que precisa fazer com essa pessoa?" /></div>
      <div className="form-group"><label className="form-label">Observações</label><textarea className="form-textarea" value={f.notas} onChange={e => setF({ ...f, notas: e.target.value })} placeholder="Anotações livres..." /></div>
      <button className="btn-primary" onClick={() => onSave(f)} disabled={!f.nome.trim()}>Salvar</button>
    </div>
  )
}

function ReuniaoForm({ item, onSave }) {
  const [f, setF] = useState({ titulo: '', data: '', horario: '', participantes: '', resumo: '', pendencias: '', ...item })
  return (
    <div>
      <div className="form-group"><label className="form-label">Título</label><input className="form-input" value={f.titulo} onChange={e => setF({ ...f, titulo: e.target.value })} placeholder="Assunto da reunião" /></div>
      <div className="form-group"><label className="form-label">Data</label><input className="form-input" type="date" value={f.data} onChange={e => setF({ ...f, data: e.target.value })} /></div>
      <div className="form-group"><label className="form-label">Horário</label><input className="form-input" type="time" value={f.horario} onChange={e => setF({ ...f, horario: e.target.value })} /></div>
      <div className="form-group"><label className="form-label">Participantes</label><input className="form-input" value={f.participantes} onChange={e => setF({ ...f, participantes: e.target.value })} placeholder="Ex: Candidato, equipe..." /></div>
      <div className="form-group"><label className="form-label">O que foi decidido</label><textarea className="form-textarea" value={f.resumo} onChange={e => setF({ ...f, resumo: e.target.value })} placeholder="Resumo das decisões..." /></div>
      <div className="form-group"><label className="form-label">Pendências geradas</label><textarea className="form-textarea" value={f.pendencias} onChange={e => setF({ ...f, pendencias: e.target.value })} placeholder="O que ficou para fazer..." /></div>
      <button className="btn-primary" onClick={() => onSave(f)} disabled={!f.titulo.trim()}>Salvar</button>
    </div>
  )
}

function NotaForm({ item, onSave }) {
  const [f, setF] = useState({ titulo: '', conteudo: '', ...item })
  return (
    <div>
      <div className="form-group"><label className="form-label">Título</label><input className="form-input" value={f.titulo} onChange={e => setF({ ...f, titulo: e.target.value })} placeholder="Título da nota" /></div>
      <div className="form-group"><label className="form-label">Conteúdo</label><textarea className="form-textarea" style={{ minHeight: 160 }} value={f.conteudo} onChange={e => setF({ ...f, conteudo: e.target.value })} placeholder="Escreva aqui..." /></div>
      <button className="btn-primary" onClick={() => onSave(f)} disabled={!f.titulo.trim()}>Salvar</button>
    </div>
  )
}
