import { Code2, GitBranch, Zap } from 'lucide-react'

const libs = [
  {
    name: 'crypto-js',
    version: '4.2.0',
    icon: Code2,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    descripcion:
      'Algoritmos de cifrado simétrico (AES, DES, Triple-DES) y asimétrico (RSA). Hashing MD5, SHA-256. Simulaciones interactivas de cifrado y descifrado de mensajes.',
    uso: 'Unidad 5 — Criptografía',
  },
  {
    name: 'reactflow',
    version: '11.11.4',
    icon: GitBranch,
    color: 'text-cyber',
    bg: 'bg-cyber/10',
    descripcion:
      'Visualización y diseño de grafos interactivos para representar topologías de red, direccionamiento IP, enrutamiento y relaciones entre nodos en redes LAN/WAN.',
    uso: 'Unidades 1, 2, 3',
  },
  {
    name: 'socket.io-client',
    version: '4.8.3',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    descripcion:
      'Comunicación bidireccional en tiempo real entre cliente y servidor. Demostraciones de eventos, salas, namespaces y patrones de mensajería para sistemas distribuidos.',
    uso: 'Unidades 4, 6',
  },
]

export function LibreríasSection() {
  return (
    <section
      className="px-4 py-12 md:py-16"
      aria-labelledby="librerias-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-1 font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Stack Tecnológico
          </p>
          <h2
            id="librerias-heading"
            className="text-2xl font-bold text-foreground md:text-3xl"
          >
            Librerías Especializadas
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {libs.map((lib) => {
            const Icon = lib.icon
            return (
              <div
                key={lib.name}
                className="rounded-xl border border-border/50 bg-surface-2 p-5"
              >
                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${lib.bg}`}
                  >
                    <Icon className={`size-5 ${lib.color}`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-foreground">
                      {lib.name}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      v{lib.version}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
                  {lib.descripcion}
                </p>

                {/* Usage tag */}
                <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${lib.bg}`}
                  style={{ borderColor: 'transparent' }}
                >
                  <span className={`size-1 rounded-full ${lib.color.replace('text-', 'bg-')}`} aria-hidden="true" />
                  <span className={`font-mono text-[10px] font-medium ${lib.color}`}>
                    {lib.uso}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
