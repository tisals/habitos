import React from 'react';

interface WeekDotsProps {
  completions: boolean[];
}

const WeekDots: React.FC<WeekDotsProps> = ({ completions }) => {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <h3 className="text-xs font-bold text-slate-600 uppercase mb-3">Últimos 7 días</h3>
      <div className="flex justify-between gap-2">
        {completions.map((completed, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                completed
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 text-slate-300'
              }`}
            >
              {completed ? '✓' : '·'}
            </div>
            <span className="text-[10px] text-slate-400">{days[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekDots;
