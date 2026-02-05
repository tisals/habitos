
import React from 'react';
import { User } from '../types';

interface PlansViewProps {
  user: User;
  onUpgrade: () => void;
  onBack: () => void;
}

const PlansView: React.FC<PlansViewProps> = ({ user, onUpgrade, onBack }) => {
  return (
    <div className="p-8 space-y-8 animate-in zoom-in-95 duration-300">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl font-bold">Desbloquea tu Potencial</h1>
      </header>

      <div className="bg-white border-2 border-indigo-600 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-tighter">Plan Único</div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Membresía Premium</h2>
            <p className="text-slate-500 text-sm">El sistema completo para el alto rendimiento.</p>
          </div>

          <div className="space-y-4">
            {[
              'Ritual P.I.T. (Salvavidas) desbloqueado',
              'Audios guiados en Ritual de Cierre',
              'Historial y métricas avanzadas',
              'Soporte prioritario por WhatsApp',
              'Acceso a contenido exclusivo de nivel 3'
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                <span className="text-sm font-medium text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800">$19.99</span>
            <span className="text-slate-400 font-bold uppercase text-xs">/ Mes</span>
          </div>

          {user.isPremium ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center font-bold">
              ¡Ya eres Premium!
            </div>
          ) : (
            <div className="space-y-3">
              <button 
                onClick={() => {
                  window.open(`https://wa.me/573123456789?text=Hola!%20Quiero%20desbloquear%20la%20versión%20completa%20de%20La%20Llave%20de%20tu%20Potencial`, '_blank');
                  // For demo purposes, we allow immediate unlock
                  onUpgrade();
                }}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg active:bg-indigo-700 transition-all active:scale-95"
              >
                Activar con WhatsApp
              </button>
              <p className="text-[10px] text-center text-slate-400 font-medium">Activación manual inmediata tras validación de pago.</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400 leading-relaxed px-6">
          Más de 500 líderes ya están optimizando su día con nuestros rituales científicos de alto rendimiento.
        </p>
      </div>
    </div>
  );
};

export default PlansView;
