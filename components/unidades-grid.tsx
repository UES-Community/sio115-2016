import Link from 'next/link'
import {
  Network,
  Globe,
  Route,
  Shield,
  Lock,
  Radio,
  ChevronRight,
} from 'lucide-react'

const unidades = [
  {
    num: '01',
    label: 'Unidad 1',
    titulo: 'Fundamentos de Redes',
    descripcion:
      'Modelos OSI y TCP/IP, tipos de redes, medios de transmisión y arquitecturas básicas de comunicación.',
    icon: Network,
    color: 'text-primary',
    bg: 'bg-primary/10',
    href: '/unidad/1',
    tecnologia: 'ReactFlow · Topologías',
  },
  {
    num: '02',
    label: 'Unidad 2',
    titulo: 'Protocolos TCP/IP',
    descripcion:
      'Direccionamiento IPv4/IPv6, subredes CIDR, protocolos de transporte y la capa de aplicación.',
    icon: Globe,
    color: 'text-cyber',
    bg: 'bg-cyber/10',
    href: '/unidad/2',
    tecnologia: 'ReactFlow · Direccionamiento',
  },
  {
    num: '03',
    label: 'Unidad 3',
    titulo: 'Enrutamiento',
    descripcion:
      'Protocolos RIP, OSPF y BGP. Tablas de enrutamiento, métricas y algoritmos de camino más corto.',
    icon: Route,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    href: '/unidad/3',
    tecnologia: 'ReactFlow · Grafos',
  },
  {
    num: '04',
    label: 'Unidad 4',
    titulo: 'Seguridad Informática',
    descripcion:
      'Amenazas, vulnerabilidades, firewalls, IDS/IPS, VPN y políticas de seguridad en redes corporativas.',
    icon: Shield,
    color: 'text-alert',
    bg: 'bg-alert/10',
    href: '/unidad/4',
    tecnologia: 'Socket.IO · Ataques Demo',
  },
  {
    num: '05',
    label: 'Unidad 5',
    titulo: 'Criptografía',
    descripcion:
      'Cifrado simétrico AES/DES y asimétrico RSA. Hashing, firmas digitales y gestión de certificados.',
    icon: Lock,
    color: 'text-violet-400',
    bg: 'bg-violet-400/10',
    href: '/unidad/5',
    tecnologia: 'CryptoJS · Simulador',
  },
  {
    num: '06',
    label: 'Unidad 6',
    titulo: 'Comunicaciones',
    descripcion:
      'Comunicación bidireccional en tiempo real, WebSockets, protocolos de mensajería y arquitecturas pub/sub.',
    icon: Radio,
    color: 'text-teal-400',
    bg: 'bg-teal-400/10',
    href: '/unidad/6',
    tecnologia: 'Socket.IO · Tiempo Real',
  },
]

export function UnidadesGrid() {
  return (
    <section className="px-4 py-12 md:py-16" aria-labelledby="unidades-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-1 font-mono text-xs text-muted-foreground uppercase tracking-widest">
              Contenido del Curso
            </p>
            <h2
              id="unidades-heading"
              className="text-2xl font-bold text-foreground md:text-3xl"
            >
              Unidades Temáticas
            </h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {unidades.length} unidades
          </span>
        </div>

        {/* Glowing top-border accent */}
        <div className="mb-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-glow-line" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unidades.map((u) => {
            const Icon = u.icon
            return (
              <Link
                key={u.href}
                href={u.href}
                className="group relative flex flex-col rounded-xl border border-border/50 bg-surface-2 p-5 transition-all hover:border-primary/40 hover:bg-surface-2/80 hover:shadow-[0_0_24px_oklch(0.72_0.18_196_/_10%)]"
              >
                {/* Unit number watermark */}
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-3 font-mono text-4xl font-black leading-none text-foreground/5 select-none"
                >
                  {u.num}
                </span>

                <div className="mb-4 flex items-start gap-3">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${u.bg}`}>
                    <Icon className={`size-4 ${u.color}`} aria-hidden="true" />
                  </div>
                  <div>
                    <p className={`font-mono text-[10px] font-semibold uppercase tracking-widest ${u.color}`}>
                      {u.label}
                    </p>
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {u.titulo}
                    </h3>
                  </div>
                </div>

                <p className="mb-4 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {u.descripcion}
                </p>

                <div className="flex items-center justify-between">
                  <span className="rounded border border-border/40 bg-surface px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {u.tecnologia}
                  </span>
                  <ChevronRight
                    className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
