
import React from 'react';
import { User, UserStats, Ritual, UserLevel, RitualType } from '../types';

interface DashboardViewProps {
  user: User;
  stats: UserStats;
  rituals: Ritual[];
  onSelectRitual: (ritual: Ritual) => void;
  onGoToPlans: () => void;
  onGoToAdmin: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ user, stats, rituals, onSelectRitual, onGoToPlans, onGoToAdmin }) => {
  const isCafeDone = stats.completionsToday.includes('ritual_cafe');
  const isLifeDone = stats.completionsToday.includes('ritual_life');
  const isDayWon = isCafeDone && isLifeDone;

  const getSmartMessage = () => {
    if (!isCafeDone) return "Tu día está intacto. Empecemos por ganar tu mañana con C.A.F.É.";
    if (isCafeDone && !isLifeDone) return "Ya ganaste la mañana, ahora no dejes el día abierto. Reserva 5 min para el cierre.";
    return "¡Día Ganado! Has cumplido tus rituales hoy. Tu potencial está activado.";
  };

  const getRitualStatus = (ritual: Ritual) => {
    if (user.level < ritual.minLevel) return 'locked-level';
    if (ritual.requiresPremium && !user.isPremium) return 'locked-premium';
    if (stats.completionsToday.includes(ritual.id)) return 'done';
    return 'ready';
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Streak */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hola, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm">Nivel {user.level} {user.isPremium && '• Premium'}</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2 flex flex-col items-center">
          <span className="text-2xl">🔥</span>
          <span className="text-lg font-bold text-indigo-700 leading-none">{stats.streak}</span>
          <span className="text-[10px] uppercase font-bold text-indigo-400">Racha</span>
        </div>
      </header>

      {/* Smart Message */}
      <div className={`p-4 rounded-2xl border ${isDayWon ? 'bg-green-50 border-green-100' : 'bg-indigo-600 text-white border-transparent'}`}>
        <p className={`text-sm font-medium ${isDayWon ? 'text-green-800' : 'text-indigo-50'}`}>
          {getSmartMessage()}
        </p>
      </div>

      {/* Rituals Grid */}
      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-lg font-bold text-slate-800 mt-2">Tus Rituales</h2>
        
        {rituals.map(ritual => {
          const status = getRitualStatus(ritual);
          const isLocked = status === 'locked-level' || status === 'locked-premium';
          const isDone = status === 'done';

          return (
            <button
              key={ritual.id}
              disabled={isLocked}
              onClick={() => onSelectRitual(ritual)}
              className={`
                relative w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-95
                ${isDone ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}
                ${isLocked ? 'opacity-60 grayscale' : 'hover:border-indigo-400 shadow-sm'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-3xl">
                  {ritual.type === RitualType.CAFE ? '☕' : ritual.type === RitualType.ARA ? '⚡' : '✨'}
                </span>
                {isDone ? (
                  <span className="bg-green-500 text-white p-1 rounded-full">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  </span>
                ) : isLocked && (
                  <span className="text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  </span>
                )}
              </div>
              
              <h3 className={`font-bold ${isDone ? 'text-green-800' : 'text-slate-800'}`}>{ritual.name}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ritual.description}</p>
              
              {status === 'locked-level' && (
                <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase">Disponible en Nivel {ritual.minLevel}</div>
              )}
              {status === 'locked-premium' && (
                <div className="mt-2 text-[10px] font-bold text-indigo-500 uppercase">Solo en Premium</div>
              )}
            </button>
          );
        })}
      </div>

      {!user.isPremium && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg">
          <h3 className="text-lg font-bold mb-1">Desbloquea el Nivel 3</h3>
          <p className="text-indigo-100 text-xs mb-4">Accede a audios guiados, Ritual ARA y seguimiento avanzado.</p>
          <button 
            onClick={onGoToPlans}
            className="bg-white text-indigo-600 px-6 py-2 rounded-xl text-sm font-bold w-full shadow-md active:bg-indigo-50"
          >
            Ver Planes
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
