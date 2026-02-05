import React from 'react';
import { Ritual, RitualType } from '../../types';

interface RecommendationCardProps {
  ritual: Ritual;
  message: string;
  onStart: () => void;
}

const ritualIcons = {
  [RitualType.CAFE]: '☕',
  [RitualType.PIT]: '⚡',
  [RitualType.LIFE]: '✨'
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ ritual, message, onStart }) => {
  const totalMinutes = Math.ceil(ritual.steps.reduce((sum, step) => sum + step.durationSeconds, 0) / 60);

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{ritualIcons[ritual.type]}</span>
        <div>
          <h3 className="text-sm font-bold text-indigo-100 uppercase">Tu mejor jugada ahora</h3>
          <h2 className="text-xl font-bold">{ritual.name}</h2>
        </div>
      </div>
      
      <p className="text-indigo-100 text-sm mb-4">{message}</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-indigo-200">⏱️ {totalMinutes} min</span>
      </div>
      
      <button
        onClick={onStart}
        className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
      >
        Empezar Ahora
      </button>
    </div>
  );
};

export default RecommendationCard;
