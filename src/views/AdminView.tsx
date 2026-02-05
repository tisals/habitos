 
import React from 'react';
import { Ritual, CompletionRecord } from '../types';

interface AdminViewProps {
  rituals: Ritual[];
  completions: CompletionRecord[];
  onBack: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ rituals, completions, onBack }) => {
  const stats = {
    totalCompletions: completions.length,
    cafeCompletions: completions.filter(c => c.ritualId === 'ritual_cafe').length,
    pitCompletions: completions.filter(c => c.ritualId === 'ritual_pit' || c.ritualId === 'ritual_ara').length,
    lifeCompletions: completions.filter(c => c.ritualId === 'ritual_life').length,
  };

  return (
    <div className="p-6 space-y-8">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="text-xl font-bold">Panel de Administración</h1>
      </header>

      {/* Metrics Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Métricas Globales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Total Usos</span>
            <div className="text-2xl font-black text-slate-800">{stats.totalCompletions}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">C.A.F.É.</span>
            <div className="text-2xl font-black text-indigo-600">{stats.cafeCompletions}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">P.I.T. (Rescate)</span>
            <div className="text-2xl font-black text-red-600">{stats.pitCompletions}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Life</span>
            <div className="text-2xl font-black text-purple-600">{stats.lifeCompletions}</div>
          </div>
        </div>
      </section>

      {/* Ritual Management */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Gestionar Rituales</h2>
        <div className="space-y-3">
          {rituals.map(ritual => (
            <div key={ritual.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{ritual.name}</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Slug: {ritual.slug} • {ritual.steps.length} Pasos</p>
              </div>
              <button className="text-indigo-600 text-xs font-bold px-3 py-1 border border-indigo-100 rounded-lg hover:bg-indigo-50">
                Editar
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-slate-100 p-4 rounded-2xl text-[10px] text-slate-500 font-mono">
        LOGS DE ACTIVIDAD RECIENTE:<br/>
        {completions.slice(-5).reverse().map((c, i) => (
          <div key={i} className="mt-1">
            [{new Date(c.timestamp).toLocaleTimeString()}] User {c.userId} completó {c.ritualId}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminView;
