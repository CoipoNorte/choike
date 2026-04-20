import { useState } from 'react'
import { FaRocket, FaFolderOpen, FaTerminal, FaCode, FaReact, FaCheck } from 'react-icons/fa'
import { SiVite, SiNextdotjs } from 'react-icons/si'

// --- COMPONENTES INTERNOS ---

function FrameworkCard({ active, onClick, icon, title, desc }: any) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all flex-1 ${active
          ? 'border-sky-500 bg-sky-500/10 shadow-lg shadow-sky-500/10'
          : 'border-slate-800 bg-[#1e293b]/30 hover:border-slate-700'
        }`}
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-sm">{title}</h3>
      <p className="text-[9px] text-slate-500 font-bold uppercase">{desc}</p>
    </div>
  )
}

function CheckBox({ label, checked, onChange }: any) {
  return (
    <div className="flex items-center gap-3 cursor-pointer group" onClick={onChange}>
      <div
        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${checked ? 'bg-sky-600 border-sky-600' : 'border-slate-700 bg-slate-950'
          }`}
      >
        {checked && <FaCheck className="text-[10px] text-white" />}
      </div>
      <span className="text-xs text-slate-400 group-hover:text-slate-200">{label}</span>
    </div>
  )
}

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [name, setName] = useState('mi-proyecto-pro')
  const [path, setPath] = useState('')
  const [framework, setFramework] = useState<'vite' | 'next' | 'cra'>('vite')
  const [version, setVersion] = useState('latest') // <--- NUEVO: Estado para la versión
  const [isInstalling, setIsInstalling] = useState(false)
  const [options, setOptions] = useState({ tailwind: true, router: true, install: true, git: false })
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Choike listo para operar.'])

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`])

  const selectFolder = async () => {
    try {
      const selectedPath = await (window as any).choikeAPI.openDirectory()
      if (selectedPath) setPath(selectedPath)
    } catch (err) {
      addLog('Error al abrir el selector de carpetas.')
    }
  }

  const handleLaunch = async () => {
    if (!path || !name) return alert("Selecciona una carpeta y nombre primero.")

    setIsInstalling(true)
    const vTag = version === 'latest' ? '@latest' : `@${version}` // Preparamos el tag (@latest, @5, etc)
    addLog(`Iniciando creación con ${framework.toUpperCase()} (${version})...`)

    try {
      // 1. Definir comando base usando la versión seleccionada
      let cmd = ""
      if (framework === 'vite') {
        cmd = `npm create vite${vTag} ${name} -- --template react-ts`
      } else if (framework === 'next') {
        cmd = `npx create-next-app${vTag} ${name} --ts --tailwind`
      } else {
        cmd = `npx create-react-app ${name} --template typescript`
      }

      addLog(`Ejecutando en: ${path}`)
      await (window as any).choikeAPI.runCommand({ command: cmd, cwd: path })

      const projectPath = `${path}/${name}`

      // 2. Instalación de dependencias si está marcado
      if (options.install) {
        addLog("Instalando dependencias base (esto puede tardar)...")
        await (window as any).choikeAPI.runCommand({ command: 'npm install', cwd: projectPath })
      }

      addLog(`[ÉXITO] Proyecto ${name} creado correctamente.`)
    } catch (err) {
      addLog(`[ERROR] ${err}`)
    } finally {
      setIsInstalling(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 p-8 font-sans overflow-hidden">
      {/* HEADER */}
      <header className="mb-6 flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-black text-sky-400 tracking-tighter">CHOIKE</h1>
          <p className="text-slate-500 text-[10px] tracking-[0.3em] font-bold">SOFTWARE FACTORY</p>
        </div>

        <div className="flex items-center gap-3">
          <img src="icon.ico" alt="" className="w-10 h-10 object-contain" />
          <span className="text-slate-800 font-black text-3xl select-none">V1.0</span>
        </div>
      </header>

      {/* CONTENIDO SCROLLABLE */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2">
        {/* SECCIÓN 1: SETUP */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-600 flex items-center gap-2 mb-3 tracking-widest uppercase">
            <FaCode /> Section 1: Project Setup
          </h2>
          <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Project Name</label>
              <input
                className="w-full bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-sm outline-none focus:border-sky-500 transition-all text-white"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-bold uppercase">Save To</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-950/50 border border-slate-800 p-3 rounded-xl text-[10px] text-slate-400"
                  value={path}
                  readOnly
                  placeholder="Selecciona carpeta de destino..."
                />
                <button
                  onClick={selectFolder}
                  className="bg-slate-800 hover:bg-slate-700 px-5 rounded-xl transition-colors text-slate-300"
                >
                  <FaFolderOpen />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: FRAMEWORKS Y VERSIÓN */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[10px] font-bold text-slate-600 flex items-center gap-2 tracking-widest uppercase">
              <FaReact /> Section 2: Framework & Version
            </h2>
            
            {/* SELECTOR DE VERSIÓN INTEGRADO */}
            <div className="flex flex-col gap-1 min-w-[120px]">
              <select 
                value={version} 
                onChange={(e) => setVersion(e.target.value)}
                className="bg-slate-900 border border-slate-800 p-2 rounded-xl text-[10px] text-sky-400 font-bold outline-none focus:border-sky-500 cursor-pointer"
              >
                {framework === 'vite' ? (
                  <>
                    <option value="latest">LATEST (V6)</option>
                    <option value="5">VERSION 5.x</option>
                    <option value="4">VERSION 4.x</option>
                  </>
                ) : framework === 'next' ? (
                  <>
                    <option value="latest">LATEST (V15)</option>
                    <option value="14">VERSION 14.x</option>
                    <option value="13">VERSION 13.x</option>
                  </>
                ) : (
                  <option value="latest">DEFAULT</option>
                )}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <FrameworkCard
              active={framework === 'vite'}
              onClick={() => { setFramework('vite'); setVersion('latest'); }}
              icon={<SiVite className="text-amber-400" />}
              title="VITE"
              desc="Fast, modern build tool."
            />
            <FrameworkCard
              active={framework === 'next'}
              onClick={() => { setFramework('next'); setVersion('latest'); }}
              icon={<SiNextdotjs className="text-white" />}
              title="NEXT.JS"
              desc="App Router (Default)"
            />
            <FrameworkCard
              active={framework === 'cra'}
              onClick={() => { setFramework('cra'); setVersion('latest'); }}
              icon={<FaReact className="text-sky-400" />}
              title="LEGACY (CRA)"
              desc="React (Classic)"
            />
          </div>
        </section>

        {/* SECCIÓN 3: OPTIONS */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-600 flex items-center gap-2 mb-3 tracking-widest uppercase">
            <FaTerminal /> Section 3: Extra Tools & Scripts
          </h2>
          <div className="grid grid-cols-2 gap-4 bg-[#1e293b]/50 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <CheckBox label="Include Tailwind CSS" checked={options.tailwind} onChange={() => setOptions({ ...options, tailwind: !options.tailwind })} />
            <CheckBox label="Include React Router" checked={options.router} onChange={() => setOptions({ ...options, router: !options.router })} />
            <CheckBox label="Run 'npm install' automatically" checked={options.install} onChange={() => setOptions({ ...options, install: !options.install })} />
            <CheckBox label="Initialize Git Repository" checked={options.git} onChange={() => setOptions({ ...options, git: !options.git })} />
          </div>
        </section>
      </div>

      {/* BOTTOM PANEL */}
      <div className="mt-8 flex-none space-y-4">
        <button
          onClick={handleLaunch}
          disabled={isInstalling}
          className={`w-full p-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-3 ${isInstalling
              ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-500 active:scale-95'
            }`}
        >
          {isInstalling ? 'CREATING PROJECT...' : 'CREATE & INSTALL PROJECT'} <FaRocket className={isInstalling ? 'animate-bounce' : ''} />
        </button>

        {/* TERMINAL LOG */}
        <div className="bg-black/90 border border-slate-800 rounded-xl p-4 h-28 font-mono text-[10px] overflow-y-auto shadow-inner">
          {logs.map((l, i) => (
            <p key={i} className={`mb-1 ${l.includes('ÉXITO') ? 'text-green-400' : l.includes('ERROR') ? 'text-red-400' : 'text-sky-500/80'}`}>
              {l}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}