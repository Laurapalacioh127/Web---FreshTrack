import Link from 'next/link';
import { Logo } from '@/components/logo/Logo';
import { Photo } from '@/components/Photo/Photo';
import { FloatingChip } from '@/components/FloatingChip/FloatingChip';
import { StepCard } from '@/components/StepCard/StepCard';
import { RoleCard } from '@/components/RoleCard/RoleCard';
import { ImpactBand } from '@/components/ImpactBand/ImpactBand';

const steps = [
  {
    emoji: '📦',
    label: 'SABER',
    title: 'Sabe qué tienes en casa',
    description: 'Escanea o registra tus alimentos y mira todo tu inventario en un solo lugar.',
    tone: 'blue' as const,
  },
  {
    emoji: '🛒',
    label: 'PLANEAR',
    title: 'Compra mucho mejor',
    description: 'Genera tu lista de mercado inteligente con lo que realmente te falta.',
    tone: 'yellow' as const,
  },
  {
    emoji: '🔔',
    label: 'ACTUAR',
    title: 'Recibe avisos a tiempo',
    description: 'Te avisamos qué vence pronto para que lo cocines o lo dones antes de perderlo.',
    tone: 'rose' as const,
  },
];

const stats = [
  { value: '12.480', label: 'kg de comida salvada' },
  { value: '1.246', label: 'donaciones entregadas' },
  { value: '3.820', label: 'familias ayudadas' },
];

const HomePage = () => (
  <>
    <header className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
      <Logo />
      <span className="rounded-full bg-white px-4 py-2 text-xs font-bold shadow-soft">
        Saber · Planear · Actuar
      </span>
    </header>

    <section className="mx-auto grid max-w-6xl items-center gap-12 overflow-x-clip px-8 pb-20 pt-6 md:grid-cols-2">
      <div>
        <span className="rounded-full bg-brand-soft px-4 py-1.5 text-xs font-bold text-brand-dark">
          🌱 Comida bien aprovechada
        </span>
        <h1 className="mt-6 text-6xl leading-[0.95] md:text-8xl">
          Bienvenido a{' '}
          <span className="relative isolate inline-block text-brand">
            FreshTrack
            <span className="absolute -bottom-1 left-0 -z-10 h-5 w-full rounded-full bg-sun" />
          </span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-neutral-700">
          Convierte el manejo de tu comida en una rutina simple, proactiva y hasta divertida.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="#roles"
            className="rounded-full bg-brand px-7 py-4 text-sm font-bold text-white shadow-glow-brand transition hover:-translate-y-0.5"
          >
            Empezar ahora →
          </Link>
          <span className="text-sm font-semibold text-neutral-600">Saber → Planear → Actuar</span>
        </div>
      </div>

      <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
        <div className="absolute inset-0 -rotate-6 rounded-[3rem] bg-rose" />
        <div className="absolute inset-0 rotate-3 rounded-[3rem] bg-sun" />
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[3rem] bg-brand-soft text-9xl shadow-pop">
          🥬
          <Photo src="/photos/hero.jpg" sizes="(min-width: 768px) 450px, 100vw" priority />
        </div>
        <FloatingChip tone="blue" title="SABER" subtitle="Sabe qué tienes en casa" className="-left-6 top-10 -rotate-6" />
        <FloatingChip tone="yellow" title="PLANEAR" subtitle="Compra mucho mejor" className="-right-4 top-1/2 rotate-3" />
        <FloatingChip tone="rose" title="ACTUAR" subtitle="Recibe avisos a tiempo" className="-bottom-4 left-8 -rotate-2" />
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-8 pb-20">
      <h2 className="mb-8 text-center text-4xl md:text-5xl">Tres pasos, cero desperdicio</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <StepCard key={step.label} {...step} />
        ))}
      </div>
    </section>

    <section id="roles" className="bg-white px-8 py-20 text-center">
      <p className="text-xs font-black tracking-widest text-brand">ELIGE TU EXPERIENCIA</p>
      <h2 className="mt-2 text-4xl md:text-5xl">¿Cómo quieres usar FreshTrack?</h2>
      <p className="mt-2 text-sm text-neutral-600">Un mismo propósito, dos herramientas conectadas.</p>
      <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-2">
        <RoleCard
          portal="user"
          tag="Para tu hogar"
          title="Quiero trackear mi comida"
          description="Controla tu inventario, evita el desperdicio y dona lo que no vas a consumir."
          href="/login/user"
          buttonLabel="Continuar como usuario"
          photo="/photos/home.jpg"
        />
        <RoleCard
          portal="admin"
          tag="Para organizaciones"
          title="Quiero ser parte del equipo"
          description="Modera contenido, gestiona el catálogo y coordina donaciones."
          href="/login/admin"
          buttonLabel="Continuar como equipo"
          photo="/photos/team.jpg"
        />
      </div>
    </section>

    <ImpactBand stats={stats} />

    <footer className="px-8 py-8 text-center text-xs text-neutral-500">
      © 2026 FreshTrack · Universidad Icesi
    </footer>
  </>
);

export default HomePage;