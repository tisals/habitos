
import React from 'react';

interface LandingViewProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart, onLogin }) => {
  return (
    <div className="flex flex-col h-full bg-indigo-950 text-white p-8 relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32"></div>
      
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-12 mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">La Llave de tu <span className="text-indigo-400">Potencial</span></h1>
          <p className="text-indigo-200 font-medium text-lg leading-snug">
            El sistema operativo para el líder que busca claridad y alto rendimiento sin quemarse.
          </p>
        </div>

        <div className="w-full space-y-4 pt-12">
          <button 
            onClick={onStart}
            className="w-full bg-white text-indigo-950 py-5 rounded-2xl font-black text-xl shadow-xl active:scale-95 transition-all"
          >
            EMPEZAR AHORA
          </button>
          <button 
            onClick={onLogin}
            className="w-full bg-transparent text-white border border-white/20 py-4 rounded-2xl font-bold text-sm active:bg-white/5"
          >
            YA TENGO CUENTA (DEMO)
          </button>
        </div>
      </div>

      <footer className="text-center pt-8">
        <p className="text-[10px] text-indigo-400 font-bold tracking-widest uppercase opacity-60">Prototipe MVP - Sprint 1 & 2</p>
      </footer>
    </div>
  );
};

export default LandingView;
