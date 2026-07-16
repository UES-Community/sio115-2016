import { HeroSection } from '@/components/hero-section'
import { UnidadesGrid } from '@/components/unidades-grid'
import { LibreríasSection } from '@/components/librerias-section'

export default function HomePage() {
  return (
    <main className="relative z-10 min-h-screen">
      <HeroSection />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-px bg-border/60" />
      </div>

      <UnidadesGrid />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-px bg-border/60" />
      </div>

      <LibreríasSection />

      {/* Footer strip */}
      <footer className="border-t border-border/60 bg-surface/50 px-4 py-6 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          SIO115-2016 · Sistemas Operativos · Redes, Comunicaciones y Seguridad Informática · 2026
        </p>
      </footer>
    </main>
  )
}
