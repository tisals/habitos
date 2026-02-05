import React from 'react';
import { User } from '../types';

interface PlansViewProps {
  user: User;
  onUpgrade: () => void;
  onBack: () => void;
}

const PlansView: React.FC<PlansViewProps> = ({ user, onUpgrade, onBack }) => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 active:scale-90 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-xl font-bold text-slate-800">Membresía Fundadora</h1>
      </header>

      {/* Card Principal de Oferta */}
      <div className="bg-white border-2 border-amber-500 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
          Oferta Limitada
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">USUARIO FUNDADOR 🚀</h2>
            <p className="text-slate-500 text-sm mt-1">Acceso total al sistema de alto rendimiento.</p>
          </div>

          {/* Lista de Beneficios y Bonos */}
          <div className="space-y-3">
            {[
              { text: 'Ritual P.I.T. (Salvavidas) Desbloqueado', bold: true },
              { text: 'Audios Guiados (C.A.F.É. y L.I.F.E.)', bold: true },
              { text: 'Bono: Mapa de Autosabotaje 📘', bold: false },
              { text: 'Bono: Kit de Arranque C.A.F.É. 🧠', bold: false },
              { text: 'Acceso Prioritario a Mejoras 🔥', bold: false }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 bg-emerald-100 rounded-full p-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span className={`text-sm ${item.bold ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          {/* Sección de Precio */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-400 line-through text-sm font-bold">$49.000</span>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Ahorra 40%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">$29.000</span>
              <span className="text-slate-500 font-bold text-xs uppercase">COP / MES</span>
            </div>
          </div>

          {user.isPremium ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-center font-bold animate-pulse">
              ✨ Ya eres Usuario Fundador
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={() => {
                  const msg = encodeURIComponent("¡Hola! Quiero asegurar mi cupo como Usuario Fundador de La Llave de tu Potencial 🚀");
                  window.open(`https://wa.me/573123456789?text=${msg}`, '_blank');
                  onUpgrade();
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-orange-200 active:scale-95 transition-all"
              >
                Quiero Mi Acceso Ahora
              </button>
              
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-xl">
                <p className="text-[11px] text-amber-800 font-bold leading-tight">
                  ⚠️ Solo quedan cupos para 100 fundadores. El precio subirá pronto.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-center text-slate-400 px-8 leading-relaxed">
        Únete a los líderes que ya dominan su energía. Activación manual inmediata vía WhatsApp.
      </p>
    </div>
  );
};

export default PlansView;