
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserLevel, UserStats, CompletionRecord, Ritual } from './types';
import { INITIAL_USER, MOCK_RITUALS } from './constants';
import DashboardView from './views/DashboardView';
import RitualView from './views/RitualView';
import DiagnosticView from './views/DiagnosticView';
import AdminView from './views/AdminView';
import PlansView from './views/PlansView';
import LandingView from './views/LandingView';

const App: React.FC = () => {
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('llp_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [completions, setCompletions] = useState<CompletionRecord[]>(() => {
    const saved = localStorage.getItem('llp_completions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'ritual' | 'diagnostic' | 'admin' | 'plans'>('landing');
  const [activeRitual, setActiveRitual] = useState<Ritual | null>(null);

  useEffect(() => {
    localStorage.setItem('llp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('llp_completions', JSON.stringify(completions));
  }, [completions]);

  const stats: UserStats = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCompletions = completions
      .filter(c => c.date === today)
      .map(c => c.ritualId);

    // Basic streak logic
    let streak = 0;
    const sortedCompletions = [...completions].sort((a, b) => b.timestamp - a.timestamp);
    const uniqueDates = Array.from(new Set(sortedCompletions.map(c => c.date)));
    
    // Check consecutive days where both CAFE and CIERRE were done
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = uniqueDates[i];
      const ritualsDoneOnDate = completions.filter(c => c.date === date).map(c => c.ritualId);
      const isDayWon = ritualsDoneOnDate.includes('ritual_cafe') && ritualsDoneOnDate.includes('ritual_life');
      
      if (isDayWon) {
        streak++;
      } else if (date !== today) {
        break; // Streak broken if past day was not won
      }
    }

    return {
      streak,
      lastCompletionDate: uniqueDates[0] || null,
      completionsToday: todayCompletions
    };
  }, [completions]);

  const handleCompleteRitual = (ritualId: string) => {
    const newRecord: CompletionRecord = {
      userId: user.id,
      ritualId,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };
    setCompletions(prev => [...prev, newRecord]);
    setCurrentView('dashboard');
  };

  const handleLevelAssigned = (level: UserLevel) => {
    setUser(prev => ({ ...prev, level }));
    setCurrentView('dashboard');
  };

  const navigateToRitual = (ritual: Ritual) => {
    setActiveRitual(ritual);
    setCurrentView('ritual');
  };

  const toggleAdmin = () => {
    setUser(prev => ({ ...prev, role: prev.role === 'admin' ? 'user' : 'admin' }));
  };

  const handleUpdatePremium = (isPremium: boolean) => {
    setUser(prev => ({ ...prev, isPremium }));
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl flex flex-col relative">
      {/* Quick Nav for Demo */}
      <div className="bg-slate-800 text-white text-[10px] p-1 flex justify-between items-center z-50 sticky top-0">
        <div className="flex gap-2">
          <button onClick={() => setCurrentView('landing')}>Home</button>
          <button onClick={() => setCurrentView('dashboard')}>Dashboard</button>
          <button onClick={() => setCurrentView('plans')}>Plans</button>
          <button onClick={toggleAdmin} className={user.role === 'admin' ? 'text-yellow-400' : ''}>Admin Mode</button>
        </div>
        <div className="flex gap-2">
          <span>Level {user.level}</span>
          <span>{user.isPremium ? 'PREMIUM' : 'FREE'}</span>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-24">
        {currentView === 'landing' && <LandingView onStart={() => setCurrentView('diagnostic')} onLogin={() => setCurrentView('dashboard')} />}
        {currentView === 'diagnostic' && <DiagnosticView onComplete={handleLevelAssigned} />}
        {currentView === 'dashboard' && (
          <DashboardView 
            user={user} 
            stats={stats} 
            rituals={MOCK_RITUALS} 
            onSelectRitual={navigateToRitual} 
            onGoToPlans={() => setCurrentView('plans')}
            onGoToAdmin={() => setCurrentView('admin')}
          />
        )}
        {currentView === 'ritual' && activeRitual && (
          <RitualView 
            ritual={activeRitual} 
            isPremium={user.isPremium} 
            onComplete={() => handleCompleteRitual(activeRitual.id)} 
            onBack={() => setCurrentView('dashboard')} 
          />
        )}
        {currentView === 'admin' && (
          <AdminView 
            rituals={MOCK_RITUALS} 
            completions={completions} 
            onBack={() => setCurrentView('dashboard')}
          />
        )}
        {currentView === 'plans' && (
          <PlansView 
            user={user} 
            onUpgrade={() => handleUpdatePremium(true)} 
            onBack={() => setCurrentView('dashboard')} 
          />
        )}
      </main>

      {/* Persistent Bottom Bar for Mobile Feel */}
      {currentView !== 'landing' && currentView !== 'ritual' && currentView !== 'diagnostic' && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 py-3 flex justify-around items-center z-40">
          <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          <button onClick={() => setCurrentView('plans')} className={`flex flex-col items-center gap-1 ${currentView === 'plans' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span className="text-[10px] font-medium">Premium</span>
          </button>
          {user.role === 'admin' && (
            <button onClick={() => setCurrentView('admin')} className={`flex flex-col items-center gap-1 ${currentView === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              <span className="text-[10px] font-medium">Admin</span>
            </button>
          )}
        </nav>
      )}
    </div>
  );
};

export default App;
