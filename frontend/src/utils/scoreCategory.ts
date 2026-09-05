import { ScoreCategory, ScoreLevel } from '@/types';

export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    level: 'critico',
    label: 'Riesgo Crítico',
    description: 'Alto riesgo de incumplimiento. Acceso a crédito muy limitado.',
    color: '#EF4444',
    bgColor: 'rgba(239,68,68,0.15)',
    min: 0,
    max: 20,
  },
  {
    level: 'alto',
    label: 'Riesgo Alto',
    description: 'Historial con irregularidades. Se recomienda revisión profunda.',
    color: '#F97316',
    bgColor: 'rgba(249,115,22,0.15)',
    min: 21,
    max: 40,
  },
  {
    level: 'moderado',
    label: 'Riesgo Moderado',
    description: 'Perfil con algunos indicadores de riesgo. Evaluación recomendada.',
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.15)',
    min: 41,
    max: 60,
  },
  {
    level: 'bueno',
    label: 'Riesgo Bajo',
    description: 'Buen historial financiero. Apto para la mayoría de productos.',
    color: '#22C55E',
    bgColor: 'rgba(34,197,94,0.15)',
    min: 61,
    max: 80,
  },
  {
    level: 'excelente',
    label: 'Excelente',
    description: 'Perfil financiero óptimo. Máxima confiabilidad crediticia.',
    color: '#06B6D4',
    bgColor: 'rgba(6,182,212,0.15)',
    min: 81,
    max: 100,
  },
];

export function getScoreCategory(score: number): ScoreCategory {
  return (
    SCORE_CATEGORIES.find((c) => score >= c.min && score <= c.max) ||
    SCORE_CATEGORIES[0]
  );
}

export function getScoreGradient(score: number): string {
  const cat = getScoreCategory(score);
  return cat.color;
}
