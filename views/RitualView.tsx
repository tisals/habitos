import React, { useState, useEffect } from 'react';
import { Ritual, RitualStep } from '../types';

interface RitualViewProps {
  ritual: Ritual;
  isPremium: boolean;
  onComplete: () => void;
  onBack: () => void;
}

const RitualView: React.FC<RitualViewProps> = ({ ritual, isPremium, onComplete, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ritual.steps[0].durationSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useAudio, setUseAudio] = useState(false);

  const currentStep = ritual.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / ritual.steps.length) * 100;
  const canAdvance = timeLeft <= ritual.steps[currentStepIndex].durationSeconds * 0.5;

  // Use 'any' type for timer to avoid NodeJS namespace errors in browser environments
  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleNext = () => {
    if (currentStepIndex < ritual.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeLeft(ritual.steps[nextIndex].durationSeconds);
      setIsPlaying(false);
    } else {
      onComplete();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const audioBlocked = ritual.hasAudio && !isPremium && ritual.slug !== 'cafe';

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white relative">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-800">
        <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      <header className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="text-slate-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{ritual.name}</span>
        <div className="w-6"></div>
      </header>

      <div className="flex-1 px-8 flex flex-col items-center justify-center text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">{currentStep.title}</h2>
          <p className="text-slate-400 text-lg">{currentStep.description}</p>
        </div>

        {/* Audio Toggle */}
        {ritual.hasAudio && (
          <div className="flex flex-col items-center gap-2">
            <button 
              disabled={audioBlocked}
              onClick={() => setUseAudio(!useAudio)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${useAudio ? 'bg-indigo-600 border-indigo-500' : 'border-slate-700'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
              <span className="text-xs font-bold">{useAudio ? 'Voz Activada' : 'Modo Manual'}</span>
            </button>
            {audioBlocked && (
              <span className="text-[10px] text-indigo-400 font-bold">DESBLOQUEA AUDIOS EN PREMIUM</span>
            )}
          </div>
        )}

        {/* Timer */}
        <div className="relative flex items-center justify-center">
          <svg className="w-64 h-64 -rotate-90">
            <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
            <circle 
              cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="4" fill="transparent" 
              className="text-indigo-500 transition-all duration-1000"
              strokeDasharray={754}
              strokeDashoffset={754 - (754 * timeLeft) / currentStep.durationSeconds}
            />
          </svg>
          <div className="absolute text-5xl font-mono font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Play/Pause */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-6 rounded-full transition-all active:scale-90 ${isPlaying ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'}`}
        >
          {isPlaying ? (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          ) : (
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
          )}
        </button>
      </div>

      <footer className="p-8">
        <button 
          onClick={handleNext}
          disabled={!canAdvance && timeLeft > 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${canAdvance || timeLeft === 0 ? 'bg-white text-slate-900 shadow-xl' : 'bg-slate-800 text-slate-600'}`}
        >
          {currentStepIndex === ritual.steps.length - 1 ? 'Finalizar Ritual' : 'Siguiente Paso'}
        </button>
        <p className="text-center text-[10px] text-slate-600 mt-4 uppercase font-bold">Debes completar al menos el 50% del tiempo para avanzar</p>
      </footer>
    </div>
  );
};

export default RitualView;