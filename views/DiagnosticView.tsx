
import React, { useState } from 'react';
import { DIAGNOSTIC_QUESTIONS } from '../constants';
import { UserLevel } from '../types';

interface DiagnosticViewProps {
  onComplete: (level: UserLevel) => void;
}

const DiagnosticView: React.FC<DiagnosticViewProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    setScore(newScore);
    
    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Logic for levels: 
      // Max score: 12. 
      // < 6: Level 1 (Burned out)
      // 6-9: Level 2 (Intermediate)
      // 10-12: Level 3 (Ready for pro)
      let level = UserLevel.NIVEL_1;
      if (newScore >= 10) level = UserLevel.NIVEL_3;
      else if (newScore >= 6) level = UserLevel.NIVEL_2;
      
      onComplete(level);
    }
  };

  const progress = ((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

  return (
    <div className="p-8 flex flex-col h-full bg-indigo-900 text-white justify-center items-center text-center space-y-12">
      <div className="space-y-4">
        <h2 className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Paso {currentIdx + 1} de {DIAGNOSTIC_QUESTIONS.length}</h2>
        <h1 className="text-2xl font-bold leading-tight">{DIAGNOSTIC_QUESTIONS[currentIdx].text}</h1>
      </div>

      <div className="w-full space-y-3">
        {DIAGNOSTIC_QUESTIONS[currentIdx].options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt.score)}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 p-5 rounded-2xl text-left font-medium transition-all active:scale-95 flex justify-between items-center group"
          >
            <span>{opt.text}</span>
            <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        ))}
      </div>

      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default DiagnosticView;
