export const formatKg = (kg: number): string =>
  kg.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export const formatExpiry = (days: number): string => {
  if (days < 0) return 'Vencido';
  if (days === 0) return 'Vence hoy';
  if (days === 1) return 'Vence mañana';
  return `${days} días`;
};

export const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();