
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
    id: 'ritual_ara',
    slug: 'ara',
    name: 'Ritual ARA',
    type: RitualType.ARA,
    description: 'Tu salvavidas en medio del caos para recuperar el control.',
    minLevel: UserLevel.NIVEL_3,
    requiresPremium: true,
    hasAudio: true,
    steps: [
      { 
        id: 'atrapa', 
        title: 'Paso A - ATRAPA', 
        description: 'Retén ese pensamiento automático crítico que te está bloqueando en este momento.', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/ara/atrapa.MP3',
        checkpoints: ['Identifiqué el pensamiento crítico', 'Lo observé sin juzgarme']
      },
      { 
        id: 'reta', 
        title: 'Paso R - RETA', 
        description: 'Cuestiona la veracidad de ese pensamiento. ¿Es 100% verdad? ¿Qué le dirías a tu mejor amigo si estuviera en tu situación?', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/ara/reta.MP3',
        checkpoints: ['Cuestioné la veracidad del pensamiento', 'Pensé en qué le diría a un amigo']
      },
      { 
        id: 'afirma', 
        title: 'Paso A - AFIRMA', 
        description: 'Crea una nueva afirmación o cláusula en tu contrato mental que reemplace el pensamiento anterior.', 
        durationSeconds: 60,
        audioPath: '/assets/audio/rituals/ara/afirma.MP3',
        checkpoints: ['Creé una nueva afirmación positiva', 'Me comprometí con la nueva cláusula']
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
