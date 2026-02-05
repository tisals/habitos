import React from 'react';

interface StreakWidgetProps {
  streak: number;
}

const StreakWidget: React.FC<StreakWidgetProps> = ({ streak }) => {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-2 flex flex-col items-center">
      <span className="text-2xl">🔥</span>
      <span className="text-lg font-bold text-indigo-700 leading-none">{streak}</span>
      <span className="text-[10px] uppercase font-bold text-indigo-400">Racha</span>
    </div>
  );
};

export default StreakWidget;
