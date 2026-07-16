import { Network, Lock, Radio } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">
      {/* Decorative glow orb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 size-[480px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, oklch(0.72 0.18 196 / 12%) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Course badge */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
          <span className="size-1.5 rounded-full bg-primary animate-pulse-cyber" aria-hidden="true" />
          <span className="font-mono text-xs font-medium text-primary tracking-widest uppercase">
            SIO115-2016 · 2026
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-4 font-mono text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Sistemas{' '}
          <span className="text-primary">Operativos</span>
        </h1>

        <p className="mx-auto mb-3 max-w-xl text-lg font-semibold text-foreground/80">
          Redes, Comunicaciones y Seguridad Informática
        </p>

        <p className="mx-auto mb-10 max-w-2xl leading-relaxed text-muted-foreground">
          Plataforma interactiva para el estudio de protocolos de red, criptografía aplicada,
          topologías de comunicación y seguridad en sistemas distribuidos.
          Cada unidad incluye simulaciones y visualizaciones en tiempo real.
        </p>

        {/* Stat pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { icon: Network,  label: '6 Unidades',          sub: 'contenido estructurado' },
            { icon: Lock,     label: 'Criptografía',         sub: 'AES · DES · RSA' },
            { icon: Radio,    label: 'Tiempo Real',          sub: 'Socket.IO demos' },
          ].map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-border/60 bg-surface-2 px-4 py-3"
            >
              <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{label}</p>
                <p className="font-mono text-[10px] text-muted-foreground">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
