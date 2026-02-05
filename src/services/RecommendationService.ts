import { DailyState, Ritual, RitualType, TimeOfDay } from '../types';

export class RecommendationService {
  static getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
  }

  static getRecommendation(
    dailyState: DailyState | null,
    rituals: Ritual[],
    completedToday: string[]
  ): { ritual: Ritual; message: string } {
    const timeOfDay = this.getTimeOfDay();
    
    if (!dailyState) {
      const cafeRitual = rituals.find(r => r.type === RitualType.CAFE);
      if (cafeRitual) {
        return {
          ritual: cafeRitual,
          message: "Tu día está intacto. Empecemos por ganar tu mañana con C.A.F.É."
        };
      }
    }

    if (dailyState) {
      if (dailyState.ruidoMental >= 4) {
        const pitRitual = rituals.find(r => r.type === RitualType.PIT);
        if (pitRitual && !completedToday.includes(pitRitual.id)) {
          return {
            ritual: pitRitual,
            message: "Hoy el ruido está alto. No necesitas exigirte. Haz P.I.T. en 2 minutos."
          };
        }
      }

      if (timeOfDay === 'morning' && dailyState.enfoque <= 3) {
        const cafeRitual = rituals.find(r => r.type === RitualType.CAFE);
        if (cafeRitual && !completedToday.includes(cafeRitual.id)) {
          return {
            ritual: cafeRitual,
            message: "Tu enfoque está bajito. Un C.A.F.É. corto y arrancas."
          };
        }
      }

      if (timeOfDay === 'night' || dailyState.energia <= 2) {
        const lifeRitual = rituals.find(r => r.type === RitualType.LIFE);
        if (lifeRitual && !completedToday.includes(lifeRitual.id)) {
          return {
            ritual: lifeRitual,
            message: "Cierra el día suave. L.I.F.E. y a dormir con la mente limpia."
          };
        }
      }
    }

    const pendingRituals = rituals.filter(r => !completedToday.includes(r.id));
    if (pendingRituals.length > 0) {
      return {
        ritual: pendingRituals[0],
        message: "Todo está ok. Mantén el balance con tu ritual pendiente."
      };
    }

    return {
      ritual: rituals[0],
      message: "¡Día Ganado! Has cumplido tus rituales hoy. Tu potencial está activado."
    };
  }
}
