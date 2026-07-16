'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

const unidades = [
  { label: 'Unidad 1', titulo: 'Fundamentos de Redes', href: '/unidad/1' },
  { label: 'Unidad 2', titulo: 'Protocolos TCP/IP', href: '/unidad/2' },
  { label: 'Unidad 3', titulo: 'Enrutamiento', href: '/unidad/3' },
  { label: 'Unidad 4', titulo: 'Seguridad Informática', href: '/unidad/4' },
  { label: 'Unidad 5', titulo: 'Criptografía', href: '/unidad/5' },
  { label: 'Unidad 6', titulo: 'Comunicaciones', href: '/unidad/6' },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo / Course ID */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-wide text-primary hover:opacity-80 transition-opacity"
        >
          <Shield className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="font-mono text-xs text-muted-foreground">SIO115-2016</span>
          <span className="hidden text-foreground sm:inline">Sistemas Operativos</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Unidades de la materia" className="hidden items-center gap-1 md:flex">
          {unidades.map((u) => {
            const active = pathname?.startsWith(u.href)
            return (
              <Link
                key={u.href}
                href={u.href}
                title={u.titulo}
                className={cn(
                  'rounded px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                )}
              >
                {u.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="flex size-8 items-center justify-center rounded text-muted-foreground hover:text-foreground md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav
          aria-label="Unidades — menú móvil"
          className="border-t border-border/60 bg-surface px-4 py-3 md:hidden"
        >
          <ul className="grid grid-cols-2 gap-2">
            {unidades.map((u) => {
              const active = pathname?.startsWith(u.href)
              return (
                <li key={u.href}>
                  <Link
                    href={u.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded border px-3 py-2 font-mono text-xs transition-colors',
                      active
                        ? 'border-primary/40 bg-primary/10 text-primary'
                        : 'border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                    )}
                  >
                    <span className="font-semibold">{u.label}</span>
                    <span className="mt-0.5 block truncate text-[10px] opacity-70">{u.titulo}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
