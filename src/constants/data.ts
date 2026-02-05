import { Ritual, RitualType, UserLevel, User } from '../types';

export const INITIAL_USER: User = {
  id: 'user_001',
  name: 'Demo Leader',
  email: 'leader@example.com',
  level: UserLevel.NIVEL_1,
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
      { 
        id: 'cuerpo', 
        title: 'Paso C - CUERPO', 
        description: 'Mientras se prepara tu café o té, bebe un vaso grande de agua y haz 3 estiramientos profundos: intenta tocar el cielo y luego tus pies. Siente cómo tu cuerpo despierta.', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/cafe/cuerpo.MP3',
        checkpoints: ['Bebí un vaso de agua', 'Hice 3 estiramientos (cielo y pies)']
      },
      { 
        id: 'alma', 
        title: 'Paso A - ALMA', 
        description: 'Siéntate en silencio y realiza 5 respiraciones profundas con la técnica 4-7-8 (inhala 4 seg, sostén 7 seg, exhala 8 seg). Siente cómo baja la tensión y tu mente se aclara.', 
        durationSeconds: 120,
        audioPath: '/assets/audio/rituals/cafe/alma.MP3',
        checkpoints: ['Hice mis 5 respiraciones 4-7-8']
      },
      { 
        id: 'foco', 
        title: 'Paso F - FOCO', 
        description: 'Abre tu cuaderno físico. Escribe tu Objetivo de Enfoque Único (OEU) para hoy: una sola tarea que, si la completas, hará que el día valga la pena. Luego léelo en voz alta y visualiza por un instante cómo se siente haberlo logrado.', 
        durationSeconds: 120,
        audioPath: '/assets/audio/rituals/cafe/foco.MP3',
        checkpoints: ['Escribí mi OEU en el cuaderno', 'Leí mi OEU en voz alta', 'Visualicé cómo se siente lograrlo']
      }
    ]
  },
  {
    id: 'ritual_pit',
    slug: 'pit',
    name: 'Ritual P.I.T.',
    type: RitualType.PIT,
    description: 'Tu herramienta de rescate para romper patrones negativos y retomar el control.',
    minLevel: UserLevel.NIVEL_3,
    requiresPremium: true,
    hasAudio: true,
    steps: [
      {
        id: 'pausa',
        title: 'Paso P - PAUSA',
        description: 'Corta el patrón de lo que estás haciendo. Detén los pensamientos negativos que estás persiguiendo. Respira profundo.',
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/pit/pausa.MP3',
        checkpoints: ['Detuve lo que estaba haciendo', 'Identifiqué el patrón negativo']
      },
      {
        id: 'intencion',
        title: 'Paso I - INTENCIÓN',
        description: 'Define tu nueva intención como si se lo estuvieras contando a un amigo. Sé específico y positivo.',
        durationSeconds: 90,
        audioPath: '/assets/audio/rituals/pit/intencion.MP3',
        checkpoints: ['Definí mi nueva intención', 'La expresé en voz alta o por escrito']
      },
      {
        id: 'traccion',
        title: 'Paso T - TRACCIÓN',
        description: 'Identifica el primer paso pequeño para arrancar sin fricción. Algo tan simple que no puedas decir que no.',
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/pit/traccion.MP3',
        checkpoints: ['Identifiqué mi primer paso', 'Estoy listo para ejecutarlo']
      }
    ]
  },
  {
    id: 'ritual_life',
    slug: 'life',
    name: 'Ritual Life',
    type: RitualType.LIFE,
    description: 'Cierra el día con intención, gratitud y enfoque para mañana.',
    minLevel: UserLevel.NIVEL_2,
    requiresPremium: false,
    hasAudio: true,
    steps: [
      { 
        id: 'liberacion', 
        title: 'Paso L - LIBERACIÓN', 
        description: 'Suelta la tensión física del día. Realiza un estiramiento suave o una respiración consciente profunda.', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/life/liberacion.MP3',
        checkpoints: ['Solté la tensión física', 'Hice un estiramiento o respiración']
      },
      { 
        id: 'introspeccion', 
        title: 'Paso I - INTROSPECCIÓN', 
        description: 'Revisa qué pasó hoy, qué lograste y qué aprendiste. Reconoce tus victorias, por pequeñas que sean.', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/life/introspeccion.MP3',
        checkpoints: ['Revisé mis logros del día', 'Identifiqué un aprendizaje clave']
      },
      { 
        id: 'foco', 
        title: 'Paso F - FOCO', 
        description: 'Define la prioridad número uno para mañana. Qué es lo más importante que debes lograr.', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/life/foco.MP3',
        checkpoints: ['Definí mi prioridad para mañana']
      },
      { 
        id: 'entrega', 
        title: 'Paso E - ENTREGA', 
        description: 'Cierra oficialmente el día. Da por terminado tu trabajo y entrégate al descanso reparador.', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/life/entrega.MP3',
        checkpoints: ['Cerré oficialmente el día', 'Me permito descansar']
      }
    ]
  }
];

export const DIAGNOSTIC_QUESTIONS = [
  { id: 1, text: '¿Sientes que el estrés controla tu día a menudo?', options: [{ text: 'Nunca', score: 3 }, { text: 'A veces', score: 2 }, { text: 'Siempre', score: 1 }] },
  { id: 2, text: '¿Cómo calificarías tu nivel de foco matutino?', options: [{ text: 'Excelente', score: 3 }, { text: 'Regular', score: 2 }, { text: 'Bajo', score: 1 }] },
  { id: 3, text: '¿Tienes una rutina para terminar el día?', options: [{ text: 'Sí, estructurada', score: 3 }, { text: 'Algo improvisado', score: 2 }, { text: 'No tengo nada', score: 1 }] },
  { id: 4, text: '¿Cuántas veces sientes "burnout" a la semana?', options: [{ text: 'Ninguna', score: 3 }, { text: '1-2 veces', score: 2 }, { text: 'Casi a diario', score: 1 }] },
];
