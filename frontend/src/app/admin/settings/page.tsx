import { PageHeader } from '@/components/PageHeader/PageHeader';
import { SettingsCard } from '@/components/SettingsCard/SettingsCard';

const cards = [
  {
    title: 'Notificaciones',
    description: 'Alertas en vivo, urgencias y resúmenes diarios.',
    buttonLabel: 'Configurar',
  },
  {
    title: 'Equipo y permisos',
    description: 'Roles, accesos y solicitudes pendientes.',
    buttonLabel: 'Gestionar equipo',
  },
  {
    title: 'Zonas de operación',
    description: 'Rutas, bancos aliados y cobertura logística.',
    buttonLabel: 'Editar zonas',
  },
];

const AdminSettingsPage = () => (
  <div className="flex flex-col gap-6">
    <PageHeader
      eyebrow="PREFERENCIAS DEL PORTAL"
      title="Configuración"
      subtitle="Administra notificaciones, permisos y operación."
    />
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <SettingsCard key={card.title} {...card} />
      ))}
    </div>
  </div>
);

export default AdminSettingsPage;