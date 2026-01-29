
import { Ritual, RitualType, UserLevel, User } from './types';

export const INITIAL_USER: User = {
  id: 'user_001',
  name: 'Demo Leader',
  email: 'leader@example.com',
  level: UserLevel.NIVEL_1, // Default starting level
  isPremium: false,
  role: 'user'
};

export const MOCK_RITUALS: Ritual[] = [
  {
    id: 'ritual_cafe',
    slug: 'cafe',
    name: 'Ritual C.A.F.É.',
    type: RitualType.CAFE,
    description: 'Gana tu mañana con Claridad, Afirmación, Foco y Energía.',
    minLevel: UserLevel.NIVEL_1,
    requiresPremium: false,
    hasAudio: true,
    steps: [
      { id: 'c1', title: 'C - Claridad', description: 'Define tus 3 prioridades del día.', durationSeconds: 60 },
      { id: 'a1', title: 'A - Afirmación', description: 'Declara tu propósito y valores.', durationSeconds: 30 },
      { id: 'f1', title: 'F - Foco', description: 'Visualiza la ejecución perfecta.', durationSeconds: 60 },
      { id: 'e1', title: 'É - Energía', description: 'Activación física rápida (estiramiento o respiración).', durationSeconds: 90 },
    ]
  },
  {
    id: 'ritual_ara',
    slug: 'ara',
    name: 'Ritual ARA',
    type: RitualType.ARA,
    description: 'Tu salvavidas en medio del caos para recuperar el control.',
    minLevel: UserLevel.NIVEL_3,
    requiresPremium: true,
    hasAudio: true,
    steps: [
      { id: 'ara_a1', title: 'A - Aliento', description: 'Respiración consciente 4-7-8.', durationSeconds: 60 },
      { id: 'ara_r1', title: 'R - Reenfoca', description: '¿Qué es lo único que importa ahora?', durationSeconds: 30 },
      { id: 'ara_a2', title: 'A - Actúa', description: 'Compromiso total con la siguiente tarea.', durationSeconds: 30 },
    ]
  },
  {
    id: 'ritual_cierre',
    slug: 'cierre',
    name: 'Ritual de Cierre',
    type: RitualType.CIERRE,
    description: 'Baja la mente y cierra el día con paz.',
    minLevel: UserLevel.NIVEL_2,
    requiresPremium: false,
    hasAudio: true, // Audio only unlocked in premium level 3
    steps: [
      { id: 'cierre_1', title: 'Logros', description: 'Escribe 3 victorias de hoy.', durationSeconds: 60 },
      { id: 'cierre_2', title: 'Mañana', description: 'Prepara el primer paso de mañana.', durationSeconds: 60 },
      { id: 'cierre_3', title: 'Cierre', description: 'Desconexión digital y agradecimiento.', durationSeconds: 30 },
    ]
  }
];

export const DIAGNOSTIC_QUESTIONS = [
  { id: 1, text: '¿Sientes que el estrés controla tu día a menudo?', options: [{ text: 'Nunca', score: 3 }, { text: 'A veces', score: 2 }, { text: 'Siempre', score: 1 }] },
  { id: 2, text: '¿Cómo calificarías tu nivel de foco matutino?', options: [{ text: 'Excelente', score: 3 }, { text: 'Regular', score: 2 }, { text: 'Bajo', score: 1 }] },
  { id: 3, text: '¿Tienes una rutina para terminar el día?', options: [{ text: 'Sí, estructurada', score: 3 }, { text: 'Algo improvisado', score: 2 }, { text: 'No tengo nada', score: 1 }] },
  { id: 4, text: '¿Cuántas veces sientes "burnout" a la semana?', options: [{ text: 'Ninguna', score: 3 }, { text: '1-2 veces', score: 2 }, { text: 'Casi a diario', score: 1 }] },
];
